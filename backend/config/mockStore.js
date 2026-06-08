// In-memory dataset fallback for Zero-Setup Sandbox Mode
export const mockUsers = [
  {
    _id: "60c72b2f9b1d8b22a07c91b1",
    firebaseUid: "dev-student-uid",
    email: "student@eduvault.com",
    name: "Aditya Verma",
    enrollmentNumber: "ENR-2026-001",
    collegeName: "State Institute of Technology",
    branch: "Computer Science & Engineering",
    semester: 4,
    phoneNumber: "+91 98765 43210",
    profilePhoto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
    role: "student",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "60c72b2f9b1d8b22a07c91b2",
    firebaseUid: "dev-admin-uid",
    email: "admin@eduvault.com",
    name: "Sneha Reddy",
    enrollmentNumber: "ADM-999",
    collegeName: "State Institute of Technology",
    branch: "Administration",
    semester: 8,
    phoneNumber: "+91 99999 88888",
    profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    role: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockDocuments = [
  {
    _id: "60c72b2f9b1d8b22a07c91b3",
    userId: "60c72b2f9b1d8b22a07c91b1",
    name: "Aadhaar_Card.jpg",
    url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80",
    firebaseStoragePath: "users/60c72b2f9b1d8b22a07c91b1/Personal/Aadhaar_Card.jpg",
    fileType: "jpg",
    category: "Personal",
    subCategory: "Aadhaar Card",
    fileSize: 450000,
    createdAt: new Date("2026-05-10T12:00:00Z").toISOString()
  },
  {
    _id: "60c72b2f9b1d8b22a07c91b4",
    userId: "60c72b2f9b1d8b22a07c91b1",
    name: "Income_Certificate_2026.pdf",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    firebaseStoragePath: "users/60c72b2f9b1d8b22a07c91b1/Scholarship/Income_Certificate_2026.pdf",
    fileType: "pdf",
    category: "Scholarship",
    subCategory: "Income Certificate",
    fileSize: 1250000,
    createdAt: new Date("2026-05-15T14:30:00Z").toISOString()
  },
  {
    _id: "60c72b2f9b1d8b22a07c91b5",
    userId: "60c72b2f9b1d8b22a07c91b1",
    name: "Bank_Passbook_Front.png",
    url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80",
    firebaseStoragePath: "users/60c72b2f9b1d8b22a07c91b1/Financial/Bank_Passbook_Front.png",
    fileType: "png",
    category: "Financial",
    subCategory: "Bank Passbook",
    fileSize: 850000,
    createdAt: new Date("2026-05-20T09:15:00Z").toISOString()
  },
  {
    _id: "60c72b2f9b1d8b22a07c91b6",
    userId: "60c72b2f9b1d8b22a07c91b1",
    name: "Semester_1_Marksheet.pdf",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    firebaseStoragePath: "users/60c72b2f9b1d8b22a07c91b1/Academic/Semester_1_Marksheet.pdf",
    fileType: "pdf",
    category: "Academic",
    subCategory: "Semester Results",
    fileSize: 1540000,
    createdAt: new Date("2026-05-25T11:00:00Z").toISOString()
  },
  {
    _id: "60c72b2f9b1d8b22a07c91b7",
    userId: "60c72b2f9b1d8b22a07c91b1",
    name: "Tuition_Fee_Receipt_Sem3.pdf",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    firebaseStoragePath: "users/60c72b2f9b1d8b22a07c91b1/Financial/Receipts/Tuition_Fee_Receipt_Sem3.pdf",
    fileType: "pdf",
    category: "Financial",
    subCategory: "Fee Receipt - Sem 3 (2025-2026)",
    fileSize: 920000,
    createdAt: new Date("2025-07-22T10:00:00Z").toISOString()
  }
];

export const mockScholarships = [
  {
    _id: "60c72b2f9b1d8b22a07c91b8",
    userId: "60c72b2f9b1d8b22a07c91b1",
    name: "Post-Matric Scholarship Scheme",
    provider: "State Government welfare Department",
    amount: 45000,
    status: "Submitted",
    applicationDate: new Date("2026-04-10").toISOString(),
    documents: [
      {
        _id: "60c72b2f9b1d8b22a07c91b3",
        name: "Aadhaar_Card.jpg",
        url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80"
      },
      {
        _id: "60c72b2f9b1d8b22a07c91b4",
        name: "Income_Certificate_2026.pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      },
      {
        _id: "60c72b2f9b1d8b22a07c91b5",
        name: "Bank_Passbook_Front.png",
        url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80"
      }
    ],
    remarks: "Application submitted online. Waiting for department audit."
  },
  {
    _id: "60c72b2f9b1d8b22a07c91b9",
    userId: "60c72b2f9b1d8b22a07c91b1",
    name: "Merit-Cum-Means National Grant",
    provider: "Ministry of Education",
    amount: 25000,
    status: "Approved",
    applicationDate: new Date("2025-10-15").toISOString(),
    documents: [
      {
        _id: "60c72b2f9b1d8b22a07c91b3",
        name: "Aadhaar_Card.jpg",
        url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80"
      },
      {
        _id: "60c72b2f9b1d8b22a07c91b6",
        name: "Semester_1_Marksheet.pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      }
    ],
    remarks: "Sanctioned. Funds credited to linked bank account."
  }
];

export const mockFeeReceipts = [
  {
    _id: "60c72b2f9b1d8b22a07c91ba",
    userId: "60c72b2f9b1d8b22a07c91b1",
    documentId: {
      _id: "60c72b2f9b1d8b22a07c91b7",
      name: "Tuition_Fee_Receipt_Sem3.pdf",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    },
    academicYear: "2025-2026",
    semester: 3,
    amount: 45000,
    paymentDate: new Date("2025-07-22").toISOString(),
    receiptNumber: "REC-2025-3091"
  }
];
