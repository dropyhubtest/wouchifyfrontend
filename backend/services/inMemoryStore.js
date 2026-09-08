// In-memory fallback store for development when MongoDB is not connected
let deals = [
  { _id: '1', id: 1, name: 'Apple iPhone 16 Pro (128 GB) - Natural Titanium', store: 'Amazon', category: 'Electronics', price: '₹1,19,900', originalPrice: '₹1,34,900', discount: '11% OFF', status: 'active', expiry: 'Sep 25, 2026', isBestSelling: true, sectionPlacement: 'both' },
  { _id: '2', id: 2, name: 'Nike Air Max Men Sneaker Shoes', store: 'Myntra', category: 'Fashion', price: '₹5,499', originalPrice: '₹9,995', discount: '45% OFF', status: 'active', expiry: 'Sep 18, 2026', isBestSelling: false, sectionPlacement: 'favourite' },
  { _id: '3', id: 3, name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', store: 'Flipkart', category: 'Electronics', price: '₹26,990', originalPrice: '₹34,990', discount: '23% OFF', status: 'active', expiry: 'Sep 22, 2026', isBestSelling: true, sectionPlacement: 'best_selling' },
  { _id: '4', id: 4, name: 'Swiggy Gourmet Feast - Flat 50% Off First 3 Orders', store: 'Swiggy', category: 'Food', price: '₹250', originalPrice: '₹500', discount: '50% OFF', status: 'pending', expiry: 'Sep 12, 2026', isBestSelling: false, sectionPlacement: 'favourite' },
  { _id: '5', id: 5, name: 'Zomato Gold 12-Month Dining Membership', store: 'Zomato', category: 'Food', price: '₹499', originalPrice: '₹999', discount: '50% OFF', status: 'expired', expiry: 'Sep 02, 2026', isBestSelling: false, sectionPlacement: 'favourite' },
  { _id: '6', id: 6, name: 'Nykaa Beauty Mega Sale - MAC & Clinique Combos', store: 'Nykaa', category: 'Beauty', price: '₹1,890', originalPrice: '₹3,500', discount: '46% OFF', status: 'active', expiry: 'Sep 30, 2026', isBestSelling: false, sectionPlacement: 'favourite' },
  { _id: '7', id: 7, name: 'Fresh Organic Produce Combo Pack (5kg)', store: 'Big Basket', category: 'Grocery', price: '₹399', originalPrice: '₹650', discount: '38% OFF', status: 'active', expiry: 'Sep 15, 2026', isBestSelling: false, sectionPlacement: 'favourite' },
  { _id: '8', id: 8, name: '10-Minute Grocery Rush Flash Pass', store: 'Zepto', category: 'Grocery', price: '₹99', originalPrice: '₹299', discount: '67% OFF', status: 'active', expiry: 'Sep 14, 2026', isBestSelling: false, sectionPlacement: 'favourite' },
  { _id: '9', id: 9, name: 'Oval Up Down LED Wall Light 2W [Flash Loot]', store: 'Amazon', category: 'Electronics', price: '₹179', originalPrice: '₹1,899', discount: '91% OFF', status: 'active', expiry: 'Sep 30, 2026', isBestSelling: false, sectionPlacement: 'favourite' },
  { _id: '10', id: 10, name: 'Milton Rapid Electric Kettle 1.8L [Trending]', store: 'Amazon', category: 'Electronics', price: '₹604', originalPrice: '₹1,499', discount: '60% OFF', status: 'active', expiry: 'Sep 28, 2026', isBestSelling: true, sectionPlacement: 'both' }
];

let coupons = [
  { _id: '1', id: 1, code: 'WOUCH50', store: 'Swiggy', discount: '50% OFF', category: 'Food', usageCount: 1420, usageLimit: 2000, status: 'active', expiry: 'Sep 30, 2026' },
  { _id: '2', id: 2, code: 'MYNTRA20', store: 'Myntra', discount: '20% OFF', category: 'Fashion', usageCount: 890, usageLimit: 1500, status: 'active', expiry: 'Sep 28, 2026' },
  { _id: '3', id: 3, code: 'AMZTECH1000', store: 'Amazon', discount: '₹1000 Flat', category: 'Electronics', usageCount: 2310, usageLimit: 2500, status: 'active', expiry: 'Sep 20, 2026' },
  { _id: '4', id: 4, code: 'ZEPTOFREE', store: 'Zepto', discount: 'Free Delivery', category: 'Grocery', usageCount: 3100, usageLimit: 5000, status: 'active', expiry: 'Oct 05, 2026' },
  { _id: '5', id: 5, code: 'ZOMATOEATS', store: 'Zomato', discount: '60% OFF', category: 'Food', usageCount: 4200, usageLimit: 4200, status: 'expired', expiry: 'Sep 01, 2026' },
  { _id: '6', id: 6, code: 'AJIOFIRST', store: 'Ajio', discount: '₹500 OFF', category: 'Fashion', usageCount: 650, usageLimit: 1000, status: 'active', expiry: 'Oct 15, 2026' }
];

let lootDeals = [
  { _id: 'flash-1', id: 'flash-1', title: 'Oval Up Down LED Wall Light 2W', storeName: 'Amazon', category: 'Electronics', discount: '91% OFF', currentPrice: '₹179', originalPrice: '₹1,899', dealType: 'flash', status: 'active', href: '/deals' },
  { _id: 'excl-1', id: 'excl-1', title: 'Noise ColorFit Pulse Grand Smartwatch', storeName: 'Flipkart', category: 'Electronics', discount: '75% OFF', currentPrice: '₹999', originalPrice: '₹3,999', dealType: 'exclusive', status: 'active', href: '/deals' }
];

let stores = [
  { _id: '1', name: 'Ajio', category: 'Fashion', reward: 'Upto 5% rewards', status: 'active' },
  { _id: '2', name: 'Amazon', category: 'Electronics', reward: 'Upto 7.5% rewards', status: 'active' },
  { _id: '3', name: 'Big Basket', category: 'Grocery', reward: 'Upto 4% rewards', status: 'active' },
  { _id: '4', name: 'Flipkart', category: 'Electronics', reward: 'Upto 8% rewards', status: 'active' },
  { _id: '5', name: 'Myntra', category: 'Fashion', reward: 'Upto 6% rewards', status: 'active' },
  { _id: '6', name: 'Nykaa', category: 'Beauty', reward: 'Upto 7% rewards', status: 'active' },
  { _id: '7', name: 'Swiggy', category: 'Food', reward: 'Upto 10% rewards', status: 'active' },
  { _id: '8', name: 'Zepto', category: 'Grocery', reward: 'Upto 5% rewards', status: 'active' },
  { _id: '9', name: 'Zomato', category: 'Food', reward: 'Upto 8% rewards', status: 'active' }
];

let categories = [
  { _id: '1', name: 'Electronics', slug: 'electronics', description: 'Gadgets, phones, audio & computing', color: '#3B82F6', dealsCount: 142 },
  { _id: '2', name: 'Fashion & Apparel', slug: 'fashion', description: 'Clothing, footwear & luxury accessories', color: '#EC4899', dealsCount: 238 },
  { _id: '3', name: 'Food & Dining', slug: 'food-dining', description: 'Delivery apps, cloud kitchens & cafes', color: '#F59E0B', dealsCount: 89 },
  { _id: '4', name: 'Quick Grocery', slug: 'grocery', description: '10-minute essentials & daily staples', color: '#10B981', dealsCount: 64 },
  { _id: '5', name: 'Beauty & Wellness', slug: 'beauty', description: 'Cosmetics, skincare & grooming', color: '#8B5CF6', dealsCount: 112 },
  { _id: '6', name: 'Home & Living', slug: 'home-living', description: 'Furniture, decor & smart appliances', color: '#6366F1', dealsCount: 76 },
  { _id: '7', name: 'Travel & Mobility', slug: 'travel', description: 'Flight bookings, hotels & ride hailing', color: '#06B6D4', dealsCount: 45 }
];

let users = [
  { _id: '1', id: 1, name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', walletBalance: '₹850', totalCashback: '₹4,250', joinedDate: 'Aug 12, 2026', status: 'verified' },
  { _id: '2', id: 2, name: 'Priya Patel', email: 'priya.patel@outlook.com', walletBalance: '₹1,240', totalCashback: '₹6,180', joinedDate: 'Jul 24, 2026', status: 'verified' },
  { _id: '3', id: 3, name: 'Amit Kumar', email: 'amit.k@gmail.com', walletBalance: '₹320', totalCashback: '₹1,900', joinedDate: 'Aug 29, 2026', status: 'active' },
  { _id: '4', id: 4, name: 'Sneha Verma', email: 'sneha.v@yahoo.com', walletBalance: '₹2,450', totalCashback: '₹12,400', joinedDate: 'Jun 10, 2026', status: 'verified' },
  { _id: '5', id: 5, name: 'Vikram Mehta', email: 'v.mehta@gmail.com', walletBalance: '₹150', totalCashback: '₹890', joinedDate: 'Sep 01, 2026', status: 'active' },
  { _id: '6', id: 6, name: 'Karan Malhotra', email: 'karan.m@gmail.com', walletBalance: '₹0', totalCashback: '₹0', joinedDate: 'Sep 06, 2026', status: 'suspended' }
];

let transactions = [
  { _id: 'TXN-9021', id: 'TXN-9021', transactionId: 'TXN-9021', user: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', type: 'Cashback', amount: '₹250', status: 'Completed', time: '5 mins ago' },
  { _id: 'TXN-9020', id: 'TXN-9020', transactionId: 'TXN-9020', user: 'Priya Patel', email: 'priya.patel@outlook.com', type: 'Redemption', amount: '₹500', status: 'Pending', time: '18 mins ago' },
  { _id: 'TXN-9019', id: 'TXN-9019', transactionId: 'TXN-9019', user: 'Amit Kumar', email: 'amit.k@gmail.com', type: 'Cashback', amount: '₹120', status: 'Completed', time: '1 hr ago' },
  { _id: 'TXN-9018', id: 'TXN-9018', transactionId: 'TXN-9018', user: 'Sneha Verma', email: 'sneha.v@yahoo.com', type: 'Redemption', amount: '₹1,200', status: 'Completed', time: '2 hrs ago' },
  { _id: 'TXN-9017', id: 'TXN-9017', transactionId: 'TXN-9017', user: 'Vikram Mehta', email: 'v.mehta@gmail.com', type: 'Referral', amount: '₹150', status: 'Completed', time: '4 hrs ago' },
  { _id: 'TXN-9016', id: 'TXN-9016', transactionId: 'TXN-9016', user: 'Ananya Roy', email: 'ananya.roy@gmail.com', type: 'Cashback', amount: '₹340', status: 'Completed', time: '6 hrs ago' },
  { _id: 'TXN-9015', id: 'TXN-9015', transactionId: 'TXN-9015', user: 'Rohan Deshmukh', email: 'rohan.d@gmail.com', type: 'Redemption', amount: '₹750', status: 'Pending', time: '8 hrs ago' }
];

module.exports = {
  // Deals
  getDeals: (filter = {}) => {
    let result = [...deals];
    if (filter.category && filter.category !== 'All') {
      result = result.filter(d => d.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.status && filter.status !== 'All') {
      result = result.filter(d => d.status.toLowerCase() === filter.status.toLowerCase());
    }
    return result;
  },
  addDeal: (item) => {
    const id = Date.now().toString();
    const created = { _id: id, id: Date.now(), ...item };
    deals.unshift(created);
    return created;
  },
  updateDeal: (id, updates) => {
    const idx = deals.findIndex(d => d._id === id || String(d.id) === String(id));
    if (idx === -1) return null;
    deals[idx] = { ...deals[idx], ...updates };
    return deals[idx];
  },
  deleteDeal: (id) => {
    const idx = deals.findIndex(d => d._id === id || String(d.id) === String(id));
    if (idx === -1) return false;
    deals.splice(idx, 1);
    return true;
  },
  toggleDealStatus: (id) => {
    const deal = deals.find(d => d._id === id || String(d.id) === String(id));
    if (!deal) return null;
    deal.status = deal.status === 'active' ? 'pending' : 'active';
    return deal;
  },

  // Coupons
  getCoupons: () => [...coupons],
  addCoupon: (item) => {
    const id = Date.now().toString();
    const created = { _id: id, id: Date.now(), usageCount: 0, usageLimit: 1000, status: 'active', ...item };
    coupons.unshift(created);
    return created;
  },
  updateCoupon: (id, updates) => {
    const idx = coupons.findIndex(c => c._id === id || String(c.id) === String(id));
    if (idx === -1) return null;
    coupons[idx] = { ...coupons[idx], ...updates };
    return coupons[idx];
  },
  deleteCoupon: (id) => {
    const idx = coupons.findIndex(c => c._id === id || String(c.id) === String(id));
    if (idx === -1) return false;
    coupons.splice(idx, 1);
    return true;
  },

  // Loot Deals
  getLootDeals: (filter = {}) => {
    let result = [...lootDeals];
    if (filter.dealType && filter.dealType !== 'All') {
      result = result.filter(l => l.dealType === filter.dealType);
    }
    return result;
  },
  addLootDeal: (item) => {
    const id = `loot-${Date.now()}`;
    const created = { _id: id, id, status: 'active', ...item };
    lootDeals.unshift(created);
    return created;
  },
  updateLootDeal: (id, updates) => {
    const idx = lootDeals.findIndex(l => l._id === id || l.id === id);
    if (idx === -1) return null;
    lootDeals[idx] = { ...lootDeals[idx], ...updates };
    return lootDeals[idx];
  },
  deleteLootDeal: (id) => {
    const idx = lootDeals.findIndex(l => l._id === id || l.id === id);
    if (idx === -1) return false;
    lootDeals.splice(idx, 1);
    return true;
  },
  toggleLootDealStatus: (id) => {
    const loot = lootDeals.find(l => l._id === id || l.id === id);
    if (!loot) return null;
    loot.status = loot.status === 'active' ? 'inactive' : 'active';
    return loot;
  },

  // Stores
  getStores: () => [...stores],
  addStore: (item) => {
    const id = Date.now().toString();
    const created = { _id: id, status: 'active', ...item };
    stores.unshift(created);
    return created;
  },
  updateStore: (id, updates) => {
    const idx = stores.findIndex(s => s._id === id);
    if (idx === -1) return null;
    stores[idx] = { ...stores[idx], ...updates };
    return stores[idx];
  },
  deleteStore: (id) => {
    const idx = stores.findIndex(s => s._id === id);
    if (idx === -1) return false;
    stores.splice(idx, 1);
    return true;
  },

  // Categories
  getCategories: () => [...categories],
  addCategory: (item) => {
    const id = Date.now().toString();
    const created = { _id: id, dealsCount: 0, ...item };
    categories.push(created);
    return created;
  },
  updateCategory: (id, updates) => {
    const idx = categories.findIndex(c => c._id === id);
    if (idx === -1) return null;
    categories[idx] = { ...categories[idx], ...updates };
    return categories[idx];
  },
  deleteCategory: (id) => {
    const idx = categories.findIndex(c => c._id === id);
    if (idx === -1) return false;
    categories.splice(idx, 1);
    return true;
  },

  // Users
  getUsers: () => [...users],
  addUser: (item) => {
    const id = Date.now().toString();
    const created = { _id: id, id: Date.now(), walletBalance: '₹0', totalCashback: '₹0', joinedDate: 'Today', status: 'active', ...item };
    users.unshift(created);
    return created;
  },
  updateUser: (id, updates) => {
    const idx = users.findIndex(u => u._id === id || String(u.id) === String(id));
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates };
    return users[idx];
  },
  deleteUser: (id) => {
    const idx = users.findIndex(u => u._id === id || String(u.id) === String(id));
    if (idx === -1) return false;
    users.splice(idx, 1);
    return true;
  },
  toggleUserStatus: (id, status) => {
    const user = users.find(u => u._id === id || String(u.id) === String(id));
    if (!user) return null;
    user.status = status || (user.status === 'active' ? 'suspended' : 'active');
    return user;
  },

  // Transactions
  getTransactions: () => [...transactions],
  addTransaction: (item) => {
    const num = Math.floor(Math.random() * 9000 + 1000);
    const txnId = `TXN-${num}`;
    const created = { _id: txnId, id: txnId, transactionId: txnId, status: 'Pending', time: 'Just now', ...item };
    transactions.unshift(created);
    return created;
  },
  approveTransaction: (id) => {
    const txn = transactions.find(t => t._id === id || t.id === id || t.transactionId === id);
    if (!txn) return null;
    txn.status = 'Completed';
    return txn;
  },

  // Seed / Reset
  seed: () => ({
    dealsCount: deals.length,
    couponsCount: coupons.length,
    lootDealsCount: lootDeals.length,
    storesCount: stores.length,
    categoriesCount: categories.length,
    usersCount: users.length,
    transactionsCount: transactions.length
  })
};
