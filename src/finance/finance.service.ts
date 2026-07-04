import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // FEE CATEGORIES
  // ==========================================
  async getCategories(schoolId: string) {
    return this.prisma.feeCategory.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
    });
  }

  async createCategory(schoolId: string, data: any) {
    return this.prisma.feeCategory.create({
      data: {
        schoolId,
        name: data.name,
        description: data.description,
        amount: data.amount,
        frequency: data.frequency,
      },
    });
  }

  // ==========================================
  // FEE STRUCTURES
  // ==========================================
  async getStructures(schoolId: string) {
    return this.prisma.feeStructure.findMany({
      where: { schoolId },
      include: {
        class: true,
        items: {
          include: { feeCategory: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async createStructure(schoolId: string, data: any) {
    // data.items is an array of feeCategoryIds
    return this.prisma.$transaction(async (tx) => {
      const structure = await tx.feeStructure.create({
        data: {
          schoolId,
          name: data.name,
          description: data.description,
          classId: data.classId,
        },
      });

      if (data.items && data.items.length > 0) {
        await tx.feeStructureItem.createMany({
          data: data.items.map((categoryId: string) => ({
            schoolId,
            feeStructureId: structure.id,
            feeCategoryId: categoryId,
          })),
        });
      }

      return tx.feeStructure.findUnique({
        where: { id: structure.id },
        include: { items: { include: { feeCategory: true } } },
      });
    });
  }

  // ==========================================
  // INVOICES
  // ==========================================
  async getInvoices(schoolId: string, status?: string) {
    const where: any = { schoolId };
    if (status) where.status = status;

    return this.prisma.invoice.findMany({
      where,
      include: {
        student: { include: { user: true, currentSection: { include: { class: true } } } },
        items: { include: { feeCategory: true } },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createInvoice(schoolId: string, data: any) {
    // data: studentId, title, dueDate, items: [{ feeCategoryId, amount }]
    const totalAmount = data.items.reduce((sum: number, item: any) => sum + item.amount, 0);

    return this.prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          schoolId,
          studentId: data.studentId,
          title: data.title,
          dueDate: new Date(data.dueDate),
          totalAmount,
          status: 'UNPAID',
        },
      });

      if (data.items && data.items.length > 0) {
        await tx.invoiceItem.createMany({
          data: data.items.map((item: any) => ({
            schoolId,
            invoiceId: invoice.id,
            feeCategoryId: item.feeCategoryId,
            amount: item.amount,
          })),
        });
      }

      return invoice;
    });
  }

  // ==========================================
  // PAYMENTS
  // ==========================================
  async recordPayment(schoolId: string, invoiceId: string, data: any) {
    // data: amount, paymentMethod, referenceNumber
    return this.prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({
        where: { id: invoiceId, schoolId },
        include: { payments: true },
      });

      if (!invoice) throw new NotFoundException('Invoice not found');

      const newPayment = await tx.payment.create({
        data: {
          schoolId,
          invoiceId,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          referenceNumber: data.referenceNumber,
        },
      });

      // Recalculate status
      const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0) + data.amount;
      
      let newStatus = 'UNPAID';
      if (totalPaid >= invoice.totalAmount) {
        newStatus = 'PAID';
      } else if (totalPaid > 0) {
        newStatus = 'PARTIAL';
      }

      await tx.invoice.update({
        where: { id: invoiceId },
        data: { status: newStatus },
      });

      return newPayment;
    });
  }
}
