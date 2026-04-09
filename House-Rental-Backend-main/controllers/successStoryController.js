const SuccessStory = require('../models/SuccessStory');
const Notification = require('../models/Notification');

const createSuccessStory = async (req, res) => {
  try {
    const { houseId, story, rating } = req.body;
    const successStory = await SuccessStory.create({
      userId: req.user._id,
      houseId,
      userName: req.user.name,
      userRole: req.user.role,
      story,
      rating,
      isApproved: true // Auto-approve for demo
    });
    res.status(201).json(successStory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSuccessStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find({ isApproved: true })
      .populate('userId', 'name')
      .populate('houseId', 'title location')
      .sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find({ userId: req.user._id })
      .populate('houseId', 'title location')
      .sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSuccessStory, getSuccessStories, getMyStories };
