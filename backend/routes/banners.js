const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Banner = require('../models/Banner');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');

// GET /api/banners - Public read access
router.get('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(store.getBanners(req.query));
    }

    const { targetPage, status, submissionStatus } = req.query;
    let query = {};

    if (targetPage && targetPage !== 'All') query.targetPage = targetPage;
    if (status && status !== 'All') query.status = status;
    if (submissionStatus && submissionStatus !== 'All') query.submissionStatus = submissionStatus;

    const banners = await Banner.find(query).sort({ priority: 1, createdAt: -1 });
    res.json(banners);
  } catch (err) { next(err); }
});

// GET /api/banners/:id
router.get('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const banner = store.getBannerById(req.params.id);
      if (!banner) return res.status(404).json({ message: 'Banner not found' });
      return res.json(banner);
    }
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.json(banner);
  } catch (err) { next(err); }
});

// Protected administrative mutation routes
router.use(auth);

// POST /api/banners - Create
router.post('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const created = store.addBanner(req.body);
      return res.status(201).json(created);
    }
    const banner = new Banner(req.body);
    await banner.save();
    res.status(201).json(banner);
  } catch (err) { next(err); }
});

// PUT /api/banners/:id - Update
router.put('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const updated = store.updateBanner(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Banner not found' });
      return res.json(updated);
    }
    const updated = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Banner not found' });
    res.json(updated);
  } catch (err) { next(err); }
});

// PATCH /api/banners/:id/status - Toggle/Set Status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (mongoose.connection.readyState !== 1) {
      const updated = store.toggleBannerStatus(req.params.id, status);
      if (!updated) return res.status(404).json({ message: 'Banner not found' });
      return res.json(updated);
    }
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    banner.status = status || (banner.status === 'active' ? 'inactive' : 'active');
    await banner.save();
    res.json(banner);
  } catch (err) { next(err); }
});

// DELETE /api/banners/:id - Delete
router.delete('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const ok = store.deleteBanner(req.params.id);
      if (!ok) return res.status(404).json({ message: 'Banner not found' });
      return res.json({ message: 'Banner deleted' });
    }
    const deleted = await Banner.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Banner not found' });
    res.json({ message: 'Banner deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
