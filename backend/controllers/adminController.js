// controllers/adminController.js

import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import WasteCollection from '../models/WasteCollection.js'; // Import the WasteCollection model


// @desc    Add new personnel
// @route   POST /api/admin/personnel
// @access  Admin
const addPersonnel = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate inputs
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please include all fields');
  }

  // Check if the personnel already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Personnel already exists');
  }

  // Create new personnel with 'personnel' role
  const personnel = await User.create({
    name,
    email,
    password,
    role: 'personnel', // Set role as personnel
  });

  if (personnel) {
    res.status(201).json({
      _id: personnel._id,
      name: personnel.name,
      email: personnel.email,
      role: personnel.role,
    });
  } else {
    res.status(400);
    throw new Error('Invalid personnel data');
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}); // Fetch all users
  res.status(200).json(users);
});

// Admin Analytics Controller
const getAnalytics = asyncHandler(async (req, res) => {
  const dailySchedules = await WasteCollection.aggregate([
    {
      $match: {
        // Match based on the current day
        collectionDate: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)), // start of the day
          $lt: new Date(new Date().setHours(23, 59, 59, 999)), // end of the day
        },
      },
    },
    { $count: 'total' },
  ]);

  const weeklySchedules = await WasteCollection.aggregate([
    {
      $match: {
        // Match collections within the last 7 days
        collectionDate: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: '$collectionDate' },
        total: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } }, // Order by day of week
  ]);

  const monthlySchedules = await WasteCollection.aggregate([
    {
      $match: {
        // Match collections within the current month
        collectionDate: {
          $gte: new Date(new Date().setDate(1)), // Start of the current month
        },
      },
    },
    {
      $group: {
        _id: { $dayOfMonth: '$collectionDate' },
        total: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } }, // Order by day of the month
  ]);

  res.json({
    dailySchedules: dailySchedules.length > 0 ? dailySchedules[0].total : 0,
    weeklySchedules: weeklySchedules.map((item) => item.total),
    monthlySchedules: monthlySchedules.map((item) => item.total),
  });
});


// @desc    Update personnel details
// @route   PUT /api/admin/users/:id
// @access  Admin
const updatePersonnel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  const personnel = await User.findById(id);

  if (!personnel) {
    res.status(404);
    throw new Error('Personnel not found');
  }

  personnel.name = name || personnel.name;
  personnel.email = email || personnel.email;
  personnel.role = role || personnel.role;

  const updatedPersonnel = await personnel.save();

  res.status(200).json({
    _id: updatedPersonnel._id,
    name: updatedPersonnel.name,
    email: updatedPersonnel.email,
    role: updatedPersonnel.role,
  });
});

// Export all controller functions collectively
export { addPersonnel, getAllUsers, getAnalytics, updatePersonnel };
