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
const Category = require('../models/Category');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');
const { fastQuery, safeBackground } = require('../utils/mongoFastQuery');

function getEntityModel(entityType) {
  switch (entityType) {
    case 'deal': return Deal;
    case 'credit_card': return CreditCard;
    case 'coupon': return Coupon;
    case 'banner': return Banner;
    case 'advertisement': return Advertisement;
    case 'loot_deal': return LootDeal;
    case 'store': return Store;
    case 'category': return Category;
    default: return null;
  }
}

function buildEntityQuery(entityId, dataSnapshot = null) {
  const conditions = [];
  if (entityId) {
    const str = String(entityId).trim();
    conditions.push({ id: str });
    if (mongoose.Types.ObjectId.isValid(str)) {
      try {
        conditions.push({ _id: new mongoose.Types.ObjectId(str) });
      } catch {}
    }
  }
  if (dataSnapshot) {
    if (dataSnapshot.id && String(dataSnapshot.id) !== String(entityId)) {
      conditions.push({ id: String(dataSnapshot.id).trim() });
    }
    if (dataSnapshot._id && String(dataSnapshot._id) !== String(entityId)) {
      const snapId = String(dataSnapshot._id).trim();
      if (mongoose.Types.ObjectId.isValid(snapId)) {
        try {
          conditions.push({ _id: new mongoose.Types.ObjectId(snapId) });
        } catch {}
      } else {
        conditions.push({ id: snapId });
      }
    }
    if (dataSnapshot.name) conditions.push({ name: dataSnapshot.name });
    if (dataSnapshot.title) conditions.push({ title: dataSnapshot.title });
    if (dataSnapshot.cardName) conditions.push({ cardName: dataSnapshot.cardName });
    if (dataSnapshot.code) conditions.push({ code: dataSnapshot.code.toUpperCase() });
  }

  if (conditions.length === 0) return { _id: null };
  return { $or: conditions };
}

async function updateMongoEntityOnApproval(entityType, entityId, action, dataSnapshot, reviewer = 'manager@wouchify.com', reviewerName = 'Manager', reviewerRole = 'Manager') {
  if (!entityId && !dataSnapshot) return;
  const Model = getEntityModel(entityType);
  if (!Model) return;

  const nowIso = new Date();
  const updatePatch = { 
    ...(dataSnapshot || {}),
    submissionStatus: 'approved', 
    status: 'active',
    opsManagerApproval: 'Approved',
    managerApproval: 'Approved',
    approvedBy: reviewer,
    approvedByName: reviewerName,
    approvedByRole: reviewerRole,
    approvedAt: nowIso
  };
  delete updatePatch._id;
  delete updatePatch.id;
  delete updatePatch.createdAt;
  delete updatePatch.__v;

  const query = buildEntityQuery(entityId, dataSnapshot);

  try {
    if (action === 'delete') {
      await Model.findOneAndDelete(query);
    } else {
      const updated = await Model.findOneAndUpdate(query, updatePatch, { new: true, upsert: false });
      if (!updated && action === 'create' && dataSnapshot) {
        const toCreate = new Model({
          ...dataSnapshot,
          id: entityId || `entity-${Date.now()}`,
          submissionStatus: 'approved',
          status: 'active',
          opsManagerApproval: 'Approved',
          managerApproval: 'Approved',
          approvedBy: reviewer,
          approvedByName: reviewerName,
          approvedByRole: reviewerRole,
          approvedAt: nowIso
        });
        await toCreate.save();
      }
    }
  } catch (e) {
    console.error(`Failed to update mongo entity on approval: ${e.message}`);
  }
}

async function updateMongoEntityOnRejection(entityType, entityId, dataSnapshot) {
  if (!entityId && !dataSnapshot) return;
  const Model = getEntityModel(entityType);
  if (!Model) return;

  const query = buildEntityQuery(entityId, dataSnapshot);
  const updatePatch = { submissionStatus: 'rejected', status: 'inactive', opsManagerApproval: 'Rejected', managerApproval: 'Rejected' };

  try {
    await Model.findOneAndUpdate(query, updatePatch, { new: true });
  } catch (e) {
    console.error(`Failed to update mongo entity on rejection: ${e.message}`);
  }
}

async function updateMongoEntityOnPending(entityType, entityId, dataSnapshot) {
  if (!entityId && !dataSnapshot) return;
  const Model = getEntityModel(entityType);
  if (!Model) return;

  const query = buildEntityQuery(entityId, dataSnapshot);
  const updatePatch = { submissionStatus: 'pending_approval', status: 'pending', opsManagerApproval: 'Pending', managerApproval: 'Pending' };

  try {
    await Model.findOneAndUpdate(query, updatePatch, { new: true });
  } catch (e) {
    console.error(`Failed to update mongo entity on pending: ${e.message}`);
  }
}

// All submission queue endpoints use authentication
router.use(auth);

// GET /api/submissions - List all submissions with filters
router.get('/', async (req, res, next) => {
  try {
    const { status, entityType, submittedBy, priority } = req.query;
    let query = {};

    if (status && status !== 'All' && status !== 'all') query.status = status;
    if (entityType && entityType !== 'All' && entityType !== 'all') query.entityType = entityType;
    if (submittedBy && submittedBy !== 'All' && submittedBy !== 'all') query.submittedBy = submittedBy;
    if (priority && priority !== 'All' && priority !== 'all') query.priority = priority;

    const getFallback = () => store.getSubmissions(req.query);
    const submissions = await fastQuery(() => Submission.find(query).sort({ submittedAt: -1, createdAt: -1 }).lean(), getFallback, 200);
    res.json(submissions);
  } catch (err) { 
    return res.json(store.getSubmissions(req.query));
  }
});

// GET /api/submissions/:id
router.get('/:id', async (req, res, next) => {
  try {
    const subQuery = buildEntityQuery(req.params.id);
    const getFallback = () => store.getSubmissionById(req.params.id);

    if (mongoose.connection.readyState !== 1) {
      const sub = getFallback();
      if (!sub) return res.status(404).json({ message: 'Submission not found' });
      return res.json(sub);
    }

    const sub = await fastQuery(() => Submission.findOne(subQuery).lean(), getFallback, 200);
    if (!sub) return res.status(404).json({ message: 'Submission not found' });
    res.json(sub);
  } catch (err) {
    const mem = store.getSubmissionById(req.params.id);
    if (mem) return res.json(mem);
    return res.status(404).json({ message: 'Submission not found' });
  }
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

    // Always record in in-memory store (<1ms)
    const memCreated = store.addSubmission(payload);

    // Background MongoDB persistence without blocking client
    safeBackground(async () => {
      if (mongoose.connection.readyState === 1) {
        const sub = new Submission(payload);
        await sub.save();
        if (sub.entityType && sub.entityId) {
          await updateMongoEntityOnPending(sub.entityType, sub.entityId, sub.dataSnapshot);
        }
      }
    }, 'Mongo Submission Create');

    res.status(201).json(memCreated);
  } catch (err) { next(err); }
});

// POST /api/submissions/bulk-approve - Bulk approve multiple submissions
router.post('/bulk-approve', async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'ids array is required' });
    }
    const reviewer = req.user?.email || req.body.reviewedBy || req.body.approvedBy || 'ops.manager@wouchify.com';
    const reviewerName = req.user?.name || req.body.reviewedByName || req.body.approvedByName || (reviewer.includes('manager@') && !reviewer.includes('ops') ? 'Manager' : 'Operational Manager');
    const reviewerRole = req.user?.role || req.body.reviewedByRole || req.body.approvedByRole || (reviewer.includes('manager@') && !reviewer.includes('ops') ? 'Manager' : 'Operational Manager');

    const approvedList = [];
    for (const id of ids) {
      const approved = store.approveSubmission(id, reviewer, reviewerName, reviewerRole);
      if (approved) approvedList.push(approved);
      if (mongoose.connection.readyState === 1) {
        try {
          const sub = await Submission.findOne(buildEntityQuery(id));
          if (sub) {
            sub.status = 'Approved';
            sub.reviewedBy = reviewer;
            sub.reviewedByName = reviewerName;
            sub.reviewedByRole = reviewerRole;
            sub.approvedBy = reviewer;
            sub.approvedByName = reviewerName;
            sub.approvedByRole = reviewerRole;
            sub.reviewedAt = new Date();
            sub.approvedAt = new Date();
            await sub.save();
            if (sub.entityType && sub.entityId) {
              await updateMongoEntityOnApproval(sub.entityType, sub.entityId, sub.action, sub.dataSnapshot, reviewer, reviewerName, reviewerRole);
            }
          }
        } catch {}
      }
    }
    res.json({ success: true, count: approvedList.length, items: approvedList });
  } catch (err) { next(err); }
});

// POST /api/submissions/bulk-reject - Bulk reject multiple submissions
router.post('/bulk-reject', async (req, res, next) => {
  try {
    const { ids, rejectionReason } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'ids array is required' });
    }
    const reviewer = req.user?.email || req.body.reviewedBy || 'ops.manager@wouchify.com';
    const reason = rejectionReason || 'Bulk rejected by operational manager.';

    const results = ids.map(id => store.rejectSubmission(id, reason, reviewer)).filter(Boolean);
    res.json({ success: true, count: results.length });

    safeBackground(async () => {
      if (mongoose.connection.readyState === 1) {
        for (const subId of ids) {
          try {
            const subQuery = buildEntityQuery(subId);
            const sub = await Submission.findOne(subQuery);
            if (sub) {
              sub.status = 'Rejected';
              sub.rejectionReason = reason;
              sub.reviewedBy = reviewer;
              sub.reviewedAt = new Date();
              await sub.save();
              if (sub.entityType) {
                await updateMongoEntityOnRejection(sub.entityType, sub.entityId, sub.dataSnapshot);
              }
            }
          } catch (e) {}
        }
      }
    }, 'Bulk Mongo Reject');
  } catch (err) { next(err); }
});

// PATCH /api/submissions/:id/approve - Approve submission & activate entity
router.patch('/:id/approve', async (req, res, next) => {
  try {
    const reviewer = req.user?.email || req.body.reviewedBy || req.body.approvedBy || 'manager@wouchify.com';
    const reviewerName = req.user?.name || req.body.reviewedByName || req.body.approvedByName || (reviewer.includes('manager@') && !reviewer.includes('ops') ? 'Manager' : 'Operational Manager');
    const reviewerRole = req.user?.role || req.body.reviewedByRole || req.body.approvedByRole || (reviewer.includes('manager@') && !reviewer.includes('ops') ? 'Manager' : 'Operational Manager');
    const subId = req.params.id;

    // 1. Sync memory store immediately
    const memApproved = store.approveSubmission(subId, reviewer, reviewerName, reviewerRole);

    // 2. Respond immediately to user for instant UI responsiveness
    if (memApproved) {
      res.json(memApproved);
    } else {
      const subQuery = buildEntityQuery(subId);
      const sub = await Submission.findOne(subQuery);
      if (!sub) return res.status(404).json({ message: 'Submission not found' });
      sub.status = 'Approved';
      sub.reviewedBy = reviewer;
      sub.reviewedByName = reviewerName;
      sub.reviewedByRole = reviewerRole;
      sub.approvedBy = reviewer;
      sub.approvedByName = reviewerName;
      sub.approvedByRole = reviewerRole;
      sub.reviewedAt = new Date();
      sub.approvedAt = new Date();
      await sub.save();
      await updateMongoEntityOnApproval(sub.entityType, sub.entityId, sub.action, sub.dataSnapshot, reviewer, reviewerName, reviewerRole);
      return res.json(sub);
    }

    // 3. Background MongoDB update without blocking client
    safeBackground(async () => {
      if (mongoose.connection.readyState === 1) {
        const subQuery = buildEntityQuery(subId);
        const sub = await Submission.findOne(subQuery);
        let targetEntityType = memApproved?.entityType;
        let targetEntityId = memApproved?.entityId;
        let targetAction = memApproved?.action || 'create';
        let targetDataSnapshot = memApproved?.dataSnapshot;

        if (sub) {
          sub.status = 'Approved';
          sub.reviewedBy = reviewer;
          sub.reviewedByName = reviewerName;
          sub.reviewedByRole = reviewerRole;
          sub.approvedBy = reviewer;
          sub.approvedByName = reviewerName;
          sub.approvedByRole = reviewerRole;
          sub.reviewedAt = new Date();
          sub.approvedAt = new Date();
          await sub.save();
          targetEntityType = sub.entityType || targetEntityType;
          targetEntityId = sub.entityId || targetEntityId;
          targetAction = sub.action || targetAction;
          targetDataSnapshot = sub.dataSnapshot || targetDataSnapshot;
        }

        if (targetEntityType) {
          await updateMongoEntityOnApproval(targetEntityType, targetEntityId, targetAction, targetDataSnapshot, reviewer, reviewerName, reviewerRole);
        }
      }
    }, 'Mongo Submission Approve');
  } catch (err) { next(err); }
});

// PATCH /api/submissions/:id/reject - Reject submission with reason
router.patch('/:id/reject', async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    const reviewer = req.user?.email || req.body.reviewedBy || 'ops.manager@wouchify.com';
    const reviewerName = req.user?.name || req.body.reviewedByName || (reviewer.includes('manager@') && !reviewer.includes('ops') ? 'Manager' : 'Operational Manager');
    const reviewerRole = req.user?.role || req.body.reviewedByRole || (reviewer.includes('manager@') && !reviewer.includes('ops') ? 'Manager' : 'Operational Manager');
    const subId = req.params.id;

    // 1. Sync memory store immediately
    const memRejected = store.rejectSubmission(subId, rejectionReason, reviewer, reviewerName, reviewerRole);

    // 2. Respond immediately to user
    if (memRejected) {
      res.json(memRejected);
    } else {
      const subQuery = buildEntityQuery(subId);
      const sub = await Submission.findOne(subQuery);
      if (!sub) return res.status(404).json({ message: 'Submission not found' });
      sub.status = 'Rejected';
      sub.rejectionReason = rejectionReason || 'Submission rejected by operational manager.';
      sub.reviewedBy = reviewer;
      sub.reviewedAt = new Date();
      await sub.save();
      await updateMongoEntityOnRejection(sub.entityType, sub.entityId, sub.dataSnapshot);
      return res.json(sub);
    }

    // 3. Background MongoDB update without blocking client
    safeBackground(async () => {
      if (mongoose.connection.readyState === 1) {
        const subQuery = buildEntityQuery(subId);
        const sub = await Submission.findOne(subQuery);
        let targetEntityType = memRejected?.entityType;
        let targetEntityId = memRejected?.entityId;
        let targetDataSnapshot = memRejected?.dataSnapshot;

        if (sub) {
          sub.status = 'Rejected';
          sub.rejectionReason = rejectionReason || 'Submission rejected.';
          sub.reviewedBy = reviewer;
          sub.reviewedByName = reviewerName;
          sub.reviewedByRole = reviewerRole;
          sub.reviewedAt = new Date();
          await sub.save();
          targetEntityType = sub.entityType || targetEntityType;
          targetEntityId = sub.entityId || targetEntityId;
          targetDataSnapshot = sub.dataSnapshot || targetDataSnapshot;
        }

        if (targetEntityType) {
          await updateMongoEntityOnRejection(targetEntityType, targetEntityId, targetDataSnapshot);
        }
      }
    }, 'Mongo Submission Reject');
  } catch (err) { next(err); }
});

// PUT /api/submissions/:id - Update submission
router.put('/:id', async (req, res, next) => {
  try {
    const memUpdated = store.updateSubmission(req.params.id, req.body);
    if (mongoose.connection.readyState !== 1) {
      if (!memUpdated) return res.status(404).json({ message: 'Submission not found' });
      return res.json(memUpdated);
    }
    try {
      const updated = await Submission.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (updated) return res.json(updated);
    } catch (e) {
      console.warn('MongoDB submission update error:', e.message);
    }
    if (memUpdated) return res.json(memUpdated);
    return res.status(404).json({ message: 'Submission not found' });
  } catch (err) { next(err); }
});

// DELETE /api/submissions/:id - Delete submission
router.delete('/:id', async (req, res, next) => {
  try {
    const memDeleted = store.deleteSubmission(req.params.id);
    if (mongoose.connection.readyState !== 1) {
      if (!memDeleted) return res.status(404).json({ message: 'Submission not found' });
      return res.json({ message: 'Submission deleted' });
    }
    try {
      await Submission.findByIdAndDelete(req.params.id);
    } catch (e) {
      console.warn('MongoDB submission delete error:', e.message);
    }
    if (memDeleted) return res.json({ message: 'Submission deleted' });
    return res.status(404).json({ message: 'Submission not found' });
  } catch (err) { next(err); }
});

module.exports = router;
