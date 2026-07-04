const admin = require("firebase-admin");

// We can safely initialize again if it's the first time in this process, 
// or check if apps length is 0.
if (admin.apps.length === 0) {
  const serviceAccount = require("./firebase-service-account.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function seedDatabase() {
  console.log("Starting Firestore Seeding...");
  
  // 1. Create a dummy School
  const schoolRef = db.collection("schools").doc("DPS_001");
  await schoolRef.set({
    name: "Delhi Public School",
    code: "DPS_001",
    address: "123 Education Lane",
    established: 1995
  });
  console.log("✅ Seeded School: Delhi Public School");

  // 2. Create some dummy Students in the 'users' collection
  const students = [
    { name: "Arjun Kumar", grade: "10th", rollNo: "10A_01", type: "student" },
    { name: "Priya Sharma", grade: "10th", rollNo: "10A_02", type: "student" },
    { name: "Rahul Singh", grade: "11th", rollNo: "11B_05", type: "student" }
  ];

  const batch = db.batch();
  for (const s of students) {
    const docRef = db.collection("users").doc();
    batch.set(docRef, {
      ...s,
      schoolId: "DPS_001",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  await batch.commit();
  console.log(`✅ Seeded ${students.length} Students`);

  // 3. Create a dummy Class/Course
  await db.collection("classes").doc("Class_10A").set({
    name: "Class 10 A",
    teacherId: "teacher_001", // This would normally match a Firebase Auth UID
    subject: "Mathematics",
    schoolId: "DPS_001"
  });
  console.log("✅ Seeded Class: Class 10 A");

  console.log("🎉 Seeding Complete!");
  process.exit(0);
}

seedDatabase().catch(console.error);
