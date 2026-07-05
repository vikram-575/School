import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export type AuthenticatedUser = {
    sub: string;
    email?: string;
    role: string;
    schoolId?: string | null;
};
export type AuthenticatedRequest = Request & {
    headers: Record<string, string | string[] | undefined>;
    user: AuthenticatedUser;
    tenantId?: string | null;
};
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly prisma;
    constructor(jwtService: JwtService, prisma: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
