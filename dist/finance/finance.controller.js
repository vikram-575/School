"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FinanceController", {
    enumerable: true,
    get: function() {
        return FinanceController;
    }
});
const _common = require("@nestjs/common");
const _jwtauthguard = require("../auth/jwt-auth.guard");
const _financeservice = require("./finance.service");
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
let FinanceController = class FinanceController {
    async getCategories(req) {
        return this.financeService.getCategories(req.user.schoolId);
    }
    async createCategory(req, data) {
        return this.financeService.createCategory(req.user.schoolId, data);
    }
    async getStructures(req) {
        return this.financeService.getStructures(req.user.schoolId);
    }
    async createStructure(req, data) {
        return this.financeService.createStructure(req.user.schoolId, data);
    }
    async getInvoices(req, status) {
        return this.financeService.getInvoices(req.user.schoolId, status);
    }
    async createInvoice(req, data) {
        return this.financeService.createInvoice(req.user.schoolId, data);
    }
    async recordPayment(req, id, data) {
        return this.financeService.recordPayment(req.user.schoolId, id, data);
    }
    constructor(financeService){
        this.financeService = financeService;
    }
};
_ts_decorate([
    (0, _common.Get)('categories'),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], FinanceController.prototype, "getCategories", null);
_ts_decorate([
    (0, _common.Post)('categories'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], FinanceController.prototype, "createCategory", null);
_ts_decorate([
    (0, _common.Get)('structures'),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], FinanceController.prototype, "getStructures", null);
_ts_decorate([
    (0, _common.Post)('structures'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], FinanceController.prototype, "createStructure", null);
_ts_decorate([
    (0, _common.Get)('invoices'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Query)('status')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], FinanceController.prototype, "getInvoices", null);
_ts_decorate([
    (0, _common.Post)('invoices'),
    _ts_param(0, (0, _common.Request)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], FinanceController.prototype, "createInvoice", null);
_ts_decorate([
    (0, _common.Post)('invoices/:id/pay'),
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
], FinanceController.prototype, "recordPayment", null);
FinanceController = _ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Controller)('finance'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _financeservice.FinanceService === "undefined" ? Object : _financeservice.FinanceService
    ])
], FinanceController);

//# sourceMappingURL=finance.controller.js.map