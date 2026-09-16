const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Coupon = require('../models/Coupon');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');

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
  const { status, public: isPublic, store: storeName, category } = req.query;
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
      if (isPublic === 'true') {
        memoryCoupons = memoryCoupons.filter(c => c.opsManagerApproval !== 'Rejected' && c.managerApproval !== 'Rejected');
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
    if (isPublic === 'true') {
      query.status = { $ne: 'rejected' };
    }

    const coupons = await Coupon.find(query).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) { next(err); }
});

// 2. PROTECTED: Ops / Manager approval queues & mutations
router.use(auth);

// Get pending coupons (Ops Manager queue)
router.get('/pending', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(store.getCoupons().filter(c => c.opsManagerApproval === 'Pending'));
    }
    const coupons = await Coupon.find({ opsManagerApproval: 'Pending' }).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) { next(err); }
});

// Get manager pending coupons (Manager queue)
router.get('/manager-pending', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(store.getCoupons().filter(c => c.opsManagerApproval === 'Approved' && c.managerApproval === 'Pending'));
    }
    const coupons = await Coupon.find({ opsManagerApproval: 'Approved', managerApproval: 'Pending' }).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) { next(err); }
});

// Create coupon
router.post('/', async (req, res, next) => {
  try {
    const payload = {
      id: req.body.id || `coupon-${Date.now()}`,
      ...req.body,
      code: (req.body.code || '').toUpperCase().trim(),
      status: req.body.status || 'active'
    };

    if (mongoose.connection.readyState !== 1) {
      const created = store.addCoupon(payload);
      return res.status(201).json(created);
    }
    const coupon = new Coupon(payload);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) { next(err); }
});

// Update coupon
router.put('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const updated = store.updateCoupon(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Coupon not found' });
      return res.json(updated);
    }

    const query = buildCouponQuery(req.params.id);
    const coupon = await Coupon.findOneAndUpdate(query, req.body, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json(coupon);
  } catch (err) { next(err); }
});

// Approve coupon
router.patch('/:id/approve/:role', async (req, res, next) => {
  const { role } = req.params;
  try {
    if (mongoose.connection.readyState !== 1) {
      const approved = store.approveCoupon(req.params.id, role);
      if (!approved) return res.status(404).json({ message: 'Coupon not found' });
      return res.json(approved);
    }

    const query = buildCouponQuery(req.params.id);
    const couponDoc = await Coupon.findOne(query);
    if (!couponDoc) return res.status(404).json({ message: 'Coupon not found' });
    
    if (role === 'opsManager') couponDoc.opsManagerApproval = 'Approved';
    if (role === 'manager') couponDoc.managerApproval = 'Approved';
    
    if (couponDoc.opsManagerApproval === 'Approved' && couponDoc.managerApproval === 'Approved') {
      couponDoc.status = 'active';
    }
    await couponDoc.save();
    res.json(couponDoc);
  } catch (err) { next(err); }
});

// Reject coupon
router.patch('/:id/reject/:role', async (req, res, next) => {
  const { role } = req.params;
  try {
    if (mongoose.connection.readyState !== 1) {
      const rejected = store.rejectCoupon(req.params.id, role);
      if (!rejected) return res.status(404).json({ message: 'Coupon not found' });
      return res.json(rejected);
    }

    const query = buildCouponQuery(req.params.id);
    const couponDoc = await Coupon.findOne(query);
    if (!couponDoc) return res.status(404).json({ message: 'Coupon not found' });
    
    if (role === 'opsManager') couponDoc.opsManagerApproval = 'Rejected';
    if (role === 'manager') couponDoc.managerApproval = 'Rejected';
    couponDoc.status = 'rejected';
    await couponDoc.save();
    res.json(couponDoc);
  } catch (err) { next(err); }
});

// Delete coupon (Multi-field match)
router.delete('/:id', async (req, res, next) => {
  try {
    const target = req.params.id;
    // Always delete from memory store as well
    store.deleteCoupon(target);

    if (mongoose.connection.readyState !== 1) {
      return res.json({ message: 'Coupon deleted from memory store' });
    }

    const query = buildCouponQuery(target);
    const result = await Coupon.deleteMany(query);
    res.json({ message: 'Coupon deleted successfully', deletedCount: result.deletedCount });
  } catch (err) { next(err); }
});

module.exports = router;
