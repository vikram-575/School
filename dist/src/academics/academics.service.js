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
exports.AcademicsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AcademicsService = class AcademicsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAcademicYears(schoolId) {
        return this.prisma.academicYear.findMany({ where: { schoolId }, orderBy: { startDate: 'desc' } });
    }
    async createAcademicYear(schoolId, data) {
        return this.prisma.academicYear.create({
            data: { ...data, schoolId },
        });
    }
    async getDepartments(schoolId) {
        return this.prisma.department.findMany({ where: { schoolId } });
    }
    async createDepartment(schoolId, data) {
        return this.prisma.department.create({
            data: { ...data, schoolId },
        });
    }
    async getClasses(schoolId) {
        return this.prisma.class.findMany({
            where: { schoolId },
            include: { sections: true },
            orderBy: { order: 'asc' }
        });
    }
    async createClass(schoolId, data) {
        return this.prisma.class.create({
            data: { ...data, schoolId },
        });
    }
    async getSections(schoolId, classId) {
        const where = { schoolId };
        if (classId)
            where.classId = classId;
        return this.prisma.section.findMany({
            where,
            include: {
                class: true,
                classTeacher: { include: { user: true } }
            },
            orderBy: { name: 'asc' }
        });
    }
    async createSection(schoolId, data) {
        return this.prisma.section.create({
            data: { ...data, schoolId },
        });
    }
    async getSubjects(schoolId) {
        return this.prisma.subject.findMany({ where: { schoolId }, orderBy: { name: 'asc' } });
    }
    async createSubject(schoolId, data) {
        return this.prisma.subject.create({
            data: {
                schoolId,
                name: data.name,
                code: data.code,
                type: data.type || "THEORY",
            }
        });
    }
    async assignClassTeacher(schoolId, sectionId, employeeId) {
        const employee = await this.prisma.employeeProfile.findFirst({
            where: { schoolId, employeeId }
        });
        if (!employee)
            throw new Error('Employee not found');
        return this.prisma.section.update({
            where: { id: sectionId },
            data: { classTeacherId: employee.id }
        });
    }
    async assignSubjectTeacher(schoolId, classSubjectId, employeeId) {
        const employee = await this.prisma.employeeProfile.findFirst({
            where: { schoolId, employeeId }
        });
        if (!employee)
            throw new Error('Employee not found');
        return this.prisma.classSubject.update({
            where: { id: classSubjectId },
            data: { teacherId: employee.id }
        });
    }
};
exports.AcademicsService = AcademicsService;
exports.AcademicsService = AcademicsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AcademicsService);
//# sourceMappingURL=academics.service.js.map