const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
  houseId: { type: mongoose.Schema.Types.ObjectId, ref: 'House', required: true },
  renterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true }, // e.g., "January 2024"
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  paidDate: { type: Date },
  dueDate: { type: Date, required: true }
}, { timestamps: true });

paymentSchema.index({ renterId: 1, status: 1 });
paymentSchema.index({ ownerId: 1 });
paymentSchema.index({ houseId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
