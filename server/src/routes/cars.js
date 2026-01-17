const express = require('express');
const router = express.Router();
const pool = require('../db');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  
  const jwt = require('jsonwebtoken');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change_this');
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// POST /api/cars - Add new car
router.post('/', verifyToken, async (req, res) => {
  try {
    const { carName, vinNumber, photos } = req.body;
    const userId = req.userId;

    if (!carName || !vinNumber) {
      return res.status(400).json({ message: 'Missing car name or VIN number' });
    }

    // Check if VIN already exists
    const [existing] = await pool.query('SELECT id FROM cars WHERE vinNumber = ?', [vinNumber]);
    if (existing.length) {
      return res.status(409).json({ message: 'VIN number already exists' });
    }

    const photosJson = photos ? JSON.stringify(photos) : null;
    const [result] = await pool.query(
      'INSERT INTO cars (userId, carName, vinNumber, photos) VALUES (?, ?, ?, ?)',
      [userId, carName, vinNumber, photosJson]
    );

    return res.status(201).json({ 
      id: result.insertId, 
      message: 'Car added successfully',
      car: { id: result.insertId, carName, vinNumber, photos: photos || [] }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/cars - Get all cars for logged-in user (requires auth)
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const [cars] = await pool.query('SELECT id, carName, vinNumber, photos, createdAt FROM cars WHERE userId = ? ORDER BY createdAt DESC', [userId]);
    
    const formattedCars = cars.map(car => ({
      ...car,
      photos: car.photos ? JSON.parse(car.photos) : []
    }));

    return res.json({ cars: formattedCars });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/cars/public - Get all cars for public display (no auth required)
router.get('/public', async (req, res) => {
  try {
    const [cars] = await pool.query('SELECT id, carName, vinNumber, photos, createdAt FROM cars ORDER BY createdAt DESC');
    
    const formattedCars = cars.map(car => ({
      ...car,
      photos: car.photos ? JSON.parse(car.photos) : []
    }));

    return res.json({ cars: formattedCars });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/cars/:id - Delete a car
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const carId = req.params.id;
    const userId = req.userId;

    // Verify ownership
    const [car] = await pool.query('SELECT userId FROM cars WHERE id = ?', [carId]);
    if (!car.length) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (car[0].userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await pool.query('DELETE FROM cars WHERE id = ?', [carId]);
    return res.json({ message: 'Car deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
