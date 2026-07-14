const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, full_name, avatar_url, bio, created_at FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { full_name, bio, avatar_url } = req.body;

    const result = await pool.query(
      'UPDATE users SET full_name = $1, bio = $2, avatar_url = $3 WHERE id = $4 RETURNING id, email, full_name, bio, avatar_url',
      [full_name, bio, avatar_url, req.userId]
    );

    res.json({
      message: 'Profile updated',
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
