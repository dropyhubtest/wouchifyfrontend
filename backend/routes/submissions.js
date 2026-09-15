const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Submission = require('../models/Submission');
const Deal = require('../models/Deal');
const CreditCard = require('../models/CreditCard');
const Coupon = require('../models/Coupon');
const Banner = require('../models/Banner');
const Advertisement = require('../models/Advertisement');
const LootDeal = require('../models/LootDeal');
const Store = require('../models/Store');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');

async function updateMongoEntityOnApproval(entityType, entityId, action) {
  if (!entityId) return;
  const updatePatch = { submissionStatus: 'approved', status: 'active' };
  try {
    if (action === 'delete') {
      if (entityType === 'deal') await Deal.findByIdAndDelete(entityId);
      else if (entityType === 'credit_card') await CreditCard.findByIdAndDelete(entityId);
      else if (entityType === 'coupon') await Coupon.findByIdAndDelete(entityId);
      else if (entityType === 'banner') await Banner.findByIdAndDelete(entityId);
      else if (entityType === 'advertisement') await Advertisement.findByIdAndDelete(entityId);
      else if (entityType === 'loot_deal') await LootDeal.findByIdAndDelete(entityId);
      else if (entityType === 'store') await Store.findByIdAndDelete(entityId);
    } else {
      if (entityType === 'deal') await Deal.findByIdAndUpdate(entityId, updatePatch);
      else if (entityType === 'credit_card') await CreditCard.findByIdAndUpdate(entityId, updatePatch);
      else if (entityType === 'coupon') await Coupon.findByIdAndUpdate(entityId, updatePatch);
      else if (entityType === 'banner') await Banner.findByIdAndUpdate(entityId, updatePatch);
      else if (entityType === 'advertisement') await Advertisement.findByIdAndUpdate(entityId, updatePatch);
      else if (entityType === 'loot_deal') await LootDeal.findByIdAndUpdate(entityId, updatePatch);
      else if (entityType === 'store') await Store.findByIdAndUpdate(entityId, updatePatch);
    }
  } catch (e) {
    console.error(`Failed to update mongo entity on approval: ${e.message}`);
  }
}

async function updateMongoEntityOnRejection(entityType, entityId) {
  if (!entityId) return;
  const updatePatch = { submissionStatus: 'rejected' };
  try {
    if (entityType === 'deal') await Deal.findByIdAndUpdate(entityId, updatePatch);
    else if (entityType === 'credit_card') await CreditCard.findByIdAndUpdate(entityId, updatePatch);
    else if (entityType === 'coupon') await Coupon.findByIdAndUpdate(entityId, updatePatch);
    else if (entityType === 'banner') await Banner.findByIdAndUpdate(entityId, updatePatch);
    else if (entityType === 'advertisement') await Advertisement.findByIdAndUpdate(entityId, updatePatch);
    else if (entityType === 'loot_deal') await LootDeal.findByIdAndUpdate(entityId, updatePatch);
    else if (entityType === 'store') await Store.findByIdAndUpdate(entityId, updatePatch);
  } catch (e) {
    console.error(`Failed to update mongo entity on rejection: ${e.message}`);
  }
}

async function updateMongoEntityOnPending(entityType, entityId) {
  if (!entityId) return;
  const updatePatch = { submissionStatus: 'pending_approval' };
  try {
    if (entityType === 'deal') await Deal.findByIdAndUpdate(entityId, updatePatch);
    else if (entityType === 'credit_card') await CreditCard.findByIdAndUpdate(entityId, updatePatch);
    else if (entityType === 'coupon') await Coupon.findByIdAndUpdate(entityId, updatePatch);
    else if (entityType === 'banner') await Banner.findByIdAndUpdate(entityId, updatePatch);
    else if (entityType === 'advertisement') await Advertisement.findByIdAndUpdate(entityId, updatePatch);
    else if (entityType === 'loot_deal') await LootDeal.findByIdAndUpdate(entityId, updatePatch);
    else if (entityType === 'store') await Store.findByIdAndUpdate(entityId, updatePatch);
  } catch (e) {
    console.error(`Failed to update mongo entity on pending: ${e.message}`);
  }
}

// All submission queue endpoints use authentication
router.use(auth);

// GET /api/submissions - List all submissions with filters
router.get('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(store.getSubmissions(req.query));
    }

    const { status, entityType, submittedBy, priority } = req.query;
    let query = {};

    if (status && status !== 'All') query.status = status;
    if (entityType && entityType !== 'All') query.entityType = entityType;
    if (submittedBy && submittedBy !== 'All') query.submittedBy = submittedBy;
    if (priority && priority !== 'All') query.priority = priority;

    const submissions = await Submission.find(query).sort({ submittedAt: -1, createdAt: -1 });
    res.json(submissions);
  } catch (err) { next(err); }
});

// GET /api/submissions/:id
router.get('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const sub = store.getSubmissionById(req.params.id);
      if (!sub) return res.status(404).json({ message: 'Submission not found' });
      return res.json(sub);
    }
    const sub = await Submission.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Submission not found' });
    res.json(sub);
  } catch (err) { next(err); }
});

// POST /api/submissions - Create new submission
router.post('/', async (req, res, next) => {
  try {
    const payload = {
      submittedBy: req.user?.email || req.body.submittedBy || 'executive@wouchify.com',
      submittedByName: req.user?.name || req.body.submittedByName || 'Executive',
      submittedAt: new Date(),
      ...req.body
    };

    if (mongoose.connection.readyState !== 1) {
      const created = store.addSubmission(payload);
      return res.status(201).json(created);
    }

    const sub = new Submission(payload);
    await sub.save();

    // Mark corresponding entity as pending_approval in Mongo
    if (sub.entityType && sub.entityId) {
      await updateMongoEntityOnPending(sub.entityType, sub.entityId);
    }

    res.status(201).json(sub);
  } catch (err) { next(err); }
});

// PATCH /api/submissions/:id/approve - Approve submission & activate entity
router.patch('/:id/approve', async (req, res, next) => {
  try {
    const reviewer = req.user?.email || req.body.reviewedBy || 'manager@wouchify.com';

    if (mongoose.connection.readyState !== 1) {
      const approved = store.approveSubmission(req.params.id, reviewer);
      if (!approved) return res.status(404).json({ message: 'Submission not found' });
      return res.json(approved);
    }

    const sub = await Submission.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Submission not found' });

    sub.status = 'Approved';
    sub.reviewedBy = reviewer;
    sub.reviewedAt = new Date();
    await sub.save();

    if (sub.entityType && sub.entityId) {
      await updateMongoEntityOnApproval(sub.entityType, sub.entityId, sub.action);
    }

    res.json(sub);
  } catch (err) { next(err); }
});

// PATCH /api/submissions/:id/reject - Reject submission with reason
router.patch('/:id/reject', async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    const reviewer = req.user?.email || req.body.reviewedBy || 'manager@wouchify.com';

    if (mongoose.connection.readyState !== 1) {
      const rejected = store.rejectSubmission(req.params.id, rejectionReason, reviewer);
      if (!rejected) return res.status(404).json({ message: 'Submission not found' });
      return res.json(rejected);
    }

    const sub = await Submission.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Submission not found' });

    sub.status = 'Rejected';
    sub.rejectionReason = rejectionReason || 'Submission rejected by operational manager.';
    sub.reviewedBy = reviewer;
    sub.reviewedAt = new Date();
    await sub.save();

    if (sub.entityType && sub.entityId) {
      await updateMongoEntityOnRejection(sub.entityType, sub.entityId);
    }

    res.json(sub);
  } catch (err) { next(err); }
});

// PUT /api/submissions/:id - Update submission
router.put('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const updated = store.updateSubmission(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Submission not found' });
      return res.json(updated);
    }
    const updated = await Submission.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Submission not found' });
    res.json(updated);
  } catch (err) { next(err); }
});

// DELETE /api/submissions/:id - Delete submission
router.delete('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const ok = store.deleteSubmission(req.params.id);
      if (!ok) return res.status(404).json({ message: 'Submission not found' });
      return res.json({ message: 'Submission deleted' });
    }
    const deleted = await Submission.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Submission not found' });
    res.json({ message: 'Submission deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
