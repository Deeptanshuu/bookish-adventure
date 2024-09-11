const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const http = require('http');
const { connectToDatabase } = require('./config/database');
const githubController = require('./controllers/githubController');
const leaderboardController = require('./controllers/leaderboardController');
const { initWebSocketServer, broadcastLeaderboard } = require('./services/websocketManager');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Database connection
connectToDatabase().then(() => {
  // Create HTTP server
  const server = http.createServer(app);

  // Initialize Socket.IO server
  initWebSocketServer(server);

  // Function to update leaderboard and broadcast it
  async function updateAndBroadcastLeaderboard() {
    try {
      const leaderboard = await leaderboardController.getLeaderboard(); // Fetch leaderboard directly from service
      broadcastLeaderboard(leaderboard); // Broadcast leaderboard to all connected clients
    } catch (error) {
      console.error('Error retrieving leaderboard:', error);
    }
  }

  // Start HTTP server
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    updateAndBroadcastLeaderboard(); // Initial leaderboard broadcast
  });
});
