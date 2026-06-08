import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Document from './models/Document.js';
import Scholarship from './models/Scholarship.js';
import FeeReceipt from './models/FeeReceipt.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eduvault');
    console.log('Database connected. Clearing existing collections...');

    // Clear existing records
    await User.deleteMany({});
    await Document.deleteMany({});
    await Scholarship.deleteMany({});
    await FeeReceipt.deleteMany({});

    console.log('Collections cleared. Seeding default student profile...');

    // 1. Seed Student User
    const student = await User.create({
      firebaseUid: 'dev-student-uid',
      email: 'student@eduvault.com',
      name: 'Aditya Verma',
      enrollmentNumber: 'ENR-2026-001',
      collegeName: 'State Institute of Technology',
      branch: 'Computer Science & Engineering',
      semester: 4,
      phoneNumber: '+91 98765 43210',
      profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      role: 'student',
    });

    // 2. Seed Admin User
    const admin = await User.create({
      firebaseUid: 'dev-admin-uid',
      email: 'admin@eduvault.com',
      name: 'Sneha Reddy',
      enrollmentNumber: 'ADM-999',
      collegeName: 'State Institute of Technology',
      branch: 'Administration',
      semester: 8,
      phoneNumber: '+91 99999 88888',
      profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      role: 'admin',
    });

    console.log('Users seeded. Seeding document library...');

    // 3. Seed Documents for Student
    const aadhaarDoc = await Document.create({
      userId: student._id,
      name: 'Aadhaar_Card.jpg',
      url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
      firebaseStoragePath: `users/${student._id}/Personal/Aadhaar_Card.jpg`,
      fileType: 'jpg',
      category: 'Personal',
      subCategory: 'Aadhaar Card',
      fileSize: 450000, // 450 KB
    });

    const incomeDoc = await Document.create({
      userId: student._id,
      name: 'Income_Certificate_2026.pdf',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      firebaseStoragePath: `users/${student._id}/Scholarship/Income_Certificate_2026.pdf`,
      fileType: 'pdf',
      category: 'Scholarship',
      subCategory: 'Income Certificate',
      fileSize: 1250000, // 1.25 MB
    });

    const passbookDoc = await Document.create({
      userId: student._id,
      name: 'Bank_Passbook_Front.png',
      url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
      firebaseStoragePath: `users/${student._id}/Financial/Bank_Passbook_Front.png`,
      fileType: 'png',
      category: 'Financial',
      subCategory: 'Bank Passbook',
      fileSize: 850000, // 850 KB
    });

    const sem1Result = await Document.create({
      userId: student._id,
      name: 'Semester_1_Marksheet.pdf',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      firebaseStoragePath: `users/${student._id}/Academic/Semester_1_Marksheet.pdf`,
      fileType: 'pdf',
      category: 'Academic',
      subCategory: 'Semester Results',
      fileSize: 1540000, // 1.54 MB
    });

    const receiptDoc = await Document.create({
      userId: student._id,
      name: 'Tuition_Fee_Receipt_Sem3.pdf',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      firebaseStoragePath: `users/${student._id}/Financial/Receipts/Tuition_Fee_Receipt_Sem3.pdf`,
      fileType: 'pdf',
      category: 'Financial',
      subCategory: 'Fee Receipt - Sem 3 (2025-2026)',
      fileSize: 920000,
    });

    console.log('Documents seeded. Seeding scholarships & receipts trackers...');

    // 4. Seed Scholarship Scheme for Student
    await Scholarship.create({
      userId: student._id,
      name: 'Post-Matric Scholarship Scheme',
      provider: 'State Government welfare Department',
      amount: 45000,
      status: 'Submitted',
      applicationDate: new Date('2026-04-10'),
      documents: [aadhaarDoc._id, incomeDoc._id, passbookDoc._id],
      remarks: 'Application submitted online. Waiting for department audit.',
    });

    await Scholarship.create({
      userId: student._id,
      name: 'Merit-Cum-Means National Grant',
      provider: 'Ministry of Education',
      amount: 25000,
      status: 'Approved',
      applicationDate: new Date('2025-10-15'),
      documents: [aadhaarDoc._id, sem1Result._id],
      remarks: 'Sanctioned. Funds credited to linked bank account.',
    });

    // 5. Seed Fee Receipt log
    await FeeReceipt.create({
      userId: student._id,
      documentId: receiptDoc._id,
      academicYear: '2025-2026',
      semester: 3,
      amount: 45000,
      paymentDate: new Date('2025-07-22'),
      receiptNumber: 'REC-2025-3091',
    });

    console.log('Database seeded successfully! Run npm run dev to start.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding process failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
