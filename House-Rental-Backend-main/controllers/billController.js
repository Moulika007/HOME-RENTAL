const Bill = require('../models/Bill');

// Get all bills for the logged-in user
const getMyBills = async (req, res) => {
    try {
        const bills = await Bill.find({ userId: req.user._id }).sort({ dueDate: 1 });
        res.json(bills);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// Add a new bill reminder
const addBill = async (req, res) => {
    try {
        const { title, category, amount, dueDate, houseId, notes } = req.body;
        const bill = await Bill.create({
            userId: req.user._id,
            houseId: houseId || null,
            title, category, amount, dueDate, notes
        });
        res.status(201).json(bill);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// Mark a bill as paid
const markBillPaid = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) return res.status(404).json({ message: 'Bill not found' });
        if (bill.userId.toString() !== req.user._id.toString())
            return res.status(403).json({ message: 'Not authorized' });
        bill.isPaid = true;
        bill.paidDate = new Date();
        await bill.save();
        res.json(bill);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// Delete a bill
const deleteBill = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) return res.status(404).json({ message: 'Bill not found' });
        if (bill.userId.toString() !== req.user._id.toString())
            return res.status(403).json({ message: 'Not authorized' });
        await Bill.findByIdAndDelete(req.params.id);
        res.json({ message: 'Bill deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getMyBills, addBill, markBillPaid, deleteBill };
