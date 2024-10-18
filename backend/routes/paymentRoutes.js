import express from 'express';
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment,
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/payments
// @desc    Create a payment
// @access  Private (User)
router.post('/', protect, authorize('user'), createPayment);

// @route   GET /api/payments
// @desc    Get all payments (Admin) or specific payments (User)
// @access  Private (Admin, User)
router.get('/', protect, authorize('admin', 'user'), getAllPayments);

// @route   GET /api/payments/:id
// @desc    Get a payment by ID
// @access  Private (Admin, Payment Owner)
router.get('/:id', protect, authorize('admin', 'user'), getPaymentById);

// @route   PUT /api/payments/:id
// @desc    Update payment status
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), updatePaymentStatus);

// @route   DELETE /api/payments/:id
// @desc    Delete a payment
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), deletePayment);

export default router;
