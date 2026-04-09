const express = require('express');
const router = express.Router();
const { getMyBills, addBill, markBillPaid, deleteBill } = require('../controllers/billController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMyBills);
router.post('/', protect, addBill);
router.put('/:id/pay', protect, markBillPaid);
router.delete('/:id', protect, deleteBill);

module.exports = router;
