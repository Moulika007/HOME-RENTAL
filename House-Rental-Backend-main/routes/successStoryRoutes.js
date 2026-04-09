const express = require('express');
const router = express.Router();
const { createSuccessStory, getSuccessStories, getMyStories } = require('../controllers/successStoryController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSuccessStory);
router.get('/', getSuccessStories);
router.get('/my-stories', protect, getMyStories);

module.exports = router;
