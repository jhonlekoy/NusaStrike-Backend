const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

// Get subscription plans
router.get('/plans', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM subscription_plans');

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Get user subscription
router.get('/user', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, p.name, p.price, p.features
       FROM subscriptions s
       LEFT JOIN subscription_plans p ON s.plan_id = p.id
       WHERE s.user_id = $1 AND s.status = 'active'
       ORDER BY s.created_at DESC
       LIMIT 1`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.json({
        subscription: null,
        plan: 'free',
      });
    }

    res.json({
      subscription: result.rows[0],
      plan: result.rows[0].name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Create subscription (Midtrans integration)
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { plan_id } = req.body;

    // Here you would integrate with Midtrans payment gateway
    // For now, just create placeholder
    const result = await pool.query(
      `INSERT INTO subscriptions (user_id, plan_id, status, started_at, expires_at)
       VALUES ($1, $2, 'pending', NOW(), NOW() + INTERVAL '1 month')
       RETURNING *`,
      [req.userId, plan_id]
    );

    res.status(201).json({
      message: 'Subscription created',
      subscription: result.rows[0],
      // In real app, return Midtrans payment URL
      payment_url: 'https://midtrans.com/...',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

module.exports = router;
