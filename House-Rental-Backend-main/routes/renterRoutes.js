const express = require('express');
const router = express.Router();
const { getRenterDashboard } = require('../controllers/renterController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getRenterDashboard);

module.exports = router;
