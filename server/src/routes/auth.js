const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { customerName, email, phoneNumber, vehicleRegNumber, password } = req.body;
    if (!customerName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO users (customerName, email, phoneNumber, vehicleRegNumber, password) VALUES (?, ?, ?, ?, ?)`,
      [customerName, email, phoneNumber || null, vehicleRegNumber || null, hashed]
    );

    return res.status(201).json({ id: result.insertId, message: 'User registered' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const loginEmail = email || username; // Accept either email or username field
    console.log('Login attempt:', { loginEmail, passwordLength: password?.length });
    
    if (!loginEmail || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ message: 'Missing credentials' });
    }

    const [rows] = await pool.query('SELECT id, password, customerName, email FROM users WHERE email = ?', [loginEmail]);
    console.log('DB query result rows:', rows.length);
    
    if (!rows.length) {
      console.log('User not found:', loginEmail);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    console.log('User found, comparing passwords...');
    const match = await bcrypt.compare(password, user.password);
    console.log('Password match:', match);
    
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, name: user.customerName, email: user.email }, process.env.JWT_SECRET || 'change_this', { expiresIn: '7d' });
    return res.json({ token, user: { id: user.id, name: user.customerName, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
