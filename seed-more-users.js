const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding 2 of each role (Student, Teacher, School Admin, Superadmin)...');

  // Need a school ID to attach them to
  const school = await prisma.school.findFirst();
  let schoolId = null;
  if (school) {
    schoolId = school.id;
  } else {
    console.log('No school found in the database. Creating a default school...');
    const newSchool = await prisma.school.create({
      data: {
        name: 'Default Test School',
        contactEmail: 'contact@defaultschool.com'
      }
    });
    schoolId = newSchool.id;
  }

  const usersToCreate = [
    // STUDENTS
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe.test99@example.com',
      passwordHash: 'SecureTest!2024',
      role: 'STUDENT',
      schoolId: schoolId,
      studentProfile: { create: { admissionNumber: 'TEST-ADM-001' } }
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith.demo22@example.com',
      passwordHash: 'FlutterAuth#887',
      role: 'STUDENT',
      schoolId: schoolId,
      studentProfile: { create: { admissionNumber: 'TEST-ADM-002' } }
    },
    // TEACHERS
    {
      firstName: 'Teacher',
      lastName: 'One',
      email: 'teacher1.test@example.com',
      passwordHash: 'TeacherPass!1',
      role: 'TEACHER',
      schoolId: schoolId,
      teacherProfile: { create: { employeeId: 'TEST-EMP-001' } }
    },
    {
      firstName: 'Teacher',
      lastName: 'Two',
      email: 'teacher2.test@example.com',
      passwordHash: 'TeacherPass!2',
      role: 'TEACHER',
      schoolId: schoolId,
      teacherProfile: { create: { employeeId: 'TEST-EMP-002' } }
    },
    // SCHOOL ADMINS
    {
      firstName: 'Admin',
      lastName: 'Oakridge',
      email: 'admin.oakridge@example.com',
      passwordHash: 'AdminPass!2024',
      role: 'SCHOOL_ADMIN',
      schoolId: schoolId
    },
    {
      firstName: 'Admin',
      lastName: 'Pinehurst',
      email: 'admin.pinehurst@example.com',
      passwordHash: 'School@Auth99',
      role: 'SCHOOL_ADMIN',
      schoolId: schoolId
    },
    // SUPERADMINS
    {
      firstName: 'Super',
      lastName: 'Sysadmin',
      email: 'super.sysadmin@example.com',
      passwordHash: 'SuperSecure!Sys24',
      role: 'SUPER_ADMIN',
      schoolId: null
    },
    {
      firstName: 'Global',
      lastName: 'Director',
      email: 'global.director@example.com',
      passwordHash: 'Director#Root11',
      role: 'SUPER_ADMIN',
      schoolId: null
    }
  ];

  for (const u of usersToCreate) {
    try {
      await prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: u
      });
      console.log(`✅ Created/Verified user: ${u.email} [${u.role}]`);
    } catch (err) {
      console.error(`❌ Failed to create ${u.email}:`, err.message);
    }
  }

  console.log('\nSeeding complete. You can now log in with these accounts!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
