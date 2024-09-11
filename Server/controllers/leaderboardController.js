//controller/leaderboardController.js

const { getLeaderboard } = require('../services/teamService');

async function handleLeaderboardEvent(req, res) {
    try {
      const leaderboard = await getLeaderboard(); // Fetch the leaderboard from the service
      res.status(200).json(leaderboard); // Send the leaderboard as a JSON response
    } catch (error) {
      console.error('Error retrieving leaderboard:', error);
      res.status(500).send('Error retrieving leaderboard');
    }
  }

module.exports = { handleLeaderboardEvent };