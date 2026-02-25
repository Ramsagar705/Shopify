const User = require('../models/User');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');

exports.getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalOrders, revenueAgg, topProducts, recentOrders, monthlyRevenue] =
    await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }]),
      Order.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product',
            totalSold: { $sum: '$items.quantity' },
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
          }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' }
      ]),
      Order.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email'),
      Order.aggregate([
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            revenue: { $sum: '$totalAmount' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    ]);

  res.json({
    totalUsers,
    totalOrders,
    totalRevenue: revenueAgg[0]?.totalRevenue || 0,
    topProducts,
    recentOrders,
    monthlyRevenue
  });
});

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

exports.setUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.role = role;
  await user.save();
  res.json(user);
});

