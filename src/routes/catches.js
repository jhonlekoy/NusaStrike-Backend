const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

// Log a catch
router.post('/', verifyToken, async (req, res) => {
  try {
    const { species, weight, length, location, latitude, longitude, photo_url, notes } = req.body;

    const result = await pool.query(
      `INSERT INTO catches (user_id, species, weight, length, location, latitude, longitude, photo_url, notes, caught_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
       RETURNING *`,
      [req.userId, species, weight, length, location, latitude, longitude, photo_url, notes]
    );

    res.status(201).json({
      message: 'Catch logged successfully',
      catch: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to log catch' });
  }
});

// Get user's catches
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM catches WHERE user_id = $1 ORDER BY caught_at DESC',
      [req.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch catches' });
  }
});

// Get catch by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM catches WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Catch not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch catch' });
  }
});

// Get statistics
router.get('/stats/summary', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_catches,
        AVG(weight) as avg_weight,
        MAX(weight) as max_weight,
        COUNT(DISTINCT species) as species_count
       FROM catches WHERE user_id = $1`,
      [req.userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
