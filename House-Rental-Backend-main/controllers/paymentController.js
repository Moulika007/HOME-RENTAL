const Payment = require('../models/Payment');
const House = require('../models/House');
const Notification = require('../models/Notification');

const createPayment = async (req, res) => {
  try {
    const { houseId, amount, month, dueDate } = req.body;
    const house = await House.findById(houseId);
    
    if (!house) return res.status(404).json({ message: 'House not found' });

    const payment = await Payment.create({
      houseId,
      renterId: req.user._id,
      ownerId: house.ownerId,
      amount,
      month,
      dueDate
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markPaid = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('houseId');
    
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    payment.status = 'paid';
    payment.paidDate = new Date();
    await payment.save();

    await Notification.create({
      userId: payment.ownerId,
      type: 'payment_received',
      title: 'Rent Payment Received 💰',
      message: `${payment.renterId?.name || 'Renter'} has paid ₹${payment.amount} for "${payment.houseId.title}" (${payment.houseId.propertyType}) for ${payment.month}.`,
      metadata: {
        amount: payment.amount,
        month: payment.month,
        houseTitle: payment.houseId.title,
        propertyType: payment.houseId.propertyType,
        renterName: payment.renterId?.name
      }
    });

    await Notification.create({
      userId: payment.renterId,
      type: 'payment_received',
      title: 'Payment Successful ✅',
      message: `Your payment of ₹${payment.amount} for "${payment.houseId.title}" (${payment.houseId.propertyType}) for ${payment.month} has been confirmed.`,
      metadata: {
        amount: payment.amount,
        month: payment.month,
        houseTitle: payment.houseId.title,
        propertyType: payment.houseId.propertyType
      }
    });

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const notifyMoveIn = async (req, res) => {
  try {
    const { houseId } = req.body;
    const house = await House.findById(houseId).populate('ownerId');
    
    if (!house) return res.status(404).json({ message: 'House not found' });

    await Notification.create({
      userId: house.ownerId._id,
      type: 'tenant_moved_in',
      title: 'Tenant Moved In 🏠',
      message: `${req.user.name} has moved into ${house.title}`,
      houseId: house._id,
      metadata: {
        tenantName: req.user.name,
        houseTitle: house.title,
        moveInDate: new Date().toLocaleDateString()
      }
    });

    res.json({ message: 'Move-in notification sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ renterId: req.user._id })
      .populate('houseId', 'title location')
      .sort({ dueDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOwnerPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ ownerId: req.user._id })
      .populate('houseId', 'title location')
      .populate('renterId', 'name email')
      .sort({ dueDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPayment, markPaid, notifyMoveIn, getMyPayments, getOwnerPayments };
