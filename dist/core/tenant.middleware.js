"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TenantMiddleware", {
    enumerable: true,
    get: function() {
        return TenantMiddleware;
    }
});
const _common = require("@nestjs/common");
const _tenantcontext = require("./tenant.context");
const _jwt = require("@nestjs/jwt");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let TenantMiddleware = class TenantMiddleware {
    use(req, res, next) {
        let schoolId;
        let userId;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                const decoded = this.jwtService.decode(token);
                if (decoded) {
                    schoolId = decoded.schoolId;
                    userId = decoded.sub;
                }
            } catch (err) {
            // Token is invalid, ignore or handle in JwtGuard
            }
        }
        // Run the rest of the request within the AsyncLocalStorage context
        _tenantcontext.tenantContext.run({
            schoolId,
            userId
        }, ()=>{
            next();
        });
    }
    constructor(jwtService){
        this.jwtService = jwtService;
    }
};
TenantMiddleware = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService
    ])
], TenantMiddleware);

//# sourceMappingURL=tenant.middleware.js.map