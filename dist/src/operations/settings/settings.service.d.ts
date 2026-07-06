import { PrismaService } from '../../prisma/prisma.service';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(schoolId: string): Promise<any>;
    updateSettings(schoolId: string, settingsData: any, userId: string): Promise<{
        id: string;
        schoolId: string | null;
        key: string;
        value: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string | null;
        updatedBy: string | null;
    }>;
}
