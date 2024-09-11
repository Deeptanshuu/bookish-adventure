// routes/leaderboard.js
const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/teamController');

router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await getLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;
