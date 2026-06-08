import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/error.js';

// Route Imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import documentRoutes from './routes/document.js';
import scholarshipRoutes from './routes/scholarship.js';
import feeReceiptRoutes from './routes/feeReceipt.js';
import adminRoutes from './routes/admin.js';

// Load env variables
dotenv.config();

// Establish Database Connection
connectDB();

const app = express();

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows cross-origin asset requests (e.g. downloads) if needed
}));
app.use(cors({
  origin: '*', // Allows connecting from Vite dev server on any port
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/scholarship', scholarshipRoutes);
app.use('/api/feeReceipt', feeReceiptRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`EduVault Backend Server running in dev mode on port ${PORT}`);
});
