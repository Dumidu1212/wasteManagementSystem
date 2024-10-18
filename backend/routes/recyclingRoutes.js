import express from 'express';
import { addRecyclingCredits, getRecyclingCredits } from '../controllers/recyclingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin adds credits to a specific user
router.put('/add-credits/:id', protect, authorize('admin'), addRecyclingCredits);

// Users view their credits
router.get('/credits', protect, getRecyclingCredits);

export default router;
