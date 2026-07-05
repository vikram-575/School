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
exports.OperationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OperationsService = class OperationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async markAttendance(schoolId, data, userId) {
        const { date, records } = data;
        const dateObj = new Date(date);
        const results = await Promise.all(records.map((record) => this.prisma.attendanceRecord.upsert({
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
        })));
        return results;
    }
    async getAttendance(schoolId, date, sectionId) {
        const dateObj = new Date(date);
        if (sectionId) {
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
    async createLeaveRequest(schoolId, userId, data) {
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
    async getLeaveRequests(schoolId, status) {
        const where = { schoolId };
        if (status)
            where.status = status;
        return this.prisma.leaveRequest.findMany({
            where,
            include: {
                user: { select: { firstName: true, lastName: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateLeaveRequest(schoolId, id, data, approverId) {
        return this.prisma.leaveRequest.update({
            where: { id },
            data: {
                status: data.status,
                approvedBy: approverId,
            },
        });
    }
    async createNotice(schoolId, authorId, data) {
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
    async getNotices(schoolId) {
        return this.prisma.notice.findMany({
            where: { schoolId },
            include: {
                author: { select: { firstName: true, lastName: true } },
            },
            orderBy: { publishDate: 'desc' },
        });
    }
    async deleteNotice(schoolId, id) {
        return this.prisma.notice.delete({ where: { id } });
    }
    async getPeriods(schoolId) {
        return this.prisma.period.findMany({
            where: { schoolId },
            orderBy: { order: 'asc' },
        });
    }
    async createPeriod(schoolId, data) {
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
    async getTimetable(schoolId, sectionId) {
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
    async saveTimetableEntry(schoolId, data) {
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
};
exports.OperationsService = OperationsService;
exports.OperationsService = OperationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OperationsService);
//# sourceMappingURL=operations.service.js.map