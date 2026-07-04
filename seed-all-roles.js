const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ONE account for EVERY role in the database schema...');

  const school = await prisma.school.findFirst();
  let schoolId = null;
  if (school) {
    schoolId = school.id;
  }

  // List of all roles according to the Prisma Schema
  const allRoles = [
    { role: 'SUPER_ADMIN', email: 'one.superadmin@example.com', name: 'Super Admin' },
    { role: 'SCHOOL_ADMIN', email: 'one.schooladmin@example.com', name: 'School Admin' },
    { role: 'PRINCIPAL', email: 'one.principal@example.com', name: 'The Principal' },
    { role: 'VICE_PRINCIPAL', email: 'one.viceprincipal@example.com', name: 'Vice Principal' },
    { role: 'HR', email: 'one.hr@example.com', name: 'Head HR' },
    { role: 'ACCOUNTANT', email: 'one.accountant@example.com', name: 'Head Accountant' },
    { role: 'TECHNICAL', email: 'one.technical@example.com', name: 'Tech Support' },
    { role: 'TEACHER', email: 'one.teacher@example.com', name: 'A Teacher' },
    { role: 'PARENT', email: 'one.parent@example.com', name: 'A Parent' },
    { role: 'STUDENT', email: 'one.student@example.com', name: 'A Student' },
    { role: 'STAFF', email: 'one.staff@example.com', name: 'General Staff' },
  ];

  const commonPassword = 'Password123!';

  for (const r of allRoles) {
    try {
      await prisma.user.upsert({
        where: { email: r.email },
        update: {}, // don't overwrite if it already exists
        create: {
          firstName: r.name.split(' ')[0],
          lastName: r.name.split(' ')[1] || 'User',
          email: r.email,
          passwordHash: commonPassword,
          role: r.role,
          schoolId: r.role === 'SUPER_ADMIN' ? null : schoolId,
        }
      });
      console.log(`✅ Created: ${r.email} [${r.role}] with password "${commonPassword}"`);
    } catch (err) {
      console.error(`❌ Failed: ${r.email}`, err.message);
    }
  }

  console.log('\nFinished seeding all 11 roles!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
