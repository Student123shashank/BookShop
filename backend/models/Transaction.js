const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  paymentAmount: { type: Number, required: true },
  transactionStatus: { type: String, required: true, enum: ['pending', 'success', 'failed'] },
  paymentMethod: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User' },
  orderId: { type: mongoose.Types.ObjectId, ref: 'Order' },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
