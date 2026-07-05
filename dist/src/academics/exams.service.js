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
exports.ExamsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExamsService = class ExamsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getExams(schoolId) {
        return this.prisma.exam.findMany({
            where: { schoolId },
            orderBy: { startDate: 'desc' },
        });
    }
    async createExam(schoolId, data) {
        return this.prisma.exam.create({
            data: {
                schoolId,
                name: data.name,
                description: data.description,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
            },
        });
    }
    async getExamResults(schoolId, examId, sectionId) {
        return this.prisma.examResult.findMany({
            where: {
                schoolId,
                examId,
                ...(sectionId ? { student: { currentSectionId: sectionId } } : {}),
            },
            include: {
                student: {
                    include: { user: true }
                },
                subject: true,
            },
        });
    }
    async saveExamResult(schoolId, data) {
        return this.prisma.examResult.upsert({
            where: {
                examId_studentId_subjectId_schoolId: {
                    schoolId,
                    examId: data.examId,
                    studentId: data.studentId,
                    subjectId: data.subjectId,
                },
            },
            update: {
                marksObtained: parseFloat(data.marksObtained),
                maxMarks: parseFloat(data.maxMarks),
                grade: data.grade,
                remarks: data.remarks,
            },
            create: {
                schoolId,
                examId: data.examId,
                studentId: data.studentId,
                subjectId: data.subjectId,
                marksObtained: parseFloat(data.marksObtained),
                maxMarks: parseFloat(data.maxMarks),
                grade: data.grade,
                remarks: data.remarks,
            },
        });
    }
};
exports.ExamsService = ExamsService;
exports.ExamsService = ExamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExamsService);
//# sourceMappingURL=exams.service.js.map