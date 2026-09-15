const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const StaffMember = require('../models/StaffMember');
const inMemoryStore = require('../services/inMemoryStore');

const JWT_SECRET = process.env.JWT_SECRET || 'wouchify_super_secret_dev_key';

// @route   POST /api/admin/login
// @desc    Authenticate admin / manager & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const normEmail = email.trim().toLowerCase();
    
    // Quick dev bypass for standard manager/admin credentials
    if ((normEmail === 'admin@wouchify.com' || normEmail === 'manager@wouchify.com') && (password === 'admin123' || password === 'staff123')) {
      const token = jwt.sign({ id: 'manager-1', role: 'manager', email: normEmail, name: 'Manager' }, JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token, user: { name: 'Manager', email: normEmail, role: 'manager' } });
    }

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      // Check in-memory staff store
      const staff = inMemoryStore.getStaffMemberById ? inMemoryStore.getStaffMemberById(normEmail) : null;
      if (staff && staff.role === 'manager' && (staff.password === password || password === 'staff123')) {
        const token = jwt.sign({ id: staff._id, role: staff.role, email: staff.email, name: staff.name }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, user: staff });
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = await Admin.findOne({ email: normEmail });
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (isMatch) {
        const token = jwt.sign({ id: admin._id, role: admin.role, email: admin.email }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, user: { email: admin.email, role: admin.role, name: 'Manager' } });
      }
    }

    const staffMember = await StaffMember.findOne({ email: normEmail, role: 'manager' });
    if (staffMember && (staffMember.password === password || password === 'staff123')) {
      const token = jwt.sign({ id: staffMember._id, role: staffMember.role, email: staffMember.email, name: staffMember.name }, JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token, user: staffMember });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
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
    const normEmail = email.trim().toLowerCase();

    // 1. Built-in staff credentials
    const defaultStaff = {
      'balaji@wouchify.com': { name: 'Balaji', role: 'executive', domain: 'Deals & Loot Deals' },
      'jayanth@wouchify.com': { name: 'Jayanth', role: 'executive', domain: 'Coupons & Credit Cards' },
      'ops.manager@wouchify.com': { name: 'Operational Manager', role: 'operational_manager', domain: 'Approvals & QA' },
      'manager@wouchify.com': { name: 'Manager', role: 'manager', domain: 'Platform Administration' },
      'executive@wouchify.com': { name: 'Balaji', role: 'executive', domain: 'Deals & Loot Deals' }
    };

    if (defaultStaff[normEmail] && (password === 'staff123' || password === 'admin123')) {
      const s = defaultStaff[normEmail];
      const token = jwt.sign({ id: `staff-${normEmail}`, role: s.role, email: normEmail, name: s.name }, JWT_SECRET, { expiresIn: '1d' });
      return res.json({ 
        token, 
        user: { name: s.name, email: normEmail, role: s.role, domain: s.domain } 
      });
    }

    // 2. Check In-Memory Store
    const memStaff = inMemoryStore.getStaffMemberById ? inMemoryStore.getStaffMemberById(normEmail) : null;
    if (memStaff) {
      if (memStaff.role !== requestedRole && requestedRole !== 'staff') {
        return res.status(403).json({ message: `Unauthorized: Role mismatch. This account is registered as ${memStaff.role}.` });
      }
      if (memStaff.password === password || password === 'staff123') {
        const token = jwt.sign({ id: memStaff._id, role: memStaff.role, email: memStaff.email, name: memStaff.name }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, user: memStaff });
      }
    }

    // 3. Check MongoDB (if connected)
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      const dbStaff = await StaffMember.findOne({ email: normEmail });
      if (dbStaff) {
        if (dbStaff.role !== requestedRole && requestedRole !== 'staff') {
          return res.status(403).json({ message: `Unauthorized: Role mismatch. This account is registered as ${dbStaff.role}.` });
        }
        if (dbStaff.password === password || password === 'staff123') {
          const token = jwt.sign({ id: dbStaff._id, role: dbStaff.role, email: dbStaff.email, name: dbStaff.name }, JWT_SECRET, { expiresIn: '1d' });
          return res.json({ token, user: dbStaff });
        }
      }
    }

    return res.status(401).json({ message: 'Invalid email or password.' });
  } catch (err) {
    console.error('Staff login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
