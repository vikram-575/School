import { PrismaService } from '../prisma/prisma.service';
export declare class ExamsService {
    private prisma;
    constructor(prisma: PrismaService);
    getExams(schoolId: string): Promise<{
        id: string;
        schoolId: string;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }[]>;
    createExam(schoolId: string, data: any): Promise<{
        id: string;
        schoolId: string;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    getExamResults(schoolId: string, examId: string, sectionId?: string): Promise<({
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
    } & {
        id: string;
        schoolId: string;
        examId: string;
        studentId: string;
        subjectId: string;
        marksObtained: number;
        maxMarks: number;
        grade: string | null;
        remarks: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    saveExamResult(schoolId: string, data: any): Promise<{
        id: string;
        schoolId: string;
        examId: string;
        studentId: string;
        subjectId: string;
        marksObtained: number;
        maxMarks: number;
        grade: string | null;
        remarks: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
}
