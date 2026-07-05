"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RolesGuard", {
    enumerable: true,
    get: function() {
        return RolesGuard;
    }
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _rolesdecorator = require("./roles.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let RolesGuard = class RolesGuard {
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(_rolesdecorator.ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        if (!requiredRoles) {
            return true; // No roles required, allow access
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            throw new _common.ForbiddenException('User is not authenticated.');
        }
        const hasRole = requiredRoles.includes(user.role);
        if (!hasRole) {
            console.error(`RolesGuard: User has role ${user.role}, but requires ${requiredRoles}`);
            throw new _common.ForbiddenException('You do not have the required role to access this resource.');
        }
        console.log(`RolesGuard: Authorized for role ${user.role}`);
        return true;
    }
    constructor(reflector){
        this.reflector = reflector;
    }
};
RolesGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _core.Reflector === "undefined" ? Object : _core.Reflector
    ])
], RolesGuard);

//# sourceMappingURL=roles.guard.js.map