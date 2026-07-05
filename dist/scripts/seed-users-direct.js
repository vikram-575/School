"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting direct DB seed...');
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
    await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
    async function createDirectUser(email, password, firstName, lastName, roleName) {
        console.log(`Creating ${email}...`);
        const existing = await prisma.user.findFirst({ where: { email } });
        if (existing) {
            console.log(`User ${email} already exists in DB. Skipping.`);
            return;
        }
        try {
            const result = await prisma.$queryRawUnsafe(`
        INSERT INTO auth.users (
          instance_id,
          id,
          aud,
          role,
          email,
          encrypted_password,
          email_confirmed_at,
          created_at,
          updated_at,
          raw_user_meta_data,
          is_sso_user,
          deleted_at,
          confirmation_token,
          recovery_token,
          email_change_token_new,
          email_change
        ) VALUES (
          '00000000-0000-0000-0000-000000000000',
          gen_random_uuid(),
          'authenticated',
          'authenticated',
          $1,
          crypt($2, gen_salt('bf')),
          now(),
          now(),
          now(),
          $3::jsonb,
          false,
          null,
          '',
          '',
          '',
          ''
        ) RETURNING id;
      `, email, password, JSON.stringify({ first_name: firstName, last_name: lastName }));
            const authUserId = result[0].id;
            await prisma.$executeRawUnsafe(`
        INSERT INTO auth.identities (
          id,
          user_id,
          identity_data,
          provider,
          last_sign_in_at,
          created_at,
          updated_at,
          provider_id
        ) VALUES (
          gen_random_uuid(),
          $1::uuid,
          $2::jsonb,
          'email',
          now(),
          now(),
          now(),
          $3
        );
      `, authUserId, JSON.stringify({ sub: authUserId, email }), authUserId);
            const user = await prisma.user.create({
                data: {
                    id: authUserId,
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
        catch (e) {
            console.error(`Error creating ${email}:`, e.message);
        }
    }
    for (let i = 11; i <= 14; i++) {
        await createDirectUser(`student${i}@school.com`, 'Password123!', `Student`, `${i}`, 'STUDENT');
        await createDirectUser(`parent${i}@school.com`, 'Password123!', `Parent`, `${i}`, 'PARENT');
        await createDirectUser(`teacher${i}@school.com`, 'Password123!', `Teacher`, `${i}`, 'TEACHER');
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
//# sourceMappingURL=seed-users-direct.js.map