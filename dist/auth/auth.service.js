"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthService", {
    enumerable: true,
    get: function() {
        return AuthService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../prisma/prisma.service");
const _supabasejs = require("@supabase/supabase-js");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AuthService = class AuthService {
    async validateUser(loginId, pass) {
        if (!loginId || !pass) return null;
        // Check if it's an email
        if (loginId.includes('@')) {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: loginId,
                password: pass
            });
            if (error || !data.user) return null;
        } else {
            // Login via phone
            const { data, error } = await this.supabase.auth.signInWithPassword({
                phone: loginId,
                password: pass
            });
            if (error || !data.user) return null;
        }
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    {
                        email: loginId
                    },
                    {
                        phone: loginId
                    }
                ]
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
        // Perform Supabase Login
        let authResponse;
        if (loginId.includes('@')) {
            authResponse = await this.supabase.auth.signInWithPassword({
                email: loginId,
                password: pass
            });
        } else {
            authResponse = await this.supabase.auth.signInWithPassword({
                phone: loginId,
                password: pass
            });
        }
        if (authResponse.error || !authResponse.data.session) {
            throw new _common.UnauthorizedException('Invalid credentials');
        }
        const dbUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    {
                        email: loginId
                    },
                    {
                        phone: loginId
                    }
                ]
            },
            include: {
                role: true
            }
        });
        if (!dbUser) {
            throw new _common.UnauthorizedException('User not found in system database');
        }
        return {
            access_token: authResponse.data.session.access_token,
            refresh_token: authResponse.data.session.refresh_token,
            role: dbUser.role.name,
            user: dbUser
        };
    }
    async refresh(refreshToken) {
        const { data, error } = await this.supabase.auth.refreshSession({
            refresh_token: refreshToken
        });
        if (error || !data.session || !data.user) {
            throw new _common.UnauthorizedException('Invalid or expired refresh token');
        }
        const dbUser = await this.prisma.user.findFirst({
            where: {
                email: data.user.email
            },
            include: {
                role: true
            }
        });
        return {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            role: dbUser?.role?.name,
            user: dbUser
        };
    }
    async logout(accessToken) {
        const { error } = await this.supabase.auth.signOut(); // Requires context of token if called on behalf of user, better to let client clear local session
        // Since we don't have the user token here easily without passing it, typically logout is handled purely client-side with Supabase.
        // For API consistency, returning success.
        return {
            success: true
        };
    }
    async getCurrentUser(userId) {
        return this.prisma.user.findUnique({
            where: {
                id: userId
            },
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
                school: true
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
        this.supabase = (0, _supabasejs.createClient)(process.env.SUPABASE_URL || 'http://localhost:54321', process.env.SUPABASE_KEY || '');
    }
};
AuthService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], AuthService);

//# sourceMappingURL=auth.service.js.map