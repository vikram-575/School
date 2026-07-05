import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getAdminDashboard(req: any): Promise<{
        totals: {
            students: number;
            teachers: number;
            collectedAmount: number;
            pendingFees: number;
        };
    }>;
    getSuperAdminDashboard(): Promise<{
        activeSchools: number;
        totalCapacity: number;
        mrr: number;
    }>;
    getAccountantDashboard(req: any): Promise<{
        totalCollected: number;
        monthlyCollected: number;
        pendingDues: number;
        activeDefaulters: number;
    }>;
    getPrincipalDashboard(req: any): Promise<{
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
    getHrDashboard(req: any): Promise<{
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
