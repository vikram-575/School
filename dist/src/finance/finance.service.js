"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FinanceService = class FinanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCategories(schoolId) {
        return this.prisma.feeCategory.findMany({
            where: { schoolId },
            orderBy: { name: 'asc' },
        });
    }
    async createCategory(schoolId, data) {
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
    async getStructures(schoolId) {
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
    async createStructure(schoolId, data) {
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
                    data: data.items.map((categoryId) => ({
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
    async getInvoices(schoolId, status) {
        const where = { schoolId };
        if (status)
            where.status = status;
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
    async createInvoice(schoolId, data) {
        const totalAmount = data.items.reduce((sum, item) => sum + item.amount, 0);
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
                    data: data.items.map((item) => ({
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
    async recordPayment(schoolId, invoiceId, data) {
        return this.prisma.$transaction(async (tx) => {
            const invoice = await tx.invoice.findUnique({
                where: { id: invoiceId, schoolId },
                include: { payments: true },
            });
            if (!invoice)
                throw new common_1.NotFoundException('Invoice not found');
            const newPayment = await tx.payment.create({
                data: {
                    schoolId,
                    invoiceId,
                    amount: data.amount,
                    paymentMethod: data.paymentMethod,
                    referenceNumber: data.referenceNumber,
                },
            });
            const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0) + data.amount;
            let newStatus = 'UNPAID';
            if (totalPaid >= invoice.totalAmount) {
                newStatus = 'PAID';
            }
            else if (totalPaid > 0) {
                newStatus = 'PARTIAL';
            }
            await tx.invoice.update({
                where: { id: invoiceId },
                data: { status: newStatus },
            });
            return newPayment;
        });
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinanceService);
//# sourceMappingURL=finance.service.js.map