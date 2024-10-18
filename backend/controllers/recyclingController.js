import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Add recycling credits for a specific user (Admin)
// @route   PUT /api/recycling/add-credits/:id
// @access  Private (Admin)
const addRecyclingCredits = asyncHandler(async (req, res) => {
  const { credits } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.recyclingCredits += credits;
  await user.save();

  res.json({
    message: `Successfully added ${credits} recycling credits`,
    currentCredits: user.recyclingCredits,
  });
});

// @desc    Get user recycling credits
// @route   GET /api/recycling/credits
// @access  Private (User)
const getRecyclingCredits = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({ recyclingCredits: user.recyclingCredits });
});

export { addRecyclingCredits, getRecyclingCredits };
