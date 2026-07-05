import { AcademicsService } from './academics.service';
export declare class AcademicsController {
    private readonly academicsService;
    constructor(academicsService: AcademicsService);
    getAcademicYears(req: any): Promise<{
        id: string;
        schoolId: string;
        name: string;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string | null;
        updatedBy: string | null;
        deletedAt: Date | null;
    }[]>;
    createAcademicYear(req: any, body: any): Promise<{
        id: string;
        schoolId: string;
        name: string;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string | null;
        updatedBy: string | null;
        deletedAt: Date | null;
    }>;
    getDepartments(req: any): Promise<{
        id: string;
        schoolId: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string | null;
        updatedBy: string | null;
        deletedAt: Date | null;
    }[]>;
    createDepartment(req: any, body: any): Promise<{
        id: string;
        schoolId: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string | null;
        updatedBy: string | null;
        deletedAt: Date | null;
    }>;
    getClasses(req: any): Promise<({
        sections: {
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
        }[];
    } & {
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
    })[]>;
    createClass(req: any, body: any): Promise<{
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
    }>;
    getSections(req: any, classId?: string): Promise<({
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
    })[]>;
    createSection(req: any, body: any): Promise<{
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
    }>;
    getSubjects(req: any): Promise<{
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
    }[]>;
    createSubject(req: any, body: any): Promise<{
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
    }>;
    assignClassTeacher(sectionId: string, req: any, body: {
        teacherId: string;
    }): Promise<{
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
    }>;
    assignSubjectTeacher(classSubjectId: string, req: any, body: {
        teacherId: string;
    }): Promise<{
        id: string;
        schoolId: string;
        sectionId: string;
        subjectId: string;
        teacherId: string | null;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string | null;
        updatedBy: string | null;
        deletedAt: Date | null;
    }>;
}
