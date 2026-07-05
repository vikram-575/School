"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const supabase_js_1 = require("@supabase/supabase-js");
const prisma = new client_1.PrismaClient();
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rygtyzwkhcuiwxzqmmlo.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_6OJmArhZRC4HcHd_IBFbmw_7hpaYGHO';
const supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_KEY);
async function main() {
    console.log('Starting seed...');
    let school = await prisma.school.findFirst();
    if (!school) {
        school = await prisma.school.create({
            data: {
                name: 'Demo School',
                contactEmail: 'admin@demoschool.com',
            },
        });
        console.log('Created Demo School');
    }
    const rolesToEnsure = ['PARENT', 'STUDENT', 'TEACHER'];
    const roleIds = {};
    for (const roleName of rolesToEnsure) {
        let role = await prisma.role.findFirst({ where: { name: roleName } });
        if (!role) {
            role = await prisma.role.create({
                data: {
                    name: roleName,
                    schoolId: school.id,
                    isSystem: true,
                },
            });
        }
        roleIds[roleName] = role.id;
    }
    console.log('Roles ensured');
    async function createUser(email, password, firstName, lastName, roleName) {
        console.log(`Creating ${email}...`);
        const existing = await prisma.user.findFirst({ where: { email } });
        if (existing) {
            console.log(`User ${email} already exists in DB. Skipping.`);
            return;
        }
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                },
            },
        });
        if (authError) {
            console.error(`Failed to create ${email} in Supabase:`, authError.message);
            return;
        }
        if (!authData.user) {
            console.error(`No user returned for ${email}`);
            return;
        }
        const user = await prisma.user.create({
            data: {
                id: authData.user.id,
                schoolId: school.id,
                roleId: roleIds[roleName],
                email: email,
                passwordHash: 'supabase-managed',
                firstName,
                lastName,
                isEmailVerified: true,
            },
        });
        if (roleName === 'TEACHER') {
            await prisma.employeeProfile.create({
                data: {
                    userId: user.id,
                    schoolId: school.id,
                    employeeId: `EMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    designation: 'Teacher',
                },
            });
        }
        else if (roleName === 'STUDENT') {
            await prisma.studentProfile.create({
                data: {
                    userId: user.id,
                    schoolId: school.id,
                    admissionNumber: `ADM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                },
            });
        }
        console.log(`Successfully created ${roleName} ${email}`);
    }
    for (let i = 1; i <= 4; i++) {
        await createUser(`student${i}@school.com`, 'Password123!', `Student`, `${i}`, 'STUDENT');
        await createUser(`parent${i}@school.com`, 'Password123!', `Parent`, `${i}`, 'PARENT');
        await createUser(`teacher${i}@school.com`, 'Password123!', `Teacher`, `${i}`, 'TEACHER');
    }
    console.log('Seed complete!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-users.js.map