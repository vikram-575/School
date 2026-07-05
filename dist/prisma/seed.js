"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding Database for Module 1 (Tenant & Core Auth)...');
    const superAdminRole = await prisma.role.upsert({
        where: { name_schoolId: { name: 'SUPER_ADMIN', schoolId: '' } },
        update: {},
        create: {
            name: 'SUPER_ADMIN',
            description: 'Platform Super Administrator',
            isSystem: true,
        },
    });
    const principalRole = await prisma.role.upsert({
        where: { name_schoolId: { name: 'PRINCIPAL', schoolId: '' } },
        update: {},
        create: {
            name: 'PRINCIPAL',
            description: 'School Principal',
            isSystem: true,
        },
    });
    const superAdmin = await prisma.user.upsert({
        where: { email_schoolId: { email: 'admin@schoolos.com', schoolId: '' } },
        update: {},
        create: {
            email: 'admin@schoolos.com',
            passwordHash: 'password123',
            firstName: 'Super',
            lastName: 'Admin',
            roleId: superAdminRole.id,
            isEmailVerified: true,
        },
    });
    const basicPlan = await prisma.plan.upsert({
        where: { name: 'Basic' },
        update: {},
        create: {
            name: 'Basic',
            priceMonthly: 4999,
            priceYearly: 49990,
            maxStudents: 500,
            maxStorageGB: 50,
            features: ['Attendance', 'Fees', 'Timetable'],
        },
    });
    const premiumPlan = await prisma.plan.upsert({
        where: { name: 'Premium' },
        update: {},
        create: {
            name: 'Premium',
            priceMonthly: 14999,
            priceYearly: 149990,
            maxStudents: 2000,
            maxStorageGB: 200,
            features: ['Basic', 'Library', 'Transport', 'Hostel'],
        },
    });
    console.log('Seeding Completed successfully.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map