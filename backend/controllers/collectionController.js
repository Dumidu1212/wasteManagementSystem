// controllers/collectionController.js
import asyncHandler from 'express-async-handler';
import WasteCollection from '../models/WasteCollection.js';
import Schedule from '../models/Schedule.js';

// @desc    Update waste collection status
// @route   PUT /api/wastes/:id/status
// @access  Private (Admin)
const updateCollectionStatus = asyncHandler(async (req, res) => {
  const waste = await WasteCollection.findById(req.params.id);

  if (!waste) {
    res.status(404);
    throw new Error('Waste collection record not found');
  }

  waste.status = req.body.status || waste.status;
  const updatedWaste = await waste.save();
  res.json(updatedWaste);
});

// @desc    View collection schedules
// @route   GET /api/wastes/schedules
// @access  Private (Admin)
const getCollectionSchedules = asyncHandler(async (req, res) => {
  const schedules = await Schedule.find().populate('user', 'name email');
  res.json(schedules);
});

// @desc    Report an issue
// @route   POST /api/wastes/report
// @access  Private (Admin)
const reportIssue = asyncHandler(async (req, res) => {
  const { description, location } = req.body;
  if (!description || !location) {
    res.status(400);
    throw new Error('Please include all fields');
  }

  const issue = await Report.create({ description, location, reportedBy: req.user._id });
  res.status(201).json(issue);
});

// @desc    Get daily collection summary
// @route   GET /api/wastes/summary/daily
// @access  Private (Admin)
const getDailyCollectionSummary = asyncHandler(async (req, res) => {
  const today = new Date().setHours(0, 0, 0, 0);

  const collections = await WasteCollection.find({ collectionDate: { $gte: today } });
  res.json(collections);
});

// @desc    Record missed collection attempts
// @route   PUT /api/wastes/:id/missed
// @access  Private (Admin)
const recordMissedCollection = asyncHandler(async (req, res) => {
  const waste = await WasteCollection.findById(req.params.id);

  if (!waste) {
    res.status(404);
    throw new Error('Waste collection record not found');
  }

  waste.missed = true; // Mark it as missed
  const updatedWaste = await waste.save();
  res.json(updatedWaste);
});

export {
  updateCollectionStatus,
  getCollectionSchedules,
  reportIssue,
  getDailyCollectionSummary,
  recordMissedCollection,
};
