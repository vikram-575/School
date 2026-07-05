"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthModule", {
    enumerable: true,
    get: function() {
        return AuthModule;
    }
});
const _common = require("@nestjs/common");
const _authservice = require("./auth.service");
const _authcontroller = require("./auth.controller");
const _jwt = require("@nestjs/jwt");
const _prismamodule = require("../prisma/prisma.module");
const _jwtauthguard = require("./jwt-auth.guard");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AuthModule = class AuthModule {
};
AuthModule = _ts_decorate([
    (0, _common.Global)(),
    (0, _common.Module)({
        imports: [
            _prismamodule.PrismaModule,
            _jwt.JwtModule.register({
                secret: process.env.SUPABASE_JWT_SECRET || 'super-secret-key-change-in-prod',
                signOptions: {
                    expiresIn: '1d'
                }
            })
        ],
        controllers: [
            _authcontroller.AuthController
        ],
        providers: [
            _authservice.AuthService,
            _jwtauthguard.JwtAuthGuard
        ],
        exports: [
            _authservice.AuthService,
            _jwt.JwtModule,
            _jwtauthguard.JwtAuthGuard
        ]
    })
], AuthModule);

//# sourceMappingURL=auth.module.js.map