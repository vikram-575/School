"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DashboardController", {
    enumerable: true,
    get: function() {
        return DashboardController;
    }
});
const _common = require("@nestjs/common");
const _dashboardservice = require("./dashboard.service");
const _jwtauthguard = require("../auth/jwt-auth.guard");
const _rolesguard = require("../auth/roles.guard");
const _rolesdecorator = require("../auth/roles.decorator");
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
let DashboardController = class DashboardController {
    async getAdminDashboard(req) {
        return this.dashboardService.getAdminStats(req.user.schoolId);
    }
    async getSuperAdminDashboard() {
        return this.dashboardService.getSuperAdminStats();
    }
    async getAccountantDashboard(req) {
        return this.dashboardService.getAccountantStats(req.user.schoolId);
    }
    async getPrincipalDashboard(req) {
        return this.dashboardService.getPrincipalStats(req.user.schoolId);
    }
    async getHrDashboard(req) {
        return this.dashboardService.getHrStats(req.user.schoolId);
    }
    constructor(dashboardService){
        this.dashboardService = dashboardService;
    }
};
_ts_decorate([
    (0, _common.Get)('admin'),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], DashboardController.prototype, "getAdminDashboard", null);
_ts_decorate([
    (0, _rolesdecorator.Roles)('SUPER_ADMIN'),
    (0, _common.UseGuards)(_rolesguard.RolesGuard),
    (0, _common.Get)('superadmin'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Promise)
], DashboardController.prototype, "getSuperAdminDashboard", null);
_ts_decorate([
    (0, _common.Get)('accountant'),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], DashboardController.prototype, "getAccountantDashboard", null);
_ts_decorate([
    (0, _common.Get)('principal'),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], DashboardController.prototype, "getPrincipalDashboard", null);
_ts_decorate([
    (0, _common.Get)('hr'),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], DashboardController.prototype, "getHrDashboard", null);
DashboardController = _ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Controller)('dashboard'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _dashboardservice.DashboardService === "undefined" ? Object : _dashboardservice.DashboardService
    ])
], DashboardController);

//# sourceMappingURL=dashboard.controller.js.map