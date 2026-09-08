const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Deal = require('../models/Deal');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');

// Public read access for storefront & catalog consumers
router.get('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(store.getDeals(req.query));
    }
    const { category, status } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (status && status !== 'All') query.status = status;
    const deals = await Deal.find(query).sort({ createdAt: -1 });
    res.json(deals);
  } catch (err) { next(err); }
});

// Protected administrative mutation routes
router.use(auth);

// Create deal
router.post('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const created = store.addDeal(req.body);
      return res.status(201).json(created);
    }
    const deal = new Deal(req.body);
    await deal.save();
    res.status(201).json(deal);
  } catch (err) { next(err); }
});

// Update deal
router.put('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const updated = store.updateDeal(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Deal not found' });
      return res.json(updated);
    }
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    res.json(deal);
  } catch (err) { next(err); }
});

// Delete deal
router.delete('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const ok = store.deleteDeal(req.params.id);
      if (!ok) return res.status(404).json({ message: 'Deal not found' });
      return res.json({ message: 'Deal deleted' });
    }
    const deal = await Deal.findByIdAndDelete(req.params.id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    res.json({ message: 'Deal deleted' });
  } catch (err) { next(err); }
});

// Toggle status
router.patch('/:id/status', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const toggled = store.toggleDealStatus(req.params.id);
      if (!toggled) return res.status(404).json({ message: 'Deal not found' });
      return res.json(toggled);
    }
    const deal = await Deal.findById(req.params.id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    deal.status = deal.status === 'active' ? 'pending' : 'active';
    await deal.save();
    res.json(deal);
  } catch (err) { next(err); }
});

module.exports = router;
