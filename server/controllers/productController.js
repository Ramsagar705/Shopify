const Joi = require('joi');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');

const productSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(0).required(),
  categoryId: Joi.string().required(),
  stock: Joi.number().integer().min(0).required(),
  images: Joi.array().items(Joi.string())
});

exports.createProduct = asyncHandler(async (req, res) => {
  const { error, value } = productSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const category = await Category.findById(value.categoryId);
  if (!category) return res.status(400).json({ message: 'Invalid category' });

  const product = await Product.create({
    title: value.title,
    description: value.description,
    price: value.price,
    category: category._id,
    stock: value.stock,
    images: value.images || []
  });

  res.status(201).json(product);
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = productSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const category = await Category.findById(value.categoryId);
  if (!category) return res.status(400).json({ message: 'Invalid category' });

  const product = await Product.findByIdAndUpdate(
    id,
    {
      title: value.title,
      description: value.description,
      price: value.price,
      category: category._id,
      stock: value.stock,
      images: value.images || []
    },
    { new: true }
  );

  if (!product) return res.status(404).json({ message: 'Product not found' });

  res.json(product);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
});

exports.getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate('category');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

exports.getProducts = asyncHandler(async (req, res) => {
  const { keyword, category, minPrice, maxPrice, sortBy, sortOrder } = req.query;
  const filter = {};

  if (keyword) filter.title = { $regex: keyword, $options: 'i' };
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const order = sortOrder === 'desc' ? -1 : 1;
  const sort = sortBy
    ? sortBy === 'price'
      ? { price: order }
      : sortBy === 'rating'
        ? { averageRating: order }
        : { createdAt: order }
    : { createdAt: -1 };

  const products = await Product.find(filter).populate('category').sort(sort);
  res.json(products);
});

exports.createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  // Only verified buyers can review
  const hasPurchased = await Order.exists({
    user: req.user._id,
    'items.product': product._id,
    status: { $in: ['Paid', 'Shipped', 'Delivered'] }
  });
  if (!hasPurchased) {
    return res.status(403).json({ message: 'Only verified buyers can review this product' });
  }

  const review = await Review.findOneAndUpdate(
    { user: req.user._id, product: product._id },
    { rating, comment },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const stats = await Review.aggregate([
    { $match: { product: product._id } },
    {
      $group: {
        _id: '$product',
        numReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    product.numReviews = stats[0].numReviews;
    product.averageRating = stats[0].averageRating;
  } else {
    product.numReviews = 0;
    product.averageRating = 0;
  }

  await product.save();
  res.status(201).json(review);
});

