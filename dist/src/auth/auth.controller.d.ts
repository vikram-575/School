import { AuthService } from './auth.service';
import type { AuthenticatedRequest } from './jwt-auth.guard';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(signInDto: {
        email?: string;
        loginId?: string;
        password?: string;
    }): Promise<{
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
                status: import(".prisma/client").$Enums.Status;
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
            status: import(".prisma/client").$Enums.Status;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            updatedBy: string | null;
            deletedAt: Date | null;
        };
    }>;
    refresh(body: {
        refresh_token: string;
    }): Promise<{
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
                status: import(".prisma/client").$Enums.Status;
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
            status: import(".prisma/client").$Enums.Status;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            updatedBy: string | null;
            deletedAt: Date | null;
        }) | null;
    }>;
    logout(body: {
        refresh_token: string;
    }): Promise<{
        success: boolean;
    }>;
    me(request: AuthenticatedRequest): Promise<{
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
            status: import(".prisma/client").$Enums.Status;
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
            status: import(".prisma/client").$Enums.Status;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            updatedBy: string | null;
            deletedAt: Date | null;
        };
    } | null>;
}
