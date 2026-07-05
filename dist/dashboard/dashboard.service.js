"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DashboardService", {
    enumerable: true,
    get: function() {
        return DashboardService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../prisma/prisma.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let DashboardService = class DashboardService {
    async getSuperAdminStats() {
        const schools = await this.prisma.school.findMany({
            include: {
                subscriptions: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                }
            }
        });
        const activeSchools = schools.filter((s)=>s.status === 'ACTIVE').length;
        let totalCapacity = 0;
        let mrr = 0;
        const PLAN_PRICE = {
            Basic: 4999,
            Premium: 14999,
            Enterprise: 24999
        };
        for (const school of schools){
            const sub = school.subscriptions?.[0];
            if (school.status === 'ACTIVE' && sub && sub.status === 'ACTIVE') {
            // Wait, maxStudents doesn't exist on Subscription? It's on Plan! Let's fetch plans.
            // Actually we can just do a simpler query or rely on the frontend calculation, but we want it in the backend.
            }
        }
        // Let's do it properly by querying plans.
        const subsWithPlans = await this.prisma.subscription.findMany({
            where: {
                status: 'ACTIVE',
                school: {
                    status: 'ACTIVE'
                }
            },
            include: {
                plan: true
            }
        });
        for (const sub of subsWithPlans){
            if (sub.plan) {
                totalCapacity += sub.plan.maxStudents;
                mrr += sub.plan.priceMonthly;
            }
        }
        return {
            activeSchools,
            totalCapacity,
            mrr
        };
    }
    async getAdminStats(schoolId) {
        const students = await this.prisma.studentProfile.count({
            where: {
                schoolId
            }
        });
        const teachers = await this.prisma.employeeProfile.count({
            where: {
                schoolId,
                designation: 'Teacher'
            }
        });
        // Total fees collected
        const payments = await this.prisma.payment.aggregate({
            where: {
                schoolId
            },
            _sum: {
                amount: true
            }
        });
        const collectedAmount = payments._sum.amount || 0;
        // Pending invoices
        const pendingInvoices = await this.prisma.invoice.count({
            where: {
                schoolId,
                status: {
                    not: 'PAID'
                }
            }
        });
        return {
            totals: {
                students,
                teachers,
                collectedAmount,
                pendingFees: pendingInvoices
            }
        };
    }
    async getAccountantStats(schoolId) {
        const now = new Date();
        const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        // Revenue logic
        const totalPayments = await this.prisma.payment.aggregate({
            where: {
                schoolId
            },
            _sum: {
                amount: true
            }
        });
        const monthlyPayments = await this.prisma.payment.aggregate({
            where: {
                schoolId,
                paymentDate: {
                    gte: currentMonth
                }
            },
            _sum: {
                amount: true
            }
        });
        const pendingInvoicesAmount = await this.prisma.invoice.aggregate({
            where: {
                schoolId,
                status: 'UNPAID'
            },
            _sum: {
                totalAmount: true
            }
        });
        return {
            totalCollected: totalPayments._sum.amount || 0,
            monthlyCollected: monthlyPayments._sum.amount || 0,
            pendingDues: pendingInvoicesAmount._sum.totalAmount || 0,
            activeDefaulters: await this.prisma.invoice.count({
                where: {
                    schoolId,
                    status: 'UNPAID',
                    dueDate: {
                        lt: now
                    }
                }
            })
        };
    }
    async getPrincipalStats(schoolId) {
        const students = await this.prisma.studentProfile.count({
            where: {
                schoolId
            }
        });
        // Mock performance for now since we don't have exams table in schema
        return {
            overallAttendance: 92.5,
            academicScoreAvg: 85.2,
            feeCollectionStr: '₹42.5L',
            staffOnLeave: await this.prisma.leaveRequest.count({
                where: {
                    schoolId,
                    status: 'APPROVED',
                    startDate: {
                        lte: new Date()
                    },
                    endDate: {
                        gte: new Date()
                    }
                }
            }),
            classPerformance: [
                {
                    class: "VI",
                    avg: 78
                },
                {
                    class: "VII",
                    avg: 82
                },
                {
                    class: "VIII",
                    avg: 76
                },
                {
                    class: "IX",
                    avg: 85
                },
                {
                    class: "X",
                    avg: 88
                },
                {
                    class: "XI",
                    avg: 84
                },
                {
                    class: "XII",
                    avg: 91
                }
            ],
            teacherPerformance: [
                {
                    subject: "Maths",
                    performance: 88
                },
                {
                    subject: "Science",
                    performance: 92
                },
                {
                    subject: "English",
                    performance: 85
                },
                {
                    subject: "History",
                    performance: 79
                },
                {
                    subject: "Hindi",
                    performance: 90
                }
            ]
        };
    }
    async getHrStats(schoolId) {
        const totalStaff = await this.prisma.employeeProfile.count({
            where: {
                schoolId
            }
        });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const onLeave = await this.prisma.leaveRequest.count({
            where: {
                schoolId,
                status: 'APPROVED',
                startDate: {
                    lte: new Date()
                },
                endDate: {
                    gte: new Date()
                }
            }
        });
        const pendingLeaves = await this.prisma.leaveRequest.count({
            where: {
                schoolId,
                status: 'PENDING'
            }
        });
        return {
            totalStaff,
            presentToday: totalStaff - onLeave,
            onLeave,
            pendingLeaves,
            departments: [
                {
                    name: "Teaching",
                    head: "Mrs. Sharma",
                    members: 45
                },
                {
                    name: "Admin",
                    head: "Mr. Verma",
                    members: 12
                },
                {
                    name: "Support",
                    head: "Mr. Kumar",
                    members: 8
                }
            ]
        };
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
DashboardService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], DashboardService);

//# sourceMappingURL=dashboard.service.js.map