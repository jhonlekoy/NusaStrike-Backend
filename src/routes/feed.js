const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

// Get feed (catches from all users)
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        c.id, c.species, c.weight, c.length, c.location, c.photo_url, c.caught_at,
        u.id as user_id, u.full_name, u.avatar_url
       FROM catches c
       JOIN users u ON c.user_id = u.id
       ORDER BY c.caught_at DESC
       LIMIT 50`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

// Like a catch
router.post('/:catchId/like', verifyToken, async (req, res) => {
  try {
    await pool.query(
      'INSERT INTO likes (user_id, catch_id) VALUES ($1, $2)',
      [req.userId, req.params.catchId]
    );

    res.json({ message: 'Liked' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to like' });
  }
});

// Comment on a catch
router.post('/:catchId/comments', verifyToken, async (req, res) => {
  try {
    const { text } = req.body;

    const result = await pool.query(
      'INSERT INTO comments (user_id, catch_id, text) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, req.params.catchId, text]
    );

    res.status(201).json({
      message: 'Comment added',
      comment: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

module.exports = router;
