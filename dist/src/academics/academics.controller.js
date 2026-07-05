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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const academics_service_1 = require("./academics.service");
let AcademicsController = class AcademicsController {
    academicsService;
    constructor(academicsService) {
        this.academicsService = academicsService;
    }
    getAcademicYears(req) {
        return this.academicsService.getAcademicYears(req.user.schoolId);
    }
    createAcademicYear(req, body) {
        return this.academicsService.createAcademicYear(req.user.schoolId, body);
    }
    getDepartments(req) {
        return this.academicsService.getDepartments(req.user.schoolId);
    }
    createDepartment(req, body) {
        return this.academicsService.createDepartment(req.user.schoolId, body);
    }
    getClasses(req) {
        return this.academicsService.getClasses(req.user.schoolId);
    }
    createClass(req, body) {
        return this.academicsService.createClass(req.user.schoolId, body);
    }
    getSections(req, classId) {
        return this.academicsService.getSections(req.user.schoolId, classId);
    }
    createSection(req, body) {
        return this.academicsService.createSection(req.user.schoolId, body);
    }
    getSubjects(req) {
        return this.academicsService.getSubjects(req.user.schoolId);
    }
    createSubject(req, body) {
        return this.academicsService.createSubject(req.user.schoolId, body);
    }
    assignClassTeacher(sectionId, req, body) {
        return this.academicsService.assignClassTeacher(req.user.schoolId, sectionId, body.teacherId);
    }
    assignSubjectTeacher(classSubjectId, req, body) {
        return this.academicsService.assignSubjectTeacher(req.user.schoolId, classSubjectId, body.teacherId);
    }
};
exports.AcademicsController = AcademicsController;
__decorate([
    (0, common_1.Get)('years'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "getAcademicYears", null);
__decorate([
    (0, common_1.Post)('years'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "createAcademicYear", null);
__decorate([
    (0, common_1.Get)('departments'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "getDepartments", null);
__decorate([
    (0, common_1.Post)('departments'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "createDepartment", null);
__decorate([
    (0, common_1.Get)('classes'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "getClasses", null);
__decorate([
    (0, common_1.Post)('classes'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "createClass", null);
__decorate([
    (0, common_1.Get)('sections'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "getSections", null);
__decorate([
    (0, common_1.Post)('sections'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "createSection", null);
__decorate([
    (0, common_1.Get)('subjects'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "getSubjects", null);
__decorate([
    (0, common_1.Post)('subjects'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "createSubject", null);
__decorate([
    (0, common_1.Put)('sections/:id/class-teacher'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "assignClassTeacher", null);
__decorate([
    (0, common_1.Put)('class-subjects/:id/teacher'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AcademicsController.prototype, "assignSubjectTeacher", null);
exports.AcademicsController = AcademicsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('academics'),
    __metadata("design:paramtypes", [academics_service_1.AcademicsService])
], AcademicsController);
//# sourceMappingURL=academics.controller.js.map