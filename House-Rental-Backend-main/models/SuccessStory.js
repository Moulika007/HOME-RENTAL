const mongoose = require('mongoose');

const successStorySchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  houseId: { type: mongoose.Schema.Types.ObjectId, ref: 'House', required: true },
  userName: { type: String, required: true },
  userRole: { type: String, enum: ['owner', 'renter'], required: true },
  story: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('SuccessStory', successStorySchema);
