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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getClassReport(schoolId, sectionId) {
        const section = await this.prisma.section.findUnique({
            where: { id: sectionId },
            include: {
                students: {
                    include: {
                        user: { select: { firstName: true, lastName: true, id: true } }
                    }
                },
                class: true,
            }
        });
        if (!section)
            throw new Error("Section not found");
        const studentIds = section.students.map(s => s.id);
        const results = await this.prisma.examResult.findMany({
            where: { studentId: { in: studentIds } },
            include: {
                exam: true,
                subject: true
            }
        });
        return {
            section,
            results,
            message: "Class report generated successfully"
        };
    }
    async getStudentReport(schoolId, studentId) {
        const student = await this.prisma.studentProfile.findUnique({
            where: { id: studentId },
            include: {
                user: { select: { firstName: true, lastName: true, email: true } },
                currentSection: { include: { class: true } }
            }
        });
        if (!student)
            throw new Error("Student not found");
        const results = await this.prisma.examResult.findMany({
            where: { studentId },
            include: {
                exam: true,
                subject: true
            }
        });
        return {
            student,
            results,
            message: "Student report generated successfully"
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map