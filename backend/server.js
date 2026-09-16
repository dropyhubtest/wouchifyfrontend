const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

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

const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}

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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
      {
        name: 'Xiaomi 138 cm (55 inch) FX Pro QLED Ultra HD 4K Smart Fire TV',
        title: 'Xiaomi 138 cm (55 inch) FX Pro QLED Ultra HD 4K Smart Fire TV',
        store: 'Amazon',
        brand: 'Xiaomi',
        category: 'Electronics',
        subCategory: 'Smart Televisions',
        asinOrSku: 'B0CHX1W1XY',
        type: 'deal',
        price: '₹37,998',
        originalPrice: '₹62,999',
        discount: '40% OFF',
        discountLabel: '40% OFF',
        discountValue: 40,
        bankOffer: 'Flat ₹1,500 Instant Discount on HDFC Credit Cards',
        effectivePrice: '₹36,498',
        code: 'XIAOMI1500',
        cashback: '+ 5% Wouchify Cashback',
        status: 'active',
        submissionStatus: 'approved',
        isBestSelling: true,
        sectionPlacement: 'both',
        rating: '4.5 ★ (14.2k)',
        deliveryInfo: 'Prime 1-Day Delivery',
        warranty: '2 Years Comprehensive Brand Warranty',
        expiry: '2026-11-30T23:59:59.000Z',
        expiresAt: '2026-11-30T23:59:59.000Z',
        postedAt: 'Today, 10:30 AM',
        description: 'Experience cinema-grade entertainment with 4K QLED clarity and vibrant Dolby Vision colours.',
        clicks: 1420
      },
      {
        name: 'Apple iPhone 16 Pro (128 GB) - Natural Titanium',
        title: 'Apple iPhone 16 Pro (128 GB) - Natural Titanium',
        store: 'Amazon',
        brand: 'Apple',
        category: 'Electronics',
        subCategory: 'Flagship Smartphones',
        asinOrSku: 'B0CHX2T7Z9',
        type: 'deal',
        price: '₹1,19,900',
        originalPrice: '₹1,34,900',
        discount: '11% OFF',
        discountLabel: '11% OFF',
        discountValue: 11,
        bankOffer: 'Flat ₹5,000 Instant Cashback on ICICI/SBI Cards',
        effectivePrice: '₹1,14,900',
        code: 'IPHONEPRO',
        cashback: '+ ₹1,200 Super Cashback',
        status: 'active',
        submissionStatus: 'approved',
        isBestSelling: true,
        sectionPlacement: 'both',
        rating: '4.9 ★ (8.7k)',
        deliveryInfo: 'Free Next-Day Delivery',
        warranty: '1 Year Apple Official Warranty',
        expiry: '2026-10-31T23:59:59.000Z',
        expiresAt: '2026-10-31T23:59:59.000Z',
        postedAt: 'Today, 09:15 AM',
        description: 'A18 Pro chip powerhouse with Grade 5 Titanium design and 48MP Fusion Camera system.',
        clicks: 2890
      },
      {
        name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        store: 'Flipkart',
        brand: 'Sony',
        category: 'Electronics',
        subCategory: 'Premium Audio',
        asinOrSku: 'B09XS7JWHH',
        type: 'deal',
        price: '₹26,990',
        originalPrice: '₹34,990',
        discount: '23% OFF',
        discountLabel: '23% OFF',
        discountValue: 23,
        bankOffer: 'Flat ₹2,000 Bank Discount at Checkout',
        effectivePrice: '₹24,990',
        code: 'SONYANC',
        cashback: '+ 4% Wouchify Cashback',
        status: 'active',
        submissionStatus: 'approved',
        isBestSelling: true,
        sectionPlacement: 'both',
        rating: '4.8 ★ (19.4k)',
        deliveryInfo: 'Express Delivery by Tomorrow',
        warranty: '1 Year Sony India Warranty',
        expiry: '2026-10-15T23:59:59.000Z',
        expiresAt: '2026-10-15T23:59:59.000Z',
        postedAt: 'Today, 08:45 AM',
        description: 'Industry-leading noise cancellation powered by two processors and 8 microphones with Auto NC Optimizer.',
        clicks: 1980
      },
      {
        name: 'Milton Rapid 1.8L Stainless Steel Electric Kettle',
        title: 'Milton Rapid 1.8L Stainless Steel Electric Kettle',
        store: 'Amazon',
        brand: 'Milton',
        category: 'Home & Lifestyle',
        subCategory: 'Kitchen Appliances',
        asinOrSku: 'B07N9165PQ',
        type: 'deal',
        price: '₹604',
        originalPrice: '₹1,499',
        discount: '60% OFF',
        discountLabel: '60% OFF',
        discountValue: 60,
        bankOffer: 'Extra ₹50 Coupon on Amazon Pay UPI',
        effectivePrice: '₹554',
        code: 'MILTON50',
        cashback: '+ ₹30 Extra Cashback',
        status: 'active',
        submissionStatus: 'approved',
        isBestSelling: true,
        sectionPlacement: 'both',
        rating: '4.4 ★ (32.1k)',
        deliveryInfo: 'Standard 2-Day Shipping',
        warranty: '1 Year Manufacturer Warranty',
        expiry: '2026-09-30T23:59:59.000Z',
        expiresAt: '2026-09-30T23:59:59.000Z',
        postedAt: 'Yesterday, 04:20 PM',
        description: '1500W rapid boiling kettle with 304 food-grade stainless steel body and auto shut-off protection.',
        clicks: 860
      },
      {
        name: 'Nike Air Max Men Lightweight Running Sneaker Shoes',
        title: 'Nike Air Max Men Lightweight Running Sneaker Shoes',
        store: 'Myntra',
        brand: 'Nike',
        category: 'Fashion & Apparel',
        subCategory: 'Athletic Footwear',
        asinOrSku: 'NK-AM-2026-09',
        type: 'deal',
        price: '₹5,499',
        originalPrice: '₹9,995',
        discount: '45% OFF',
        discountLabel: '45% OFF',
        discountValue: 45,
        bankOffer: '10% Instant Off with Kotak Cards',
        effectivePrice: '₹4,949',
        code: 'NIKEAIR',
        cashback: '+ 6% Myntra Rewards',
        status: 'active',
        submissionStatus: 'approved',
        isBestSelling: true,
        sectionPlacement: 'both',
        rating: '4.7 ★ (6.8k)',
        deliveryInfo: 'Free Delivery & 14-Day Returns',
        warranty: '6 Months Brand Sole Warranty',
        expiry: '2026-10-20T23:59:59.000Z',
        expiresAt: '2026-10-20T23:59:59.000Z',
        postedAt: 'Yesterday, 02:00 PM',
        description: 'Iconic visible Max Air cushioning paired with breathable engineered mesh upper for elite road running comfort.',
        clicks: 1650
      },
      {
        name: 'LEGO Batman 1989 Batmobile Collector Set (3,306 Pcs)',
        title: 'LEGO Batman 1989 Batmobile Collector Set (3,306 Pcs)',
        store: 'Amazon',
        brand: 'LEGO',
        category: 'Toys & Hobbies',
        subCategory: 'Collector Building Sets',
        asinOrSku: 'B07WFMWGB8',
        type: 'deal',
        price: '₹24,999',
        originalPrice: '₹32,999',
        discount: '24% OFF',
        discountLabel: '24% OFF',
        discountValue: 24,
        bankOffer: 'Free LEGO Batman Keychain + ₹1,000 Voucher',
        effectivePrice: '₹23,999',
        code: 'LEGOBAT',
        cashback: '+ ₹500 Instant Cashback',
        status: 'active',
        submissionStatus: 'approved',
        isBestSelling: true,
        sectionPlacement: 'both',
        rating: '4.9 ★ (2.1k)',
        deliveryInfo: 'Priority Express Delivery',
        warranty: 'Genuine LEGO Sealed Box Guarantee',
        expiry: '2026-12-15T23:59:59.000Z',
        expiresAt: '2026-12-15T23:59:59.000Z',
        postedAt: 'Sep 10, 2026',
        description: 'Authentic 1989 classic Batmobile movie replica featuring slide-open cockpit, pop-up machine guns, and display turntable.',
        clicks: 3120
      },
      {
        name: 'Samsung Galaxy Watch 6 Bluetooth (44mm, Graphite)',
        title: 'Samsung Galaxy Watch 6 Bluetooth (44mm, Graphite)',
        store: 'Amazon',
        brand: 'Samsung',
        category: 'Electronics',
        subCategory: 'Wearables & Smartwatches',
        asinOrSku: 'B0CCFMM65Y',
        type: 'deal',
        price: '₹19,999',
        originalPrice: '₹33,999',
        discount: '41% OFF',
        discountLabel: '41% OFF',
        discountValue: 41,
        bankOffer: 'Flat ₹3,000 HDFC Instant Card Discount',
        effectivePrice: '₹16,999',
        code: 'GALAXYWATCH',
        cashback: '+ 5% Wouchify Cashback',
        status: 'active',
        submissionStatus: 'approved',
        isBestSelling: false,
        sectionPlacement: 'favourite',
        rating: '4.6 ★ (11.3k)',
        deliveryInfo: 'Same-Day Prime Dispatch',
        warranty: '1 Year Samsung India Warranty',
        expiry: '2026-10-18T23:59:59.000Z',
        expiresAt: '2026-10-18T23:59:59.000Z',
        postedAt: 'Sep 09, 2026',
        description: 'Advanced sleep coaching, heart rhythm ECG tracking, Sapphire Crystal glass, and vibrant Super AMOLED display.',
        clicks: 1240
      },
      {
        name: 'Fortune Sunlite Refined Sunflower Oil 5L Jar',
        title: 'Fortune Sunlite Refined Sunflower Oil 5L Jar',
        store: 'Big Basket',
        brand: 'Fortune',
        category: 'Grocery',
        subCategory: 'Cooking Staples',
        asinOrSku: 'BB-FS-5L-JAR',
        type: 'deal',
        price: '₹403',
        originalPrice: '₹650',
        discount: '38% OFF',
        discountLabel: '38% OFF',
        discountValue: 38,
        bankOffer: 'Flat ₹50 Cashback on BB Wallet',
        effectivePrice: '₹353',
        code: 'FORTUNE50',
        cashback: '+ ₹20 Wallet Bonus',
        status: 'active',
        submissionStatus: 'approved',
        isBestSelling: false,
        sectionPlacement: 'favourite',
        rating: '4.6 ★ (45.8k)',
        deliveryInfo: 'Delivered in 30 Minutes',
        warranty: '100% Fresh & Authentic Guarantee',
        expiry: '2026-10-10T23:59:59.000Z',
        expiresAt: '2026-10-10T23:59:59.000Z',
        postedAt: 'Sep 08, 2026',
        description: 'Light and enriched with Vitamin A & D for healthy daily family cooking and delicious frying.',
        clicks: 740
      },
      {
        name: 'Samsung 108 cm (43 inch) Crystal 4K Dynamic UHD Smart TV',
        title: 'Samsung 108 cm (43 inch) Crystal 4K Dynamic UHD Smart TV',
        store: 'Flipkart',
        brand: 'Samsung',
        category: 'Electronics',
        subCategory: 'Smart Televisions',
        asinOrSku: 'FK-SAM-43-CRYSTAL',
        type: 'deal',
        price: '₹28,990',
        originalPrice: '₹44,900',
        discount: '35% OFF',
        discountLabel: '35% OFF',
        discountValue: 35,
        bankOffer: '₹2,500 SBI Credit Card Instant Discount',
        effectivePrice: '₹26,490',
        code: 'CRYSTAL4K',
        cashback: '+ 4% Wouchify Cashback',
        status: 'active',
        submissionStatus: 'approved',
        isBestSelling: false,
        sectionPlacement: 'favourite',
        rating: '4.6 ★ (28.7k)',
        deliveryInfo: 'Free Delivery & Tabletop Installation',
        warranty: '1 Year Comprehensive + 1 Year Panel Warranty',
        expiry: '2026-11-25T23:59:59.000Z',
        expiresAt: '2026-11-25T23:59:59.000Z',
        postedAt: 'Sep 07, 2026',
        description: 'Crystal Processor 4K delivers true-to-life colors and PurColor dynamic contrast optimization.',
        clicks: 1110
      },
      {
        name: 'OnePlus 12R 5G (16GB RAM, 256GB Storage, Cool Blue)',
        title: 'OnePlus 12R 5G (16GB RAM, 256GB Storage, Cool Blue)',
        store: 'Amazon',
        brand: 'OnePlus',
        category: 'Electronics',
        subCategory: 'Smartphones',
        asinOrSku: 'B0CQPPY6KC',
        type: 'deal',
        price: '₹39,999',
        originalPrice: '₹45,999',
        discount: '13% OFF',
        discountLabel: '13% OFF',
        discountValue: 13,
        bankOffer: 'Flat ₹2,000 ICICI Bank Discount',
        effectivePrice: '₹37,999',
        code: 'ONEPLUS12R',
        cashback: '+ ₹500 Cashback',
        status: 'active',
        submissionStatus: 'approved',
        isBestSelling: false,
        sectionPlacement: 'favourite',
        rating: '4.7 ★ (16.9k)',
        deliveryInfo: 'Fast Prime Delivery',
        warranty: '1 Year OnePlus India Warranty',
        expiry: '2026-10-31T23:59:59.000Z',
        expiresAt: '2026-10-31T23:59:59.000Z',
        postedAt: 'Sep 06, 2026',
        description: 'Snapdragon 8 Gen 2, 4th Gen LTPO 120Hz ProXDR display, and blazing 100W SUPERVOOC charging.',
        clicks: 2150
      },
      {
        name: 'Puma Smashic Unisex Lifestyle Casual Sneakers',
        title: 'Puma Smashic Unisex Lifestyle Casual Sneakers',
        store: 'Ajio',
        brand: 'Puma',
        category: 'Fashion & Apparel',
        subCategory: 'Casual Shoes',
        asinOrSku: 'AJIO-PUMA-SMASHIC',
        type: 'deal',
        price: '₹1,749',
        originalPrice: '₹3,999',
        discount: '56% OFF',
        discountLabel: '56% OFF',
        discountValue: 56,
        bankOffer: 'Extra ₹250 Off with Code PUMA250',
        effectivePrice: '₹1,499',
        code: 'PUMA250',
        cashback: '+ 8% Ajio Cashback',
        status: 'active',
        submissionStatus: 'approved',
        isBestSelling: false,
        sectionPlacement: 'favourite',
        rating: '4.5 ★ (9.1k)',
        deliveryInfo: 'Free Shipping on ₹999+',
        warranty: '3 Months Manufacturer Warranty',
        expiry: '2026-10-12T23:59:59.000Z',
        expiresAt: '2026-10-12T23:59:59.000Z',
        postedAt: 'Sep 05, 2026',
        description: 'Clean court-inspired silhouette with cushioned SoftFoam+ sockliner for all-day streetwear versatility.',
        clicks: 980
      },
      {
        name: 'Boat Airdopes 141 ANC TWS Earbuds with 42H Playtime',
        title: 'Boat Airdopes 141 ANC TWS Earbuds with 42H Playtime',
        store: 'Amazon',
        brand: 'Boat',
        category: 'Electronics',
        subCategory: 'Audio & Earbuds',
        asinOrSku: 'B0CBV5Q9J1',
        type: 'deal',
        price: '₹1,299',
        originalPrice: '₹4,490',
        discount: '71% OFF',
        discountLabel: '71% OFF',
        discountValue: 71,
        bankOffer: 'Flat 5% Cashback on Amazon Pay Card',
        effectivePrice: '₹1,234',
        code: 'AIRDOPES',
        cashback: '+ ₹50 Instant Cashback',
        status: 'active',
        submissionStatus: 'approved',
        isBestSelling: false,
        sectionPlacement: 'favourite',
        rating: '4.3 ★ (54.3k)',
        deliveryInfo: 'Free 1-Day Delivery',
        warranty: '1 Year boAt Doorstep Warranty',
        expiry: '2026-10-05T23:59:59.000Z',
        expiresAt: '2026-10-05T23:59:59.000Z',
        postedAt: 'Sep 04, 2026',
        description: 'Active Noise Cancellation up to 32dB, ENx quad-mic tech, Beast mode 50ms low latency for gaming.',
        clicks: 1780
      }
    ]);

    const coupons = await Coupon.insertMany([
      { code: 'AMAZON10', store: 'Amazon', discount: '10% off', category: 'Electronics', expiry: 'Sep 18, 2026', minOrder: 'Min Order: 499', description: 'Valid for Amazon users across groceries and daily essentials with zero delivery fee.', submissionStatus: 'approved' },
      { code: 'FLIPKART15', store: 'Flipkart', discount: '15% off', category: 'Electronics', expiry: 'Sep 28, 2026', minOrder: 'Min Order: ₹999', description: 'Instant discount on top smartphone and laptop brands with valid bank cards.', submissionStatus: 'approved' },
      { code: 'MYNTRA20', store: 'Myntra', discount: '20% off', category: 'Fashion', expiry: 'Oct 05, 2026', minOrder: 'Min Order: ₹1,499', description: "Applicable on top brands including Nike, Puma, Levi's, and Roadster.", submissionStatus: 'approved' },
      { code: 'SWIGGY50', store: 'Swiggy', discount: '50% off', category: 'Food', expiry: 'Sep 24, 2026', minOrder: 'Min Order: ₹149', description: 'Instant half-price discount on top-rated restaurants and cafes.', submissionStatus: 'approved' },
      { code: 'ZEPTOFREE', store: 'Zepto', discount: 'Free Delivery', category: 'Grocery', expiry: 'Oct 01, 2026', minOrder: 'Min Order: ₹99', description: 'Instant 10-minute grocery delivery at zero shipping cost.', submissionStatus: 'approved' },
      { code: 'ZOMATOEATS', store: 'Zomato', discount: '60% off', category: 'Food', expiry: 'Sep 21, 2026', minOrder: 'Min Order: ₹199', description: 'Valid on orders from top dining partners and gourmet cloud kitchens.', submissionStatus: 'approved' },
      { code: 'AJIOFIRST', store: 'Ajio', discount: '₹500 off', category: 'Fashion', expiry: 'Oct 06, 2026', minOrder: 'Min Order: ₹1,999', description: 'Valid on premium styles and footwear collections at Ajio Luxe and Trends.', submissionStatus: 'approved' },
      { code: 'NYKAA25', store: 'Nykaa', discount: '25% off', category: 'Beauty', expiry: 'Oct 04, 2026', minOrder: 'Min Order: ₹799', description: 'Applicable on authentic makeup, skincare, and fragrance collections.', submissionStatus: 'approved' },
      { code: 'BBBIGSAVER', store: 'Big Basket', discount: '₹150 off', category: 'Grocery', expiry: 'Oct 03, 2026', minOrder: 'Min Order: ₹999', description: 'Super savings on weekly groceries and dairy deliveries directly to doorstep.', submissionStatus: 'approved' },
      { code: 'JIOMART100', store: 'Jio Mart', discount: '₹100 off', category: 'Grocery', expiry: 'Sep 26, 2026', minOrder: 'Min Order: ₹750', description: 'Valid across branded FMCG, personal hygiene, and pantry essentials.', submissionStatus: 'approved' },
      { code: 'RELTECH', store: 'Reliance Digital', discount: '₹1,000 off', category: 'Electronics', expiry: 'Oct 16, 2026', minOrder: 'Min Order: ₹9,999', description: 'Instant discount voucher at Reliance Digital store and website.', submissionStatus: 'approved' }
    ]);

    const lootDeals = await LootDeal.insertMany([
      {
        id: 'loot-1',
        title: 'Oval Up Down LED Wall Light 2 Watts | Warm White 2 Ray Outdoor Indoor Fixture',
        name: 'Oval Up Down LED Wall Light 2 Watts | Warm White 2 Ray Outdoor Indoor Fixture',
        store: 'Amazon',
        storeName: 'Amazon',
        brand: 'Wipro',
        category: 'Electronics',
        lootType: 'flash',
        dealType: 'flash',
        badge: '⚡ 91% FLASH LOOT',
        status: 'active',
        submissionStatus: 'approved',
        priority: 'Critical',
        code: 'LOOT91',
        link: '/stores#amazon',
        href: '/stores#amazon',
        originalPrice: '₹1,899',
        price: '₹179',
        currentPrice: '₹179',
        discount: '91% OFF',
        discountLabel: '91% OFF',
        discountValue: 91,
        effectivePrice: '₹179',
        cashback: '+ ₹20 Wouchify Cash',
        stockClaimedPercent: 96,
        quantityAlert: 'Hurry! Flash window open — 96% units claimed',
        proofNote: 'Verified flash loot drop on Amazon India.',
        trickSteps: '1. Click "Grab Loot" to go to Amazon product page.\n2. Apply the 91% coupon checkbox if shown.\n3. Complete checkout via UPI for instant dispatch.',
        terms: 'Limited time lightning flash price. 1 unit per customer.',
        asinOrSku: 'B0CHOVAL2W',
        deliveryInfo: 'Prime 1-Day Free Delivery',
        rating: '4.8 ★ (12k)',
        postedAt: 'Today, 11:15 AM',
        expiresAt: '2026-12-31T23:59:59.000Z',
        image: '/src/assets/deals/deal1.png',
        images: ['/src/assets/deals/deal1.png', '/src/assets/deals/deal2.png'],
        telegramAlert: true,
        pushNotification: true,
        isFeatured: true,
        isVerified: true,
        isBestSelling: true,
        sectionPlacement: 'both',
        clicks: 7890
      },
      {
        id: 'loot-2',
        title: 'Exclusive Oval Architectural LED Outdoor Fixture (Warm White Dual Ray)',
        name: 'Exclusive Oval Architectural LED Outdoor Fixture (Warm White Dual Ray)',
        store: 'Amazon',
        storeName: 'Amazon',
        brand: 'Philips',
        category: 'Electronics',
        lootType: 'steal',
        dealType: 'flash',
        badge: '💎 EXCLUSIVE STEAL',
        status: 'active',
        submissionStatus: 'approved',
        priority: 'High',
        code: 'STEAL91',
        link: '/stores#amazon',
        href: '/stores#amazon',
        originalPrice: '₹1,899',
        price: '₹179',
        currentPrice: '₹179',
        discount: '91% OFF',
        discountLabel: '91% OFF',
        discountValue: 91,
        effectivePrice: '₹179',
        cashback: '+ 5% Wouchify Cashback',
        stockClaimedPercent: 89,
        quantityAlert: 'Exclusive pricing locked for Wouchify members',
        proofNote: 'Exclusive partner deal negotiated directly with manufacturer.',
        trickSteps: '1. Click "Grab Loot" to activate exclusive pricing.\n2. Proceed to checkout on Amazon.\n3. Extra ₹20 cashback credited to Wouchify wallet.',
        terms: 'Exclusive to registered Wouchify users.',
        asinOrSku: 'B0CHEXCL2W',
        deliveryInfo: 'Free Delivery with Prime',
        rating: '4.7 ★ (8.5k)',
        postedAt: 'Today, 10:45 AM',
        expiresAt: '2026-12-31T23:59:59.000Z',
        image: '/src/assets/deals/deal2.png',
        images: ['/src/assets/deals/deal2.png', '/src/assets/deals/deal1.png'],
        telegramAlert: true,
        pushNotification: true,
        isFeatured: true,
        isVerified: true,
        isBestSelling: true,
        sectionPlacement: 'both',
        clicks: 5410
      },
      {
        id: 'loot-3',
        title: 'Milton Rapid Electric Kettle 1.8L Stainless Steel Fast Boil',
        name: 'Milton Rapid Electric Kettle 1.8L Stainless Steel Fast Boil',
        store: 'Amazon',
        storeName: 'Amazon',
        brand: 'Milton',
        category: 'Home & Living',
        lootType: 'glitch',
        dealType: 'flash',
        badge: '💥 68% PRICE GLITCH',
        status: 'active',
        submissionStatus: 'approved',
        priority: 'Critical',
        code: 'KETTLE604',
        link: '/stores#amazon',
        href: '/stores#amazon',
        originalPrice: '₹1,899',
        price: '₹604',
        currentPrice: '₹604',
        discount: '68% OFF',
        discountLabel: '68% OFF',
        discountValue: 68,
        effectivePrice: '₹554',
        cashback: '+ ₹50 Wouchify Cash',
        stockClaimedPercent: 92,
        quantityAlert: 'Price error live! May expire anytime',
        proofNote: 'Seller algorithmic error discount confirmed active.',
        trickSteps: '1. Click Grab Loot immediately.\n2. Add to cart & apply coupon checkbox on Amazon.\n3. Complete payment before seller rectifies price.',
        terms: 'Price may change without prior notice.',
        asinOrSku: 'B0CHMILT18',
        deliveryInfo: 'Prime Same-Day / 1-Day Delivery',
        rating: '4.5 ★ (34k)',
        postedAt: 'Today, 09:30 AM',
        expiresAt: '2026-12-31T23:59:59.000Z',
        image: '/src/assets/deals/deal2.png',
        images: ['/src/assets/deals/deal2.png'],
        telegramAlert: true,
        pushNotification: true,
        isFeatured: true,
        isVerified: true,
        isBestSelling: true,
        sectionPlacement: 'both',
        clicks: 9200
      },
      {
        id: 'loot-4',
        title: 'Xiaomi 55" 4K Ultra HD Smart Google TV with Dolby Vision & Atmos',
        name: 'Xiaomi 55" 4K Ultra HD Smart Google TV with Dolby Vision & Atmos',
        store: 'Flipkart',
        storeName: 'Flipkart',
        brand: 'Xiaomi',
        category: 'Electronics',
        lootType: 'flash',
        dealType: 'flash',
        badge: '⚡ 50% MEGA DROP',
        status: 'active',
        submissionStatus: 'approved',
        priority: 'High',
        code: 'TVSAVE',
        link: '/stores#flipkart',
        href: '/stores#flipkart',
        originalPrice: '₹49,999',
        price: '₹24,999',
        currentPrice: '₹24,999',
        discount: '50% OFF',
        discountLabel: '50% OFF',
        discountValue: 50,
        effectivePrice: '₹23,499',
        cashback: '+ ₹1,500 Bank Discount',
        stockClaimedPercent: 85,
        quantityAlert: 'Limited flash sale units remaining',
        proofNote: 'Flipkart Big Billion Days preview drop.',
        trickSteps: '1. Click Grab Loot to open Flipkart app/web.\n2. Use HDFC/SBI card for extra ₹1,500 discount.\n3. Free wall-mount installation included.',
        terms: '1 unit per account. 1 Year comprehensive warranty.',
        asinOrSku: 'FSNXIAOMI55',
        deliveryInfo: 'Free Express Scheduled Delivery',
        rating: '4.6 ★ (62k)',
        postedAt: 'Today, 08:45 AM',
        expiresAt: '2026-12-31T23:59:59.000Z',
        image: '/src/assets/deals/deal1.png',
        images: ['/src/assets/deals/deal1.png'],
        telegramAlert: true,
        pushNotification: true,
        isFeatured: true,
        isVerified: true,
        isBestSelling: true,
        sectionPlacement: 'both',
        clicks: 11400
      },
      {
        id: 'loot-5',
        title: 'Portronics 65W Fast USB-C Braided Cable (2 Metres)',
        name: 'Portronics 65W Fast USB-C Braided Cable (2 Metres)',
        store: 'Amazon',
        storeName: 'Amazon',
        brand: 'Portronics',
        category: 'Electronics',
        lootType: 'under99',
        dealType: 'flash',
        badge: '🏷️ UNDER ₹99 LOOT',
        status: 'active',
        submissionStatus: 'approved',
        priority: 'High',
        code: '',
        link: '/stores#amazon',
        href: '/stores#amazon',
        originalPrice: '₹899',
        price: '₹79',
        currentPrice: '₹79',
        discount: '91% OFF',
        discountLabel: '91% OFF',
        discountValue: 91,
        effectivePrice: '₹79',
        cashback: '+ 8% Wouchify Cashback',
        stockClaimedPercent: 65,
        quantityAlert: 'Fast charging supported on all USB-C devices',
        proofNote: 'Amazon lightning loot deal.',
        trickSteps: '1. Click Grab Loot.\n2. Add to cart & checkout.',
        terms: 'Valid while supplies last.',
        asinOrSku: 'B0PORT01',
        deliveryInfo: 'Prime 1-Day Delivery',
        rating: '4.4 ★ (18.6k)',
        postedAt: 'Yesterday, 06:40 PM',
        expiresAt: '2026-12-31T23:59:59.000Z',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop'],
        telegramAlert: true,
        pushNotification: false,
        isFeatured: false,
        isVerified: true,
        isBestSelling: false,
        sectionPlacement: 'favourite',
        clicks: 1980
      },
      {
        id: 'loot-6',
        title: 'The Man Company Charcoal Grooming Kit (5-Piece Gift Set)',
        name: 'The Man Company Charcoal Grooming Kit (5-Piece Gift Set)',
        store: 'Flipkart',
        storeName: 'Flipkart',
        brand: 'The Man Company',
        category: 'Beauty & Wellness',
        lootType: 'under199',
        dealType: 'flash',
        badge: '🏷️ UNDER ₹199',
        status: 'active',
        submissionStatus: 'approved',
        priority: 'Normal',
        code: 'GROOM100',
        link: '/stores#flipkart',
        href: '/stores#flipkart',
        originalPrice: '₹1,899',
        price: '₹189',
        currentPrice: '₹189',
        discount: '90% OFF',
        discountLabel: '90% OFF',
        discountValue: 90,
        effectivePrice: '₹189',
        cashback: '+ ₹25 Cashback',
        stockClaimedPercent: 91,
        quantityAlert: 'Lightning Deal (91% Claimed)',
        proofNote: 'Flash kit sale verified on Flipkart seller portal.',
        trickSteps: '1. Add 1 set to cart.\n2. Coupon GROOM100 auto-applies.\n3. Complete payment before flash sale expires.',
        terms: 'Valid on single box per customer.',
        asinOrSku: 'FSNTMC9018',
        deliveryInfo: 'Free Delivery above ₹149',
        rating: '4.5 ★ (9.1k)',
        postedAt: 'Yesterday, 02:15 PM',
        expiresAt: '2026-12-31T23:59:59.000Z',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop'],
        telegramAlert: false,
        pushNotification: false,
        isFeatured: false,
        isVerified: true,
        isBestSelling: false,
        sectionPlacement: 'favourite',
        clicks: 1420
      },
      {
        id: 'loot-7',
        title: 'Free Sample Coffee Tasting Box (3 Exotic Flavours 150g)',
        name: 'Free Sample Coffee Tasting Box (3 Exotic Flavours 150g)',
        store: 'Tata CLiQ',
        storeName: 'Tata CLiQ',
        brand: 'Tata Coffee',
        category: 'Food & Dining',
        lootType: 'freebie',
        dealType: 'exclusive',
        badge: '🎁 100% FREE SAMPLE',
        status: 'active',
        submissionStatus: 'approved',
        priority: 'High',
        code: 'FREEBREW',
        link: '/stores#tata-cliq',
        href: '/stores#tata-cliq',
        originalPrice: '₹499',
        price: '₹0',
        currentPrice: '₹0',
        discount: '100% FREE',
        discountLabel: '100% FREE',
        discountValue: 100,
        effectivePrice: '₹0',
        cashback: 'Zero Shipping Fee',
        stockClaimedPercent: 98,
        quantityAlert: 'Almost gone! 98% claimed today',
        proofNote: 'Sponsored official brand promotional sampler.',
        trickSteps: '1. Click Grab Loot.\n2. Enter delivery address.\n3. Apply FREEBREW code at checkout.',
        terms: '1 sample box per household address.',
        asinOrSku: 'TATAFREE01',
        deliveryInfo: 'Dispatched via India Post Express',
        rating: '4.9 ★ (28k)',
        postedAt: 'Today, 07:00 AM',
        expiresAt: '2026-12-31T23:59:59.000Z',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop'],
        telegramAlert: true,
        pushNotification: true,
        isFeatured: false,
        isVerified: true,
        isBestSelling: false,
        sectionPlacement: 'favourite',
        clicks: 4320
      },
      {
        id: 'loot-8',
        title: 'Boat Rockerz 255 Pro+ Wireless Neckband Earphones (40H Playback)',
        name: 'Boat Rockerz 255 Pro+ Wireless Neckband Earphones (40H Playback)',
        store: 'Amazon',
        storeName: 'Amazon',
        brand: 'Boat',
        category: 'Electronics',
        lootType: 'glitch',
        dealType: 'flash',
        badge: '💥 70% LOOT DROP',
        status: 'active',
        submissionStatus: 'approved',
        priority: 'Critical',
        code: 'BOAT999',
        link: '/stores#amazon',
        href: '/stores#amazon',
        originalPrice: '₹3,490',
        price: '₹999',
        currentPrice: '₹999',
        discount: '71% OFF',
        discountLabel: '71% OFF',
        discountValue: 71,
        effectivePrice: '₹949',
        cashback: '+ ₹50 Wouchify Cash',
        stockClaimedPercent: 88,
        quantityAlert: 'Hurry! Limited stock available at this flash price',
        proofNote: 'Official boat flash sale verified on Amazon.',
        trickSteps: '1. Click Grab Loot to open Amazon.\n2. Apply ₹100 instant coupon checkbox.\n3. Extra 5% cashback with Amazon Pay ICICI Card.',
        terms: 'Limited period offer.',
        asinOrSku: 'B08TV2P158',
        deliveryInfo: 'Prime 1-Day Delivery',
        rating: '4.3 ★ (78k)',
        postedAt: 'Today, 06:15 AM',
        expiresAt: '2026-12-31T23:59:59.000Z',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop',
        images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop'],
        telegramAlert: true,
        pushNotification: true,
        isFeatured: true,
        isVerified: true,
        isBestSelling: true,
        sectionPlacement: 'both',
        clicks: 8650
      }
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
        title: 'Samsung Galaxy S24 Ultra Festive Promo',
        advertiser: 'Samsung India',
        placement: 'homepage_top_banner',
        imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
        targetLink: 'https://samsung.com/in/smartphones/galaxy-s24-ultra/?aff=wouchify',
        ctaText: 'Buy Now with ₹10k Bonus',
        badgeText: 'Sponsored Ad',
        pricingModel: 'CPC',
        budgetOrRate: '₹12.50 / click',
        status: 'active',
        expiryDate: '2026-10-31',
        impressions: 89000,
        clicks: 4320,
        submittedBy: 'marketing@wouchify.com',
        submissionStatus: 'approved'
      },
      {
        title: 'Hostinger Cloud Hosting - 78% OFF + Free SSL',
        advertiser: 'Hostinger International',
        placement: 'sidebar_deal_view',
        imageUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&auto=format&fit=crop&q=80',
        targetLink: 'https://hostinger.in/web-hosting?aff=wouchify',
        ctaText: 'Claim 78% Discount',
        badgeText: 'Featured Partner',
        pricingModel: 'Affiliate',
        budgetOrRate: '40% RevShare',
        status: 'active',
        expiryDate: '2026-11-30',
        impressions: 42100,
        clicks: 1980,
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
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://rahuldropyhub_db_user:Wouchify%402026@cluster0.shilkmv.mongodb.net/wouchify?appName=Cluster0';

// Connect to MongoDB asynchronously
if (mongoose.connection.readyState === 0) {
  mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
      console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => {
      console.log('MongoDB connection error - using fallback data.', err);
    });
}

// Only start HTTP listener if not running on Vercel serverless
if (!process.env.VERCEL && require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
