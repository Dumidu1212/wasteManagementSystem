import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import QRCode from 'qrcode'; // Import QR Code library

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Generate QR Code for user registration
const generateQRCode = async (userId) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(`User:${userId}`);
    return qrCodeDataUrl;
  } catch (err) {
    console.error('QR Code generation error:', err);
    throw new Error('Failed to generate QR Code');
  }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate input fields
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please include all fields');
  }

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create the user
  const user = await User.create({
    name,
    email,
    password,
    role, // Admin can assign roles; otherwise, default role
  });

  // Generate QR Code for the user
  const qrCodeUrl = await generateQRCode(user._id);

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      qrCode: qrCodeUrl, // Return QR code
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user and login
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input fields
  if (!email || !password) {
    res.status(400);
    throw new Error('Please include all fields');
  }

  // Find user by email and check password
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});


export { registerUser, loginUser };
