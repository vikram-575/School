"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "JwtAuthGuard", {
    enumerable: true,
    get: function() {
        return JwtAuthGuard;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _prismaservice = require("../prisma/prisma.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let JwtAuthGuard = class JwtAuthGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const req = request;
        const authHeader = req.headers?.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return false;
        }
        const token = authHeader.split(' ')[1];
        try {
            const supabaseUrl = process.env.SUPABASE_URL || '';
            const supabaseKey = process.env.SUPABASE_KEY || '';
            const { createClient } = require('@supabase/supabase-js');
            const supabase = createClient(supabaseUrl, supabaseKey);
            const { data, error } = await supabase.auth.getUser(token);
            if (error || !data.user) {
                console.error('JwtAuthGuard: Supabase error:', error);
                throw new _common.ForbiddenException('Invalid or expired token from Supabase');
            }
            console.log('JwtAuthGuard: Supabase user found:', data.user.id, data.user.email);
            // Supabase payload has 'sub' as the user's ID
            let user = await this.prisma.user.findUnique({
                where: {
                    id: data.user.id
                },
                include: {
                    role: true
                }
            });
            // Fallback: Check by email in case of legacy token or manual setup mismatch
            if (!user && data.user.email) {
                console.log('JwtAuthGuard: User not found by ID, checking by email:', data.user.email);
                user = await this.prisma.user.findFirst({
                    where: {
                        email: data.user.email
                    },
                    include: {
                        role: true
                    }
                });
            }
            if (!user) {
                console.error('JwtAuthGuard: User not found in database for id:', data.user.id);
                throw new _common.ForbiddenException('User not found in database');
            }
            console.log('JwtAuthGuard: User authorized successfully with role:', user.role.name);
            req.user = {
                sub: user.id,
                email: user.email,
                role: user.role.name,
                schoolId: user.schoolId
            };
            const requestedSchoolId = req.query.schoolId ? req.query.schoolId : req.headers['x-tenant-id'] ? req.headers['x-tenant-id'] : req.user.schoolId ?? null;
            req.tenantId = requestedSchoolId;
            return true;
        } catch (error) {
            console.error('JwtAuthGuard Error:', error);
            if (error instanceof _common.UnauthorizedException || error instanceof _common.ForbiddenException) {
                throw error;
            }
            throw new _common.ForbiddenException('Invalid token');
        }
    }
    constructor(jwtService, prisma){
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
};
JwtAuthGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService,
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], JwtAuthGuard);

//# sourceMappingURL=jwt-auth.guard.js.map