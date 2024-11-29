const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, required: true },
  paymentStatus: { type: String, required: true, enum: ['pending', 'success', 'failed'] },
  amount: { type: Number, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User' },
  orderId: { type: mongoose.Types.ObjectId, ref: 'Order' },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;