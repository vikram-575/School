import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting direct DB seed...');

  // Ensure default school
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

  // Ensure Roles
  const rolesToEnsure = ['PARENT', 'STUDENT', 'TEACHER'];
  const roleIds: Record<string, string> = {};

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

  // Ensure pgcrypto extension for password hashing
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

  async function createDirectUser(email: string, password: string, firstName: string, lastName: string, roleName: string) {
    console.log(`Creating ${email}...`);
    
    const existing = await prisma.user.findFirst({ where: { email } });
    if (existing) {
      console.log(`User ${email} already exists in DB. Skipping.`);
      return;
    }

    try {
      // 1. Insert into auth.users using raw SQL
      const result = await prisma.$queryRawUnsafe<any[]>(`
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

      // 2. Insert into auth.identities
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

      // 3. Create in Prisma schema (public)
      const user = await prisma.user.create({
        data: {
          id: authUserId,
          schoolId: school!.id,
          roleId: roleIds[roleName],
          email: email,
          passwordHash: 'supabase-managed',
          firstName,
          lastName,
          isEmailVerified: true,
        },
      });

      // 4. Create profiles
      if (roleName === 'TEACHER') {
        await prisma.employeeProfile.create({
          data: {
            userId: user.id,
            schoolId: school!.id,
            employeeId: `EMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            designation: 'Teacher',
          },
        });
      } else if (roleName === 'STUDENT') {
        await prisma.studentProfile.create({
          data: {
            userId: user.id,
            schoolId: school!.id,
            admissionNumber: `ADM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          },
        });
      }

      console.log(`Successfully created ${roleName} ${email}`);
    } catch (e: any) {
      console.error(`Error creating ${email}:`, e.message);
    }
  }

  // Generate 4 of each
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
