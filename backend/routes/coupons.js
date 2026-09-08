const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Coupon = require('../models/Coupon');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');

router.use(auth);

// Get all coupons
router.get('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(store.getCoupons());
    }
    const coupons = await Coupon.find().sort({ createdAt: -1 });
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
