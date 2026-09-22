const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Banner = require('../models/Banner');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');
const { handleEntityCreate, handleEntityUpdate, handleEntityDelete } = require('../middleware/approvalHelper');
const { fastQuery, safeBackground } = require('../utils/mongoFastQuery');

// GET /api/banners - Public read access
router.get('/', async (req, res, next) => {
  const { targetPage, status, submissionStatus, all } = req.query;
  const getFallback = () => {
    let memoryBanners = store.getBanners(req.query);
    if (all !== 'true') {
      memoryBanners = memoryBanners.filter(b => b.submissionStatus !== 'pending_approval' && (b.status || 'active') === 'active');
    }
    return memoryBanners;
  };

  try {
    let query = {};
    if (targetPage && targetPage !== 'All') query.targetPage = targetPage;

    if (all === 'true') {
      if (status && status !== 'All') query.status = status;
      if (submissionStatus && submissionStatus !== 'All') query.submissionStatus = submissionStatus;
    } else {
      query.submissionStatus = submissionStatus || 'approved';
      query.status = status || 'active';
    }

    const banners = await fastQuery(
      () => Banner.find(query).sort({ priority: 1, createdAt: -1 }).lean(),
      getFallback,
      200
    );
    res.json(banners);
  } catch (err) {
    return res.json(getFallback());
  }
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

// POST /api/banners/:id/click - Public click tracking
router.post('/:id/click', async (req, res, next) => {
  try {
    const target = req.params.id;
    const memoryBanner = store.incrementBannerClicks(target);
    if (mongoose.connection.readyState !== 1) {
      if (!memoryBanner) return res.status(404).json({ message: 'Banner not found' });
      return res.json({ success: true, clicks: memoryBanner.clicks });
    }

    const query = mongoose.Types.ObjectId.isValid(target)
      ? { _id: target }
      : { $or: [{ id: target }, { title: new RegExp(`^${target}$`, 'i') }] };

    const banner = await Banner.findOneAndUpdate(
      query,
      { $inc: { clicks: 1 } },
      { new: true }
    );
    if (!banner) {
      if (memoryBanner) return res.json({ success: true, clicks: memoryBanner.clicks });
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.json({ success: true, clicks: banner.clicks });
  } catch (err) { next(err); }
});

// Protected administrative mutation routes
router.use(auth);

// POST /api/banners - Create
router.post('/', async (req, res, next) => {
  try {
    const result = await handleEntityCreate({
      entityType: 'banner',
      title: req.body.title || 'New Banner',
      store: req.body.targetPage || 'home',
      category: 'Marketing',
      priority: req.body.priority || 'Normal',
      data: req.body,
      user: req.user,
      Model: Banner,
      storeAddMethod: store.addBanner
    });
    res.status(201).json(result.entity || result);
  } catch (err) { next(err); }
});

// PUT /api/banners/:id - Update
router.put('/:id', async (req, res, next) => {
  try {
    const result = await handleEntityUpdate({
      id: req.params.id,
      entityType: 'banner',
      title: req.body.title,
      store: req.body.targetPage,
      category: 'Marketing',
      priority: req.body.priority || 'Normal',
      updates: req.body,
      user: req.user,
      Model: Banner,
      storeUpdateMethod: store.updateBanner,
      storeGetMethod: store.getBannerById
    });
    res.json(result.entity || result);
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
    const result = await handleEntityDelete({
      id: req.params.id,
      entityType: 'banner',
      title: req.body?.title,
      store: req.body?.targetPage,
      user: req.user,
      Model: Banner,
      storeDeleteMethod: store.deleteBanner,
      storeGetMethod: store.getBannerById
    });
    res.json(result);
  } catch (err) { next(err); }
});

module.exports = router;
