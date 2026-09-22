const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CreditCard = require('../models/CreditCard');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');
const { handleEntityCreate, handleEntityUpdate, handleEntityDelete } = require('../middleware/approvalHelper');
const { fastQuery, safeBackground } = require('../utils/mongoFastQuery');

// GET /api/credit-cards - Public read access
router.get('/', async (req, res, next) => {
  const { bank, network, tier, status, submissionStatus, isFeatured, q, all } = req.query;
  const getFallback = () => store.getCreditCards(req.query);

  try {
    let query = {};
    if (bank && bank !== 'All') query.bank = bank;
    if (network && network !== 'All') query.network = network;
    if (tier && tier !== 'All') query.tier = tier;
    if (isFeatured !== undefined) query.isFeatured = String(isFeatured) === 'true';

    if (all === 'true') {
      if (status && status !== 'All' && status !== 'all') query.status = status;
      if (submissionStatus && submissionStatus !== 'All' && submissionStatus !== 'all') query.submissionStatus = submissionStatus;
    } else {
      query.submissionStatus = { $nin: ['pending_approval', 'rejected', 'draft'] };
      if (status && status !== 'All' && status !== 'all') {
        query.status = status;
      } else {
        query.status = { $in: ['active', 'featured'] };
      }
    }

    if (q) {
      query.$or = [
        { cardName: { $regex: q, $options: 'i' } },
        { bank: { $regex: q, $options: 'i' } },
        { welcomeOffer: { $regex: q, $options: 'i' } }
      ];
    }

    const cards = await fastQuery(
      () => CreditCard.find(query).sort({ isFeatured: -1, createdAt: -1 }).lean(),
      getFallback,
      200
    );
    res.json(cards);
  } catch (err) {
    return res.json(getFallback());
  }
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

// POST /api/credit-cards/:id/click - Public apply/click counter
router.post('/:id/click', async (req, res, next) => {
  try {
    const target = req.params.id;
    const memoryCard = store.incrementCreditCardClicks(target);
    if (mongoose.connection.readyState !== 1) {
      if (!memoryCard) return res.status(404).json({ message: 'Credit Card not found' });
      return res.json({ success: true, applyCount: memoryCard.applyCount });
    }

    const query = mongoose.Types.ObjectId.isValid(target)
      ? { _id: target }
      : { $or: [{ id: target }, { cardName: new RegExp(`^${target}$`, 'i') }] };

    const card = await CreditCard.findOneAndUpdate(
      query,
      { $inc: { applyCount: 1 } },
      { new: true }
    );
    if (!card) {
      if (memoryCard) return res.json({ success: true, applyCount: memoryCard.applyCount });
      return res.status(404).json({ message: 'Credit Card not found' });
    }
    res.json({ success: true, applyCount: card.applyCount });
  } catch (err) { next(err); }
});

// Protected administrative mutation routes
router.use(auth);

// POST /api/credit-cards - Create
router.post('/', async (req, res, next) => {
  try {
    const result = await handleEntityCreate({
      entityType: 'credit_card',
      title: req.body.cardName || 'New Credit Card',
      store: req.body.bank,
      category: req.body.tier || 'Finance',
      priority: req.body.priority || 'Normal',
      data: req.body,
      user: req.user,
      Model: CreditCard,
      storeAddMethod: store.addCreditCard
    });
    res.status(201).json(result.entity || result);
  } catch (err) { next(err); }
});

// PUT /api/credit-cards/:id - Update
router.put('/:id', async (req, res, next) => {
  try {
    const result = await handleEntityUpdate({
      id: req.params.id,
      entityType: 'credit_card',
      title: req.body.cardName,
      store: req.body.bank,
      category: req.body.tier || 'Finance',
      priority: req.body.priority || 'Normal',
      updates: req.body,
      user: req.user,
      Model: CreditCard,
      storeUpdateMethod: store.updateCreditCard,
      storeGetMethod: store.getCreditCardById
    });
    res.json(result.entity || result);
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
    const result = await handleEntityDelete({
      id: req.params.id,
      entityType: 'credit_card',
      title: req.body?.cardName,
      store: req.body?.bank,
      user: req.user,
      Model: CreditCard,
      storeDeleteMethod: store.deleteCreditCard,
      storeGetMethod: store.getCreditCardById
    });
    res.json(result);
  } catch (err) { next(err); }
});

module.exports = router;
