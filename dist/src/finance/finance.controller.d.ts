import { FinanceService } from './finance.service';
export declare class FinanceController {
    private readonly financeService;
    constructor(financeService: FinanceService);
    getCategories(req: any): Promise<{
        id: string;
        schoolId: string;
        name: string;
        description: string | null;
        amount: number;
        frequency: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }[]>;
    createCategory(req: any, data: any): Promise<{
        id: string;
        schoolId: string;
        name: string;
        description: string | null;
        amount: number;
        frequency: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    getStructures(req: any): Promise<({
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
        } | null;
        items: ({
            feeCategory: {
                id: string;
                schoolId: string;
                name: string;
                description: string | null;
                amount: number;
                frequency: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
            };
        } & {
            id: string;
            schoolId: string;
            feeStructureId: string;
            feeCategoryId: string;
            createdAt: Date;
        })[];
    } & {
        id: string;
        schoolId: string;
        name: string;
        description: string | null;
        classId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    createStructure(req: any, data: any): Promise<({
        items: ({
            feeCategory: {
                id: string;
                schoolId: string;
                name: string;
                description: string | null;
                amount: number;
                frequency: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
            };
        } & {
            id: string;
            schoolId: string;
            feeStructureId: string;
            feeCategoryId: string;
            createdAt: Date;
        })[];
    } & {
        id: string;
        schoolId: string;
        name: string;
        description: string | null;
        classId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }) | null>;
    getInvoices(req: any, status?: string): Promise<({
        payments: {
            id: string;
            schoolId: string;
            invoiceId: string;
            amount: number;
            paymentMethod: string;
            paymentDate: Date;
            referenceNumber: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        }[];
        items: ({
            feeCategory: {
                id: string;
                schoolId: string;
                name: string;
                description: string | null;
                amount: number;
                frequency: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
            };
        } & {
            id: string;
            schoolId: string;
            invoiceId: string;
            feeCategoryId: string;
            amount: number;
            createdAt: Date;
        })[];
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
    } & {
        id: string;
        schoolId: string;
        studentId: string;
        title: string;
        dueDate: Date;
        totalAmount: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    createInvoice(req: any, data: any): Promise<{
        id: string;
        schoolId: string;
        studentId: string;
        title: string;
        dueDate: Date;
        totalAmount: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    recordPayment(req: any, id: string, data: any): Promise<{
        id: string;
        schoolId: string;
        invoiceId: string;
        amount: number;
        paymentMethod: string;
        paymentDate: Date;
        referenceNumber: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
}
