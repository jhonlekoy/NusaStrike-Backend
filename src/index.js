require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Routes imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const catchesRoutes = require('./routes/catches');
const spotsRoutes = require('./routes/spots');
const weatherRoutes = require('./routes/weather');
const feedRoutes = require('./routes/feed');
const subscriptionRoutes = require('./routes/subscription');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/catches', catchesRoutes);
app.use('/api/spots', spotsRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/subscription', subscriptionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎣 NusaStrike Backend running on port ${PORT}`);
});

module.exports = app;
