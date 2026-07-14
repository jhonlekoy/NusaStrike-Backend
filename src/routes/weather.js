const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get weather for location
router.get('/', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    // Using Open-Meteo (free, no API key needed)
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
        hourly: 'temperature_2m,precipitation_probability',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min',
        timezone: 'auto',
      },
    });

    res.json({
      location: { latitude, longitude },
      weather: response.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch weather' });
  }
});

// Get water conditions (could integrate with actual API later)
router.get('/water-conditions/:spotId', async (req, res) => {
  try {
    // Placeholder - can integrate with real water condition API
    res.json({
      spot_id: req.params.spotId,
      water_temperature: 28,
      water_clarity: 'Good',
      tide: 'Rising',
      current_strength: 'Moderate',
      best_time: '06:00 - 10:00',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch water conditions' });
  }
});

module.exports = router;
