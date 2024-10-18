import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import wasteRoutes from './routes/wasteRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js'; // Scheduling routes
import recyclingRoutes from './routes/recyclingRoutes.js'; // Recycling credits routes
import adminRoutes from './routes/adminRoutes.js'; // Admin routes

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wastes', wasteRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/schedules', scheduleRoutes); // Schedule routes
app.use('/api/recycling', recyclingRoutes); // Recycling credits routes
app.use('/api/admin', adminRoutes); // Admin routes

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Smart Waste Management API is running');
});

// Error Handling Middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
