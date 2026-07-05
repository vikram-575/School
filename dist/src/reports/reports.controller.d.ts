import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getClassReport(sectionId: string, req: any): Promise<{
        section: {
            class: {
                id: string;
                schoolId: string;
                name: string;
                code: string | null;
                order: number;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                updatedBy: string | null;
                deletedAt: Date | null;
            };
            students: ({
                user: {
                    id: string;
                    firstName: string;
                    lastName: string;
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
            })[];
        } & {
            id: string;
            schoolId: string;
            classId: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            updatedBy: string | null;
            deletedAt: Date | null;
            classTeacherId: string | null;
        };
        results: ({
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
            exam: {
                id: string;
                schoolId: string;
                name: string;
                description: string | null;
                startDate: Date;
                endDate: Date;
                createdAt: Date;
                updatedAt: Date;
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
        })[];
        message: string;
    }>;
    getStudentReport(studentId: string, req: any): Promise<{
        student: {
            user: {
                email: string | null;
                firstName: string;
                lastName: string;
            };
            currentSection: ({
                class: {
                    id: string;
                    schoolId: string;
                    name: string;
                    code: string | null;
                    order: number;
                    createdAt: Date;
                    updatedAt: Date;
                    createdBy: string | null;
                    updatedBy: string | null;
                    deletedAt: Date | null;
                };
            } & {
                id: string;
                schoolId: string;
                classId: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                updatedBy: string | null;
                deletedAt: Date | null;
                classTeacherId: string | null;
            }) | null;
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
        results: ({
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
            exam: {
                id: string;
                schoolId: string;
                name: string;
                description: string | null;
                startDate: Date;
                endDate: Date;
                createdAt: Date;
                updatedAt: Date;
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
        })[];
        message: string;
    }>;
}
