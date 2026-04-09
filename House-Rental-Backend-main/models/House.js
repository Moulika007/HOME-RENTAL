const mongoose = require('mongoose');

const houseSchema = mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // House Details
  title: { type: String, required: true },
  location: { type: String, required: true },
  rent: { type: Number, required: true },
  images: [String],

  // New Fields Requested
  purpose: { type: String, default: 'Living', enum: ['Living', 'Vacation'] }, // Options for living or vacation
  propertyType: { type: String, default: 'Apartment' }, // e.g., Apartment, Villa, Beach House, Relaxation
  furnishing: { type: String, default: 'Unfurnished' }, // e.g., Furnished, Semi
  amenities: [String], // e.g., ["WiFi", "Parking"]

  // Status
  isBooked: { type: Boolean, default: false },
  isPendingPayment: { type: Boolean, default: false }, // accepted but payment not yet confirmed
  paymentUpiId: { type: String },     // the Owner's UPI ID / Phone Number for this rental
  paymentQrImage: { type: String },   // base64 QR image uploaded by owner
  lastPaidDate: { type: Date },       // date renter last paid rent
  nextDueDate: { type: Date },        // auto-calculated next rent due date

  // Current Tenant (Visible to Owner if Booked)
  currentTenant: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    email: { type: String }, // Added Mail ID
    phone: { type: String },
    startDate: { type: String },
    isRentPaid: { type: Boolean, default: false }
  },

  // Booking Requests (Queue)
  requests: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
    phone: String,
    date: Date,
    status: { type: String, default: 'pending' }, // pending, accepted, rejected
    guests: Number,
    stayDuration: Number,
    additionalDetails: String,
    moveInDate: Date,
    message: String
  }],

  // Shared Workspace
  messages: [{
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderName: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
  }],
  reminders: [{
    title: String,
    date: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  todos: [{
    text: String,
    isCompleted: { type: Boolean, default: false },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  vacateRequest: {
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['none', 'pending'], default: 'none' },
    requestedAt: Date
  }
}, { timestamps: true });

houseSchema.index({ ownerId: 1 });
houseSchema.index({ isBooked: 1 });
houseSchema.index({ 'currentTenant.userId': 1 });
houseSchema.index({ 'requests.userId': 1 });
houseSchema.index({ location: 'text', title: 'text' });

module.exports = mongoose.model('House', houseSchema);