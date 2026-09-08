const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const store = require('../services/inMemoryStore');

router.use(auth);

// Get all users
router.get('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(store.getUsers());
    }
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { next(err); }
});

// Create user
router.post('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const created = store.addUser(req.body);
      return res.status(201).json(created);
    }
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) { next(err); }
});

// Update user
router.put('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const updated = store.updateUser(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'User not found' });
      return res.json(updated);
    }
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (err) { next(err); }
});

// Delete user
router.delete('/:id', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const ok = store.deleteUser(req.params.id);
      if (!ok) return res.status(404).json({ message: 'User not found' });
      return res.json({ message: 'User deleted' });
    }
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) { next(err); }
});

// Toggle status
router.patch('/:id/status', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const toggled = store.toggleUserStatus(req.params.id, req.body.status);
      if (!toggled) return res.status(404).json({ message: 'User not found' });
      return res.json(toggled);
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.status = req.body.status || (user.status === 'active' ? 'suspended' : 'active');
    await user.save();
    res.json(user);
  } catch (err) { next(err); }
});

module.exports = router;
