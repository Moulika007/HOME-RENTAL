const House = require('../models/House');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

const getRenterDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const [myHome, pendingRequests, payments] = await Promise.all([
      // Covers both isPendingPayment (accepted, awaiting payment) and isBooked (fully confirmed)
      House.findOne({
        'currentTenant.userId': userId,
        $or: [{ isBooked: true }, { isPendingPayment: true }]
      })
        .select('title location rent images currentTenant ownerId isPendingPayment isBooked paymentUpiId paymentQrImage messages reminders todos purpose propertyType')
        .populate('ownerId', 'name email phone'),

      House.find({
        'requests.userId': userId,
        isBooked: false,
        isPendingPayment: false
      }).select('title location rent images requests propertyType furnishing amenities'),

      Payment.find({ renterId: userId }).sort({ dueDate: -1 })
    ]);

    res.json({ myHome, pendingRequests, acceptedRequests: [], payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRenterDashboard };
