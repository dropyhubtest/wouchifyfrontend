const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Coupon = require('../models/Coupon');
const Submission = require('../models/Submission');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');
const { handleEntityCreate, handleEntityUpdate, handleEntityDelete } = require('../middleware/approvalHelper');
const { fastQuery, safeBackground } = require('../utils/mongoFastQuery');

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
  const getFallback = () => {
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
    return memoryCoupons;
  };

  try {
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
      query.status = { $nin: ['rejected', 'pending', 'inactive'] };
      query.opsManagerApproval = { $ne: 'Rejected' };
      query.submissionStatus = { $nin: ['pending_approval', 'rejected'] };
    }

    const mongoQueryFn = () => Coupon.find(query).sort({ createdAt: -1 }).lean().then(coupons => {
      if (all !== 'true') {
        const now = Date.now();
        return coupons.filter(c => {
          if (c.publishAt) {
            const pubTime = new Date(c.publishAt).getTime();
            if (!isNaN(pubTime) && pubTime > now + 60000) return false;
          }
          if (c.expiresAt) {
            const expTime = new Date(c.expiresAt).getTime();
            if (!isNaN(expTime) && expTime < now) return false;
          }
          return true;
        });
      }
      return coupons;
    });

    const coupons = await fastQuery(mongoQueryFn, getFallback, 200);
    res.json(coupons);
  } catch (err) {
    return res.json(getFallback());
  }
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

    const isExecutive = req.user?.role === 'executive' || autoApprove === false;
    const submissionStatus = isExecutive ? 'pending_approval' : 'approved';
    const status = isExecutive ? 'pending' : 'active';
    const opsManagerApproval = isExecutive ? 'Pending' : 'Approved';
    const managerApproval = isExecutive ? 'Pending' : 'Approved';

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
        status: isExecutive ? 'pending' : (item.status || 'active'),
        submissionStatus,
        opsManagerApproval,
        managerApproval,
        submittedBy: req.user?.email || 'executive@wouchify.com',
        submittedByName: req.user?.name || 'Content Executive',
        publishAt: publishDate,
        expiresAt: expireDate,
        isExclusive: item.isExclusive === true || item.isExclusive === 'true' || false,
        isVerified: true
      };
    });

    // 1. Always record in in-memory store immediately (<1ms)
    processedItems.forEach(item => {
      const createdCoupon = store.addCoupon(item);
      const entityId = String(createdCoupon._id || createdCoupon.id || item._id || item.id);
      item._id = entityId;
      item.id = entityId;
      if (isExecutive) {
        store.addSubmission({
          entityType: 'coupon',
          entityId,
          action: 'create',
          title: item.title || item.code,
          store: item.store,
          category: item.category,
          priority: item.priority || 'Normal',
          submittedBy: req.user?.email || 'executive@wouchify.com',
          submittedByName: req.user?.name || 'Content Executive',
          status: 'Pending Approval',
          notes: 'Bulk imported coupon submitted for Manager approval.',
          dataSnapshot: { ...item, _id: entityId, id: entityId }
        });
      }
    });

    // 2. Respond immediately to user so UI never hangs
    res.status(201).json({
      success: true,
      staged: isExecutive,
      count: processedItems.length,
      items: processedItems
    });

    // 3. Persist to MongoDB in background
    safeBackground(async () => {
      if (mongoose.connection.readyState === 1) {
        const mongoDocs = processedItems.map(item => {
          const doc = { ...item };
          if (doc._id && !mongoose.Types.ObjectId.isValid(doc._id)) {
            delete doc._id;
          }
          return doc;
        });
        const inserted = await Coupon.insertMany(mongoDocs, { ordered: false });
        if (isExecutive && inserted && inserted.length > 0) {
          const submissions = inserted.map(doc => ({
            entityType: 'coupon',
            entityId: String(doc._id || doc.id),
            action: 'create',
            title: doc.title || doc.code,
            store: doc.store || '',
            category: doc.category || '',
            priority: doc.priority || 'Normal',
            submittedBy: req.user?.email || 'executive@wouchify.com',
            submittedByName: req.user?.name || 'Content Executive',
            status: 'Pending Approval',
            notes: 'Bulk imported coupon submitted for Manager approval.',
            dataSnapshot: doc.toObject ? doc.toObject() : doc
          }));
          await Submission.insertMany(submissions, { ordered: false });
        }
      }
    }, 'Coupons Bulk Mongo Insert');
  } catch (err) { next(err); }
});

module.exports = router;
