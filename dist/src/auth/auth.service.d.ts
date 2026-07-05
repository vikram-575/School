import { PrismaService } from '../prisma/prisma.service';
import { User, Role } from '@prisma/client';
export declare class AuthService {
    private prisma;
    private supabase;
    constructor(prisma: PrismaService);
    validateUser(loginId?: string, pass?: string): Promise<(Omit<User, 'passwordHash'> & {
        role: Role;
    }) | null>;
    login(loginId: string, pass: string): Promise<{
        access_token: string;
        refresh_token: string;
        role: string;
        user: {
            role: {
                id: string;
                schoolId: string | null;
                name: string;
                description: string | null;
                isSystem: boolean;
                status: import("@prisma/client").$Enums.Status;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                updatedBy: string | null;
                deletedAt: Date | null;
            };
        } & {
            id: string;
            schoolId: string | null;
            roleId: string;
            email: string | null;
            phone: string | null;
            passwordHash: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
            isEmailVerified: boolean;
            isPhoneVerified: boolean;
            status: import("@prisma/client").$Enums.Status;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            updatedBy: string | null;
            deletedAt: Date | null;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
        role: string | undefined;
        user: ({
            role: {
                id: string;
                schoolId: string | null;
                name: string;
                description: string | null;
                isSystem: boolean;
                status: import("@prisma/client").$Enums.Status;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                updatedBy: string | null;
                deletedAt: Date | null;
            };
        } & {
            id: string;
            schoolId: string | null;
            roleId: string;
            email: string | null;
            phone: string | null;
            passwordHash: string;
            firstName: string;
            lastName: string;
            avatarUrl: string | null;
            isEmailVerified: boolean;
            isPhoneVerified: boolean;
            status: import("@prisma/client").$Enums.Status;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            updatedBy: string | null;
            deletedAt: Date | null;
        }) | null;
    }>;
    logout(accessToken: string): Promise<{
        success: boolean;
    }>;
    getCurrentUser(userId: string): Promise<{
        id: string;
        schoolId: string | null;
        email: string | null;
        phone: string | null;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: Date;
        school: {
            id: string;
            name: string;
            subdomain: string | null;
            registrationCode: string | null;
            address: string | null;
            city: string | null;
            state: string | null;
            country: string | null;
            zipCode: string | null;
            contactEmail: string;
            contactPhone: string | null;
            logoUrl: string | null;
            website: string | null;
            status: import("@prisma/client").$Enums.Status;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            updatedBy: string | null;
            deletedAt: Date | null;
        } | null;
        role: {
            id: string;
            schoolId: string | null;
            name: string;
            description: string | null;
            isSystem: boolean;
            status: import("@prisma/client").$Enums.Status;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            updatedBy: string | null;
            deletedAt: Date | null;
        };
    } | null>;
}
