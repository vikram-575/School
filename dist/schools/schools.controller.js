"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SchoolsController", {
    enumerable: true,
    get: function() {
        return SchoolsController;
    }
});
const _common = require("@nestjs/common");
const _schoolsservice = require("./schools.service");
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
let SchoolsController = class SchoolsController {
    findAll() {
        return this.schoolsService.findAll();
    }
    create(body) {
        return this.schoolsService.create(body);
    }
    update(id, body) {
        return this.schoolsService.update(id, body);
    }
    remove(id) {
        return this.schoolsService.remove(id);
    }
    updateSubscription(id, body) {
        return this.schoolsService.updateSubscription(id, body);
    }
    findOne(id) {
        return this.schoolsService.findOne(id);
    }
    constructor(schoolsService){
        this.schoolsService = schoolsService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], SchoolsController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], SchoolsController.prototype, "create", null);
_ts_decorate([
    (0, _common.Patch)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], SchoolsController.prototype, "update", null);
_ts_decorate([
    (0, _common.Delete)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], SchoolsController.prototype, "remove", null);
_ts_decorate([
    (0, _common.Patch)(':id/subscription'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], SchoolsController.prototype, "updateSubscription", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], SchoolsController.prototype, "findOne", null);
SchoolsController = _ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)('SUPER_ADMIN'),
    (0, _common.Controller)('superadmin/schools'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _schoolsservice.SchoolsService === "undefined" ? Object : _schoolsservice.SchoolsService
    ])
], SchoolsController);

//# sourceMappingURL=schools.controller.js.map