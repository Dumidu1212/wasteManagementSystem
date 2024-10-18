import asyncHandler from 'express-async-handler';
import Payment from '../models/Payment.js';
import WasteCollection from '../models/WasteCollection.js';

// @desc    Create a new payment
// @route   POST /api/payments
// @access  Private (User)
const createPayment = asyncHandler(async (req, res) => {
  const { amount, paymentMethod } = req.body;

  if (!amount || !paymentMethod) {
    res.status(400);
    throw new Error('Please include all required fields');
  }

  const payment = await Payment.create({
    user: req.user.id,
    amount,
    paymentMethod,
  });

  res.status(201).json(payment);
});

// @desc    Get all payments (Admin) or user-specific payments
// @route   GET /api/payments
// @access  Private (Admin, User)
const getAllPayments = asyncHandler(async (req, res) => {
  let payments;

  if (req.user.role === 'admin') {
    payments = await Payment.find().populate('user', 'name email');
  } else {
    payments = await Payment.find({ user: req.user.id }).populate('user', 'name email');
  }

  res.json(payments);
});

// @desc    Get specific payment
// @route   GET /api/payments/:id
// @access  Private (Admin, Payment Owner)
const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate('user', 'name email');

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  if (req.user.role !== 'admin' && payment.user._id.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to access this payment');
  }

  res.json(payment);
});

// @desc    Update payment status
// @route   PUT /api/payments/:id
// @access  Private (Admin)
const updatePaymentStatus = asyncHandler(async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      res.status(404);
      throw new Error('Payment not found');
    }

    // Log the status being passed
    console.log('Updating payment status:', req.body.status);

    payment.status = req.body.status || payment.status;
    const updatedPayment = await payment.save();

    res.json(updatedPayment);
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Failed to update payment status', error: error.message });
  }
});


// @desc    Delete a payment
// @route   DELETE /api/payments/:id
// @access  Private (Admin)
const deletePayment = asyncHandler(async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      res.status(404);
      throw new Error('Payment not found');
    }

    // Log before deleting
    console.log('Deleting payment with ID:', req.params.id);

    await payment.deleteOne(); // Use deleteOne instead of remove
    res.json({ message: 'Payment removed' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ message: 'Failed to delete payment', error: error.message });
  }
});



export {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment,
};
