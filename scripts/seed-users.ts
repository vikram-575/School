import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rygtyzwkhcuiwxzqmmlo.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_6OJmArhZRC4HcHd_IBFbmw_7hpaYGHO';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log('Starting seed...');

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

  // Helper to create users
  async function createUser(email: string, password: string, firstName: string, lastName: string, roleName: string) {
    console.log(`Creating ${email}...`);
    
    // Check if exists in Prisma first
    const existing = await prisma.user.findFirst({ where: { email } });
    if (existing) {
      console.log(`User ${email} already exists in DB. Skipping.`);
      return;
    }

    // 1. Create in Supabase Auth
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

    // 2. Create in Prisma with the exact Supabase ID
    const user = await prisma.user.create({
      data: {
        id: authData.user.id, // VERY IMPORTANT: Link Prisma User to Supabase Auth User
        schoolId: school!.id,
        roleId: roleIds[roleName],
        email: email,
        passwordHash: 'supabase-managed', // Password is managed by Supabase
        firstName,
        lastName,
        isEmailVerified: true,
      },
    });

    // 3. Create profiles
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
  }

  // Generate 4 of each
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
