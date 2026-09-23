const mongoose = require('mongoose');
const Submission = require('../models/Submission');
const inMemoryStore = require('../services/inMemoryStore');
const { safeBackground } = require('../utils/mongoFastQuery');

/**
 * Helper to handle Maker-Checker workflow on entity creation.
 * If user is an Executive, stage entity as pending_approval and queue a Submission.
 * If user is Manager / Ops Manager, directly approve and activate.
 * Always records in inMemoryStore immediately (<1ms) and persists to MongoDB asynchronously.
 */
async function handleEntityCreate({
  entityType,
  title,
  store = '',
  category = '',
  priority = 'Normal',
  data = {},
  user = {},
  Model,
  storeAddMethod
}) {
  // Always require approval for all roles so CRUD operations can be approved by managers
  const requiresApproval = true;
  const submissionStatus = requiresApproval ? 'pending_approval' : (data.submissionStatus || 'approved');
  const status = requiresApproval ? 'pending' : (data.status || 'active');
  const opsManagerApproval = requiresApproval ? 'Pending' : 'Approved';
  const managerApproval = requiresApproval ? 'Pending' : 'Approved';

  const entityData = {
    ...data,
    name: data.name || data.title || title || 'Item',
    title: data.title || data.name || title || 'Item',
    submissionStatus,
    status,
    opsManagerApproval,
    managerApproval,
    submittedBy: user.email || 'executive@wouchify.com',
    submittedByName: user.name || 'Content Executive',
  };

  // 1. Always record in memory store immediately (<1ms)
  let createdEntity = null;
  if (storeAddMethod) {
    createdEntity = storeAddMethod(entityData);
  } else {
    createdEntity = { _id: 'entity-' + Date.now(), ...entityData };
  }

  const entityId = createdEntity._id ? String(createdEntity._id) : String(createdEntity.id || Date.now());

  if (isExecutive) {
    const submissionPayload = {
      entityType,
      entityId,
      action: 'create',
      title: title || data.title || data.name || data.code || (entityType + ' item'),
      store: store || data.store || data.storeName || data.bank || '',
      category: category || data.category || '',
      priority: priority || data.priority || 'Normal',
      submittedBy: user.email || 'executive@wouchify.com',
      submittedByName: user.name || 'Content Executive',
      status: 'Pending Approval',
      notes: data.notes || ('New ' + entityType + ' submitted for review by ' + (user.name || 'Executive') + '.'),
      dataSnapshot: entityData
    };

    inMemoryStore.addSubmission(submissionPayload);

    // 2. Persist to MongoDB in background
    safeBackground(async () => {
      if (mongoose.connection.readyState === 1 && Model) {
        const doc = new Model(entityData);
        await doc.save();
        const sub = new Submission({
          ...submissionPayload,
          entityId: String(doc._id)
        });
        await sub.save();
      }
    }, 'ApprovalHelper Create');
  } else {
    // Non-executive direct publish
    safeBackground(async () => {
      if (mongoose.connection.readyState === 1 && Model) {
        const doc = new Model(entityData);
        await doc.save();
      }
    }, 'ApprovalHelper Direct Publish');
  }

  return {
    entity: createdEntity,
    staged: requiresApproval,
    message: requiresApproval
      ? 'Submitted for Operational Manager approval. It will appear live once approved.'
      : 'Published successfully.'
  };
}

/**
 * Helper to handle Maker-Checker workflow on entity update.
 * If user is an Executive, preserve current live state, mark pending_approval, and queue an update Submission with proposed changes.
 * If user is Manager / Ops Manager, apply updates immediately.
 */
async function handleEntityUpdate({
  id,
  entityType,
  title,
  store = '',
  category = '',
  priority = 'Normal',
  updates = {},
  user = {},
  Model,
  storeUpdateMethod,
  storeGetMethod
}) {
  const isExecutive = user.role === 'executive';

  if (!requiresApproval) {
    // Direct update for Manager / Ops Manager
    const patch = { ...updates, submissionStatus: 'approved' };
    let updatedDoc = null;
    if (storeUpdateMethod) {
      updatedDoc = storeUpdateMethod(id, patch);
    }

    safeBackground(async () => {
      if (mongoose.connection.readyState === 1 && Model) {
        const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { $or: [{ _id: id }, { id: id }, { code: id }] };
        await Model.findOneAndUpdate(query, patch, { new: true, runValidators: true });
      }
    }, 'ApprovalHelper Direct Update');

    return { entity: updatedDoc || patch, staged: false, message: 'Updated and published successfully.' };
  }

  // Staged update for Executive:
  let existingEntity = storeGetMethod ? storeGetMethod(id) : null;
  if (storeUpdateMethod) {
    storeUpdateMethod(id, { submissionStatus: 'pending_approval' });
  }

  const entityId = String(id);
  const submissionPayload = {
    entityType,
    entityId,
    action: 'update',
    title: title || updates.title || updates.name || updates.code || existingEntity?.title || existingEntity?.name || (entityType + ' edit'),
    store: store || updates.store || updates.storeName || updates.bank || existingEntity?.store || '',
    category: category || updates.category || existingEntity?.category || '',
    priority: priority || updates.priority || 'Normal',
    submittedBy: user.email || 'executive@wouchify.com',
    submittedByName: user.name || 'Content Executive',
    status: 'Pending Approval',
    notes: updates.notes || ('Proposed edits to ' + entityType + ' by ' + (user.name || 'Executive') + '.'),
    dataSnapshot: { ...(existingEntity || {}), ...updates }
  };

  inMemoryStore.addSubmission(submissionPayload);

  safeBackground(async () => {
    if (mongoose.connection.readyState === 1 && Model) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { $or: [{ _id: id }, { id: id }, { code: id }] };
      await Model.findOneAndUpdate(query, { submissionStatus: 'pending_approval' }, { new: true });
      const sub = new Submission(submissionPayload);
      await sub.save();
    }
  }, 'ApprovalHelper Executive Update');

  return {
    entity: existingEntity || updates,
    staged: true,
    message: 'Edits submitted to Operational Manager for review. Live version will update once approved.'
  };
}

/**
 * Helper to handle Maker-Checker workflow on entity deletion.
 */
async function handleEntityDelete({
  id,
  entityType,
  title = '',
  store = '',
  user = {},
  Model,
  storeDeleteMethod,
  storeGetMethod
}) {
  const isExecutive = user.role === 'executive';

  if (!requiresApproval) {
    if (storeDeleteMethod) storeDeleteMethod(id);
    safeBackground(async () => {
      if (mongoose.connection.readyState === 1 && Model) {
        const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { $or: [{ _id: id }, { id: id }, { code: id }] };
        await Model.findOneAndDelete(query);
      }
    }, 'ApprovalHelper Direct Delete');
    return { deleted: true, staged: false, message: 'Deleted successfully.' };
  }

  // Executive deletion request -> queue submission
  const entityId = String(id);
  let existingEntity = storeGetMethod ? storeGetMethod(id) : null;

  const submissionPayload = {
    entityType,
    entityId,
    action: 'delete',
    title: title || existingEntity?.title || existingEntity?.name || (entityType + ' deletion request'),
    store: store || existingEntity?.store || '',
    submittedBy: user.email || 'executive@wouchify.com',
    submittedByName: user.name || 'Content Executive',
    status: 'Pending Approval',
    notes: 'Executive requested deletion of ' + entityType + ' ID: ' + entityId + '.',
    dataSnapshot: existingEntity || {}
  };

  inMemoryStore.addSubmission(submissionPayload);

  safeBackground(async () => {
    if (mongoose.connection.readyState === 1 && Model) {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { $or: [{ _id: id }, { id: id }, { code: id }] };
      await Model.findOneAndUpdate(query, { submissionStatus: 'pending_approval' }, { new: true });
      const sub = new Submission(submissionPayload);
      await sub.save();
    }
  }, 'ApprovalHelper Executive Delete');

  return {
    staged: true,
    message: 'Deletion request submitted to Operational Manager for approval.'
  };
}

module.exports = {
  handleEntityCreate,
  handleEntityUpdate,
  handleEntityDelete
};
