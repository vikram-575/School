"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthController", {
    enumerable: true,
    get: function() {
        return AuthController;
    }
});
const _common = require("@nestjs/common");
const _authservice = require("./auth.service");
const _jwtauthguard = require("./jwt-auth.guard");
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
let AuthController = class AuthController {
    async login(signInDto) {
        const loginId = signInDto.email ?? signInDto.loginId;
        if (!loginId || !signInDto.password) {
            throw new _common.UnauthorizedException('Missing credentials');
        }
        return this.authService.login(loginId, signInDto.password);
    }
    async refresh(body) {
        if (!body.refresh_token) throw new _common.UnauthorizedException('Refresh token is required');
        return this.authService.refresh(body.refresh_token);
    }
    async logout(body) {
        if (!body.refresh_token) throw new _common.UnauthorizedException('Refresh token is required');
        return this.authService.logout(body.refresh_token);
    }
    async me(request) {
        return this.authService.getCurrentUser(request.user.sub);
    }
    constructor(authService){
        this.authService = authService;
    }
};
_ts_decorate([
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _common.Post)('login'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
_ts_decorate([
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _common.Post)('refresh'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _common.Post)('logout'),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Get)('me'),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof AuthenticatedRequest === "undefined" ? Object : AuthenticatedRequest
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
AuthController = _ts_decorate([
    (0, _common.Controller)('auth'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authservice.AuthService === "undefined" ? Object : _authservice.AuthService
    ])
], AuthController);

//# sourceMappingURL=auth.controller.js.map