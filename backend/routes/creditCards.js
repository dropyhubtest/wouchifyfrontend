const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CreditCard = require('../models/CreditCard');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');

// GET /api/credit-cards - Public read access
router.get('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(store.getCreditCards(req.query));
    }

    const { bank, network, tier, status, submissionStatus, isFeatured, q } = req.query;
    let query = {};

    if (bank && bank !== 'All') query.bank = bank;
    if (network && network !== 'All') query.network = network;
    if (tier && tier !== 'All') query.tier = tier;
    if (status && status !== 'All') query.status = status;
    if (submissionStatus && submissionStatus !== 'All') query.submissionStatus = submissionStatus;
    if (isFeatured !== undefined) query.isFeatured = String(isFeatured) === 'true';

    if (q) {
      query.$or = [
        { cardName: { $regex: q, $options: 'i' } },
        { bank: { $regex: q, $options: 'i' } },
        { welcomeOffer: { $regex: q, $options: 'i' } }
      ];
    }

    const cards = await CreditCard.find(query).sort({ isFeatured: -1, createdAt: -1 });
    res.json(cards);
  } catch (err) { next(err); }
});

// GET /api/credit-cards/:id
router.get('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const card = store.getCreditCardById(req.params.id);
      if (!card) return res.status(404).json({ message: 'Credit Card not found' });
      return res.json(card);
    }
    const card = await CreditCard.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Credit Card not found' });
    res.json(card);
  } catch (err) { next(err); }
});

// Protected administrative mutation routes
router.use(auth);

// POST /api/credit-cards - Create
router.post('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const created = store.addCreditCard(req.body);
      return res.status(201).json(created);
    }
    const card = new CreditCard(req.body);
    await card.save();
    res.status(201).json(card);
  } catch (err) { next(err); }
});

// PUT /api/credit-cards/:id - Update
router.put('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const updated = store.updateCreditCard(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Credit Card not found' });
      return res.json(updated);
    }
    const updated = await CreditCard.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Credit Card not found' });
    res.json(updated);
  } catch (err) { next(err); }
});

// PATCH /api/credit-cards/:id/status - Toggle/Set Status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (mongoose.connection.readyState !== 1) {
      const updated = store.toggleCreditCardStatus(req.params.id, status);
      if (!updated) return res.status(404).json({ message: 'Credit Card not found' });
      return res.json(updated);
    }
    const card = await CreditCard.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Credit Card not found' });

    card.status = status || (card.status === 'active' ? 'inactive' : 'active');
    await card.save();
    res.json(card);
  } catch (err) { next(err); }
});

// DELETE /api/credit-cards/:id - Delete
router.delete('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const ok = store.deleteCreditCard(req.params.id);
      if (!ok) return res.status(404).json({ message: 'Credit Card not found' });
      return res.json({ message: 'Credit Card deleted' });
    }
    const deleted = await CreditCard.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Credit Card not found' });
    res.json({ message: 'Credit Card deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
