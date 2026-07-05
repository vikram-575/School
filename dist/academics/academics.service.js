"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AcademicsService", {
    enumerable: true,
    get: function() {
        return AcademicsService;
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
let AcademicsService = class AcademicsService {
    // =====================================
    // ACADEMIC YEAR
    // =====================================
    async getAcademicYears(schoolId) {
        return this.prisma.academicYear.findMany({
            where: {
                schoolId
            },
            orderBy: {
                startDate: 'desc'
            }
        });
    }
    async createAcademicYear(schoolId, data) {
        return this.prisma.academicYear.create({
            data: {
                ...data,
                schoolId
            }
        });
    }
    // =====================================
    // DEPARTMENT
    // =====================================
    async getDepartments(schoolId) {
        return this.prisma.department.findMany({
            where: {
                schoolId
            }
        });
    }
    async createDepartment(schoolId, data) {
        return this.prisma.department.create({
            data: {
                ...data,
                schoolId
            }
        });
    }
    // =====================================
    // CLASSES
    // =====================================
    async getClasses(schoolId) {
        return this.prisma.class.findMany({
            where: {
                schoolId
            },
            include: {
                sections: true
            },
            orderBy: {
                order: 'asc'
            }
        });
    }
    async createClass(schoolId, data) {
        return this.prisma.class.create({
            data: {
                ...data,
                schoolId
            }
        });
    }
    // =====================================
    // SECTIONS
    // =====================================
    async getSections(schoolId, classId) {
        const where = {
            schoolId
        };
        if (classId) where.classId = classId;
        return this.prisma.section.findMany({
            where,
            include: {
                class: true
            },
            orderBy: {
                name: 'asc'
            }
        });
    }
    async createSection(schoolId, data) {
        return this.prisma.section.create({
            data: {
                ...data,
                schoolId
            }
        });
    }
    // =====================================
    // SUBJECTS
    // =====================================
    async getSubjects(schoolId) {
        return this.prisma.subject.findMany({
            where: {
                schoolId
            },
            orderBy: {
                name: 'asc'
            }
        });
    }
    async createSubject(schoolId, data) {
        return this.prisma.subject.create({
            data: {
                ...data,
                schoolId
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
AcademicsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], AcademicsService);

//# sourceMappingURL=academics.service.js.map