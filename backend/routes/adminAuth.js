const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'wouchify_super_secret_dev_key';

// @route   POST /api/admin/login
// @desc    Authenticate admin & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // If MongoDB is not connected or in dev mode without DB, handle dev credentials immediately
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      if (email === 'admin@wouchify.com' && password === 'admin123') {
        const token = jwt.sign({ id: 'dev-admin-id', role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, user: { email, role: 'admin' } });
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 1. Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      // Temporarily, if no admin exists, create one (FOR DEV ONLY - remove in prod)
      if (email === 'admin@wouchify.com' && password === 'admin123') {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newAdmin = new Admin({ email, password: hashedPassword });
        await newAdmin.save();
        
        const token = jwt.sign({ id: newAdmin._id, role: newAdmin.role }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, user: { email: newAdmin.email, role: newAdmin.role } });
      }

      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Validate password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Return JWT
    const payload = { id: admin._id, role: admin.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { email: admin.email, role: admin.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/staff-login
// @desc    Authenticate staff (operational_manager, manager, executive)
router.post('/staff-login', async (req, res) => {
  const { email, password, requestedRole } = req.body;

  if (!email || !password || !requestedRole) {
    return res.status(400).json({ message: 'Please provide email, password, and requestedRole' });
  }

  try {
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      // Temporarily create staff if missing (DEV ONLY)
      if (email === `${requestedRole}@wouchify.com` && password === 'staff123') {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newStaff = new Admin({ email, password: hashedPassword, role: requestedRole });
        await newStaff.save();
        
        const token = jwt.sign({ id: newStaff._id, role: newStaff.role }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, user: { email: newStaff.email, role: newStaff.role } });
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (admin.role !== requestedRole) {
      return res.status(403).json({ message: 'Unauthorized: Role mismatch' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = { id: admin._id, role: admin.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { email: admin.email, role: admin.role } });
  } catch (err) {
    console.error('Staff login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
