// models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // indexed
  amount: { type: Number, required: true },  // Payment amount
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  paymentDate: { type: Date, default: Date.now },  // original concept retained
  transactionId: { type: String, required: true, unique: true },  // Unique transaction ID
}, {
  timestamps: true, // createdAt, updatedAt
});

// add a compound index if you will query by user + status often
paymentSchema.index({ userId: 1, paymentStatus: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
