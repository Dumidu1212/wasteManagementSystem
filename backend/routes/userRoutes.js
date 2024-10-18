import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  registerUser,
  updateUser,
  updateUserRole, 
  deleteUser,
  getAllPersonnel,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/users - Get all users (Admin only)
router.get('/', protect, authorize('admin'), getAllUsers);

// POST /api/users - Register a new user (Admin only)
router.post('/', protect, authorize('admin'), registerUser);

// GET /api/users/profile - Get logged-in user's profile
router.get('/profile', protect, getUserProfile);

// PUT /api/users/profile - Update logged-in user's profile
router.put('/profile', protect, updateUserProfile);

// PUT /api/users/:id - Update a user by ID (Admin only)
router.put('/:id', protect, authorize('admin'), updateUser);

// PUT /api/users/:id/role - Update user role (Admin only)
router.put('/:id/role', protect, authorize('admin'), updateUserRole);

// DELETE /api/users/:id - Delete a user by ID (Admin only)
router.delete('/:id', protect, authorize('admin'), deleteUser);

// GET /api/users/personnel - Get all personnel (Admin only)
router.get('/personnel', protect, authorize('admin'), getAllPersonnel);

export default router;
