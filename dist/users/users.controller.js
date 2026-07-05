"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsersController", {
    enumerable: true,
    get: function() {
        return UsersController;
    }
});
const _common = require("@nestjs/common");
const _jwtauthguard = require("../auth/jwt-auth.guard");
const _usersservice = require("./users.service");
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
let UsersController = class UsersController {
    findAll(request, role, schoolId) {
        return this.usersService.findAll(request.user, role, schoolId);
    }
    create(request, body) {
        return this.usersService.create(request.user, body);
    }
    findOne(id, request) {
        return this.usersService.findOne(id, request.user);
    }
    constructor(usersService){
        this.usersService = usersService;
    }
};
_ts_decorate([
    (0, _common.Get)(),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Query)('role')),
    _ts_param(2, (0, _common.Query)('schoolId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthenticatedRequest === "undefined" ? Object : AuthenticatedRequest,
        String,
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
_ts_decorate([
    (0, _common.Post)(),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthenticatedRequest === "undefined" ? Object : AuthenticatedRequest,
        Object
    ]),
    _ts_metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
_ts_decorate([
    (0, _common.Get)(':id'),
    _ts_param(0, (0, _common.Param)('id')),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof AuthenticatedRequest === "undefined" ? Object : AuthenticatedRequest
    ]),
    _ts_metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
UsersController = _ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Controller)('users'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usersservice.UsersService === "undefined" ? Object : _usersservice.UsersService
    ])
], UsersController);

//# sourceMappingURL=users.controller.js.map