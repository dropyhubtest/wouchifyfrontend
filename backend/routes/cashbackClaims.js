const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CashbackClaim = require('../models/CashbackClaim');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');

// Protected routes for cashback claims management
router.use(auth);

// GET /api/cashback-claims - List claims with filtering
router.get('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(store.getCashbackClaims(req.query));
    }

    const { status, userEmail, store: storeName, payoutMethod } = req.query;
    let query = {};

    if (status && status !== 'All') query.status = status;
    if (userEmail) query.userEmail = { $regex: userEmail, $options: 'i' };
    if (storeName && storeName !== 'All') query.store = storeName;
    if (payoutMethod && payoutMethod !== 'All') query.payoutMethod = payoutMethod;

    const claims = await CashbackClaim.find(query).sort({ claimedAt: -1, createdAt: -1 });
    res.json(claims);
  } catch (err) { next(err); }
});

// GET /api/cashback-claims/:id
router.get('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const claim = store.getCashbackClaimById(req.params.id);
      if (!claim) return res.status(404).json({ message: 'Cashback claim not found' });
      return res.json(claim);
    }
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const claim = isObjectId 
      ? await CashbackClaim.findById(req.params.id) 
      : await CashbackClaim.findOne({ claimId: req.params.id });

    if (!claim) return res.status(404).json({ message: 'Cashback claim not found' });
    res.json(claim);
  } catch (err) { next(err); }
});

// POST /api/cashback-claims - Create new claim
router.post('/', async (req, res, next) => {
  try {
    const num = Math.floor(Math.random() * 900 + 100);
    const claimId = req.body.claimId || `CLM-${num}`;
    const payload = {
      claimId,
      claimedAt: new Date(),
      ...req.body
    };

    if (mongoose.connection.readyState !== 1) {
      const created = store.addCashbackClaim(payload);
      return res.status(201).json(created);
    }

    const claim = new CashbackClaim(payload);
    await claim.save();
    res.status(201).json(claim);
  } catch (err) { next(err); }
});

// PATCH /api/cashback-claims/:id/status - Update claim status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status, reviewedBy, notes } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const reviewer = reviewedBy || req.user?.email || 'manager@wouchify.com';

    if (mongoose.connection.readyState !== 1) {
      const updated = store.updateCashbackClaimStatus(req.params.id, status, { reviewedBy: reviewer, notes });
      if (!updated) return res.status(404).json({ message: 'Cashback claim not found' });
      return res.json(updated);
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const claim = isObjectId 
      ? await CashbackClaim.findById(req.params.id) 
      : await CashbackClaim.findOne({ claimId: req.params.id });

    if (!claim) return res.status(404).json({ message: 'Cashback claim not found' });

    claim.status = status;
    claim.reviewedBy = reviewer;
    if (notes !== undefined) claim.notes = notes;
    await claim.save();
    res.json(claim);
  } catch (err) { next(err); }
});

// PUT /api/cashback-claims/:id - Update claim
router.put('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const updated = store.updateCashbackClaim(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Cashback claim not found' });
      return res.json(updated);
    }
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const updated = isObjectId
      ? await CashbackClaim.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      : await CashbackClaim.findOneAndUpdate({ claimId: req.params.id }, req.body, { new: true, runValidators: true });

    if (!updated) return res.status(404).json({ message: 'Cashback claim not found' });
    res.json(updated);
  } catch (err) { next(err); }
});

// DELETE /api/cashback-claims/:id - Delete claim
router.delete('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const ok = store.deleteCashbackClaim(req.params.id);
      if (!ok) return res.status(404).json({ message: 'Cashback claim not found' });
      return res.json({ message: 'Cashback claim deleted' });
    }
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const deleted = isObjectId
      ? await CashbackClaim.findByIdAndDelete(req.params.id)
      : await CashbackClaim.findOneAndDelete({ claimId: req.params.id });

    if (!deleted) return res.status(404).json({ message: 'Cashback claim not found' });
    res.json({ message: 'Cashback claim deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
