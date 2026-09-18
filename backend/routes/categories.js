const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Deal = require('../models/Deal');
const LootDeal = require('../models/LootDeal');
const Coupon = require('../models/Coupon');
const Store = require('../models/Store');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');
const { handleEntityCreate, handleEntityUpdate, handleEntityDelete } = require('../middleware/approvalHelper');

// Helper: match item slug/name against a record's category/store fields
function isRelated(itemSlug, itemName, record) {
  const slug = (itemSlug || '').toLowerCase();
  const name = (itemName || '').toLowerCase();
  const cat = (record.category || '').toLowerCase();
  const subCat = (record.subCategory || '').toLowerCase();
  const st = (record.store || record.storeName || '').toLowerCase();
  const title = (record.title || record.name || '').toLowerCase();

  if (!cat && !subCat && !st && !title) return false;
  if (cat === slug || cat === name || cat.includes(slug) || (slug.length > 2 && slug.includes(cat))) return true;
  if (subCat === slug || subCat === name || subCat.includes(slug) || (slug.length > 2 && slug.includes(subCat))) return true;
  if (st === slug || st === name || st.includes(slug) || (slug.length > 2 && slug.includes(st))) return true;
  if (title.includes(name) || (slug.length > 3 && title.includes(slug))) return true;
  return false;
}

// GET /api/categories — list all categories with optional filters
router.get('/', async (req, res, next) => {
  const { status, search, pillar, letter, trending, all } = req.query;
  const getFallback = () => {
    let list = store.getCategories();
    if (status && status !== 'all') {
      list = list.filter(c => (c.status || 'active').toLowerCase() === status.toLowerCase());
    }
    if (all !== 'true') {
      list = list.filter(c => c.submissionStatus !== 'pending_approval' && c.opsManagerApproval !== 'Rejected');
    }
    if (pillar && pillar !== 'all') {
      list = list.filter(c => (c.pillar || 'general') === pillar);
    }
    if (letter) {
      list = list.filter(c => (c.letter || c.name.charAt(0)).toUpperCase() === letter.toUpperCase());
    }
    if (trending === 'true') {
      list = list.filter(c => c.isTrending);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
    }
    return list;
  };

  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(getFallback());
    }

    const query = {};
    if (status && status !== 'all') query.status = status;
    if (all !== 'true') {
      query.status = { $nin: ['rejected', 'pending'] };
      query.opsManagerApproval = { $ne: 'Rejected' };
      query.submissionStatus = { $ne: 'pending_approval' };
    }
    if (pillar && pillar !== 'all') query.pillar = pillar;
    if (letter) query.letter = letter.toUpperCase();
    if (trending === 'true') query.isTrending = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let categories = await Category.find(query).sort({ sortOrder: 1, name: 1 });
    if (!categories || categories.length === 0) {
      return res.json(getFallback());
    }
    res.json(categories);
  } catch (err) {
    console.warn('Categories route fallback to in-memory store:', err.message);
    return res.json(getFallback());
  }
});

// GET /api/categories/summary — aggregated pillar breakdown with live counts
router.get('/summary', async (req, res, next) => {
  try {
    let categories, deals, loots, coupons, stores;

    if (mongoose.connection.readyState === 1) {
      [categories, deals, loots, coupons, stores] = await Promise.all([
        Category.find({}).lean(),
        Deal.find({}).lean(),
        LootDeal.find({}).lean(),
        Coupon.find({}).lean(),
        Store.find({}).lean()
      ]);
    } else {
      categories = store.getCategories();
      deals = store.getDeals ? store.getDeals() : [];
      loots = store.getLootDeals ? store.getLootDeals() : [];
      coupons = store.getCoupons ? store.getCoupons() : [];
      stores = store.getStores ? store.getStores() : [];
    }

    // Aggregate by pillar
    const pillarMap = {};
    const pillars = ['subcategories', 'stores', 'brands', 'banks', 'festivals', 'travelling', 'cities-deals', 'general'];
    pillars.forEach(p => {
      pillarMap[p] = { count: 0, activeCount: 0, trendingCount: 0, totalDeals: 0, totalLoots: 0, totalCoupons: 0 };
    });

    categories.forEach(cat => {
      const p = cat.pillar || 'general';
      if (!pillarMap[p]) pillarMap[p] = { count: 0, activeCount: 0, trendingCount: 0, totalDeals: 0, totalLoots: 0, totalCoupons: 0 };
      pillarMap[p].count++;
      if ((cat.status || 'active') === 'active') pillarMap[p].activeCount++;
      if (cat.isTrending) pillarMap[p].trendingCount++;

      // Cross-reference counts
      const matchedDeals = deals.filter(d => isRelated(cat.slug, cat.name, d));
      const matchedLoots = loots.filter(l => isRelated(cat.slug, cat.name, l));
      const matchedCoupons = coupons.filter(c => isRelated(cat.slug, cat.name, c));
      pillarMap[p].totalDeals += matchedDeals.length;
      pillarMap[p].totalLoots += matchedLoots.length;
      pillarMap[p].totalCoupons += matchedCoupons.length;
    });

    res.json({
      totalCategories: categories.length,
      totalDeals: deals.length,
      totalLoots: loots.length,
      totalCoupons: coupons.length,
      totalStores: stores.length,
      pillars: pillarMap
    });
  } catch (err) { next(err); }
});

// GET /api/categories/:id — single category by ID or slug
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Intercept 'summary' to avoid conflict
    if (id === 'summary') return next();

    if (mongoose.connection.readyState !== 1) {
      const cat = store.getCategoryById(id);
      if (!cat) return res.status(404).json({ message: 'Category not found' });
      return res.json(cat);
    }

    let cat = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      cat = await Category.findById(id);
    }
    if (!cat) {
      cat = await Category.findOne({ slug: id });
    }
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    res.json(cat);
  } catch (err) { next(err); }
});

// GET /api/categories/:id/related — all deals, loot, coupons, stores linked to a category
router.get('/:id/related', async (req, res, next) => {
  try {
    const { id } = req.params;
    let cat = null;

    if (mongoose.connection.readyState === 1) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        cat = await Category.findById(id).lean();
      }
      if (!cat) {
        cat = await Category.findOne({ slug: id }).lean();
      }
    } else {
      cat = store.getCategoryById(id);
    }

    if (!cat) return res.status(404).json({ message: 'Category not found' });

    let deals, loots, coupons, stores;
    if (mongoose.connection.readyState === 1) {
      [deals, loots, coupons, stores] = await Promise.all([
        Deal.find({}).lean(),
        LootDeal.find({}).lean(),
        Coupon.find({}).lean(),
        Store.find({}).lean()
      ]);
    } else {
      deals = store.getDeals ? store.getDeals() : [];
      loots = store.getLootDeals ? store.getLootDeals() : [];
      coupons = store.getCoupons ? store.getCoupons() : [];
      stores = store.getStores ? store.getStores() : [];
    }

    const relatedDeals = deals.filter(d => isRelated(cat.slug, cat.name, d));
    const relatedLoots = loots.filter(l => isRelated(cat.slug, cat.name, l));
    const relatedCoupons = coupons.filter(c => isRelated(cat.slug, cat.name, c));
    const relatedStores = stores.filter(s => isRelated(cat.slug, cat.name, s));

    res.json({
      category: cat,
      deals: relatedDeals,
      lootDeals: relatedLoots,
      coupons: relatedCoupons,
      stores: relatedStores,
      counts: {
        deals: relatedDeals.length,
        lootDeals: relatedLoots.length,
        coupons: relatedCoupons.length,
        stores: relatedStores.length
      }
    });
  } catch (err) { next(err); }
});

// Protected mutation routes
router.use(auth);

// Create category
router.post('/', async (req, res, next) => {
  try {
    const categoryData = {
      ...req.body,
      count: req.body.count || req.body.dealsCount || 0,
      dealsCount: req.body.dealsCount || req.body.count || 0,
      letter: (req.body.letter || (req.body.name || '').charAt(0)).toUpperCase()
    };

    const result = await handleEntityCreate({
      entityType: 'category',
      title: categoryData.name || 'New Category',
      category: categoryData.name,
      priority: req.body.priority || 'Normal',
      data: categoryData,
      user: req.user,
      Model: Category,
      storeAddMethod: store.addCategory
    });
    res.status(201).json(result.entity || result);
  } catch (err) { next(err); }
});

// Update category
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const categoryData = {
      ...req.body,
      letter: req.body.name ? (req.body.letter || req.body.name.charAt(0)).toUpperCase() : req.body.letter
    };

    const result = await handleEntityUpdate({
      id,
      entityType: 'category',
      title: categoryData.name,
      category: categoryData.name,
      priority: req.body.priority || 'Normal',
      updates: categoryData,
      user: req.user,
      Model: Category,
      storeUpdateMethod: store.updateCategory,
      storeGetMethod: store.getCategoryById
    });
    res.json(result.entity || result);
  } catch (err) { next(err); }
});

// Toggle category status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      const cat = store.getCategoryById(id);
      if (!cat) return res.status(404).json({ message: 'Category not found' });
      const newStatus = cat.status === 'active' ? 'inactive' : 'active';
      const updated = store.updateCategory(id, { status: newStatus });
      return res.json(updated);
    }

    let cat = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      cat = await Category.findById(id);
    }
    if (!cat) {
      cat = await Category.findOne({ slug: id });
    }
    if (!cat) return res.status(404).json({ message: 'Category not found' });

    cat.status = cat.status === 'active' ? 'inactive' : 'active';
    await cat.save();
    res.json(cat);
  } catch (err) { next(err); }
});

// Delete category
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await handleEntityDelete({
      id,
      entityType: 'category',
      title: req.body?.name,
      category: req.body?.name,
      user: req.user,
      Model: Category,
      storeDeleteMethod: store.deleteCategory,
      storeGetMethod: store.getCategoryById
    });
    res.json(result);
  } catch (err) { next(err); }
});

module.exports = router;
