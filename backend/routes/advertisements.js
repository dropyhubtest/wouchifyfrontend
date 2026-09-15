const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Advertisement = require('../models/Advertisement');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');

// GET /api/advertisements - Public read access
router.get('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(store.getAdvertisements(req.query));
    }

    const { placement, status, submissionStatus, pricingModel } = req.query;
    let query = {};

    if (placement && placement !== 'All') query.placement = placement;
    if (status && status !== 'All') query.status = status;
    if (submissionStatus && submissionStatus !== 'All') query.submissionStatus = submissionStatus;
    if (pricingModel && pricingModel !== 'All') query.pricingModel = pricingModel;

    const ads = await Advertisement.find(query).sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) { next(err); }
});

// GET /api/advertisements/:id
router.get('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const ad = store.getAdvertisementById(req.params.id);
      if (!ad) return res.status(404).json({ message: 'Advertisement not found' });
      return res.json(ad);
    }
    const ad = await Advertisement.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: 'Advertisement not found' });
    res.json(ad);
  } catch (err) { next(err); }
});

// Protected administrative mutation routes
router.use(auth);

// POST /api/advertisements - Create
router.post('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const created = store.addAdvertisement(req.body);
      return res.status(201).json(created);
    }
    const ad = new Advertisement(req.body);
    await ad.save();
    res.status(201).json(ad);
  } catch (err) { next(err); }
});

// PUT /api/advertisements/:id - Update
router.put('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const updated = store.updateAdvertisement(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Advertisement not found' });
      return res.json(updated);
    }
    const updated = await Advertisement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Advertisement not found' });
    res.json(updated);
  } catch (err) { next(err); }
});

// PATCH /api/advertisements/:id/status - Toggle/Set Status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (mongoose.connection.readyState !== 1) {
      const updated = store.toggleAdvertisementStatus(req.params.id, status);
      if (!updated) return res.status(404).json({ message: 'Advertisement not found' });
      return res.json(updated);
    }
    const ad = await Advertisement.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: 'Advertisement not found' });

    ad.status = status || (ad.status === 'active' ? 'inactive' : 'active');
    await ad.save();
    res.json(ad);
  } catch (err) { next(err); }
});

// DELETE /api/advertisements/:id - Delete
router.delete('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const ok = store.deleteAdvertisement(req.params.id);
      if (!ok) return res.status(404).json({ message: 'Advertisement not found' });
      return res.json({ message: 'Advertisement deleted' });
    }
    const deleted = await Advertisement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Advertisement not found' });
    res.json({ message: 'Advertisement deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
