import asyncHandler from 'express-async-handler';
import WasteCollection from '../models/WasteCollection.js';
import User from '../models/User.js';
import { sendNotification } from '../utils/notification.js'; // Notification utility

// @desc    Create new waste collection record
// @route   POST /api/wastes
// @access  Private (Personnel, Admin)
const createWasteCollection = asyncHandler(async (req, res) => {
  const { location, wasteType, quantity } = req.body;

  if (!location || !wasteType || !quantity) {
    res.status(400);
    throw new Error('Please include all required fields');
  }

  const waste = await WasteCollection.create({
    collectedBy: req.user.id,
    location,
    wasteType,
    quantity,
  });

  res.status(201).json(waste);
});

// @desc    Get all waste collection records
// @route   GET /api/wastes
// @access  Private (Admin)
const getAllWasteCollections = asyncHandler(async (req, res) => {
  const wastes = await WasteCollection.find()
    .populate('collectedBy', 'name email') // Populate the user who created the waste collection
    .populate('assignedPersonnel', 'name'); // Populate assigned personnel's name
  
  // Return the populated waste collection data
  res.json(wastes);
});


// @desc    Get waste collection records for a specific user
// @route   GET /api/wastes/user/:userId
// @access  Private (Admin, User)
const getWasteCollectionsByUser = asyncHandler(async (req, res) => {
  const wastes = await WasteCollection.find({ collectedBy: req.params.userId })
    .populate('collectedBy', 'name email') // Populate user who created the waste collection
    .populate('assignedPersonnel', 'name'); // Populate assigned personnel's name

  res.json(wastes);
});


// @desc    Update waste collection record status
// @route   PUT /api/wastes/:id
// @access  Private (Personnel, Admin)
const updateWasteCollectionStatus = asyncHandler(async (req, res) => {
  const waste = await WasteCollection.findById(req.params.id);

  if (!waste) {
    res.status(404);
    throw new Error('Waste collection record not found');
  }

  waste.status = req.body.status || waste.status;

  const updatedWaste = await waste.save();

  res.json(updatedWaste);
});

// @desc    Delete waste collection record
// @route   DELETE /api/wastes/:id
// @access  Private (Admin, User)
const deleteWasteCollection = asyncHandler(async (req, res) => {
  const waste = await WasteCollection.findById(req.params.id);

  if (!waste) {
    res.status(404);
    throw new Error('Waste collection record not found');
  }

  // Check if the user is the one who created the waste collection or an admin
  if (waste.collectedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this waste collection record');
  }

  await waste.deleteOne();
  res.json({ message: 'Waste collection record removed' });
});



const scanQRCode = asyncHandler(async (req, res) => {
  const { qrCode } = req.body;

  // Extract user ID from QR code (expected format: "User:<userId>")
  const userId = qrCode.split('User:')[1];

  // Find user by ID
  const user = await user.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Fetch waste collection records for the user
  const wasteCollections = await WasteCollection.find({ collectedBy: user._id });

  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    wasteCollections,
  });
});

// @desc Assign personnel to a waste collection
// @route PUT /api/wastes/:id/assign
// @access Private (Admin)
const assignPersonnel = asyncHandler(async (req, res) => {
  const { personnelId } = req.body;

  const wasteCollection = await WasteCollection.findById(req.params.id);

  if (!wasteCollection) {
    res.status(404);
    throw new Error('Waste collection not found');
  }

  // Assign the personnel
  wasteCollection.assignedPersonnel = personnelId;
  await wasteCollection.save();

  // Populate the assigned personnel to return complete data
  await wasteCollection.populate('assignedPersonnel', 'name');

  res.json({
    message: 'Personnel assigned successfully',
    wasteCollection,
  });
});

export { createWasteCollection,assignPersonnel, getAllWasteCollections, getWasteCollectionsByUser, updateWasteCollectionStatus, deleteWasteCollection, scanQRCode };