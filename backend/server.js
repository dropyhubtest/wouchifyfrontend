const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const dotenv = require('dotenv');

dotenv.config();

// Global process exception traps to ensure high-availability and prevent unexpected server exit
process.on('uncaughtException', (err) => {
  console.error('[Server uncaughtException]', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[Server unhandledRejection]', reason && reason.message ? reason.message : reason);
});

// Import existing routes
const adminAuthRoutes = require('./routes/adminAuth');
const authRoutes = require('./routes/auth');
const dealRoutes = require('./routes/deals');
const couponRoutes = require('./routes/coupons');
const lootDealRoutes = require('./routes/lootDeals');
const storeRoutes = require('./routes/stores');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');

// Import new routes
const creditCardRoutes = require('./routes/creditCards');
const bannerRoutes = require('./routes/banners');
const advertisementRoutes = require('./routes/advertisements');
const submissionRoutes = require('./routes/submissions');
const supportTicketRoutes = require('./routes/supportTickets');
const cashbackClaimRoutes = require('./routes/cashbackClaims');
const verifyRoutes = require('./routes/verify');
const staffRoutes = require('./routes/staff');

// Import models for seeding
const Deal = require('./models/Deal');
const Coupon = require('./models/Coupon');
const LootDeal = require('./models/LootDeal');
const Store = require('./models/Store');
const Category = require('./models/Category');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const CreditCard = require('./models/CreditCard');
const Banner = require('./models/Banner');
const Advertisement = require('./models/Advertisement');
const Submission = require('./models/Submission');
const SupportTicket = require('./models/SupportTicket');
const CashbackClaim = require('./models/CashbackClaim');
const StaffMember = require('./models/StaffMember');

const inMemoryStore = require('./services/inMemoryStore');
const { connectDB } = require('./config/db');

const app = express();

// Middleware
app.use(compression());
app.use(cors({
  origin: function (origin, callback) {
    // Allow localhost and Vercel connections
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Non-blocking background MongoDB Atlas connection monitor
let lastConnectAttempt = 0;
const { hydrateStoreFromMongo } = require('./services/mongoSyncService');
app.use((req, res, next) => {
  const now = Date.now();
  if (mongoose.connection.readyState === 0 && now - lastConnectAttempt > 30000) {
    lastConnectAttempt = now;
    connectDB()
      .then(() => hydrateStoreFromMongo().catch(() => {}))
      .catch((err) => {
        console.warn('Background MongoDB connection retry note:', err.message);
      });
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/loot-deals', lootDealRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

// Register new API routes
app.use('/api/credit-cards', creditCardRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/advertisements', advertisementRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/support-tickets', supportTicketRoutes);
app.use('/api/cashback-claims', cashbackClaimRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/staff', staffRoutes);

// Compatibility / Data API routes for customer homepage sections
app.get('/api/data/deals', async (req, res) => {
  try {
    let deals = [];
    if (mongoose.connection.readyState === 1) {
      deals = await Deal.find({ status: { $in: ['active', 'Approved', 'approved'] } }).lean();
    } else {
      deals = inMemoryStore.getDeals({ status: 'active' });
    }
    const formatted = (deals || []).map(d => ({
      _id: d._id || d.id,
      title: d.title || d.name,
      name: d.title || d.name,
      price: d.price,
      originalPrice: d.originalPrice,
      discount: d.discount || d.discountLabel,
      brand: {
        name: d.brand || d.store,
        logoUrl: d.logoUrl || d.brandLogo || d.image || '/images/default-logo.png'
      },
      image: d.image || d.imageUrl || '/images/default-logo.png',
      store: d.store,
      category: d.category,
      code: d.code,
      rating: d.rating,
      expiry: d.expiry
    }));
    res.json(formatted);
  } catch (err) {
    res.status(200).json([]);
  }
});

app.get('/api/data/brands/popular', async (req, res) => {
  try {
    let stores = [];
    if (mongoose.connection.readyState === 1) {
      stores = await Store.find({ status: 'active' }).lean();
    } else {
      stores = inMemoryStore.getStores({ status: 'active' });
    }
    const formatted = (stores || []).map(s => ({
      _id: s._id || s.id,
      name: s.name,
      logoUrl: s.logo || s.logoUrl || '/images/default-logo.png',
      cashbackText: s.reward || s.cashbackText || 'Up to 10% Cashback',
      categories: [{ name: s.category || 'Shopping' }]
    }));
    res.json(formatted);
  } catch (err) {
    res.status(200).json([]);
  }
});

app.get('/api/data/categories', async (req, res) => {
  try {
    let categories = [];
    if (mongoose.connection.readyState === 1) {
      categories = await Category.find({}).lean();
    } else {
      categories = inMemoryStore.getCategories();
    }
    res.json(categories);
  } catch (err) {
    res.status(200).json([]);
  }
});

// Root endpoint - Wouchify API status
const apiStatusHandler = (req, res) => {
  const isDbReady = mongoose.connection.readyState === 1;
  res.json({
    name: 'Wouchify API Service',
    status: 'online',
    version: '1.0.0',
    database: isDbReady ? 'MongoDB Atlas (Connected)' : 'In-Memory Fallback (Active)',
    frontendUrl: 'http://localhost:3001',
    endpoints: {
      health: '/api/health',
      deals: '/api/deals',
      lootDeals: '/api/loot-deals',
      stores: '/api/stores',
      coupons: '/api/coupons',
      categories: '/api/categories',
      creditCards: '/api/credit-cards',
      banners: '/api/banners',
      advertisements: '/api/advertisements',
      supportTickets: '/api/support-tickets',
      cashbackClaims: '/api/cashback-claims',
      submissions: '/api/submissions',
      users: '/api/users',
      transactions: '/api/transactions',
      verify: '/api/verify'
    },
    message: 'Welcome to Wouchify Admin & Customer API. Frontend application runs on http://localhost:3001'
  });
};

app.get('/', apiStatusHandler);
app.get('/api', apiStatusHandler);
app.get('/api/', apiStatusHandler);

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
      Transaction.deleteMany({}),
      CreditCard.deleteMany({}),
      Banner.deleteMany({}),
      Advertisement.deleteMany({}),
      Submission.deleteMany({}),
      SupportTicket.deleteMany({}),
      CashbackClaim.deleteMany({}),
      StaffMember.deleteMany({})
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
      name, 
      category: categoryNames[Math.floor(Math.random() * categoryNames.length)],
      status: 'active'
    })));

    const categories = await Category.insertMany([
      {
        name: 'Fashion & Apparel',
        slug: 'fashion',
        color: '#FF6B6B',
        bgColor: '#FFE3E3',
        textColor: '#D92626',
        count: 240,
        dealsCount: 240,
        description: 'Explore top trending fashion, apparel, and clothing brands with verified discounts.',
        status: 'active',
        subcategories: [
          { id: 'mens-wear', name: "Men's Wear", slug: 'mens-wear', itemCount: 85 },
          { id: 'womens-wear', name: "Women's Wear", slug: 'womens-wear', itemCount: 95 },
          { id: 'footwear', name: 'Footwear', slug: 'footwear', itemCount: 40 },
          { id: 'accessories', name: 'Fashion Accessories', slug: 'accessories', itemCount: 20 }
        ]
      },
      {
        name: 'Electronics & Gadgets',
        slug: 'electronics',
        color: '#4DABF7',
        bgColor: '#E7F5FF',
        textColor: '#1971C2',
        count: 180,
        dealsCount: 180,
        description: 'Laptops, mobile devices, audio gear, and smart home appliances on discount.',
        status: 'active',
        subcategories: [
          { id: 'smartphones', name: 'Smartphones & Mobiles', slug: 'smartphones', itemCount: 60 },
          { id: 'laptops', name: 'Laptops & Computers', slug: 'laptops', itemCount: 45 },
          { id: 'audio', name: 'Headphones & Audio', slug: 'audio', itemCount: 35 },
          { id: 'home-appliances', name: 'Home Appliances', slug: 'home-appliances', itemCount: 40 }
        ]
      },
      {
        name: 'Grocery & Essentials',
        slug: 'grocery',
        color: '#51CF66',
        bgColor: '#EBFBEE',
        textColor: '#2B8A3E',
        count: 120,
        dealsCount: 120,
        description: 'Fresh daily groceries, supermarket items, and quick delivery staples.',
        status: 'active',
        subcategories: [
          { id: 'daily-essentials', name: 'Daily Essentials', slug: 'daily-essentials', itemCount: 50 },
          { id: 'packaged-foods', name: 'Packaged Foods', slug: 'packaged-foods', itemCount: 35 },
          { id: 'beverages', name: 'Beverages & Dairy', slug: 'beverages', itemCount: 35 }
        ]
      },
      {
        name: 'Beauty & Personal Care',
        slug: 'beauty',
        color: '#FCC419',
        bgColor: '#FFF9DB',
        textColor: '#E67700',
        count: 95,
        dealsCount: 95,
        description: 'Cosmetics, skincare, hair products, and luxury perfumes from authentic brands.',
        status: 'active',
        subcategories: [
          { id: 'skincare', name: 'Skincare', slug: 'skincare', itemCount: 35 },
          { id: 'makeup', name: 'Makeup & Cosmetics', slug: 'makeup', itemCount: 30 },
          { id: 'haircare', name: 'Hair Care', slug: 'haircare', itemCount: 20 },
          { id: 'fragrances', name: 'Fragrances & Perfumes', slug: 'fragrances', itemCount: 10 }
        ]
      },
      {
        name: 'Home & Furniture',
        slug: 'home',
        color: '#FF922B',
        bgColor: '#FFF4E6',
        textColor: '#D9480F',
        count: 110,
        dealsCount: 110,
        description: 'Furniture, kitchenware, interior decor, and bedding collections.',
        status: 'active',
        subcategories: [
          { id: 'furniture', name: 'Living Room Furniture', slug: 'furniture', itemCount: 45 },
          { id: 'kitchenware', name: 'Cookware & Kitchenware', slug: 'kitchenware', itemCount: 35 },
          { id: 'home-decor', name: 'Home Decor & Lighting', slug: 'home-decor', itemCount: 30 }
        ]
      },
      {
        name: 'Food & Dining',
        slug: 'food',
        color: '#FF8787',
        bgColor: '#FFF5F5',
        textColor: '#C92A2A',
        count: 85,
        dealsCount: 85,
        description: 'Food delivery apps, gourmet snacks, dining out vouchers, and restaurant deals.',
        status: 'active',
        subcategories: [
          { id: 'food-delivery', name: 'Food Delivery Apps', slug: 'food-delivery', itemCount: 40 },
          { id: 'dining-offers', name: 'Restaurant Vouchers', slug: 'dining-offers', itemCount: 25 },
          { id: 'gourmet', name: 'Gourmet & Snacks', slug: 'gourmet', itemCount: 20 }
        ]
      },
      {
        name: 'B2B & Wholesale',
        slug: 'b2b',
        color: '#845EF7',
        bgColor: '#F3F0FF',
        textColor: '#5F3DC4',
        count: 50,
        dealsCount: 50,
        description: 'Bulk ordering, enterprise supplies, and trade wholesale platforms.',
        status: 'active',
        subcategories: [
          { id: 'wholesale-trade', name: 'Wholesale Trade', slug: 'wholesale-trade', itemCount: 30 },
          { id: 'office-supplies', name: 'Office Supplies', slug: 'office-supplies', itemCount: 20 }
        ]
      },
      {
        name: 'Stores',
        slug: 'stores',
        color: '#0EA5E9',
        bgColor: '#D4F7F2',
        textColor: '#0369A1',
        count: 20,
        dealsCount: 20,
        description: 'Popular brand stores and merchant retail outlets.',
        status: 'active',
        href: '/categories/stores',
        subcategories: [
          { id: 'fashion-stores', name: 'Fashion Stores', slug: 'fashion-stores', itemCount: 10 },
          { id: 'electronics-stores', name: 'Electronics Stores', slug: 'electronics-stores', itemCount: 8 }
        ]
      },
      {
        name: 'Brands',
        slug: 'brands',
        color: '#EC4899',
        bgColor: '#FCE7F3',
        textColor: '#BE185D',
        count: 48,
        dealsCount: 48,
        description: 'Direct brand stores, flagship collections, and manufacturer discounts.',
        status: 'active',
        href: '/categories/brands',
        subcategories: [
          { id: 'top-brands', name: 'Top Brands', slug: 'top-brands', itemCount: 24 },
          { id: 'premium-brands', name: 'Premium Brands', slug: 'premium-brands', itemCount: 18 }
        ]
      },
      {
        name: 'Banks',
        slug: 'banks',
        color: '#EAB308',
        bgColor: '#FEF9C3',
        textColor: '#A16207',
        count: 16,
        dealsCount: 16,
        description: 'Leading Indian banks and card payment offers.',
        status: 'active',
        href: '/categories/banks',
        subcategories: [
          { id: 'credit-card-offers', name: 'Credit Card Offers', slug: 'credit-card-offers', itemCount: 10 },
          { id: 'net-banking', name: 'Net Banking Offers', slug: 'net-banking', itemCount: 6 }
        ]
      },
      {
        name: 'Festivals',
        slug: 'festivals',
        color: '#EF4444',
        bgColor: '#FEE2E2',
        textColor: '#B91C1C',
        count: 12,
        dealsCount: 12,
        description: 'Festive season mega promotions, Diwali, Holi, and Ramzan sales.',
        status: 'active',
        href: '/categories/festivals',
        subcategories: [
          { id: 'diwali-sales', name: 'Diwali Sales', slug: 'diwali-sales', itemCount: 6 },
          { id: 'seasonal-fests', name: 'Seasonal Festivals', slug: 'seasonal-fests', itemCount: 6 }
        ]
      },
      {
        name: 'Travelling',
        slug: 'travelling',
        color: '#0284C7',
        bgColor: '#E0F2FE',
        textColor: '#0369A1',
        count: 28,
        dealsCount: 28,
        description: 'Airlines, railway bookings, hotels, and holiday packages.',
        status: 'active',
        href: '/categories/travelling',
        subcategories: [
          { id: 'flights', name: 'Flights', slug: 'flights', itemCount: 14 },
          { id: 'hotels', name: 'Hotels & Resorts', slug: 'hotels', itemCount: 14 }
        ]
      },
      {
        name: 'Cities Deals',
        slug: 'cities-deals',
        color: '#3B82F6',
        bgColor: '#EBF5FF',
        textColor: '#1D4ED8',
        count: 32,
        dealsCount: 32,
        description: 'Hyperlocal discounts and city-specific retail shopping deals.',
        status: 'active',
        href: '/categories/cities-deals',
        subcategories: [
          { id: 'metro-cities', name: 'Metro Cities', slug: 'metro-cities', itemCount: 18 },
          { id: 'tier2-cities', name: 'Tier 2 Cities', slug: 'tier2-cities', itemCount: 14 }
        ]
      }
    ]);

    const deals = await Deal.insertMany([
      // No dummy data - only executive-uploaded deals
    ]);

    const coupons = await Coupon.insertMany([
      // No dummy data - only executive-uploaded coupons
    ]);

    const lootDeals = await LootDeal.insertMany([
      // No dummy data - only executive-uploaded loot deals
    ]);

    const userNames = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Verma', 'Vikram Mehta', 'Karan Malhotra'];
    const users = await User.insertMany(userNames.map((name, i) => ({
      name, 
      email: `${name.toLowerCase().replace(/ /g, '.')}@example.com`, 
      joinedDate: 'Aug 2026', 
      status: 'verified'
    })));

    const transactions = await Transaction.insertMany([
      { transactionId: 'TXN-9021', user: 'Rahul Sharma', email: 'rahul.sharma@example.com', type: 'Cashback', amount: '₹250', status: 'Completed', time: '5 mins ago' },
      { transactionId: 'TXN-9020', user: 'Priya Patel', email: 'priya.patel@example.com', type: 'Redemption', amount: '₹500', status: 'Pending', time: '18 mins ago' },
      { transactionId: 'TXN-9019', user: 'Amit Kumar', email: 'amit.kumar@example.com', type: 'Cashback', amount: '₹120', status: 'Completed', time: '1 hr ago' }
    ]);

    const creditCards = await CreditCard.insertMany([
      {
        cardName: 'IndusInd Bank Credit Card',
        bank: 'IndusInd Bank',
        network: 'Visa',
        tier: 'Premium',
        imageUrl: '',
        bankLogoUrl: '/src/assets/creditcardpage/indusind_bank.png',
        welcomeOffer: 'Upto 5% Cashback',
        rewardRate: 'Exclusive Rewards',
        keyBenefits: ['Upto 5% Cashback', 'Exclusive Rewards', 'Shopping, Travel, Dining'],
        partnerBrands: ['Shopping', 'Travel', 'Dining'],
        affiliateLink: '#',
        annualFee: '₹0',
        joiningFee: '₹0',
        feeWaiver: 'Lifetime Free',
        status: 'featured',
        isFeatured: true,
        isVerified: true,
        applyCount: 2400,
        viewCount: 19800,
        submittedBy: 'executive@wouchify.com',
        submissionStatus: 'approved'
      },
      {
        cardName: 'ICICI Credit Card',
        bank: 'ICICI Bank',
        network: 'Visa',
        tier: 'Premium',
        imageUrl: '',
        bankLogoUrl: '/src/assets/creditcardpage/ICICI_bank.png',
        welcomeOffer: 'Upto 5% Cashback',
        rewardRate: 'Earn Reward Points',
        keyBenefits: ['Upto 5% Cashback', 'Earn Reward Points', 'Amazon, Flipkart, Swiggy'],
        partnerBrands: ['Amazon', 'Flipkart', 'Swiggy'],
        affiliateLink: '#',
        annualFee: 'Lifetime Free',
        joiningFee: '₹0',
        feeWaiver: 'Always Free (Lifetime Free Card)',
        status: 'featured',
        isFeatured: true,
        isVerified: true,
        applyCount: 2400,
        viewCount: 21100,
        submittedBy: 'executive@wouchify.com',
        submissionStatus: 'approved'
      },
      {
        cardName: 'IDFC Credit Card',
        bank: 'IDFC First Bank',
        network: 'Visa',
        tier: 'Premium',
        imageUrl: '',
        bankLogoUrl: '/src/assets/creditcardpage/IDFC_back.png',
        welcomeOffer: 'Never Expiring Rewards',
        rewardRate: 'Lifetime Free',
        keyBenefits: ['Never Expiring Rewards', 'Lifetime Free', 'All Round Spends'],
        partnerBrands: ['All Round Spends'],
        affiliateLink: '#',
        annualFee: 'Lifetime Free',
        joiningFee: '₹0',
        feeWaiver: 'Always Free (Lifetime Free Card)',
        status: 'active',
        isFeatured: true,
        isVerified: true,
        applyCount: 2400,
        viewCount: 16500,
        submittedBy: 'executive@wouchify.com',
        submissionStatus: 'approved'
      },
      {
        cardName: 'Tata Neu Card',
        bank: 'TataNeu',
        network: 'Rupay',
        tier: 'Classic',
        imageUrl: '',
        bankLogoUrl: '/src/assets/creditcardpage/Tata_neu.svg',
        welcomeOffer: 'Up to 10% NeuCoins',
        rewardRate: 'Lifetime Free Offers',
        keyBenefits: ['Up to 10% NeuCoins', 'Lifetime Free Offers', 'Shopping, Travel, Dining'],
        partnerBrands: ['Shopping', 'Travel', 'Dining'],
        affiliateLink: '#',
        annualFee: '₹0',
        joiningFee: '₹0',
        feeWaiver: 'Lifetime Free',
        status: 'active',
        isFeatured: false,
        isVerified: true,
        applyCount: 2400,
        viewCount: 18000,
        submittedBy: 'executive@wouchify.com',
        submissionStatus: 'approved'
      },
      {
        cardName: 'Axis Credit Card',
        bank: 'Axis Bank',
        network: 'Mastercard',
        tier: 'Classic',
        imageUrl: '',
        bankLogoUrl: '/src/assets/creditcardpage/Axis_Bank.png',
        welcomeOffer: 'Up to 7.5% Cashback',
        rewardRate: 'Flat ₹1,400 Rewards',
        keyBenefits: ['Up to 7.5% Cashback', 'Flat ₹1,400 Rewards', 'Amazon, Flipkart, Swiggy'],
        partnerBrands: ['Amazon', 'Flipkart', 'Swiggy'],
        affiliateLink: '#',
        annualFee: '₹0',
        joiningFee: '₹0',
        feeWaiver: 'Lifetime Free',
        status: 'active',
        isFeatured: false,
        isVerified: true,
        applyCount: 2400,
        viewCount: 19500,
        submittedBy: 'executive@wouchify.com',
        submissionStatus: 'approved'
      },
      {
        cardName: 'Tata Neu Card',
        bank: 'TataNeu',
        network: 'Mastercard',
        tier: 'Classic',
        imageUrl: '',
        bankLogoUrl: '/src/assets/creditcardpage/Bajaj-Finsery.png',
        welcomeOffer: 'Up to 10% NeuCoins',
        rewardRate: 'Lifetime Free Offers',
        keyBenefits: ['Up to 10% NeuCoins', 'Lifetime Free Offers', 'Shopping, Travel, Dining'],
        partnerBrands: ['Shopping', 'Travel', 'Dining'],
        affiliateLink: '#',
        annualFee: '₹0',
        joiningFee: '₹0',
        feeWaiver: 'Lifetime Free',
        status: 'active',
        isFeatured: false,
        isVerified: true,
        applyCount: 2400,
        viewCount: 17200,
        submittedBy: 'executive@wouchify.com',
        submissionStatus: 'approved'
      }
    ]);

    const banners = await Banner.insertMany([
      {
        title: 'Great Indian Festival & Big Billion Days Mega Sale',
        targetPage: 'home',
        badgeText: 'FESTIVE BONANZA 2026',
        headingLine1: 'UP TO 85% OFF +',
        headingLine2: 'EXTRA 10% BANK CASHBACK',
        headingLine3: 'ON TOP BRANDS & GADGETS',
        description: 'Stack exclusive Wouchify coupon codes with bank discounts on Amazon, Flipkart, Myntra & more.',
        ctaText: 'Shop Festive Deals',
        targetLink: '/deals?category=Electronics',
        primaryImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
        dealChip1: '⚡ Instant ₹1,000 Off on SBI & HDFC Cards',
        dealChip2: '🔥 100% Verified Cashback Tracking',
        themeColor: '#4F46E5',
        priority: 1,
        status: 'active',
        expiryDate: '2026-10-31',
        views: 124500,
        clicks: 18920,
        submittedBy: 'marketing@wouchify.com',
        submissionStatus: 'approved'
      },
      {
        title: 'Super Credit Card Offers & Welcome Vouchers',
        targetPage: 'credit-cards',
        badgeText: 'HOT FINTECH REWARDS',
        headingLine1: 'APPLY & GET ₹2,500',
        headingLine2: 'AMAZON VOUCHERS',
        headingLine3: 'ZERO JOINING FEE CARDS',
        description: 'Compare 50+ credit cards with high reward rates, lounge perks, and instant approval links.',
        ctaText: 'Compare Credit Cards',
        targetLink: '/credit-cards',
        primaryImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&auto=format&fit=crop&q=80',
        dealChip1: '💳 Lifetime Free Cards Available',
        dealChip2: '✈️ Unlimited Airport Lounge Access',
        themeColor: '#059669',
        priority: 2,
        status: 'active',
        expiryDate: '2026-12-31',
        views: 64200,
        clicks: 8430,
        submittedBy: 'executive@wouchify.com',
        submissionStatus: 'approved'
      }
    ]);

    const advertisements = await Advertisement.insertMany([
      {
        title: 'Wouchify Mega Sale & Cashback Bonanza',
        advertiser: 'Wouchify',
        placement: 'homepage-banner-1713x685',
        imageUrl: '/src/assets/advertisement/image-7.png',
        targetLink: '/offers/sale',
        ctaText: 'Explore Deals',
        badgeText: 'FEATURED',
        pricingModel: 'Flat Monthly',
        budgetOrRate: '₹50,000 / month',
        status: 'active',
        expiryDate: '2026-12-31',
        impressions: 145000,
        clicks: 9240,
        submittedBy: 'marketing@wouchify.com',
        submissionStatus: 'approved'
      },
      {
        title: 'Amazon Great Indian Festival - Up to 80% Off + 7.5% Cashback',
        advertiser: 'Amazon India',
        placement: 'homepage-banner-1713x685',
        imageUrl: '/src/assets/store-promos/amazon_banner.png',
        targetLink: '/stores#amazon',
        ctaText: 'Shop Amazon Deals',
        badgeText: 'HOT SALE',
        pricingModel: 'CPC',
        budgetOrRate: '₹15 / click',
        status: 'active',
        expiryDate: '2026-11-30',
        impressions: 98400,
        clicks: 6120,
        submittedBy: 'executive@wouchify.com',
        submissionStatus: 'approved'
      },
      {
        title: 'Flipkart Big Billion Days - Extra ₹1,500 Bank Discount',
        advertiser: 'Flipkart',
        placement: 'homepage-banner-1713x685',
        imageUrl: '/src/assets/store-promos/filpkart_banner.png',
        targetLink: '/stores#flipkart',
        ctaText: 'Grab Flipkart Loot',
        badgeText: 'TOP DEALS',
        pricingModel: 'CPC',
        budgetOrRate: '₹18 / click',
        status: 'active',
        expiryDate: '2026-11-20',
        impressions: 87300,
        clicks: 5430,
        submittedBy: 'executive@wouchify.com',
        submissionStatus: 'approved'
      },
      {
        title: 'Ajio All Stars Sale - Flat 50% to 90% Off Fashion',
        advertiser: 'Ajio',
        placement: 'leaderboard-728x90',
        imageUrl: '/src/assets/store-promos/ajio_banner.png',
        targetLink: '/stores#ajio',
        ctaText: 'Shop Trendy Fashion',
        badgeText: 'TRENDING',
        pricingModel: 'Affiliate',
        budgetOrRate: '12% Commission',
        status: 'active',
        expiryDate: '2026-12-15',
        impressions: 64500,
        clicks: 3890,
        submittedBy: 'executive@wouchify.com',
        submissionStatus: 'approved'
      },
      {
        title: 'FirstCry Mega Baby Carnival - Up to 65% Off',
        advertiser: 'FirstCry',
        placement: 'store-card-360x180',
        imageUrl: '/src/assets/store-promos/firtcry_banner.png',
        targetLink: '/stores#firstcry',
        ctaText: 'Explore Baby Gear',
        badgeText: 'EXCLUSIVE',
        pricingModel: 'CPM',
        budgetOrRate: '₹75 / 1k imp',
        status: 'active',
        expiryDate: '2026-10-31',
        impressions: 41200,
        clicks: 2150,
        submittedBy: 'executive@wouchify.com',
        submissionStatus: 'approved'
      },
      {
        title: 'Croma Electronics Super Clearance - Flat ₹5,000 Off',
        advertiser: 'Croma',
        placement: 'sidebar-300x250',
        imageUrl: '/src/assets/recent-deals/banner_1.png',
        targetLink: '/deals',
        ctaText: 'Claim Tech Offer',
        badgeText: 'FLASH DEAL',
        pricingModel: 'CPC',
        budgetOrRate: '₹10 / click',
        status: 'active',
        expiryDate: '2026-11-15',
        impressions: 32000,
        clicks: 1680,
        submittedBy: 'executive@wouchify.com',
        submissionStatus: 'approved'
      }
    ]);

    const submissions = await Submission.insertMany([
      {
        entityType: 'deal',
        entityId: '4',
        action: 'create',
        title: 'Swiggy Gourmet Feast - Flat 50% Off First 3 Orders',
        store: 'Swiggy',
        category: 'Food & Dining',
        priority: 'High',
        submittedBy: 'executive@wouchify.com',
        submittedByName: 'Rohan Gupta (Deal Executive)',
        status: 'Pending Approval',
        notes: 'Verified against Swiggy active merchant coupon code gourmet50.',
        dataSnapshot: {
          name: 'Swiggy Gourmet Feast - Flat 50% Off First 3 Orders',
          store: 'Swiggy',
          price: '₹250',
          discount: '50% OFF'
        }
      },
      {
        entityType: 'credit_card',
        entityId: 'indusind-bank',
        action: 'create',
        title: 'IndusInd Legend Credit Card Listing',
        store: 'IndusInd Bank',
        category: 'Finance',
        priority: 'Critical',
        submittedBy: 'executive@wouchify.com',
        submittedByName: 'Ananya Sharma (Fintech Ops)',
        status: 'Approved',
        reviewedBy: 'manager@wouchify.com',
        reviewedAt: new Date(),
        notes: 'All lounge & golf benefits verified.',
        dataSnapshot: {
          cardName: 'IndusInd Legend Credit Card',
          bank: 'IndusInd Bank',
          annualFee: '₹999'
        }
      }
    ]);

    const supportTickets = await SupportTicket.insertMany([
      {
        ticketId: 'TICK-801',
        userName: 'Rahul Sharma',
        userEmail: 'rahul.sharma@gmail.com',
        category: 'Cashback Dispute',
        subject: 'Missing Cashback for Amazon Order #402-981273-19',
        priority: 'High',
        status: 'In Progress',
        orderId: 'AMZ-402-981273',
        disputeAmount: '₹350',
        assignedTo: 'Kavita Nair (Support Ops)',
        messages: [
          {
            sender: 'user',
            senderName: 'Rahul Sharma',
            time: '2026-09-14T10:30:00.000Z',
            text: 'I placed an order on Amazon for ₹7,000 using Wouchify affiliate link on 12th Sept, but cashback of ₹350 is not tracking in my wallet.'
          },
          {
            sender: 'support',
            senderName: 'Kavita Nair',
            time: '2026-09-14T11:45:00.000Z',
            text: 'Hello Rahul, we have escalated this transaction to Amazon affiliate network team. Turnaround is 48 hours.'
          }
        ]
      },
      {
        ticketId: 'TICK-802',
        userName: 'Priya Patel',
        userEmail: 'priya.patel@outlook.com',
        category: 'Withdrawal / Payout',
        subject: 'UPI Payout delayed for ₹500 redemption',
        priority: 'Urgent',
        status: 'Open',
        orderId: 'TXN-9020',
        disputeAmount: '₹500',
        assignedTo: 'Rohan Gupta',
        messages: [
          {
            sender: 'user',
            senderName: 'Priya Patel',
            time: '2026-09-15T09:00:00.000Z',
            text: 'I requested UPI payout of ₹500 to priya.patel@okhdfcbank earlier today. Status still shows Pending.'
          }
        ]
      }
    ]);

    const cashbackClaims = await CashbackClaim.insertMany([
      {
        claimId: 'CLM-501',
        userName: 'Rahul Sharma',
        userEmail: 'rahul.sharma@gmail.com',
        store: 'Amazon',
        orderId: 'OD-892173-AMZ',
        orderAmount: '₹4,999',
        cashbackAmount: '₹375',
        status: 'Approved',
        payoutMethod: 'UPI',
        payoutDetails: 'rahul.sharma@okaxis',
        receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
        notes: 'Invoice verified with merchant click timestamp.',
        reviewedBy: 'manager@wouchify.com'
      },
      {
        claimId: 'CLM-502',
        userName: 'Sneha Verma',
        userEmail: 'sneha.v@yahoo.com',
        store: 'Myntra',
        orderId: 'MYN-29182736',
        orderAmount: '₹2,499',
        cashbackAmount: '₹150',
        status: 'Pending',
        payoutMethod: 'Bank Transfer',
        payoutDetails: 'HDFC0001234 - AC 50100492817261',
        receiptUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=80',
        notes: 'Under review by ops team.',
        reviewedBy: ''
      }
    ]);

    const staffMembers = await StaffMember.insertMany([
      {
        name: 'Balaji',
        email: 'balaji@wouchify.com',
        role: 'executive',
        domain: 'Deals & Loot Deals',
        status: 'Online',
        submissionsToday: 12,
        totalSubmissions: 145,
        approvalRate: '98%',
        rejectionsCount: 3,
        avgTurnaround: '10m'
      },
      {
        name: 'Jayanth',
        email: 'jayanth@wouchify.com',
        role: 'executive',
        domain: 'Coupons & Credit Cards',
        status: 'Online',
        submissionsToday: 9,
        totalSubmissions: 120,
        approvalRate: '97%',
        rejectionsCount: 4,
        avgTurnaround: '12m'
      },
      {
        name: 'Operational Manager',
        email: 'ops.manager@wouchify.com',
        role: 'operational_manager',
        domain: 'Approvals & Quality Assurance',
        status: 'Online',
        submissionsToday: 21,
        totalSubmissions: 580,
        approvalRate: '99%',
        rejectionsCount: 7,
        avgTurnaround: '8m'
      },
      {
        name: 'Manager',
        email: 'manager@wouchify.com',
        role: 'manager',
        domain: 'Platform Administration & Team Management',
        status: 'Online',
        submissionsToday: 0,
        totalSubmissions: 940,
        approvalRate: '100%',
        rejectionsCount: 0,
        avgTurnaround: '5m'
      }
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
        transactions: transactions.length,
        creditCards: creditCards.length,
        banners: banners.length,
        advertisements: advertisements.length,
        submissions: submissions.length,
        supportTickets: supportTickets.length,
        cashbackClaims: cashbackClaims.length,
        staffMembers: staffMembers.length
      }
    });
  } catch (err) { next(err); }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
});

// Port & Server Startup
const PORT = process.env.PORT || 5000;

// Connect to MongoDB & ensure base seed exists
connectDB()
  .then(async () => {
    hydrateStoreFromMongo().catch(() => {});
    try {
      const dealCount = await Deal.countDocuments();
      if (dealCount === 0) {
        console.log('Database empty on startup. Triggering auto-seed...');
      }
    } catch (e) {}
  })
  .catch(err => {
    console.warn('Initial MongoDB connection warning (using fallback until connected):', err.message);
  });

// Only start HTTP listener if not running on Vercel serverless
if (!process.env.VERCEL && require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
