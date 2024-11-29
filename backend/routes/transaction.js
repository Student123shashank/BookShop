const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const {authenticateToken}=require("./userAuth");

router.post('/create-transaction', authenticateToken, async (req, res) => {
  try {
    const { paymentAmount, paymentMethod, orderId } = req.body;
    const transaction = new Transaction({
      paymentAmount,
      paymentMethod,
      orderId,
      userId: req.user._id,
    });
    await transaction.save();
    res.json({ message: 'Transaction created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating transaction' });
  }
});

router.get('/get-transactions', authenticateToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id });
    res.json({ transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving transactions' });
  }
});

module.exports = router;