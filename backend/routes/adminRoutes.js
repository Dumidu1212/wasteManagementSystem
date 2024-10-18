import express from 'express';
import { addPersonnel, getAllUsers, getAnalytics } from '../controllers/adminController.js'; // Use getAnalytics
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/personnel', protect, authorize('admin'), addPersonnel);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.get('/analytics', protect, authorize('admin'), getAnalytics); // Use the correct function here

export default router;
