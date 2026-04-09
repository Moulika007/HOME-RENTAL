const House = require('../models/House');
const Notification = require('../models/Notification');
const User = require('../models/User');

// 1. Add House
const addHouse = async (req, res) => {
  try {
    const {
      title, location, rent, images,
      purpose, propertyType, furnishing, amenities,
      isBooked, tenant
    } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: No Owner ID found" });
    }

    const newHouseData = {
      ownerId: req.user._id,
      title, location, rent, images,
      purpose: purpose || 'Living', propertyType, furnishing, amenities,
      isBooked: isBooked || false
    };

    if (isBooked && tenant) {
      newHouseData.currentTenant = tenant;
    }

    const house = await House.create(newHouseData);
    res.status(201).json(house);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getAllHouses = async (req, res) => {
  try {
    const { query, purpose, propertyType } = req.query;
    const filter = query ? {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } }
      ]
    } : {};

    if (purpose && purpose !== 'All') {
      filter.purpose = purpose;
    }
    if (propertyType && propertyType !== 'All') {
      filter.propertyType = propertyType;
    }

    const houses = await House.find(filter)
      .select('title location rent images isBooked requests purpose propertyType furnishing amenities paymentUpiId paymentQrImage')
      .populate('ownerId', 'name email')
      .lean();
    res.json(houses);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// 3. Request Booking with form data
const requestBooking = async (req, res) => {
  try {
    const house = await House.findById(req.params.id).populate('ownerId');
    const { name, email, phone, moveInDate, message, guests, stayDuration, additionalDetails } = req.body;

    if (!house) return res.status(404).json({ message: 'House not found' });
    if (house.isBooked) return res.status(400).json({ message: 'House is already occupied' });

    const existing = house.requests.find(r => r.userId.toString() === req.user._id.toString());
    if (existing) return res.status(400).json({ message: 'Request already sent' });

    house.requests.push({
      userId: req.user._id,
      name: name || req.user.name,
      email: email || req.user.email,
      phone: phone || req.user.phone,
      date: new Date(),
      status: 'pending',
      moveInDate,
      message,
      guests,
      stayDuration,
      additionalDetails
    });

    await house.save();

    // Create notification for owner
    await Notification.create({
      userId: house.ownerId._id,
      type: 'booking_request',
      title: 'New Booking Request 📩',
      message: `${name || req.user.name} has requested to book your ${house.propertyType} "${house.title}". ${house.purpose === 'Vacation' ? `Guests: ${guests}, Days: ${stayDuration}.` : `Move-in: ${new Date(moveInDate).toLocaleDateString()}.`}`,
      houseId: house._id,
      metadata: {
        renterName: name || req.user.name,
        houseTitle: house.title,
        propertyType: house.propertyType,
        rentAmount: house.rent,
        moveInDate,
        guests,
        stayDuration,
        additionalDetails
      }
    });

    // Create notification for renter (confirmation)
    await Notification.create({
      userId: req.user._id,
      type: 'booking_sent',
      title: 'Booking Request Sent ✅',
      message: `Your booking request for ${house.title} has been sent to the owner. You will be notified once they respond.`,
      houseId: house._id,
      metadata: {
        houseTitle: house.title,
        rentAmount: house.rent,
        moveInDate
      }
    });

    res.json(house);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// 4. Update Tenant Details
const updateTenantDetails = async (req, res) => {
  try {
    const { name, email, phone, startDate } = req.body;
    const house = await House.findById(req.params.id);

    if (!house) return res.status(404).json({ message: 'House not found' });

    if ((!house.isBooked && !house.isPendingPayment) || !house.currentTenant) {
      return res.status(400).json({ message: 'No tenant to edit' });
    }

    house.currentTenant.name = name || house.currentTenant.name;
    house.currentTenant.email = email || house.currentTenant.email;
    house.currentTenant.phone = phone || house.currentTenant.phone;
    house.currentTenant.startDate = startDate || house.currentTenant.startDate;

    await house.save();
    res.json(house);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyHouses = async (req, res) => {
  try {
    const houses = await House.find({ ownerId: req.user._id })
      .select('title location rent images isBooked isPendingPayment currentTenant requests purpose propertyType furnishing amenities ownerId messages reminders todos paymentUpiId paymentQrImage vacateRequest')
      .lean();
    res.json(houses);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// 5. Accept Request (Fixed to use currentTenant)
const acceptRequest = async (req, res) => {
  try {
    const house = await House.findById(req.params.id).populate('ownerId');
    const { requestId, paymentUpiId, paymentQrImage } = req.body;

    if (!house) return res.status(404).json({ message: "House not found" });
    if (!paymentUpiId && !paymentQrImage) return res.status(400).json({ message: "Provide a UPI ID/Phone or upload a QR image" });

    const request = house.requests.find(r => r._id.toString() === requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const renterId = request.userId;

    const existingResidency = await House.findOne({ "currentTenant.userId": renterId });
    if (existingResidency) {
      return res.status(400).json({
        message: "Action Failed: This user is already a resident in another house."
      });
    }

    house.currentTenant = {
      userId: renterId,
      name: request.name,
      email: request.email,
      phone: request.phone,
      startDate: new Date().toISOString().split('T')[0],
      isRentPaid: false
    };
    // Do NOT set isBooked=true yet — wait for payment confirmation
    house.isPendingPayment = true;
    house.paymentUpiId = paymentUpiId || '';
    house.paymentQrImage = paymentQrImage || '';
    house.requests = [];

    await house.save();

    // Create notification for renter with payment details
    await Notification.create({
      userId: renterId,
      type: 'request_accepted',
      title: 'Booking Request Accepted! 🎉',
      message: `Your request for ${house.title} has been accepted. Payment details: Rent ₹${house.rent}/month. Contact owner: ${house.ownerId.email}`,
      houseId: house._id,
      metadata: {
        ownerName: house.ownerId.name,
        ownerEmail: house.ownerId.email,
        ownerPhone: house.ownerId.phone,
        houseTitle: house.title,
        rentAmount: house.rent,
        location: house.location,
        paymentUpiId: paymentUpiId,
        paymentQrImage: paymentQrImage || '',
        purpose: house.purpose,
        propertyType: house.propertyType
      }
    });

    res.json({ message: "Tenant accepted successfully!", house });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Confirm Payment — called by renter after scanning QR and paying
const confirmPayment = async (req, res) => {
  try {
    const house = await House.findById(req.params.id).populate('ownerId');
    if (!house) return res.status(404).json({ message: 'House not found' });

    // Make sure the caller is the tenant of this house
    if (!house.currentTenant || house.currentTenant.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to confirm payment for this house' });
    }

    const now = new Date();
    const nextDue = new Date(now);
    nextDue.setMonth(nextDue.getMonth() + 1); // next due = 1 month from now

    house.isBooked = true;
    house.isPendingPayment = false;
    house.lastPaidDate = now;
    house.nextDueDate = nextDue;
    house.currentTenant.isRentPaid = true;
    await house.save();

    // Create payment record if not already exists for this month
    const Payment = require('../models/Payment');
    const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const existingPayment = await Payment.findOne({ 
      houseId: house._id, 
      renterId: req.user._id, 
      month: monthName,
      status: 'paid'
    });

    if (!existingPayment) {
      await Payment.create({
        houseId: house._id,
        renterId: req.user._id,
        ownerId: house.ownerId._id,
        amount: house.rent,
        month: monthName,
        status: 'paid',
        paidDate: now,
        dueDate: nextDue
      });
    }

    // Notify Owner
    await Notification.create({
      userId: house.ownerId._id,
      type: 'payment_received',
      title: '💰 Rent Payment Received!',
      message: `${req.user.name} has paid ₹${house.rent} for your ${house.propertyType} "${house.title}". Next due: ${nextDue.toLocaleDateString('en-IN')}`,
      houseId: house._id,
      metadata: {
        amount: house.rent,
        month: monthName,
        houseTitle: house.title,
        propertyType: house.propertyType,
        renterName: req.user.name,
        paidDate: now,
        nextDueDate: nextDue
      }
    });

    // Notify Renter
    await Notification.create({
      userId: req.user._id,
      type: 'payment_received',
      title: '💳 Payment Successful!',
      message: `You have successfully paid ₹${house.rent} for ${house.propertyType} "${house.title}". Your booking is confirmed.`,
      houseId: house._id,
      metadata: {
        amount: house.rent,
        month: monthName,
        houseTitle: house.title,
        propertyType: house.propertyType,
        ownerName: house.ownerId.name,
        paidDate: now,
        nextDueDate: nextDue
      }
    });

    res.json({ message: 'Payment confirmed! House is now occupied.', house, nextDueDate: nextDue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const declineRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const house = await House.findById(req.params.id);

    if (!house) return res.status(404).json({ message: "House not found" });

    const request = house.requests.find(r => r._id.toString() === requestId);
    if (request) {
      await Notification.create({
        userId: request.userId,
        type: 'request_rejected',
        title: 'Booking Request Declined',
        message: `Your request for ${house.title} has been declined.`,
        houseId: house._id
      });
    }

    house.requests = house.requests.filter(r => r._id.toString() !== requestId);
    await house.save();
    res.json(house);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const toggleRent = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    if (house.currentTenant) {
      const wasPaid = house.currentTenant.isRentPaid;
      house.currentTenant.isRentPaid = !house.currentTenant.isRentPaid;
      await house.save();

      // If toggled to UNPAID, send a reminder
      if (wasPaid && !house.currentTenant.isRentPaid) {
        // Notify Renter
        await Notification.create({
          userId: house.currentTenant.userId,
          type: 'payment_due',
          title: '📌 Payment Reminder',
          message: `Dear ${house.currentTenant.name}, your rent payment of ₹${house.rent} for "${house.title}" (${house.propertyType}) is currently due. Please complete the payment soon.`,
          houseId: house._id,
          metadata: {
            renterName: house.currentTenant.name,
            rentAmount: house.rent,
            houseTitle: house.title,
            propertyType: house.propertyType
          }
        });

        // Notify Owner
        await Notification.create({
          userId: house.ownerId,
          type: 'payment_due',
          title: '🔔 Reminder Sent',
          message: `A payment reminder has been sent to ${house.currentTenant.name} for ₹${house.rent} (${house.title}).`,
          houseId: house._id,
          metadata: {
            renterName: house.currentTenant.name,
            rentAmount: house.rent,
            houseTitle: house.title,
            propertyType: house.propertyType
          }
        });
      }
    }
    res.json(house);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// 6. Vacate House (Fixed Export Issue)
const vacateHouse = async (req, res) => {
  try {
    const houseId = req.params.id;
    const house = await House.findById(houseId);

    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    const isOwner = house.ownerId.toString() === req.user._id.toString();
    const isTenant = house.currentTenant && String(house.currentTenant.userId) === String(req.user._id);

    if (!isOwner && !isTenant) {
      return res.status(403).json({ message: "Not authorized to vacate this house" });
    }

    // Hard Reset using unset
    await House.findByIdAndUpdate(houseId, {
      $set: {
        isBooked: false,
        requests: [],
        vacateRequest: { status: 'none', requestedBy: null, requestedAt: null }
      },
      $unset: {
        currentTenant: "", // This wipes the object completely
        tenant: ""         // Just in case old data exists
      }
    });

    res.json({ message: "Vacated successfully" });

  } catch (error) {
    console.error("Vacate Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const editHouse = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) return res.status(404).json({ message: 'House not found' });
    if (house.ownerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const { title, location, rent, images, purpose, propertyType, furnishing, amenities } = req.body;
    if (title) house.title = title;
    if (location) house.location = location;
    if (rent) house.rent = rent;
    if (images) house.images = images;
    if (purpose) house.purpose = purpose;
    if (propertyType) house.propertyType = propertyType;
    if (furnishing) house.furnishing = furnishing;
    if (amenities) house.amenities = amenities;

    await house.save();
    res.json(house);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteHouse = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);

    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }

    if (house.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await House.findByIdAndDelete(req.params.id);
    res.json({ id: req.params.id, message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- WORKSPACE CONTROLLERS ---

const getWorkspace = async (req, res) => {
  try {
    const house = await House.findById(req.params.id).select('messages reminders todos ownerId currentTenant');
    if (!house) return res.status(404).json({ message: 'House not found' });

    const isOwner = house.ownerId.toString() === req.user._id.toString();
    const isTenant = house.currentTenant?.userId?.toString() === req.user._id.toString();
    if (!isOwner && !isTenant) return res.status(403).json({ message: 'Not authorized' });

    res.json({ messages: house.messages, reminders: house.reminders, todos: house.todos });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const addMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const house = await House.findById(req.params.id);
    if (!house) return res.status(404).json({ message: "House not found" });

    const isOwner = house.ownerId.toString() === req.user._id.toString();
    const isTenant = house.currentTenant?.userId?.toString() === req.user._id.toString();
    if (!isOwner && !isTenant) return res.status(403).json({ message: 'Not authorized' });

    house.messages.push({ senderId: req.user._id, senderName: req.user.name, text });
    await house.save();

    const notifyId = isOwner ? house.currentTenant?.userId : house.ownerId;
    if (notifyId) {
      await Notification.create({
        userId: notifyId,
        type: 'new_message',
        title: `💬 New Message: ${house.title}`,
        message: `${req.user.name}: ${text}`,
        houseId: house._id
      });
    }

    res.json(house.messages);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const addReminder = async (req, res) => {
  try {
    const { title, date } = req.body;
    const house = await House.findById(req.params.id);
    if (!house) return res.status(404).json({ message: "House not found" });

    house.reminders.push({ title, date, createdBy: req.user._id });
    await house.save();

    const isOwner = house.ownerId.toString() === req.user._id.toString();
    const notifyId = isOwner ? house.currentTenant?.userId : house.ownerId;
    if (notifyId) {
      await Notification.create({
        userId: notifyId,
        type: 'new_reminder',
        title: `📅 New Reminder: ${house.title}`,
        message: `${req.user.name} added a reminder: "${title}" on ${new Date(date).toLocaleDateString()}`,
        houseId: house._id
      });
    }

    res.json(house.reminders);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteReminder = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) return res.status(404).json({ message: "House not found" });
    
    house.reminders = house.reminders.filter(r => r._id.toString() !== req.params.reminderId);
    await house.save();
    res.json(house.reminders);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const addTodo = async (req, res) => {
  try {
    const { text } = req.body;
    const house = await House.findById(req.params.id);
    if (!house) return res.status(404).json({ message: 'House not found' });

    house.todos.push({ text, addedBy: req.user._id });
    await house.save();

    const isOwner = house.ownerId.toString() === req.user._id.toString();
    const notifyId = isOwner ? house.currentTenant?.userId : house.ownerId;
    if (notifyId) {
      await Notification.create({
        userId: notifyId,
        type: 'new_todo',
        title: `✅ New Task: ${house.title}`,
        message: `${req.user.name} added a task: "${text}"`,
        houseId: house._id
      });
    }

    res.json(house.todos);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const toggleTodo = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    const todo = house.todos.id(req.params.todoId);
    if (todo) {
      todo.isCompleted = !todo.isCompleted;
      await house.save();
    }
    res.json(house.todos);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteTodo = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    house.todos = house.todos.filter(t => t._id.toString() !== req.params.todoId);
    await house.save();
    res.json(house.todos);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const requestVacate = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) return res.status(404).json({ message: 'House not found' });

    const isOwner = house.ownerId.toString() === req.user._id.toString();
    const isTenant = house.currentTenant?.userId?.toString() === req.user._id.toString();

    if (!isOwner && !isTenant) return res.status(403).json({ message: 'Not authorized' });

    house.vacateRequest = {
      requestedBy: req.user._id,
      status: 'pending',
      requestedAt: new Date()
    };
    await house.save();

    const notifyId = isOwner ? house.currentTenant?.userId : house.ownerId;
    if (notifyId) {
      await Notification.create({
        userId: notifyId,
        type: 'vacate_request',
        title: '🚨 Vacate Request!',
        message: `${req.user.name} has requested to vacate "${house.title}". This requires your approval.`,
        houseId: house._id,
        metadata: {
          requesterId: req.user._id,
          requesterName: req.user.name,
          houseTitle: house.title,
          role: isOwner ? 'owner' : 'renter'
        }
      });
    }

    res.json({ message: 'Vacate request sent', house });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const respondVacate = async (req, res) => {
  try {
    const { action } = req.body; // 'approve' | 'reject'
    const house = await House.findById(req.params.id);
    if (!house) return res.status(404).json({ message: 'House not found' });

    if (house.vacateRequest.status !== 'pending') {
      return res.status(400).json({ message: 'No pending vacate request' });
    }

    const isOwner = house.ownerId.toString() === req.user._id.toString();
    const isTenant = house.currentTenant?.userId?.toString() === req.user._id.toString();

    if (!isOwner && !isTenant) return res.status(403).json({ message: 'Not authorized' });

    // Prevent approving your own request
    if (house.vacateRequest.requestedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Waiting for the other party to respond' });
    }

    if (action === 'approve') {
      const recipientId = house.vacateRequest.requestedBy;

      // ACTUAL VACATE LOGIC
      await House.findByIdAndUpdate(house._id, {
        $set: { isBooked: false, requests: [], vacateRequest: { status: 'none', requestedBy: null, requestedAt: null } },
        $unset: { currentTenant: "", tenant: "" }
      });

      // Notify the requester
      await Notification.create({
        userId: recipientId,
        type: 'vacate_response',
        title: '✅ Vacate Approved',
        message: `${req.user.name} approved the vacate request. Property "${house.title}" is now vacant.`,
        houseId: house._id,
        metadata: { action: 'approved', houseTitle: house.title }
      });

      res.json({ message: 'Vacate approved and processed' });
    } else {
      const recipientId = house.vacateRequest.requestedBy;
      house.vacateRequest = { status: 'none', requestedBy: null, requestedAt: null };
      await house.save();

      // Notify the requester
      await Notification.create({
        userId: recipientId,
        type: 'vacate_response',
        title: '❌ Vacate Rejected',
        message: `${req.user.name} rejected the vacate request for "${house.title}".`,
        houseId: house._id,
        metadata: { action: 'rejected', houseTitle: house.title }
      });

      res.json({ message: 'Vacate request rejected', house });
    }
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = {
  addHouse,
  getMyHouses,
  getAllHouses,
  requestBooking,
  acceptRequest,
  declineRequest,
  toggleRent,
  editHouse,
  deleteHouse,
  updateTenantDetails,
  vacateHouse,
  confirmPayment,
  addMessage,
  addReminder,
  deleteReminder,
  addTodo,
  toggleTodo,
  deleteTodo,
  getWorkspace,
  requestVacate,
  respondVacate
};