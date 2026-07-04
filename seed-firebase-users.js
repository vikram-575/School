const admin = require("firebase-admin");

// TODO: Replace with the path to your downloaded Firebase Service Account JSON file
const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

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

async function seedFirebaseUsers() {
  console.log("Seeding exactly 1 account per role into Firebase Auth...");
  
  for (const r of allRoles) {
    try {
      const userRecord = await admin.auth().createUser({
        email: r.email,
        password: commonPassword,
        displayName: r.name,
      });
      
      // We set custom claims so your frontend knows their role immediately upon login
      await admin.auth().setCustomUserClaims(userRecord.uid, { role: r.role });
      
      console.log(`✅ Created: ${r.email} [${r.role}] in Firebase Auth`);
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log(`⚠️ Skipped: ${r.email} already exists in Firebase.`);
      } else {
        console.error(`❌ Failed to create ${r.email}:`, error.message);
      }
    }
  }
  
  console.log("Done!");
  process.exit(0);
}

seedFirebaseUsers();
