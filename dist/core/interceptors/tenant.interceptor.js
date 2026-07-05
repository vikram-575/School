"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TenantInterceptor", {
    enumerable: true,
    get: function() {
        return TenantInterceptor;
    }
});
const _common = require("@nestjs/common");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let TenantInterceptor = class TenantInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        // We assume an AuthGuard has already injected the user into the request
        const user = request.user;
        if (!user) {
            throw new _common.UnauthorizedException('User context is missing');
        }
        // If the user is SUPER_ADMIN, they might not have a schoolId in their token.
        // If they do pass an 'x-tenant-id' header to act on behalf of a school, we can catch it.
        if (user.role === 'SUPER_ADMIN') {
            request.tenantId = request.headers['x-tenant-id'] || null;
        } else {
            // Enforce the schoolId strictly for everyone else
            if (!user.schoolId) {
                throw new _common.UnauthorizedException('Tenant context is missing for non-super-admin user');
            }
            request.tenantId = user.schoolId;
        }
        // Now request.tenantId is guaranteed to hold the correct scoping ID.
        // This value will be extracted by controllers/services for Prisma queries.
        return next.handle();
    }
};
TenantInterceptor = _ts_decorate([
    (0, _common.Injectable)()
], TenantInterceptor);

//# sourceMappingURL=tenant.interceptor.js.map