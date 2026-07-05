"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const supabase_js_1 = require("@supabase/supabase-js");
const prisma = new client_1.PrismaClient();
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rygtyzwkhcuiwxzqmmlo.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_6OJmArhZRC4HcHd_IBFbmw_7hpaYGHO';
const supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_KEY);
async function main() {
    console.log('Starting Super Admin seed...');
    const email = 'tomarsahab575@gmail.com';
    const password = 'Admin@123456';
    let role = await prisma.role.findFirst({ where: { name: 'SUPER_ADMIN' } });
    if (!role) {
        role = await prisma.role.create({
            data: {
                name: 'SUPER_ADMIN',
                isSystem: true,
            },
        });
        console.log('Created SUPER_ADMIN role');
    }
    const existing = await prisma.user.findFirst({ where: { email } });
    if (existing) {
        console.log(`User ${email} already exists in Prisma DB.`);
        return;
    }
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                firstName: 'Company',
                lastName: 'Admin',
            },
        },
    });
    if (authError) {
        console.error(`Failed to create ${email} in Supabase:`, authError.message);
    }
    let userId = authData?.user?.id;
    if (authError && authError.message.includes('already registered')) {
        const { data: signinData } = await supabase.auth.signInWithPassword({ email, password });
        if (signinData?.user) {
            userId = signinData.user.id;
            console.log(`User already exists in Supabase. Using existing ID: ${userId}`);
        }
    }
    if (userId) {
        const user = await prisma.user.create({
            data: {
                id: userId,
                roleId: role.id,
                email: email,
                passwordHash: password,
                firstName: 'Company',
                lastName: 'Admin',
                isEmailVerified: true,
            },
        });
        console.log(`Successfully created SUPER_ADMIN ${email}`);
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-super-admin.js.map