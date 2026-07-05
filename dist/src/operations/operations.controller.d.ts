import { OperationsService } from './operations.service';
export declare class OperationsController {
    private readonly operationsService;
    constructor(operationsService: OperationsService);
    getAttendance(req: any, date: string, sectionId?: string): Promise<{
        student: {
            user: {
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
        } & {
            id: string;
            userId: string;
            schoolId: string;
            admissionNumber: string;
            rollNumber: string | null;
            currentSectionId: string | null;
            parentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            updatedBy: string | null;
            deletedAt: Date | null;
        };
        attendance: {
            id: string;
            schoolId: string;
            userId: string;
            date: Date;
            status: string;
            remarks: string | null;
            markedBy: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        } | null;
    }[] | ({
        user: {
            roleId: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        schoolId: string;
        userId: string;
        date: Date;
        status: string;
        remarks: string | null;
        markedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    markAttendance(req: any, data: any): Promise<any[]>;
    getLeaves(req: any, status?: string): Promise<({
        user: {
            email: string | null;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        schoolId: string;
        userId: string;
        type: string;
        startDate: Date;
        endDate: Date;
        reason: string;
        status: string;
        approvedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    applyLeave(req: any, data: any): Promise<{
        id: string;
        schoolId: string;
        userId: string;
        type: string;
        startDate: Date;
        endDate: Date;
        reason: string;
        status: string;
        approvedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    updateLeaveStatus(req: any, id: string, data: any): Promise<{
        id: string;
        schoolId: string;
        userId: string;
        type: string;
        startDate: Date;
        endDate: Date;
        reason: string;
        status: string;
        approvedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    getNotices(req: any): Promise<({
        author: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        schoolId: string;
        title: string;
        content: string;
        type: string;
        targetAudience: string;
        publishDate: Date;
        expiryDate: Date | null;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    createNotice(req: any, data: any): Promise<{
        id: string;
        schoolId: string;
        title: string;
        content: string;
        type: string;
        targetAudience: string;
        publishDate: Date;
        expiryDate: Date | null;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    deleteNotice(req: any, id: string): Promise<{
        id: string;
        schoolId: string;
        title: string;
        content: string;
        type: string;
        targetAudience: string;
        publishDate: Date;
        expiryDate: Date | null;
        authorId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    getPeriods(req: any): Promise<{
        id: string;
        schoolId: string;
        name: string;
        startTime: string;
        endTime: string;
        order: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }[]>;
    createPeriod(req: any, data: any): Promise<{
        id: string;
        schoolId: string;
        name: string;
        startTime: string;
        endTime: string;
        order: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    getTimetable(req: any, sectionId: string): Promise<({
        subject: {
            id: string;
            schoolId: string;
            name: string;
            code: string;
            type: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            updatedBy: string | null;
            deletedAt: Date | null;
        };
        period: {
            id: string;
            schoolId: string;
            name: string;
            startTime: string;
            endTime: string;
            order: number;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        teacher: ({
            user: {
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            userId: string;
            schoolId: string;
            employeeId: string;
            departmentId: string | null;
            designation: string | null;
            joiningDate: Date | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            updatedBy: string | null;
            deletedAt: Date | null;
        }) | null;
    } & {
        id: string;
        schoolId: string;
        sectionId: string;
        subjectId: string;
        teacherId: string | null;
        periodId: string;
        dayOfWeek: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    saveTimetableEntry(req: any, data: any): Promise<{
        id: string;
        schoolId: string;
        sectionId: string;
        subjectId: string;
        teacherId: string | null;
        periodId: string;
        dayOfWeek: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
}
