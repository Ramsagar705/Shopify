const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Cart = require('../models/Cart');
const asyncHandler = require('../utils/asyncHandler');

exports.createRazorpayOrder = asyncHandler(async (req, res) => {
  if (!razorpay) {
    return res.status(500).json({
      message:
        'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server .env'
    });
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const options = {
    amount: Math.round(cart.totalAmount * 100),
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`,
    payment_capture: 1
  };

  const order = await razorpay.orders.create(options);
  res.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID
  });
});

exports.verifyRazorpaySignature = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const payload = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(payload)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: 'Invalid signature' });
  }

  res.json({
    message: 'Payment verified',
    paymentInfo: {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature
    }
  });
});

exports.razorpayWebhook = asyncHandler(async (req, res) => {
  console.log('Razorpay webhook event:', req.body?.event);
  res.json({ status: 'ok' });
});

