const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Advertisement = require('../models/Advertisement');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');
const { handleEntityCreate, handleEntityUpdate, handleEntityDelete } = require('../middleware/approvalHelper');

// GET /api/advertisements - Public read access
router.get('/', async (req, res, next) => {
  try {
    const { placement, status, submissionStatus, pricingModel, all } = req.query;
    if (mongoose.connection.readyState !== 1) {
      let memoryAds = store.getAdvertisements(req.query);
      if (all !== 'true') {
        memoryAds = memoryAds.filter(a => a.submissionStatus !== 'pending_approval' && (a.status || 'active') === 'active');
      }
      return res.json(memoryAds);
    }

    let query = {};
    if (placement && placement !== 'All') query.placement = placement;
    if (pricingModel && pricingModel !== 'All') query.pricingModel = pricingModel;

    if (all === 'true') {
      if (status && status !== 'All') query.status = status;
      if (submissionStatus && submissionStatus !== 'All') query.submissionStatus = submissionStatus;
    } else {
      query.submissionStatus = submissionStatus || 'approved';
      query.status = status || 'active';
    }

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

// POST /api/advertisements/:id/click - Public click tracking
router.post('/:id/click', async (req, res, next) => {
  try {
    const target = req.params.id;
    const memoryAd = store.incrementAdClicks(target);
    if (mongoose.connection.readyState !== 1) {
      if (!memoryAd) return res.status(404).json({ message: 'Advertisement not found' });
      return res.json({ success: true, clicks: memoryAd.clicks });
    }

    const query = mongoose.Types.ObjectId.isValid(target)
      ? { _id: target }
      : { $or: [{ id: target }, { title: new RegExp(`^${target}$`, 'i') }] };

    const ad = await Advertisement.findOneAndUpdate(
      query,
      { $inc: { clicks: 1 } },
      { new: true }
    );
    if (!ad) {
      if (memoryAd) return res.json({ success: true, clicks: memoryAd.clicks });
      return res.status(404).json({ message: 'Advertisement not found' });
    }
    res.json({ success: true, clicks: ad.clicks });
  } catch (err) { next(err); }
});

// Protected administrative mutation routes
router.use(auth);

// POST /api/advertisements - Create
router.post('/', async (req, res, next) => {
  try {
    const result = await handleEntityCreate({
      entityType: 'advertisement',
      title: req.body.title || 'New Advertisement',
      store: req.body.advertiser,
      category: req.body.placement || 'homepage-banner-1713x685',
      priority: req.body.priority || 'Normal',
      data: req.body,
      user: req.user,
      Model: Advertisement,
      storeAddMethod: store.addAdvertisement
    });
    res.status(201).json(result.entity || result);
  } catch (err) { next(err); }
});

// PUT /api/advertisements/:id - Update
router.put('/:id', async (req, res, next) => {
  try {
    const result = await handleEntityUpdate({
      id: req.params.id,
      entityType: 'advertisement',
      title: req.body.title,
      store: req.body.advertiser,
      category: req.body.placement,
      priority: req.body.priority || 'Normal',
      updates: req.body,
      user: req.user,
      Model: Advertisement,
      storeUpdateMethod: store.updateAdvertisement,
      storeGetMethod: store.getAdvertisementById
    });
    res.json(result.entity || result);
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
    const result = await handleEntityDelete({
      id: req.params.id,
      entityType: 'advertisement',
      title: req.body?.title,
      store: req.body?.advertiser,
      user: req.user,
      Model: Advertisement,
      storeDeleteMethod: store.deleteAdvertisement,
      storeGetMethod: store.getAdvertisementById
    });
    res.json(result);
  } catch (err) { next(err); }
});

module.exports = router;
