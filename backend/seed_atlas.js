const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Store = require('./models/Store');
const Coupon = require('./models/Coupon');
const Deal = require('./models/Deal');
const LootDeal = require('./models/LootDeal');
const CreditCard = require('./models/CreditCard');
const Category = require('./models/Category');
const User = require('./models/User');
const StaffMember = require('./models/StaffMember');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://rahuldropyhub_db_user:Wouchify%402026@cluster0.shilkmv.mongodb.net/wouchify?appName=Cluster0';

const MASTER_STORES = [
  { name: 'Amazon', slug: 'amazon', category: 'Fashion', reward: 'Upto 6.8% rewards', description: '5000+ Live deals & Coupons', cardBg: '#E8F5FF', badgeBg: '#B3DCFA', clicks: 24850, totalDeals: 45, status: 'active', isFeatured: true, opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { name: 'Flipkart', slug: 'flipkart', category: 'Fashion', reward: 'Upto 7.5% rewards', description: '3500+ Live deals & Cashback', cardBg: '#FFF7E6', badgeBg: '#FFD591', clicks: 21450, totalDeals: 38, status: 'active', isFeatured: true, opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { name: 'Myntra', slug: 'myntra', category: 'Fashion', reward: 'Upto 8.0% rewards', description: 'Fashion & Lifestyle deals', cardBg: '#FFF0F6', badgeBg: '#FFADD2', clicks: 18320, totalDeals: 29, status: 'active', isFeatured: true, opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { name: 'Swiggy', slug: 'swiggy', category: 'Food & Dining', reward: 'Upto 10% rewards', description: 'Food delivery & Gourmet deals', cardBg: '#FFF2E8', badgeBg: '#FFBB96', clicks: 19800, totalDeals: 24, status: 'active', isFeatured: true, opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { name: 'Zomato', slug: 'zomato', category: 'Food & Dining', reward: 'Upto 12% rewards', description: 'Dining out & Food offers', cardBg: '#FFF1F0', badgeBg: '#FFA39E', clicks: 17640, totalDeals: 26, status: 'active', isFeatured: true, opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { name: 'Ajio', slug: 'ajio', category: 'Fashion', reward: 'Upto 9.0% rewards', description: 'Trends & Luxury clothing', cardBg: '#F0F5FF', badgeBg: '#ADC6FF', clicks: 15200, totalDeals: 22, status: 'active', isFeatured: true, opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { name: 'Nykaa', slug: 'nykaa', category: 'Beauty & Personal Care', reward: 'Upto 8.5% rewards', description: 'Beauty & Cosmetics deals', cardBg: '#FFF0F6', badgeBg: '#FFADD2', clicks: 13900, totalDeals: 19, status: 'active', isFeatured: false, opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { name: 'Zepto', slug: 'zepto', category: 'Grocery', reward: 'Upto 5% rewards', description: '10-Minute Grocery Delivery', cardBg: '#F6FFED', badgeBg: '#B7EB8F', clicks: 14200, totalDeals: 16, status: 'active', isFeatured: false, opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { name: 'Big Basket', slug: 'bigbasket', category: 'Grocery', reward: 'Upto 6% rewards', description: 'Online Supermarket & Pantry', cardBg: '#E6FFFB', badgeBg: '#87E8DE', clicks: 12800, totalDeals: 18, status: 'active', isFeatured: false, opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { name: 'Reliance Digital', slug: 'reliance-digital', category: 'Electronics', reward: 'Upto 4.5% rewards', description: 'Gadgets & Home Appliances', cardBg: '#F0F5FF', badgeBg: '#ADC6FF', clicks: 11400, totalDeals: 15, status: 'active', isFeatured: false, opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { name: 'Tata CLiQ', slug: 'tata-cliq', category: 'Electronics', reward: 'Upto 5.5% rewards', description: 'Electronics & Luxury Fashion', cardBg: '#FFF0F6', badgeBg: '#FFADD2', clicks: 9800, totalDeals: 14, status: 'active', isFeatured: false, opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { name: 'Meesho', slug: 'meesho', category: 'Fashion', reward: 'Upto 7.0% rewards', description: 'Lowest Prices & Wholesale Deals', cardBg: '#FFF7E6', badgeBg: '#FFD591', clicks: 16300, totalDeals: 20, status: 'active', isFeatured: false, opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { name: 'JioMart', slug: 'jiomart', category: 'Grocery', reward: 'Upto 5.0% rewards', description: 'Groceries, Mobiles & Fashion', cardBg: '#E6FFFB', badgeBg: '#87E8DE', clicks: 10500, totalDeals: 14, status: 'active', isFeatured: false, opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { name: 'FirstCry', slug: 'firstcry', category: 'Fashion', reward: 'Upto 8.0% rewards', description: 'Baby & Kids Shopping', cardBg: '#F6FFED', badgeBg: '#B7EB8F', clicks: 9100, totalDeals: 12, status: 'active', isFeatured: false, opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { name: 'Pepperfry', slug: 'pepperfry', category: 'Home & Living', reward: 'Upto 6.5% rewards', description: 'Furniture & Home Decor', cardBg: '#FFF2E8', badgeBg: '#FFBB96', clicks: 8400, totalDeals: 11, status: 'active', isFeatured: false, opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { name: 'Snapdeal', slug: 'snapdeal', category: 'Fashion', reward: 'Upto 5.0% rewards', description: 'Daily Need Products & Offers', cardBg: '#FFF1F0', badgeBg: '#FFA39E', clicks: 7900, totalDeals: 10, status: 'active', isFeatured: false, opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { name: 'Zivame', slug: 'zivame', category: 'Fashion', reward: 'Upto 9.0% rewards', description: 'Lingerie & Activewear', cardBg: '#FFF0F6', badgeBg: '#FFADD2', clicks: 7400, totalDeals: 9, status: 'active', isFeatured: false, opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { name: 'Udaan', slug: 'udaan', category: 'Electronics', reward: 'Upto 4.0% rewards', description: 'B2B Trade & Electronics', cardBg: '#F0F5FF', badgeBg: '#ADC6FF', clicks: 6200, totalDeals: 8, status: 'active', isFeatured: false, opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { name: 'Voonik', slug: 'voonik', category: 'Fashion', reward: 'Upto 6.0% rewards', description: 'Women Fashion & Accessories', cardBg: '#FFF0F6', badgeBg: '#FFADD2', clicks: 5400, totalDeals: 7, status: 'active', isFeatured: false, opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { name: 'Yepme', slug: 'yepme', category: 'Fashion', reward: 'Upto 5.0% rewards', description: 'Budget Apparel & Footwear', cardBg: '#E8F5FF', badgeBg: '#B3DCFA', clicks: 4900, totalDeals: 6, status: 'active', isFeatured: false, opsManagerApproval: 'Approved', managerApproval: 'Approved' }
];

const MASTER_COUPONS = [
  { code: 'AMAZON10', store: 'Amazon', discount: '10% off', category: 'Electronics', expiry: 'Sep 18, 2026', minOrder: 'Min Order: 499', description: 'Valid for Amazon users across groceries and daily essentials with zero delivery fee.', status: 'active', opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { code: 'FLIPKART15', store: 'Flipkart', discount: '15% off', category: 'Electronics', expiry: 'Sep 28, 2026', minOrder: 'Min Order: ₹999', description: 'Instant discount on top smartphone and laptop brands with valid bank cards.', status: 'active', opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { code: 'MYNTRA20', store: 'Myntra', discount: '20% off', category: 'Fashion', expiry: 'Oct 05, 2026', minOrder: 'Min Order: ₹1,499', description: "Applicable on top brands including Nike, Puma, Levi's, and Roadster.", status: 'active', opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { code: 'SWIGGY50', store: 'Swiggy', discount: '50% off', category: 'Food & Dining', expiry: 'Sep 24, 2026', minOrder: 'Min Order: ₹149', description: 'Instant half-price discount on top-rated restaurants and cafes.', status: 'active', opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { code: 'ZEPTOFREE', store: 'Zepto', discount: 'Free Delivery', category: 'Grocery', expiry: 'Oct 01, 2026', minOrder: 'Min Order: ₹99', description: 'Instant 10-minute grocery delivery at zero shipping cost.', status: 'active', opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { code: 'ZOMATOEATS', store: 'Zomato', discount: '60% off', category: 'Food & Dining', expiry: 'Sep 21, 2026', minOrder: 'Min Order: ₹199', description: 'Valid on orders from top dining partners and gourmet cloud kitchens.', status: 'active', opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { code: 'AJIOFIRST', store: 'Ajio', discount: '₹500 off', category: 'Fashion', expiry: 'Oct 06, 2026', minOrder: 'Min Order: ₹1,999', description: 'Valid on premium styles and footwear collections at Ajio Luxe and Trends.', status: 'active', opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { code: 'NYKAA25', store: 'Nykaa', discount: '25% off', category: 'Beauty & Personal Care', expiry: 'Oct 04, 2026', minOrder: 'Min Order: ₹799', description: 'Applicable on authentic makeup, skincare, and fragrance collections.', status: 'active', opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { code: 'BBBIGSAVER', store: 'Big Basket', discount: '₹150 off', category: 'Grocery', expiry: 'Oct 03, 2026', minOrder: 'Min Order: ₹999', description: 'Super savings on weekly groceries and dairy deliveries directly to doorstep.', status: 'active', opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { code: 'JIOMART100', store: 'JioMart', discount: '₹100 off', category: 'Grocery', expiry: 'Sep 26, 2026', minOrder: 'Min Order: ₹750', description: 'Valid across branded FMCG, personal hygiene, and pantry essentials.', status: 'active', opsManagerApproval: 'Approved', managerApproval: 'Approved' },
  { code: 'RELTECH', store: 'Reliance Digital', discount: '₹1,000 off', category: 'Electronics', expiry: 'Oct 16, 2026', minOrder: 'Min Order: ₹9,999', description: 'Instant discount voucher at Reliance Digital store and website.', status: 'active', opsManagerApproval: 'Approved', managerApproval: 'Approved' }
];

async function seedAtlas() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB Atlas successfully!');

    console.log('Clearing existing collection records...');
    await Promise.all([
      Store.deleteMany({}),
      Coupon.deleteMany({})
    ]);

    console.log(`Inserting ${MASTER_STORES.length} stores into MongoDB Atlas...`);
    const insertedStores = await Store.insertMany(MASTER_STORES);
    console.log(`Successfully seeded ${insertedStores.length} stores into MongoDB Atlas!`);

    console.log(`Inserting ${MASTER_COUPONS.length} coupons into MongoDB Atlas...`);
    const insertedCoupons = await Coupon.insertMany(MASTER_COUPONS);
    console.log(`Successfully seeded ${insertedCoupons.length} coupons into MongoDB Atlas!`);

    console.log('MongoDB Atlas seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding MongoDB Atlas:', err);
    process.exit(1);
  }
}

seedAtlas();
