const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

exports.createOrder = asyncHandler(async (req, res) => {
  const { paymentProvider, paymentInfo, shippingInfo } = req.body;
  const provider = paymentProvider || 'Razorpay';
  const isCod = provider === 'COD';

  if (!isCod && !paymentInfo) {
    return res.status(400).json({ message: 'Payment info is required for online payments' });
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    title: item.product.title,
    price: item.price,
    quantity: item.quantity
  }));

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalAmount: cart.totalAmount,
    paymentProvider: provider,
    paymentInfo: isCod ? undefined : paymentInfo,
    shippingInfo,
    status: isCod ? 'Pending' : 'Paid',
    paidAt: isCod ? undefined : new Date()
  });

  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
  }

  cart.items = [];
  cart.totalAmount = 0;
  await cart.save();

  res.status(201).json(order);
});

exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to view this order' });
  }
  res.json(order);
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = status;
  if (status === 'Delivered' && order.paymentProvider === 'COD' && !order.paidAt) {
    order.paidAt = new Date();
  }
  await order.save();
  res.json(order);
});

