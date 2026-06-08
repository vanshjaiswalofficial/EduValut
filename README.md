# EduVault – Student Academic Document Management System

EduVault is a secure, cloud-based platform where students can store, organize, manage, download, and print all their academic documents from one place. It features role-based access controls, a digital college ID profile, scholarship tracking pipelines, a dedicated fee receipts vault, and an automated print package compiler.

---

## Technical Architecture

- **Frontend**: React (Vite) + Tailwind CSS v3 + Framer Motion + React Icons + React Router Dom.
- **Backend**: Node.js + Express.js + Mongoose (MongoDB).
- **Authentication**: Firebase Authentication (Email/Password + Google Sign-In) synced with MongoDB User profiles.
- **Storage**: Firebase Storage (Secure client-side uploads, syncing download URLs in MongoDB).
- **Bypass Mode (Sandbox)**: The application is designed to be instantly testable out-of-the-box. If Firebase environment keys are left as default placeholders (`mock-api-key`), the client enters a sandbox bypass mode. Login/Signup forms will display quick-auth buttons to simulate Firebase tokens (`dev-student-uid` / `dev-admin-uid`) which are successfully validated by the backend, allowing immediate full-stack features testing without Firebase config.

---

## Directory Structure

```
EduVault/
├── package.json               # Root scripts to install and run concurrently
├── README.md                  # System Documentation
├── backend/
│   ├── package.json           # Node/Express dependencies
│   ├── server.js              # Express App Entry Point
│   ├── .env                   # Local Backend environment values
│   ├── config/
│   │   ├── db.js              # MongoDB connectivity
│   │   └── firebase.js        # Firebase Admin SDK setups
│   ├── middleware/
│   │   ├── auth.js            # Token verification & authorization
│   │   └── error.js           # Global API Error handlers
│   ├── models/
│   │   ├── User.js            # Student profile schema
│   │   ├── Document.js        # Document metadata schema
│   │   ├── Scholarship.js     # Scholarship scheme schema
│   │   └── FeeReceipt.js      # Fee invoice transaction schema
│   └── routes/
│       ├── auth.js            # Syncer route
│       ├── user.js            # Profile routes
│       ├── document.js        # File directory routes
│       ├── scholarship.js     # Scholarship tracker routes
│       ├── feeReceipt.js      # Fee receipt routes
│       └── admin.js           # Administrative controls
└── frontend/
    ├── package.json           # React dependencies (Vite)
    ├── tailwind.config.js     # Theme, layout styles
    ├── postcss.config.js      # PostCSS setups
    ├── index.html             # Fonts and entry viewport
    ├── src/
    │   ├── main.jsx           # App entry point
    │   ├── App.jsx            # Router and protection paths
    │   ├── index.css          # Styling layers, glassmorphism templates
    │   ├── components/
    │   │   ├── Layout/        # Navbar, Sidebar, Topbar, DashboardLayout
    │   │   └── ProtectedRoute.jsx  # Route interceptor
    │   ├── context/
    │   │   ├── AuthContext.jsx  # Authentication state & DB syncs
    │   │   └── ThemeContext.jsx # Light/Dark mode toggler
    │   ├── services/
    │   │   ├── firebase.js    # Firebase Web client setup
    │   │   └── api.js         # Pre-authorized Axios request interceptor
    │   └── pages/
    │       ├── Landing.jsx    # SaaS Marketing landing
    │       ├── Login.jsx      # Login page with sandbox support
    │       ├── Signup.jsx     # Multi-step Student signup
    │       ├── ForgotPassword.jsx  # Password reset page
    │       ├── Dashboard.jsx  # Student statistics dashboard
    │       ├── MyDocuments.jsx # Grid view directory with previews
    │       ├── UploadDocument.jsx # Progress-tracked document upload form
    │       ├── ScholarshipManager.jsx # Funding tracker with badges
    │       ├── FeeReceipts.jsx # Yearly grouped transaction sheets
    │       ├── PrintCenter.jsx # Merged PDF Compiler (pdf-lib)
    │       ├── Profile.jsx     # Student ID Card page
    │       ├── Settings.jsx    # Theme preference and account locks
    │       └── AdminDashboard.jsx # Administration console
```

---

## API Documentation Reference

All requests must carry the `Authorization: Bearer <token>` header (automatically injected by `/src/services/api.js`).

### Auth & User Sync
- `POST /api/auth/sync` - Synces client Firebase auth profile to MongoDB User model (creates user if it doesn't exist).
- `GET /api/user/profile` - Fetches authenticated student details.
- `PUT /api/user/profile` - Updates student demographics (Digital ID metadata).

### Document Operations
- `POST /api/documents` - Register a file upload (records storage path, category, subcategory, size).
- `GET /api/documents` - Retrieve user documents (supports `category`, `search` text, and `sortBy` filters).
- `DELETE /api/documents/:id` - Deletes document metadata and triggers removal from Firebase Storage.

### Scholarship Tracker
- `POST /api/scholarship` - Create scholarship tracking record.
- `GET /api/scholarship` - List user scholarship applications (populates matched Document models).
- `PUT /api/scholarship/:id` - Edit scholarship status (Pending, Submitted, Approved, Rejected) and remarks.
- `DELETE /api/scholarship/:id` - Delete scholarship application history.

### Fee Receipt Vault
- `POST /api/feeReceipt` - Upload and register tuition receipt (creates underlying Document + FeeReceipt log).
- `GET /api/feeReceipt` - List receipts grouped by semester terms.
- `DELETE /api/feeReceipt/:id` - Deletes fee invoice log and cascades delete to file metadata and storage.

### Administration Console (Admin Roles Only)
- `GET /api/admin/analytics` - Returns global dashboard metrics (students count, document count, disk size).
- `GET /api/admin/students` - Searches and returns directory of all registered students.
- `GET /api/admin/students/:id/documents` - Retrieves document uploads list for a specific student.
- `DELETE /api/admin/users/:id` - Purges student account, Firebase Auth registry, and deletes all files.

---

## Installation & Running Locally

### 1. Pre-requisites
- Ensure you have **Node.js** (v16+) installed.
- Ensure **MongoDB** is running locally (`mongodb://localhost:27017`) or have a MongoDB Atlas connection string.

### 2. Dependency Installation
From the root project directory:
```bash
npm run install-all
```
This single script will install Node packages in the Root directory, Backend, and Frontend workspaces.

### 3. Environment Variables Configuration
Configure environment parameters in both client and server directories:

#### Backend (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eduvault

# Firebase Admin SDK Certificate (JSON formatted string)
# Leave blank to test with local Sandbox dev bypass mode out-of-the-box.
FIREBASE_SERVICE_ACCOUNT_JSON={"type": "service_account", "project_id": "...", ...}
```

#### Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api

# Firebase Web Client Credentials
# Leave as default 'mock-api-key' placeholders to run in Sandbox bypass mode.
VITE_FIREBASE_API_KEY=mock-api-key
VITE_FIREBASE_AUTH_DOMAIN=mock-auth-domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mock-project-id
VITE_FIREBASE_STORAGE_BUCKET=mock-storage-bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:1234567890abcdef
```

### 4. Running the Application
To launch both the Express backend server (port 5000) and Vite React frontend app (port 3000) concurrently:
```bash
npm run dev
```

---

## Deployment Steps

### Frontend Deployment: Vercel
1. Set up a Git repository and push the project.
2. In Vercel Console, import the repository.
3. Configure the directory settings:
   - Set **Framework Preset** to **Vite**.
   - Set **Root Directory** to `frontend`.
4. Configure environment variables matching `frontend/.env`:
   - Set `VITE_API_URL` to point to your deployed Render server URL (e.g. `https://eduvault-api.onrender.com/api`).
   - Add your live Firebase credentials.
5. Click **Deploy**. Vercel will build and host the static SPA.

### Backend Deployment: Render
1. Create a Web Service in Render and link your Git repository.
2. Configure settings:
   - Set **Root Directory** to `backend`.
   - Set **Runtime** to `Node`.
   - Set **Build Command** to `npm install`.
   - Set **Start Command** to `node server.js` (or `npm start`).
3. Set Environment variables in Render:
   - Set `MONGODB_URI` to your MongoDB Atlas connection string (`mongodb+srv://...`).
   - Set `FIREBASE_SERVICE_ACCOUNT_JSON` to your Firebase Service Account private key JSON string.
4. Click **Create Web Service**. Render will install, connect, and serve the API. Ensure your frontend domain is allowed in CORS parameters if custom settings are needed.
