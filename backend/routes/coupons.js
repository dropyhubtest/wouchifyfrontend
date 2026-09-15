const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Coupon = require('../models/Coupon');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');

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

// Get all coupons (with optional status filter)
router.get('/', async (req, res, next) => {
  const { status, public: isPublic } = req.query;
  try {
    if (mongoose.connection.readyState !== 1) {
      let memoryCoupons = store.getCoupons();
      if (status) {
        memoryCoupons = memoryCoupons.filter(c => c.status === status);
      }
      if (isPublic === 'true') {
        memoryCoupons = memoryCoupons.filter(c => c.opsManagerApproval === 'Approved' && c.managerApproval === 'Approved');
      }
      return res.json(memoryCoupons);
    }
    const query = status ? { status } : {};
    if (isPublic === 'true') {
      query.opsManagerApproval = 'Approved';
      query.managerApproval = 'Approved';
    }
    const coupons = await Coupon.find(query).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) { next(err); }
});

// Create coupon
router.post('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const created = store.addCoupon(req.body);
      return res.status(201).json(created);
    }
    const coupon = new Coupon(req.body);
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
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
    const couponDoc = await Coupon.findById(req.params.id);
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
    const couponDoc = await Coupon.findById(req.params.id);
    if (!couponDoc) return res.status(404).json({ message: 'Coupon not found' });
    
    if (role === 'opsManager') couponDoc.opsManagerApproval = 'Rejected';
    if (role === 'manager') couponDoc.managerApproval = 'Rejected';
    
    couponDoc.status = 'rejected';
    
    await couponDoc.save();
    res.json(couponDoc);
  } catch (err) { next(err); }
});

// Delete coupon
router.delete('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const ok = store.deleteCoupon(req.params.id);
      if (!ok) return res.status(404).json({ message: 'Coupon not found' });
      return res.json({ message: 'Coupon deleted' });
    }
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ message: 'Coupon deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
