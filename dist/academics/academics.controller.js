"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AcademicsController", {
    enumerable: true,
    get: function() {
        return AcademicsController;
    }
});
const _common = require("@nestjs/common");
const _jwtauthguard = require("../auth/jwt-auth.guard");
const _academicsservice = require("./academics.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let AcademicsController = class AcademicsController {
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
    constructor(academicsService){
        this.academicsService = academicsService;
    }
};
_ts_decorate([
    (0, _common.Get)('years'),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AcademicsController.prototype, "getAcademicYears", null);
_ts_decorate([
    (0, _common.Post)('years'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AcademicsController.prototype, "createAcademicYear", null);
_ts_decorate([
    (0, _common.Get)('departments'),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AcademicsController.prototype, "getDepartments", null);
_ts_decorate([
    (0, _common.Post)('departments'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AcademicsController.prototype, "createDepartment", null);
_ts_decorate([
    (0, _common.Get)('classes'),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AcademicsController.prototype, "getClasses", null);
_ts_decorate([
    (0, _common.Post)('classes'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AcademicsController.prototype, "createClass", null);
_ts_decorate([
    (0, _common.Get)('sections'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Query)('classId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AcademicsController.prototype, "getSections", null);
_ts_decorate([
    (0, _common.Post)('sections'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AcademicsController.prototype, "createSection", null);
_ts_decorate([
    (0, _common.Get)('subjects'),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AcademicsController.prototype, "getSubjects", null);
_ts_decorate([
    (0, _common.Post)('subjects'),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], AcademicsController.prototype, "createSubject", null);
AcademicsController = _ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Controller)('academics'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _academicsservice.AcademicsService === "undefined" ? Object : _academicsservice.AcademicsService
    ])
], AcademicsController);

//# sourceMappingURL=academics.controller.js.map