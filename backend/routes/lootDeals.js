const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const LootDeal = require('../models/LootDeal');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');

// Public read access for storefront & catalog consumers
router.get('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(store.getLootDeals(req.query));
    }
    const { dealType } = req.query;
    let query = {};
    if (dealType && dealType !== 'All') query.dealType = dealType;
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
    const loot = await LootDeal.findByIdAndUpdate(
      req.params.id,
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
    if (mongoose.connection.readyState !== 1) {
      const created = store.addLootDeal(req.body);
      return res.status(201).json(created);
    }
    const lootDeal = new LootDeal(req.body);
    await lootDeal.save();
    res.status(201).json(lootDeal);
  } catch (err) { next(err); }
});

// Update loot deal
router.put('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const updated = store.updateLootDeal(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Loot deal not found' });
      return res.json(updated);
    }
    const lootDeal = await LootDeal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lootDeal) return res.status(404).json({ message: 'Loot deal not found' });
    res.json(lootDeal);
  } catch (err) { next(err); }
});

// Delete loot deal
router.delete('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const ok = store.deleteLootDeal(req.params.id);
      if (!ok) return res.status(404).json({ message: 'Loot deal not found' });
      return res.json({ message: 'Loot deal deleted' });
    }
    const lootDeal = await LootDeal.findByIdAndDelete(req.params.id);
    if (!lootDeal) return res.status(404).json({ message: 'Loot deal not found' });
    res.json({ message: 'Loot deal deleted' });
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
    const lootDeal = await LootDeal.findById(req.params.id);
    if (!lootDeal) return res.status(404).json({ message: 'Loot deal not found' });
    lootDeal.status = lootDeal.status === 'active' ? 'inactive' : 'active';
    await lootDeal.save();
    res.json(lootDeal);
  } catch (err) { next(err); }
});

module.exports = router;
