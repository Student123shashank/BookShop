const express = require('express');
const router = express.Router();
const razorpay = require('razorpay');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const Order = require('../models/order');

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: uuidv4(),
    };
    const order = await razorpayInstance.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

router.post('/capture-payment', async (req, res) => {
  try {
    const { paymentId, orderId } = req.body;
    const payment = await razorpayInstance.payments.capture(paymentId, {
      amount: req.body.amount * 100,
      currency: 'INR',
    });
    await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid' });
    res.json({ message: 'Payment captured successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error capturing payment' });
  }
});

router.post('/create-order-for-cod', async (req, res) => {
  try {
    const { name, email, address, amount } = req.body;
    const order = new Order({
      name,
      email,
      address,
      amount,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
    });
    await order.save();
    res.json({ message: 'Order created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

module.exports = router;
