import { PrismaService } from '../prisma/prisma.service';
export declare class AcademicsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAcademicYears(schoolId: string): Promise<{
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
    createAcademicYear(schoolId: string, data: any): Promise<{
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
    getDepartments(schoolId: string): Promise<{
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
    createDepartment(schoolId: string, data: any): Promise<{
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
    getClasses(schoolId: string): Promise<({
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
    createClass(schoolId: string, data: any): Promise<{
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
    getSections(schoolId: string, classId?: string): Promise<({
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
        classTeacher: ({
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
        classId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string | null;
        updatedBy: string | null;
        deletedAt: Date | null;
        classTeacherId: string | null;
    })[]>;
    createSection(schoolId: string, data: any): Promise<{
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
    getSubjects(schoolId: string): Promise<{
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
    createSubject(schoolId: string, data: any): Promise<{
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
    assignClassTeacher(schoolId: string, sectionId: string, employeeId: string): Promise<{
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
    assignSubjectTeacher(schoolId: string, classSubjectId: string, employeeId: string): Promise<{
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
