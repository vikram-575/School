"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function cleanup() {
    const email = 'sachinsinghtomar575@gmail.com';
    const user = await prisma.user.findFirst({ where: { email } });
    if (user) {
        console.log("Found user, deleting:", user.id);
        await prisma.employeeProfile.deleteMany({ where: { userId: user.id } });
        await prisma.user.delete({ where: { id: user.id } });
        console.log("Deleted.");
    }
    else {
        console.log("User not found in DB.");
    }
}
cleanup().finally(() => prisma.$disconnect());
//# sourceMappingURL=cleanup.js.map