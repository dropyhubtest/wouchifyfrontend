const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const LootDeal = require('../models/LootDeal');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');
const { handleEntityCreate, handleEntityUpdate, handleEntityDelete } = require('../middleware/approvalHelper');

// Public read access for storefront & catalog consumers
router.get('/', async (req, res, next) => {
  try {
    const { dealType, status, submissionStatus, all } = req.query;
    if (mongoose.connection.readyState !== 1) {
      let memoryLoot = store.getLootDeals(req.query);
      if (all !== 'true') {
        memoryLoot = memoryLoot.filter(l => l.submissionStatus !== 'pending_approval' && (l.status || 'active') === 'active');
      }
      return res.json(memoryLoot);
    }
    
    let query = {};
    if (dealType && dealType !== 'All') query.dealType = dealType;

    if (all === 'true') {
      if (status && status !== 'All') query.status = status;
      if (submissionStatus && submissionStatus !== 'All') query.submissionStatus = submissionStatus;
    } else {
      query.submissionStatus = submissionStatus || 'approved';
      query.status = status || 'active';
    }

    const lootDeals = await LootDeal.find(query).sort({ createdAt: -1 });
    res.json(lootDeals);
  } catch (err) { next(err); }
});

// Public click tracking for storefront engagements
router.post('/:id/click', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const updated = store.incrementLootClicks(req.params.id);
      return res.json({ success: true, clicks: updated?.clicks || 1 });
    }
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const query = isObjectId ? { $or: [{ _id: req.params.id }, { id: req.params.id }] } : { id: req.params.id };
    const loot = await LootDeal.findOneAndUpdate(
      query,
      { $inc: { clicks: 1 } },
      { new: true }
    );
    if (!loot) return res.status(404).json({ message: 'Loot deal not found' });
    res.json({ success: true, clicks: loot.clicks || 1 });
  } catch (err) { next(err); }
});

// Protected administrative mutation routes
router.use(auth);

// Create loot deal
router.post('/', async (req, res, next) => {
  try {
    const result = await handleEntityCreate({
      entityType: 'loot_deal',
      title: req.body.title || 'New Loot Deal',
      store: req.body.storeName || req.body.store,
      category: req.body.category,
      priority: req.body.priority || 'Critical',
      data: req.body,
      user: req.user,
      Model: LootDeal,
      storeAddMethod: store.addLootDeal
    });
    res.status(201).json(result.entity || result);
  } catch (err) { next(err); }
});

// Update loot deal
router.put('/:id', async (req, res, next) => {
  try {
    const result = await handleEntityUpdate({
      id: req.params.id,
      entityType: 'loot_deal',
      title: req.body.title,
      store: req.body.storeName || req.body.store,
      category: req.body.category,
      priority: req.body.priority || 'Critical',
      updates: req.body,
      user: req.user,
      Model: LootDeal,
      storeUpdateMethod: store.updateLootDeal,
      storeGetMethod: store.getLootDealById
    });
    res.json(result.entity || result);
  } catch (err) { next(err); }
});

// Delete loot deal
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await handleEntityDelete({
      id: req.params.id,
      entityType: 'loot_deal',
      title: req.body?.title,
      store: req.body?.storeName || req.body?.store,
      user: req.user,
      Model: LootDeal,
      storeDeleteMethod: store.deleteLootDeal,
      storeGetMethod: store.getLootDealById
    });
    res.json(result);
  } catch (err) { next(err); }
});

// Toggle status
router.patch('/:id/status', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const toggled = store.toggleLootDealStatus(req.params.id);
      if (!toggled) return res.status(404).json({ message: 'Loot deal not found' });
      return res.json(toggled);
    }
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const query = isObjectId ? { $or: [{ _id: req.params.id }, { id: req.params.id }] } : { id: req.params.id };
    const lootDeal = await LootDeal.findOne(query);
    if (!lootDeal) return res.status(404).json({ message: 'Loot deal not found' });
    lootDeal.status = lootDeal.status === 'active' ? 'inactive' : 'active';
    await lootDeal.save();
    res.json(lootDeal);
  } catch (err) { next(err); }
});

module.exports = router;
