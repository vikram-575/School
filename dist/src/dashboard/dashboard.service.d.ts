import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSuperAdminStats(): Promise<{
        activeSchools: number;
        totalCapacity: number;
        mrr: number;
    }>;
    getAdminStats(schoolId: string): Promise<{
        totals: {
            students: number;
            teachers: number;
            collectedAmount: number;
            pendingFees: number;
        };
    }>;
    getAccountantStats(schoolId: string): Promise<{
        totalCollected: number;
        monthlyCollected: number;
        pendingDues: number;
        activeDefaulters: number;
    }>;
    getPrincipalStats(schoolId: string): Promise<{
        overallAttendance: number;
        academicScoreAvg: number;
        feeCollectionStr: string;
        staffOnLeave: number;
        classPerformance: {
            class: string;
            avg: number;
        }[];
        teacherPerformance: {
            subject: string;
            performance: number;
        }[];
    }>;
    getHrStats(schoolId: string): Promise<{
        totalStaff: number;
        presentToday: number;
        onLeave: number;
        pendingLeaves: number;
        departments: {
            name: string;
            head: string;
            members: number;
        }[];
    }>;
}
