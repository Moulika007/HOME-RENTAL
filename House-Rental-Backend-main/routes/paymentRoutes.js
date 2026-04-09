const express = require('express');
const router = express.Router();
const { createPayment, markPaid, notifyMoveIn, getMyPayments } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createPayment);
router.put('/:id/pay', protect, markPaid);
router.post('/move-in', protect, notifyMoveIn);
router.get('/my-payments', protect, getMyPayments);
router.get('/owner-payments', protect, getOwnerPayments);

module.exports = router;
