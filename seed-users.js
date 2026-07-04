const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding 10 students and 10 teachers...');

  // 1. We need a school ID to attach them to.
  const school = await prisma.school.findFirst();
  if (!school) {
    console.log('No school found in the database to attach users to.');
    return;
  }
  const schoolId = school.id;

  // 2. Generate 10 Teachers
  const teacherNames = [
    { first: 'Amit', last: 'Verma' },
    { first: 'Priya', last: 'Singh' },
    { first: 'Sandeep', last: 'Yadav' },
    { first: 'Neha', last: 'Gupta' },
    { first: 'Vikram', last: 'Chauhan' },
    { first: 'Meera', last: 'Rao' },
    { first: 'Karan', last: 'Malhotra' },
    { first: 'Pooja', last: 'Joshi' },
    { first: 'Rahul', last: 'Desai' },
    { first: 'Anjali', last: 'Patel' },
  ];

  for (let i = 0; i < 10; i++) {
    const t = teacherNames[i];
    await prisma.user.create({
      data: {
        firstName: t.first,
        lastName: t.last,
        email: `teacher${i+1}@school.com`,
        phone: `98000000${i < 10 ? '0'+i : i}`,
        passwordHash: 'password123',
        role: 'TEACHER',
        schoolId: schoolId,
        teacherProfile: {
          create: {
            employeeId: `EMP-2026-${String(i+1).padStart(3, '0')}`,
            qualification: 'M.Ed',
          }
        }
      }
    });
  }

  // 3. Generate 10 Students
  const studentNames = [
    { first: 'Aarav', last: 'Sharma' },
    { first: 'Vihaan', last: 'Kumar' },
    { first: 'Vivaan', last: 'Ahuja' },
    { first: 'Ananya', last: 'Iyer' },
    { first: 'Diya', last: 'Das' },
    { first: 'Advik', last: 'Trivedi' },
    { first: 'Myra', last: 'Nair' },
    { first: 'Kiara', last: 'Bose' },
    { first: 'Kabir', last: 'Menon' },
    { first: 'Ishaan', last: 'Jain' },
  ];

  for (let i = 0; i < 10; i++) {
    const s = studentNames[i];
    await prisma.user.create({
      data: {
        firstName: s.first,
        lastName: s.last,
        email: `student${i+1}@school.com`,
        phone: `99000000${i < 10 ? '0'+i : i}`,
        passwordHash: 'password123',
        role: 'STUDENT',
        schoolId: schoolId,
        studentProfile: {
          create: {
            admissionNumber: `ADM-2026-${String(i+1).padStart(3, '0')}`,
            rollNumber: String(i+1),
          }
        }
      }
    });
  }

  console.log('Successfully seeded 10 teachers and 10 students.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
