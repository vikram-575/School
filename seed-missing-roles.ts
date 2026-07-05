import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const roles = ['TEACHER', 'STUDENT', 'STAFF', 'HR', 'ACCOUNTANT'];
  
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name_schoolId: { name: role, schoolId: '' } },
      update: {},
      create: {
        name: role,
        description: `System Role: ${role}`,
        isSystem: true,
      },
    });
    console.log(`Ensured role exists: ${role}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
