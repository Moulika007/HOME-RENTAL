const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['booking_request', 'request_accepted', 'request_rejected', 'payment_due', 'success_story', 'booking_sent', 'payment_received', 'tenant_moved_in', 'new_message', 'new_reminder', 'new_todo', 'vacate_request', 'vacate_response'],
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  houseId: { type: mongoose.Schema.Types.ObjectId, ref: 'House' },
  isRead: { type: Boolean, default: false },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Notification', notificationSchema);
