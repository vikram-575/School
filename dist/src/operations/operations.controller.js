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
exports.OperationsController = void 0;
const common_1 = require("@nestjs/common");
const operations_service_1 = require("./operations.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
let OperationsController = class OperationsController {
    operationsService;
    constructor(operationsService) {
        this.operationsService = operationsService;
    }
    async getAttendance(req, date, sectionId) {
        return this.operationsService.getAttendance(req.user.schoolId, date, sectionId);
    }
    async markAttendance(req, data) {
        return this.operationsService.markAttendance(req.user.schoolId, data, req.user.id);
    }
    async getLeaves(req, status) {
        return this.operationsService.getLeaveRequests(req.user.schoolId, status);
    }
    async applyLeave(req, data) {
        return this.operationsService.createLeaveRequest(req.user.schoolId, req.user.id, data);
    }
    async updateLeaveStatus(req, id, data) {
        return this.operationsService.updateLeaveRequest(req.user.schoolId, id, data, req.user.id);
    }
    async getNotices(req) {
        return this.operationsService.getNotices(req.user.schoolId);
    }
    async createNotice(req, data) {
        return this.operationsService.createNotice(req.user.schoolId, req.user.id, data);
    }
    async deleteNotice(req, id) {
        return this.operationsService.deleteNotice(req.user.schoolId, id);
    }
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
};
exports.OperationsController = OperationsController;
__decorate([
    (0, common_1.Get)('attendance'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('date')),
    __param(2, (0, common_1.Query)('sectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], OperationsController.prototype, "getAttendance", null);
__decorate([
    (0, common_1.Post)('attendance'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OperationsController.prototype, "markAttendance", null);
__decorate([
    (0, common_1.Get)('leaves'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OperationsController.prototype, "getLeaves", null);
__decorate([
    (0, common_1.Post)('leaves'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OperationsController.prototype, "applyLeave", null);
__decorate([
    (0, common_1.Patch)('leaves/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], OperationsController.prototype, "updateLeaveStatus", null);
__decorate([
    (0, common_1.Get)('notices'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OperationsController.prototype, "getNotices", null);
__decorate([
    (0, common_1.Post)('notices'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OperationsController.prototype, "createNotice", null);
__decorate([
    (0, common_1.Delete)('notices/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OperationsController.prototype, "deleteNotice", null);
__decorate([
    (0, common_1.Get)('timetable/periods'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OperationsController.prototype, "getPeriods", null);
__decorate([
    (0, common_1.Post)('timetable/periods'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OperationsController.prototype, "createPeriod", null);
__decorate([
    (0, common_1.Get)('timetable'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('sectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OperationsController.prototype, "getTimetable", null);
__decorate([
    (0, common_1.Post)('timetable'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OperationsController.prototype, "saveTimetableEntry", null);
exports.OperationsController = OperationsController = __decorate([
    (0, common_1.Controller)('operations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [operations_service_1.OperationsService])
], OperationsController);
//# sourceMappingURL=operations.controller.js.map