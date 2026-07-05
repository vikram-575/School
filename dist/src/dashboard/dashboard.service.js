"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSuperAdminStats() {
        const schools = await this.prisma.school.findMany({
            include: { subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 } },
        });
        const activeSchools = schools.filter(s => s.status === 'ACTIVE').length;
        let totalCapacity = 0;
        let mrr = 0;
        const PLAN_PRICE = { Basic: 4999, Premium: 14999, Enterprise: 24999 };
        for (const school of schools) {
            const sub = school.subscriptions?.[0];
            if (school.status === 'ACTIVE' && sub && sub.status === 'ACTIVE') {
            }
        }
        const subsWithPlans = await this.prisma.subscription.findMany({
            where: { status: 'ACTIVE', school: { status: 'ACTIVE' } },
            include: { plan: true },
        });
        for (const sub of subsWithPlans) {
            if (sub.plan) {
                totalCapacity += sub.plan.maxStudents;
                mrr += sub.plan.priceMonthly;
            }
        }
        return {
            activeSchools,
            totalCapacity,
            mrr,
        };
    }
    async getAdminStats(schoolId) {
        const students = await this.prisma.studentProfile.count({ where: { schoolId } });
        const teachers = await this.prisma.employeeProfile.count({ where: { schoolId, designation: 'Teacher' } });
        const payments = await this.prisma.payment.aggregate({
            where: { schoolId },
            _sum: { amount: true },
        });
        const collectedAmount = payments._sum.amount || 0;
        const pendingInvoices = await this.prisma.invoice.count({
            where: { schoolId, status: { not: 'PAID' } },
        });
        return {
            totals: {
                students,
                teachers,
                collectedAmount,
                pendingFees: pendingInvoices,
            },
        };
    }
    async getAccountantStats(schoolId) {
        const now = new Date();
        const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const totalPayments = await this.prisma.payment.aggregate({
            where: { schoolId },
            _sum: { amount: true },
        });
        const monthlyPayments = await this.prisma.payment.aggregate({
            where: { schoolId, paymentDate: { gte: currentMonth } },
            _sum: { amount: true },
        });
        const pendingInvoicesAmount = await this.prisma.invoice.aggregate({
            where: { schoolId, status: 'UNPAID' },
            _sum: { totalAmount: true },
        });
        return {
            totalCollected: totalPayments._sum.amount || 0,
            monthlyCollected: monthlyPayments._sum.amount || 0,
            pendingDues: pendingInvoicesAmount._sum.totalAmount || 0,
            activeDefaulters: await this.prisma.invoice.count({ where: { schoolId, status: 'UNPAID', dueDate: { lt: now } } }),
        };
    }
    async getPrincipalStats(schoolId) {
        const students = await this.prisma.studentProfile.count({ where: { schoolId } });
        return {
            overallAttendance: 92.5,
            academicScoreAvg: 85.2,
            feeCollectionStr: '₹42.5L',
            staffOnLeave: await this.prisma.leaveRequest.count({ where: { schoolId, status: 'APPROVED', startDate: { lte: new Date() }, endDate: { gte: new Date() } } }),
            classPerformance: [
                { class: "VI", avg: 78 },
                { class: "VII", avg: 82 },
                { class: "VIII", avg: 76 },
                { class: "IX", avg: 85 },
                { class: "X", avg: 88 },
                { class: "XI", avg: 84 },
                { class: "XII", avg: 91 },
            ],
            teacherPerformance: [
                { subject: "Maths", performance: 88 },
                { subject: "Science", performance: 92 },
                { subject: "English", performance: 85 },
                { subject: "History", performance: 79 },
                { subject: "Hindi", performance: 90 },
            ]
        };
    }
    async getHrStats(schoolId) {
        const totalStaff = await this.prisma.employeeProfile.count({ where: { schoolId } });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const onLeave = await this.prisma.leaveRequest.count({
            where: {
                schoolId,
                status: 'APPROVED',
                startDate: { lte: new Date() },
                endDate: { gte: new Date() }
            }
        });
        const pendingLeaves = await this.prisma.leaveRequest.count({
            where: { schoolId, status: 'PENDING' }
        });
        return {
            totalStaff,
            presentToday: totalStaff - onLeave,
            onLeave,
            pendingLeaves,
            departments: [
                { name: "Teaching", head: "Mrs. Sharma", members: 45 },
                { name: "Admin", head: "Mr. Verma", members: 12 },
                { name: "Support", head: "Mr. Kumar", members: 8 },
            ]
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map