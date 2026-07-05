"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OperationsService", {
    enumerable: true,
    get: function() {
        return OperationsService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../prisma/prisma.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let OperationsService = class OperationsService {
    // ==========================================
    // ATTENDANCE
    // ==========================================
    async markAttendance(schoolId, data, userId) {
        const { date, records } = data; // records: { userId: string, status: string, remarks?: string }[]
        const dateObj = new Date(date);
        // Process in a transaction or individually
        const results = await Promise.all(records.map((record)=>this.prisma.attendanceRecord.upsert({
                where: {
                    userId_date_schoolId: {
                        userId: record.userId,
                        date: dateObj,
                        schoolId
                    }
                },
                update: {
                    status: record.status,
                    remarks: record.remarks,
                    markedBy: userId
                },
                create: {
                    schoolId,
                    userId: record.userId,
                    date: dateObj,
                    status: record.status,
                    remarks: record.remarks,
                    markedBy: userId
                }
            })));
        return results;
    }
    async getAttendance(schoolId, date, sectionId) {
        // If sectionId is provided, we fetch all students for that section and their attendance
        const dateObj = new Date(date);
        if (sectionId) {
            // Get all students in the section
            const students = await this.prisma.studentProfile.findMany({
                where: {
                    schoolId,
                    currentSectionId: sectionId
                },
                include: {
                    user: true
                }
            });
            const userIds = students.map((s)=>s.userId);
            const records = await this.prisma.attendanceRecord.findMany({
                where: {
                    schoolId,
                    date: dateObj,
                    userId: {
                        in: userIds
                    }
                }
            });
            return students.map((student)=>{
                const record = records.find((r)=>r.userId === student.userId);
                return {
                    student,
                    attendance: record || null
                };
            });
        }
        return this.prisma.attendanceRecord.findMany({
            where: {
                schoolId,
                date: dateObj
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        roleId: true
                    }
                }
            }
        });
    }
    // ==========================================
    // LEAVES
    // ==========================================
    async createLeaveRequest(schoolId, userId, data) {
        return this.prisma.leaveRequest.create({
            data: {
                schoolId,
                userId,
                type: data.type,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                reason: data.reason,
                status: 'PENDING'
            }
        });
    }
    async getLeaveRequests(schoolId, status) {
        const where = {
            schoolId
        };
        if (status) where.status = status;
        return this.prisma.leaveRequest.findMany({
            where,
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async updateLeaveRequest(schoolId, id, data, approverId) {
        return this.prisma.leaveRequest.update({
            where: {
                id
            },
            data: {
                status: data.status,
                approvedBy: approverId
            }
        });
    }
    // ==========================================
    // NOTICES
    // ==========================================
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
                expiryDate: data.expiryDate ? new Date(data.expiryDate) : null
            }
        });
    }
    async getNotices(schoolId) {
        return this.prisma.notice.findMany({
            where: {
                schoolId
            },
            include: {
                author: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: {
                publishDate: 'desc'
            }
        });
    }
    async deleteNotice(schoolId, id) {
        return this.prisma.notice.delete({
            where: {
                id
            }
        });
    }
    // ==========================================
    // TIMETABLE
    // ==========================================
    async getPeriods(schoolId) {
        return this.prisma.period.findMany({
            where: {
                schoolId
            },
            orderBy: {
                order: 'asc'
            }
        });
    }
    async createPeriod(schoolId, data) {
        return this.prisma.period.create({
            data: {
                schoolId,
                name: data.name,
                startTime: data.startTime,
                endTime: data.endTime,
                order: data.order
            }
        });
    }
    async getTimetable(schoolId, sectionId) {
        return this.prisma.timetableEntry.findMany({
            where: {
                schoolId,
                sectionId
            },
            include: {
                subject: true,
                teacher: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                },
                period: true
            }
        });
    }
    async saveTimetableEntry(schoolId, data) {
        return this.prisma.timetableEntry.upsert({
            where: {
                sectionId_periodId_dayOfWeek_schoolId: {
                    schoolId,
                    sectionId: data.sectionId,
                    periodId: data.periodId,
                    dayOfWeek: data.dayOfWeek
                }
            },
            update: {
                subjectId: data.subjectId,
                teacherId: data.teacherId || null
            },
            create: {
                schoolId,
                sectionId: data.sectionId,
                periodId: data.periodId,
                dayOfWeek: data.dayOfWeek,
                subjectId: data.subjectId,
                teacherId: data.teacherId || null
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
OperationsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], OperationsService);

//# sourceMappingURL=operations.service.js.map