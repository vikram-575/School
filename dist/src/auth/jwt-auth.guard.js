"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
let JwtAuthGuard = class JwtAuthGuard {
    jwtService;
    prisma;
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
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
                throw new common_1.ForbiddenException('Invalid or expired token from Supabase');
            }
            console.log('JwtAuthGuard: Supabase user found:', data.user.id, data.user.email);
            let user = await this.prisma.user.findUnique({
                where: { id: data.user.id },
                include: { role: true }
            });
            if (!user && data.user.email) {
                console.log('JwtAuthGuard: User not found by ID, checking by email:', data.user.email);
                user = await this.prisma.user.findFirst({
                    where: { email: data.user.email },
                    include: { role: true }
                });
            }
            if (!user) {
                console.error('JwtAuthGuard: User not found in database for id:', data.user.id);
                throw new common_1.ForbiddenException('User not found in database');
            }
            console.log('JwtAuthGuard: User authorized successfully with role:', user.role.name);
            req.user = {
                sub: user.id,
                email: user.email,
                role: user.role.name,
                schoolId: user.schoolId
            };
            const requestedSchoolId = req.query.schoolId
                ? req.query.schoolId
                : req.headers['x-tenant-id']
                    ? req.headers['x-tenant-id']
                    : req.user.schoolId ?? null;
            req.tenantId = requestedSchoolId;
            return true;
        }
        catch (error) {
            console.error('JwtAuthGuard Error:', error);
            if (error instanceof common_1.UnauthorizedException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new common_1.ForbiddenException('Invalid token');
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map