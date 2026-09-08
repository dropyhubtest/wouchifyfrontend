const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const adminAuthRoutes = require('./routes/adminAuth');
const dealRoutes = require('./routes/deals');
const couponRoutes = require('./routes/coupons');
const lootDealRoutes = require('./routes/lootDeals');
const storeRoutes = require('./routes/stores');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');

// Import models for seeding
const Deal = require('./models/Deal');
const Coupon = require('./models/Coupon');
const LootDeal = require('./models/LootDeal');
const Store = require('./models/Store');
const Category = require('./models/Category');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const inMemoryStore = require('./services/inMemoryStore');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow localhost and Vercel connections
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/loot-deals', lootDealRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'mongodb' : 'in-memory',
    timestamp: new Date().toISOString()
  });
});

// Seed Endpoint (NOT auth-protected)
app.post('/api/seed', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const counts = inMemoryStore.seed();
      return res.json({
        message: 'Database seeded successfully (in-memory mode)',
        counts
      });
    }

    await Promise.all([
      Deal.deleteMany({}),
      Coupon.deleteMany({}),
      LootDeal.deleteMany({}),
      Store.deleteMany({}),
      Category.deleteMany({}),
      User.deleteMany({}),
      Transaction.deleteMany({})
    ]);

    const storeNames = [
      'Amazon', 'Flipkart', 'Myntra', 'Swiggy', 'Zomato', 'Nykaa', 'Ajio',
      'Zepto', 'Big Basket', 'Meesho', 'JioMart', 'Tata CLiQ', 'Croma',
      'Boat', 'Sugar Cosmetics', 'Mamaearth', 'Lenskart', 'Pepperfry',
      'Urban Company', 'PharmEasy'
    ];
    const categoryNames = [
      'Electronics', 'Fashion', 'Food & Dining', 'Grocery',
      'Beauty & Personal Care', 'Home & Lifestyle', 'Health & Wellness'
    ];

    const stores = await Store.insertMany(storeNames.map(name => ({
      name, category: categoryNames[Math.floor(Math.random() * categoryNames.length)],
      status: 'active'
    })));

    const categories = await Category.insertMany(categoryNames.map(name => ({
      name, slug: name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'),
    })));

    const deals = await Deal.insertMany(Array(10).fill().map((_, i) => ({
      name: `Sample Deal ${i + 1}`,
      store: stores[Math.floor(Math.random() * stores.length)].name,
      category: categories[Math.floor(Math.random() * categories.length)].name,
      price: `₹${(Math.random() * 1000).toFixed(0)}`,
      originalPrice: `₹${(Math.random() * 2000 + 1000).toFixed(0)}`,
      discount: `${Math.floor(Math.random() * 50 + 10)}% OFF`,
      status: 'active',
      expiry: 'Sep 30, 2026'
    })));

    const coupons = await Coupon.insertMany([
      { code: 'WOUCH50', store: 'Swiggy', discount: '50% OFF', category: 'Food', expiry: 'Sep 30, 2026' },
      { code: 'MYNTRA20', store: 'Myntra', discount: '20% OFF', category: 'Fashion', expiry: 'Sep 28, 2026' },
      { code: 'AMZTECH1000', store: 'Amazon', discount: '₹1000 Flat', category: 'Electronics', expiry: 'Sep 20, 2026' },
      { code: 'ZEPTOFREE', store: 'Zepto', discount: 'Free Delivery', category: 'Grocery', expiry: 'Oct 05, 2026' },
      { code: 'ZOMATOEATS', store: 'Zomato', discount: '60% OFF', category: 'Food', expiry: 'Sep 01, 2026' },
      { code: 'AJIOFIRST', store: 'Ajio', discount: '₹500 OFF', category: 'Fashion', expiry: 'Oct 15, 2026' }
    ]);

    const lootDeals = await LootDeal.insertMany([
      { title: 'Oval Up Down LED Wall Light 2W', storeName: 'Amazon', category: 'Electronics', discount: '91% OFF', currentPrice: '₹179', originalPrice: '₹1,899', dealType: 'flash', status: 'active', href: '/deals' },
      { title: 'Noise ColorFit Pulse Grand Smartwatch', storeName: 'Flipkart', category: 'Electronics', discount: '75% OFF', currentPrice: '₹999', originalPrice: '₹3,999', dealType: 'exclusive', status: 'active', href: '/deals' }
    ]);

    const userNames = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Verma', 'Vikram Mehta', 'Karan Malhotra'];
    const users = await User.insertMany(userNames.map((name, i) => ({
      name, email: `${name.toLowerCase().replace(/ /g, '.')}@example.com`, joinedDate: 'Aug 2026', status: 'verified'
    })));

    const transactions = await Transaction.insertMany([
      { transactionId: 'TXN-9021', user: 'Rahul Sharma', email: 'rahul.sharma@example.com', type: 'Cashback', amount: '₹250', status: 'Completed', time: '5 mins ago' },
      { transactionId: 'TXN-9020', user: 'Priya Patel', email: 'priya.patel@example.com', type: 'Redemption', amount: '₹500', status: 'Pending', time: '18 mins ago' },
      { transactionId: 'TXN-9019', user: 'Amit Kumar', email: 'amit.kumar@example.com', type: 'Cashback', amount: '₹120', status: 'Completed', time: '1 hr ago' }
    ]);

    res.json({
      message: 'Database seeded successfully',
      counts: {
        deals: deals.length,
        coupons: coupons.length,
        lootDeals: lootDeals.length,
        stores: stores.length,
        categories: categories.length,
        users: users.length,
        transactions: transactions.length
      }
    });
  } catch (err) { next(err); }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// Port & Server Startup
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/wouchify';

// Always start the HTTP server so API works regardless of DB state
const server = app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

// Connect to MongoDB asynchronously; if unavailable, seamlessly fall back
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('MongoDB not connected - running with in-memory dev database.');
  });

module.exports = app;
