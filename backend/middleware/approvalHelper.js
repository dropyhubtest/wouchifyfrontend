const mongoose = require('mongoose');
const Submission = require('../models/Submission');
const inMemoryStore = require('../services/inMemoryStore');

/**
 * Helper to handle Maker-Checker workflow on entity creation.
 * If user is an Executive, stage entity as pending_approval and queue a Submission.
 * If user is Manager / Ops Manager, directly approve and activate.
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
  const isExecutive = user.role === 'executive';
  const submissionStatus = isExecutive ? 'pending_approval' : (data.submissionStatus || 'approved');
  const status = isExecutive ? 'pending' : (data.status || 'active');
  const opsManagerApproval = isExecutive ? 'Pending' : 'Approved';
  const managerApproval = isExecutive ? 'Pending' : 'Approved';

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

  let createdEntity = null;

  if (mongoose.connection.readyState === 1 && Model) {
    try {
      const doc = new Model(entityData);
      createdEntity = await doc.save();
    } catch (err) {
      console.warn('Mongoose save failed, falling back to memory store:', err.message);
      if (storeAddMethod) createdEntity = storeAddMethod(entityData);
      else createdEntity = { _id: 'temp-' + Date.now(), ...entityData };
    }
  } else if (storeAddMethod) {
    createdEntity = storeAddMethod(entityData);
  } else {
    createdEntity = { _id: 'temp-' + Date.now(), ...entityData };
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

    if (mongoose.connection.readyState === 1) {
      try {
        const sub = new Submission(submissionPayload);
        await sub.save();
      } catch (err) {
        console.warn('Mongoose submission save failed, falling back to memory store:', err.message);
        inMemoryStore.addSubmission(submissionPayload);
      }
    } else {
      inMemoryStore.addSubmission(submissionPayload);
    }
  }

  return {
    entity: createdEntity,
    staged: isExecutive,
    message: isExecutive
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

  if (!isExecutive) {
    // Direct update for Manager / Ops Manager
    const patch = { ...updates, submissionStatus: 'approved' };
    let updatedDoc = null;
    if (mongoose.connection.readyState === 1 && Model) {
      try {
        const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { $or: [{ _id: id }, { id: id }, { code: id }] };
        updatedDoc = await Model.findOneAndUpdate(query, patch, { new: true, runValidators: true });
      } catch (err) {
        console.warn('Mongoose update failed, falling back to memory store:', err.message);
        if (storeUpdateMethod) updatedDoc = storeUpdateMethod(id, patch);
      }
    } else if (storeUpdateMethod) {
      updatedDoc = storeUpdateMethod(id, patch);
    }
    return { entity: updatedDoc, staged: false, message: 'Updated and published successfully.' };
  }

  // Staged update for Executive:
  let existingEntity = null;
  if (mongoose.connection.readyState === 1 && Model) {
    try {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { $or: [{ _id: id }, { id: id }, { code: id }] };
      existingEntity = await Model.findOneAndUpdate(query, { submissionStatus: 'pending_approval' }, { new: true });
    } catch (err) {
      console.warn('Mongoose staged update failed, falling back to memory store:', err.message);
      if (storeGetMethod) {
        existingEntity = storeGetMethod(id);
        if (existingEntity && storeUpdateMethod) storeUpdateMethod(id, { submissionStatus: 'pending_approval' });
      }
    }
  } else if (storeGetMethod) {
    existingEntity = storeGetMethod(id);
    if (existingEntity && storeUpdateMethod) {
      storeUpdateMethod(id, { submissionStatus: 'pending_approval' });
    }
  }

  // Queue submission with the proposed snapshot
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
    dataSnapshot: { ...(existingEntity ? (existingEntity.toObject ? existingEntity.toObject() : existingEntity) : {}), ...updates }
  };

  if (mongoose.connection.readyState === 1) {
    try {
      const sub = new Submission(submissionPayload);
      await sub.save();
    } catch (err) {
      console.warn('Mongoose submission update save failed, falling back to memory store:', err.message);
      inMemoryStore.addSubmission(submissionPayload);
    }
  } else {
    inMemoryStore.addSubmission(submissionPayload);
  }

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

  if (!isExecutive) {
    if (mongoose.connection.readyState === 1 && Model) {
      try {
        const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { $or: [{ _id: id }, { id: id }, { code: id }] };
        await Model.findOneAndDelete(query);
      } catch (err) {
        console.warn('Mongoose delete failed, falling back to memory store:', err.message);
        if (storeDeleteMethod) storeDeleteMethod(id);
      }
    } else if (storeDeleteMethod) {
      storeDeleteMethod(id);
    }
    return { deleted: true, staged: false, message: 'Deleted successfully.' };
  }

  // Executive deletion request -> queue submission
  const entityId = String(id);
  let existingEntity = null;
  if (mongoose.connection.readyState === 1 && Model) {
    try {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { $or: [{ _id: id }, { id: id }, { code: id }] };
      existingEntity = await Model.findOneAndUpdate(query, { submissionStatus: 'pending_approval' }, { new: true });
    } catch (err) {
      console.warn('Mongoose staged delete failed, falling back to memory store:', err.message);
      if (storeGetMethod) existingEntity = storeGetMethod(id);
    }
  } else if (storeGetMethod) {
    existingEntity = storeGetMethod(id);
  }

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

  if (mongoose.connection.readyState === 1) {
    try {
      const sub = new Submission(submissionPayload);
      await sub.save();
    } catch (err) {
      console.warn('Mongoose submission delete save failed, falling back to memory store:', err.message);
      inMemoryStore.addSubmission(submissionPayload);
    }
  } else {
    inMemoryStore.addSubmission(submissionPayload);
  }

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
