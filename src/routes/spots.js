const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

// Get all spots
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM fishing_spots ORDER BY created_at DESC LIMIT 100'
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch spots' });
  }
});

// Get spots near location
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const result = await pool.query(
      `SELECT *, 
        earth_distance(ll_to_earth($1, $2), ll_to_earth(latitude, longitude)) / 1609.34 as distance_km
       FROM fishing_spots
       WHERE earth_distance(ll_to_earth($1, $2), ll_to_earth(latitude, longitude)) / 1609.34 < $3
       ORDER BY distance_km ASC`,
      [latitude, longitude, radius]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch nearby spots' });
  }
});

// Create a spot (premium feature)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, description, latitude, longitude, fish_species } = req.body;

    const result = await pool.query(
      `INSERT INTO fishing_spots (name, description, latitude, longitude, fish_species, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description, latitude, longitude, fish_species, req.userId]
    );

    res.status(201).json({
      message: 'Spot created successfully',
      spot: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create spot' });
  }
});

module.exports = router;
