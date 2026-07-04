const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();

const prisma = new PrismaClient();

async function seedData() {
  console.log("Starting DB-direct seeding process...");
  try {
    const schoolId = "demo-school-1";
    const school = await prisma.school.upsert({
      where: { subdomain: 'DEMO' },
      update: {},
      create: {
        id: schoolId,
        name: 'Demo International School',
        subdomain: 'DEMO',
        registrationCode: 'DEMO2026',
        address: '123 Education Street',
        contactEmail: 'contact@demoschool.com',
        contactPhone: '1234567890',
        status: 'ACTIVE',
      }
    });
    console.log("School created:", school.name);

    const usersToCreate = [
      { email: 'admin@demoschool.com', password: 'Password123!', role: 'SCHOOL_ADMIN', firstName: 'Alice', lastName: 'Admin' },
      { email: 'teacher@demoschool.com', password: 'Password123!', role: 'TEACHER', firstName: 'Bob', lastName: 'Teacher' },
      { email: 'parent@demoschool.com', password: 'Password123!', role: 'PARENT', firstName: 'Carol', lastName: 'Parent' },
      { email: 'student@demoschool.com', password: 'Password123!', role: 'STUDENT', firstName: 'Dave', lastName: 'Student' }
    ];

    for (const u of usersToCreate) {
      console.log(`Creating user: ${u.email}...`);
      
      const role = await prisma.role.findFirst({ where: { name: u.role } });
      if (!role) {
        console.error("Role not found:", u.role);
        continue;
      }

      // Check if user already exists in auth.users
      const existingUser = await prisma.$queryRawUnsafe(`SELECT id FROM auth.users WHERE email = '${u.email}'`);
      
      let supabaseUserId;
      if (existingUser.length > 0) {
        supabaseUserId = existingUser[0].id;
        console.log("User already exists in auth.users:", supabaseUserId);
      } else {
        supabaseUserId = crypto.randomUUID();
        const encryptedPassword = await bcrypt.hash(u.password, 10);
        
        await prisma.$executeRawUnsafe(`
          INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, 
            recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
          ) VALUES (
            '${supabaseUserId}', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '${u.email}', '${encryptedPassword}', now(), 
            now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
          )
        `);
        console.log("Inserted into auth.users:", supabaseUserId);
      }

      const user = await prisma.user.upsert({
        where: { id: supabaseUserId },
        update: {},
        create: {
          id: supabaseUserId,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          roleId: role.id,
          schoolId: school.id,
          passwordHash: u.password,
          status: 'ACTIVE'
        }
      });
      console.log(`Prisma user created for ${u.email}`);

      if (u.role === 'TEACHER') {
        await prisma.employeeProfile.upsert({
          where: { employeeId: 'EMP-T1', schoolId: school.id },
          update: {},
          create: {
            userId: user.id,
            schoolId: school.id,
            employeeId: 'EMP-T1',
            joiningDate: new Date(),
          }
        });
      } else if (u.role === 'STUDENT') {
        await prisma.studentProfile.upsert({
          where: { admissionNumber_schoolId: { admissionNumber: 'ADM-S1', schoolId: school.id } },
          update: {},
          create: {
            userId: user.id,
            schoolId: school.id,
            admissionNumber: 'ADM-S1',
            rollNumber: '101',
          }
        });
      }
    }
    console.log("Seeding complete!");
  } catch (error) {
    console.error("Fatal Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
