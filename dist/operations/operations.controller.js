"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OperationsController", {
    enumerable: true,
    get: function() {
        return OperationsController;
    }
});
const _common = require("@nestjs/common");
const _operationsservice = require("./operations.service");
const _jwtauthguard = require("../auth/jwt-auth.guard");
const _rolesguard = require("../auth/roles.guard");
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
let OperationsController = class OperationsController {
    // ==========================================
    // ATTENDANCE
    // ==========================================
    async getAttendance(req, date, sectionId) {
        return this.operationsService.getAttendance(req.user.schoolId, date, sectionId);
    }
    async markAttendance(req, data) {
        return this.operationsService.markAttendance(req.user.schoolId, data, req.user.id);
    }
    // ==========================================
    // LEAVES
    // ==========================================
    async getLeaves(req, status) {
        return this.operationsService.getLeaveRequests(req.user.schoolId, status);
    }
    async applyLeave(req, data) {
        return this.operationsService.createLeaveRequest(req.user.schoolId, req.user.id, data);
    }
    async updateLeaveStatus(req, id, data) {
        return this.operationsService.updateLeaveRequest(req.user.schoolId, id, data, req.user.id);
    }
    // ==========================================
    // NOTICES
    // ==========================================
    async getNotices(req) {
        return this.operationsService.getNotices(req.user.schoolId);
    }
    async createNotice(req, data) {
        return this.operationsService.createNotice(req.user.schoolId, req.user.id, data);
    }
    async deleteNotice(req, id) {
        return this.operationsService.deleteNotice(req.user.schoolId, id);
    }
    // ==========================================
    // TIMETABLE
    // ==========================================
    async getPeriods(req) {
        return this.operationsService.getPeriods(req.user.schoolId);
    }
    async createPeriod(req, data) {
        return this.operationsService.createPeriod(req.user.schoolId, data);
    }
    async getTimetable(req, sectionId) {
        return this.operationsService.getTimetable(req.user.schoolId, sectionId);
    }
    async saveTimetableEntry(req, data) {
        return this.operationsService.saveTimetableEntry(req.user.schoolId, data);
    }
    constructor(operationsService){
        this.operationsService = operationsService;
    }
};
_ts_decorate([
    (0, _common.Get)('attendance'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Query)('date')),
    _ts_param(2, (0, _common.Query)('sectionId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        String,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], OperationsController.prototype, "getAttendance", null);
_ts_decorate([
    (0, _common.Post)('attendance'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], OperationsController.prototype, "markAttendance", null);
_ts_decorate([
    (0, _common.Get)('leaves'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Query)('status')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], OperationsController.prototype, "getLeaves", null);
_ts_decorate([
    (0, _common.Post)('leaves'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], OperationsController.prototype, "applyLeave", null);
_ts_decorate([
    (0, _common.Patch)('leaves/:id'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        String,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], OperationsController.prototype, "updateLeaveStatus", null);
_ts_decorate([
    (0, _common.Get)('notices'),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], OperationsController.prototype, "getNotices", null);
_ts_decorate([
    (0, _common.Post)('notices'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], OperationsController.prototype, "createNotice", null);
_ts_decorate([
    (0, _common.Delete)('notices/:id'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], OperationsController.prototype, "deleteNotice", null);
_ts_decorate([
    (0, _common.Get)('timetable/periods'),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], OperationsController.prototype, "getPeriods", null);
_ts_decorate([
    (0, _common.Post)('timetable/periods'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], OperationsController.prototype, "createPeriod", null);
_ts_decorate([
    (0, _common.Get)('timetable'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Query)('sectionId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], OperationsController.prototype, "getTimetable", null);
_ts_decorate([
    (0, _common.Post)('timetable'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], OperationsController.prototype, "saveTimetableEntry", null);
OperationsController = _ts_decorate([
    (0, _common.Controller)('operations'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _operationsservice.OperationsService === "undefined" ? Object : _operationsservice.OperationsService
    ])
], OperationsController);

//# sourceMappingURL=operations.controller.js.map