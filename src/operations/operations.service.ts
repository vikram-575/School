import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OperationsService {
  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // ATTENDANCE
  // ==========================================
  async markAttendance(schoolId: string, data: any, userId: string) {
    const { date, records } = data; // records: { userId: string, status: string, remarks?: string }[]
    const dateObj = new Date(date);
    
    // Process in a transaction or individually
    const results = await Promise.all(
      records.map((record: any) =>
        this.prisma.attendanceRecord.upsert({
          where: {
            userId_date_schoolId: {
              userId: record.userId,
              date: dateObj,
              schoolId,
            },
          },
          update: {
            status: record.status,
            remarks: record.remarks,
            markedBy: userId,
          },
          create: {
            schoolId,
            userId: record.userId,
            date: dateObj,
            status: record.status,
            remarks: record.remarks,
            markedBy: userId,
          },
        })
      )
    );
    return results;
  }

  async getAttendance(schoolId: string, date: string, sectionId?: string) {
    // If sectionId is provided, we fetch all students for that section and their attendance
    const dateObj = new Date(date);
    
    if (sectionId) {
      // Get all students in the section
      const students = await this.prisma.studentProfile.findMany({
        where: { schoolId, currentSectionId: sectionId },
        include: { user: true },
      });
      
      const userIds = students.map(s => s.userId);
      
      const records = await this.prisma.attendanceRecord.findMany({
        where: {
          schoolId,
          date: dateObj,
          userId: { in: userIds },
        },
      });
      
      return students.map(student => {
        const record = records.find(r => r.userId === student.userId);
        return {
          student,
          attendance: record || null
        };
      });
    }

    return this.prisma.attendanceRecord.findMany({
      where: { schoolId, date: dateObj },
      include: { user: { select: { firstName: true, lastName: true, roleId: true } } },
    });
  }

  // ==========================================
  // LEAVES
  // ==========================================
  async createLeaveRequest(schoolId: string, userId: string, data: any) {
    return this.prisma.leaveRequest.create({
      data: {
        schoolId,
        userId,
        type: data.type,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        reason: data.reason,
        status: 'PENDING',
      },
    });
  }

  async getLeaveRequests(schoolId: string, status?: string) {
    const where: any = { schoolId };
    if (status) where.status = status;
    return this.prisma.leaveRequest.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateLeaveRequest(schoolId: string, id: string, data: any, approverId: string) {
    return this.prisma.leaveRequest.update({
      where: { id },
      data: {
        status: data.status,
        approvedBy: approverId,
      },
    });
  }

  // ==========================================
  // NOTICES
  // ==========================================
  async createNotice(schoolId: string, authorId: string, data: any) {
    return this.prisma.notice.create({
      data: {
        schoolId,
        authorId,
        title: data.title,
        content: data.content,
        type: data.type || 'GENERAL',
        targetAudience: data.targetAudience || 'ALL',
        publishDate: data.publishDate ? new Date(data.publishDate) : new Date(),
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      },
    });
  }

  async getNotices(schoolId: string) {
    return this.prisma.notice.findMany({
      where: { schoolId },
      include: {
        author: { select: { firstName: true, lastName: true } },
      },
      orderBy: { publishDate: 'desc' },
    });
  }

  async deleteNotice(schoolId: string, id: string) {
    return this.prisma.notice.delete({ where: { id } });
  }

  // ==========================================
  // TIMETABLE
  // ==========================================
  async getPeriods(schoolId: string) {
    return this.prisma.period.findMany({
      where: { schoolId },
      orderBy: { order: 'asc' },
    });
  }

  async createPeriod(schoolId: string, data: any) {
    return this.prisma.period.create({
      data: {
        schoolId,
        name: data.name,
        startTime: data.startTime,
        endTime: data.endTime,
        order: data.order,
      },
    });
  }

  async getTimetable(schoolId: string, sectionId: string) {
    return this.prisma.timetableEntry.findMany({
      where: { schoolId, sectionId },
      include: {
        subject: true,
        teacher: {
          include: { user: { select: { firstName: true, lastName: true } } },
        },
        period: true,
      },
    });
  }

  async saveTimetableEntry(schoolId: string, data: any) {
    return this.prisma.timetableEntry.upsert({
      where: {
        sectionId_periodId_dayOfWeek_schoolId: {
          schoolId,
          sectionId: data.sectionId,
          periodId: data.periodId,
          dayOfWeek: data.dayOfWeek,
        },
      },
      update: {
        subjectId: data.subjectId,
        teacherId: data.teacherId || null,
      },
      create: {
        schoolId,
        sectionId: data.sectionId,
        periodId: data.periodId,
        dayOfWeek: data.dayOfWeek,
        subjectId: data.subjectId,
        teacherId: data.teacherId || null,
      },
    });
  }
}
