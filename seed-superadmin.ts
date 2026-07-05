import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SUPER_ADMIN...');

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY; // Using anon key for sign up

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or Key in .env');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const email = 'admin@school-os.com';
  const password = 'SuperAdminPassword123!';

  console.log(`1. Creating Supabase Auth User: ${email}`);
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstName: 'System',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
      },
    },
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
      console.log('Auth user already exists in Supabase. Proceeding to Prisma sync...');
    } else {
      throw new Error(`Supabase Auth Error: ${authError.message}`);
    }
  } else {
    console.log('Supabase Auth User created successfully!');
  }

  console.log('2. Creating SUPER_ADMIN role in Database');
  let role = await prisma.role.findFirst({
    where: { name: 'SUPER_ADMIN', schoolId: null },
  });

  if (!role) {
    role = await prisma.role.create({
      data: {
        name: 'SUPER_ADMIN',
        description: 'System Administrator with full access to the platform',
        isSystem: true,
      },
    });
    console.log('Role SUPER_ADMIN created.');
  } else {
    console.log('Role SUPER_ADMIN already exists.');
  }

  console.log('3. Linking User Profile in Database');
  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email,
        passwordHash: password, // Storing for prototype reference only
        firstName: 'System',
        lastName: 'Admin',
        roleId: role.id,
        // schoolId is null for Super Admin
      },
    });
    console.log(`User profile for ${email} created successfully!`);
  } else {
    console.log('User profile already exists in DB.');
  }

  console.log('\n✅ SEED COMPLETE. You can now login with:');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
