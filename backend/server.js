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

    const categories = await Category.insertMany(categoryNames.map(name => ({
      name, 
      slug: name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'),
    })));

    const deals = await Deal.insertMany(Array(10).fill().map((_, i) => ({
      name: `Sample Deal ${i + 1}`,
      store: stores[Math.floor(Math.random() * stores.length)].name,
      category: categories[Math.floor(Math.random() * categories.length)].name,
      price: `₹${(Math.random() * 1000).toFixed(0)}`,
      originalPrice: `₹${(Math.random() * 2000 + 1000).toFixed(0)}`,
      discount: `${Math.floor(Math.random() * 50 + 10)}% OFF`,
      status: 'active',
      expiry: 'Sep 30, 2026',
      submissionStatus: 'approved'
    })));

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
      { title: 'Oval Up Down LED Wall Light 2W', storeName: 'Amazon', category: 'Electronics', discount: '91% OFF', currentPrice: '₹179', originalPrice: '₹1,899', dealType: 'flash', status: 'active', href: '/deals', submissionStatus: 'approved' },
      { title: 'Noise ColorFit Pulse Grand Smartwatch', storeName: 'Flipkart', category: 'Electronics', discount: '75% OFF', currentPrice: '₹999', originalPrice: '₹3,999', dealType: 'exclusive', status: 'active', href: '/deals', submissionStatus: 'approved' }
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
        cardName: 'IndusInd Legend Credit Card',
        bank: 'IndusInd Bank',
        network: 'Visa',
        tier: 'Premium',
        imageUrl: '',
        bankLogoUrl: '/src/assets/creditcardpage/indusind_bank.png',
        welcomeOffer: 'Upto 5% Cashback',
        rewardRate: 'Lounge & Golf Perks',
        keyBenefits: ['Upto 5% Cashback on All Spends', 'Complimentary Airport Lounge & Golf access', 'Zero liability on lost card protection'],
        partnerBrands: ['Shopping', 'Travel', 'Dining'],
        affiliateLink: 'https://www.indusind.com/in/en/personal/cards/credit-cards.html',
        annualFee: '₹999',
        joiningFee: '₹999',
        feeWaiver: 'Spend ₹1L/year',
        status: 'featured',
        isFeatured: true,
        isVerified: true,
        applyCount: 4200,
        viewCount: 19800,
        submittedBy: 'executive@wouchify.com',
        submissionStatus: 'approved'
      },
      {
        cardName: 'Amazon Pay ICICI Card',
        bank: 'ICICI Bank',
        network: 'Visa',
        tier: 'Classic',
        imageUrl: '',
        bankLogoUrl: '/src/assets/creditcardpage/ICICI_bank.png',
        welcomeOffer: '5% Unlimited Cashback',
        rewardRate: 'Lifetime Free Card',
        keyBenefits: ['5% Unlimited cashback on Amazon for Prime members', 'Earn Reward Points directly into Amazon Pay balance', 'Lifetime Free Card'],
        partnerBrands: ['Amazon', 'Flipkart', 'Swiggy'],
        affiliateLink: 'https://www.icicibank.com/personal-banking/cards/credit-cards/amazon-pay-credit-card',
        annualFee: 'Lifetime Free',
        joiningFee: '₹0',
        feeWaiver: 'Always Free (Lifetime Free Card)',
        status: 'featured',
        isFeatured: true,
        isVerified: true,
        applyCount: 18500,
        viewCount: 42100,
        submittedBy: 'executive@wouchify.com',
        submissionStatus: 'approved'
      },
      {
        cardName: 'IDFC FIRST Select Card',
        bank: 'IDFC First Bank',
        network: 'Visa',
        tier: 'Premium',
        imageUrl: '',
        bankLogoUrl: '/src/assets/creditcardpage/IDFC_back.png',
        welcomeOffer: '10X Never-Expiring Pts',
        rewardRate: 'Zero Annual Fee',
        keyBenefits: ['10X Never-Expiring Reward Points', 'Zero Annual Fee for lifetime', 'Complimentary domestic lounge & movie discounts'],
        partnerBrands: ['All Round Spends', 'Movie Offers', 'Dining'],
        affiliateLink: 'https://www.idfcfirstbank.com/credit-card',
        annualFee: 'Lifetime Free',
        joiningFee: '₹0',
        feeWaiver: 'Always Free (Lifetime Free Card)',
        status: 'active',
        isFeatured: true,
        isVerified: true,
        applyCount: 8900,
        viewCount: 24500,
        submittedBy: 'executive@wouchify.com',
        submissionStatus: 'approved'
      },
      {
        cardName: 'Tata Neu Infinity HDFC Card',
        bank: 'TataNeu',
        network: 'Rupay',
        tier: 'Premium',
        imageUrl: '',
        bankLogoUrl: '/src/assets/creditcardpage/Tata_neu.svg',
        welcomeOffer: 'Up to 10% NeuCoins',
        rewardRate: '1.5% UPI Cashback',
        keyBenefits: ['Up to 10% NeuCoins on Tata Neu & partner spends', '1.5% UPI Cashback on RuPay credit transactions', 'Domestic airport lounge access'],
        partnerBrands: ['Tata Neu', 'BigBasket', 'Croma'],
        affiliateLink: 'https://www.tataneu.com/credit-card',
        annualFee: '₹1,499',
        joiningFee: '₹1,499',
        feeWaiver: 'Spend ₹3L/year',
        status: 'active',
        isFeatured: false,
        isVerified: true,
        applyCount: 12300,
        viewCount: 31000,
        submittedBy: 'executive@wouchify.com',
        submissionStatus: 'approved'
      },
      {
        cardName: 'Airtel Axis Bank Card',
        bank: 'Axis Bank',
        network: 'Mastercard',
        tier: 'Classic',
        imageUrl: '',
        bankLogoUrl: '/src/assets/creditcardpage/Axis_Bank.png',
        welcomeOffer: '25% Utility Cashback',
        rewardRate: '10% on Food Delivery',
        keyBenefits: ['25% Cashback on Airtel Mobile, DTH & Broadband bills', '10% Cashback on Swiggy, Zomato & BigBasket', 'Flat ₹1,400 Welcome Rewards'],
        partnerBrands: ['Airtel Bills', 'Swiggy', 'Zomato'],
        affiliateLink: 'https://www.axisbank.com/retail/cards/credit-card',
        annualFee: '₹500',
        joiningFee: '₹500',
        feeWaiver: 'Spend ₹2L/year',
        status: 'active',
        isFeatured: false,
        isVerified: true,
        applyCount: 14700,
        viewCount: 36800,
        submittedBy: 'executive@wouchify.com',
        submissionStatus: 'approved'
      },
      {
        cardName: 'Bajaj Finserv RBL SuperCard',
        bank: 'Bajaj Finserv',
        network: 'Mastercard',
        tier: 'Super Premium',
        imageUrl: '',
        bankLogoUrl: '/src/assets/creditcardpage/Bajaj-Finsery.png',
        welcomeOffer: '4-in-1 Super Privileges',
        rewardRate: '5% Downpayment Return',
        keyBenefits: ['4-in-1 SuperCard Privileges with 50-day interest-free cash', '5% Downpayment Return on Bajaj Mall purchases', 'Emergency advance loan conversion'],
        partnerBrands: ['Electronics', 'EMI Spends', 'Groceries'],
        affiliateLink: 'https://www.bajajfinserv.in/supercard',
        annualFee: '₹999',
        joiningFee: '₹999',
        feeWaiver: 'Spend ₹1.5L/year',
        status: 'active',
        isFeatured: false,
        isVerified: true,
        applyCount: 9600,
        viewCount: 28200,
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
