const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Coupon = require('../models/Coupon');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');
const { handleEntityCreate, handleEntityUpdate, handleEntityDelete } = require('../middleware/approvalHelper');

// Helper to build flexible query matching ObjectId, string id, or coupon code
function buildCouponQuery(identifier) {
  const target = String(identifier).trim();
  const conditions = [
    { id: target },
    { code: target.toUpperCase() },
    { code: new RegExp(`^${target}$`, 'i') }
  ];
  if (mongoose.Types.ObjectId.isValid(target)) {
    conditions.push({ _id: target });
  }
  return { $or: conditions };
}

// 1. PUBLIC: Get all active/filtered coupons (No auth required for customer pages & public storefront)
router.get('/', async (req, res, next) => {
  const { status, public: isPublic, store: storeName, category, all } = req.query;
  try {
    if (mongoose.connection.readyState !== 1) {
      let memoryCoupons = store.getCoupons();
      if (status && status !== 'all') {
        memoryCoupons = memoryCoupons.filter(c => (c.status || 'active').toLowerCase() === status.toLowerCase());
      }
      if (storeName && storeName !== 'All') {
        memoryCoupons = memoryCoupons.filter(c => c.store && c.store.toLowerCase() === storeName.toLowerCase());
      }
      if (category && category !== 'All') {
        memoryCoupons = memoryCoupons.filter(c => c.category && c.category.toLowerCase() === category.toLowerCase());
      }
      if (all !== 'true') {
        memoryCoupons = memoryCoupons.filter(c => c.submissionStatus !== 'pending_approval' && c.opsManagerApproval !== 'Rejected');
      }
      return res.json(memoryCoupons);
    }

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (storeName && storeName !== 'All') {
      query.store = new RegExp(`^${storeName}$`, 'i');
    }
    if (category && category !== 'All') {
      query.category = new RegExp(`^${category}$`, 'i');
    }
    if (all !== 'true') {
      query.status = { $ne: 'rejected', $ne: 'pending' };
      query.opsManagerApproval = { $ne: 'Rejected' };
      query.submissionStatus = { $ne: 'pending_approval' };
      query.publishAt = { $lte: new Date() };
      query.$or = [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gte: new Date() } }
      ];
    }

    const coupons = await Coupon.find(query).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) { next(err); }
});

// PUBLIC: Click & usage counter
router.post('/:id/click', async (req, res, next) => {
  try {
    const memoryCoupon = store.incrementCouponClicks(req.params.id);
    if (mongoose.connection.readyState !== 1) {
      if (!memoryCoupon) return res.status(404).json({ message: 'Coupon not found' });
      return res.json({ success: true, clicks: memoryCoupon.clicks, usageCount: memoryCoupon.usageCount });
    }

    const query = buildCouponQuery(req.params.id);
    const coupon = await Coupon.findOneAndUpdate(
      query,
      { $inc: { clicks: 1, usageCount: 1 } },
      { new: true }
    );
    if (!coupon) {
      if (memoryCoupon) return res.json({ success: true, clicks: memoryCoupon.clicks, usageCount: memoryCoupon.usageCount });
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json({ success: true, clicks: coupon.clicks || coupon.usageCount || 1, usageCount: coupon.usageCount || 1 });
  } catch (err) { next(err); }
});

// 2. PROTECTED: Ops / Manager approval queues & mutations
router.use(auth);

// Get pending coupons (Ops Manager queue)
router.get('/pending', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(store.getCoupons().filter(c => c.opsManagerApproval === 'Pending' || c.submissionStatus === 'pending_approval'));
    }
    const coupons = await Coupon.find({ $or: [{ opsManagerApproval: 'Pending' }, { submissionStatus: 'pending_approval' }] }).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) { next(err); }
});

// Create coupon
router.post('/', async (req, res, next) => {
  try {
    const result = await handleEntityCreate({
      entityType: 'coupon',
      title: req.body.title || req.body.code || 'New Coupon',
      store: req.body.store,
      category: req.body.category,
      priority: req.body.priority || 'Normal',
      data: {
        ...req.body,
        code: (req.body.code || '').toUpperCase().trim(),
      },
      user: req.user,
      Model: Coupon,
      storeAddMethod: store.addCoupon
    });
    res.status(201).json(result.entity || result);
  } catch (err) { next(err); }
});

// Update coupon
router.put('/:id', async (req, res, next) => {
  try {
    const result = await handleEntityUpdate({
      id: req.params.id,
      entityType: 'coupon',
      title: req.body.title || req.body.code,
      store: req.body.store,
      category: req.body.category,
      priority: req.body.priority || 'Normal',
      updates: {
        ...req.body,
        code: req.body.code ? req.body.code.toUpperCase().trim() : undefined
      },
      user: req.user,
      Model: Coupon,
      storeUpdateMethod: store.updateCoupon,
      storeGetMethod: store.getCouponById
    });
    res.json(result.entity || result);
  } catch (err) { next(err); }
});

// Delete coupon
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await handleEntityDelete({
      id: req.params.id,
      entityType: 'coupon',
      title: req.body?.code || req.body?.title,
      store: req.body?.store,
      user: req.user,
      Model: Coupon,
      storeDeleteMethod: store.deleteCoupon,
      storeGetMethod: store.getCouponById
    });
    res.json(result);
  } catch (err) { next(err); }
});

// Bulk Create Coupons (Excel / CSV batch insert with scheduled publishing)
router.post('/bulk', async (req, res, next) => {
  try {
    const { items, autoApprove } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items array is required and cannot be empty' });
    }

    const processedItems = items.map((item, idx) => {
      const now = new Date();
      let publishDate = item.publishAt ? new Date(item.publishAt) : now;
      if (isNaN(publishDate.getTime())) publishDate = now;

      let expireDate = item.expiresAt ? new Date(item.expiresAt) : null;
      if (expireDate && isNaN(expireDate.getTime())) expireDate = null;

      const codeStr = (item.code || `PROMO${idx + 1}`).toUpperCase().trim();

      return {
        ...item,
        code: codeStr,
        title: item.title || `${item.discount || '20% OFF'} at ${item.store || 'Store'}`,
        description: item.description || `Use coupon code ${codeStr} to get ${item.discount || 'special discount'} on your order.`,
        store: item.store || 'Amazon',
        category: item.category || 'Electronics',
        discount: item.discount || '20% OFF',
        discountValue: Number(item.discountValue) || 20,
        usageLimit: Number(item.usageLimit) || 5000,
        totalUses: Number(item.totalUses || item.usageLimit) || 5000,
        usageCount: Number(item.usageCount) || 0,
        minOrder: item.minOrder || '',
        maxDiscount: item.maxDiscount || '',
        affiliateLink: item.affiliateLink || item.link || '',
        status: item.status || 'active',
        submissionStatus: (autoApprove !== false) ? 'approved' : 'pending',
        opsManagerApproval: (autoApprove !== false) ? 'Approved' : 'Pending',
        managerApproval: (autoApprove !== false) ? 'Approved' : 'Pending',
        publishAt: publishDate,
        expiresAt: expireDate,
        isExclusive: item.isExclusive === true || item.isExclusive === 'true' || false,
        isVerified: true
      };
    });

    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({
        success: true,
        count: processedItems.length,
        items: processedItems
      });
    }

    const inserted = await Coupon.insertMany(processedItems, { ordered: false });
    res.status(201).json({
      success: true,
      count: inserted.length,
      items: inserted
    });
  } catch (err) { next(err); }
});

module.exports = router;
