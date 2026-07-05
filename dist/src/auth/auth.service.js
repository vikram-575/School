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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const supabase_js_1 = require("@supabase/supabase-js");
let AuthService = class AuthService {
    prisma;
    supabase;
    constructor(prisma) {
        this.prisma = prisma;
        this.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL || 'http://localhost:54321', process.env.SUPABASE_KEY || '');
    }
    async validateUser(loginId, pass) {
        if (!loginId || !pass)
            return null;
        if (loginId.includes('@')) {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: loginId,
                password: pass,
            });
            if (error || !data.user)
                return null;
        }
        else {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                phone: loginId,
                password: pass,
            });
            if (error || !data.user)
                return null;
        }
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: loginId }, { phone: loginId }],
            },
            include: {
                role: true
            }
        });
        if (user) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async login(loginId, pass) {
        let authResponse;
        if (loginId.includes('@')) {
            authResponse = await this.supabase.auth.signInWithPassword({
                email: loginId,
                password: pass,
            });
        }
        else {
            authResponse = await this.supabase.auth.signInWithPassword({
                phone: loginId,
                password: pass,
            });
        }
        if (authResponse.error || !authResponse.data.session) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const dbUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: loginId }, { phone: loginId }],
            },
            include: {
                role: true
            }
        });
        if (!dbUser) {
            throw new common_1.UnauthorizedException('User not found in system database');
        }
        return {
            access_token: authResponse.data.session.access_token,
            refresh_token: authResponse.data.session.refresh_token,
            role: dbUser.role.name,
            user: dbUser,
        };
    }
    async refresh(refreshToken) {
        const { data, error } = await this.supabase.auth.refreshSession({ refresh_token: refreshToken });
        if (error || !data.session || !data.user) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        const dbUser = await this.prisma.user.findFirst({
            where: { email: data.user.email },
            include: { role: true }
        });
        return {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            role: dbUser?.role?.name,
            user: dbUser,
        };
    }
    async logout(accessToken) {
        const { error } = await this.supabase.auth.signOut();
        return { success: true };
    }
    async getCurrentUser(userId) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                phone: true,
                firstName: true,
                lastName: true,
                role: true,
                schoolId: true,
                createdAt: true,
                updatedAt: true,
                school: true,
            },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map