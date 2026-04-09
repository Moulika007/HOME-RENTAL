const mongoose = require('mongoose');

const billSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    houseId: { type: mongoose.Schema.Types.ObjectId, ref: 'House' },
    title: { type: String, required: true },        // e.g. "Electricity Bill"
    category: { type: String, default: 'Other' },      // Electricity, Water, Internet, Gas, Other
    amount: { type: Number },                        // optional estimated amount
    dueDate: { type: Date, required: true },
    isPaid: { type: Boolean, default: false },
    paidDate: { type: Date },
    notes: { type: String }
}, { timestamps: true });

billSchema.index({ userId: 1, dueDate: 1 });

module.exports = mongoose.model('Bill', billSchema);
