const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

const recalcTotal = (cart) => {
  cart.totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [], totalAmount: 0 });
  }
  res.json(cart);
});

exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const requestedQty = Number(quantity || 1);
  if (requestedQty < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });
  if (requestedQty > product.stock) {
    return res.status(400).json({ message: 'Not enough stock available' });
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [], totalAmount: 0 });
  }

  const itemIndex = cart.items.findIndex((i) => i.product.toString() === productId);
  if (itemIndex > -1) {
    const nextQty = cart.items[itemIndex].quantity + requestedQty;
    if (nextQty > product.stock) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }
    cart.items[itemIndex].quantity = nextQty;
  } else {
    cart.items.push({ product: product._id, quantity: requestedQty, price: product.price });
  }

  recalcTotal(cart);
  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
});

exports.updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const requestedQty = Number(quantity || 1);
  if (requestedQty < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (requestedQty > product.stock) {
    return res.status(400).json({ message: 'Not enough stock available' });
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) return res.status(404).json({ message: 'Item not found in cart' });

  item.quantity = requestedQty;
  recalcTotal(cart);
  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
});

exports.removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  recalcTotal(cart);
  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
});

exports.clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  cart.items = [];
  cart.totalAmount = 0;
  await cart.save();
  res.json(cart);
});

