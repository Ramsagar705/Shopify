const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopify';

const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@12345';

async function run() {
  if (!process.env.JWT_SECRET && process.env.NODE_ENV !== 'production') {
    process.env.JWT_SECRET = 'dev_secret_change_me';
  }

  await mongoose.connect(MONGO_URI);
  const existing = await User.findOne({ email: ADMIN_EMAIL });

  if (existing) {
    existing.name = ADMIN_NAME;
    existing.role = 'admin';
    // Update password if explicitly provided via env
    if (process.env.ADMIN_PASSWORD) existing.password = ADMIN_PASSWORD;
    await existing.save();
    console.log(`Admin updated: ${existing.email}`);
  } else {
    const user = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin'
    });
    console.log(`Admin created: ${user.email}`);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

