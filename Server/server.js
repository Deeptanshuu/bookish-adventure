const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const http = require('http');
const { connectToDatabase } = require('./config/database');
const githubController = require('./controllers/githubController');
const leaderboardController = require('./controllers/leaderboardController');
const { initWebSocketServer, broadcastLeaderboard, setupChangeStream } = require('./services/websocketManager');
const path = require('path');
const helmet = require('helmet');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors('*')); // Enable CORS for all routes
app.use(bodyParser.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Serve static files
app.use(express.static(path.join(__dirname, './dist')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, './dist', 'index.html'),
   function(err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});


// Database connection
connectToDatabase().then(() => {
  // Create HTTP server
  const server = http.createServer(app);

  // Initialize Socket.IO server
  initWebSocketServer(server);

  // Set up change stream in MONGODB
  setupChangeStream();

  // Function to update leaderboard and broadcast it
  async function updateAndBroadcastLeaderboard() {
    try {
      const leaderboard = await leaderboardController.getLeaderboard(); // Fetch leaderboard directly from service
      broadcastLeaderboard(leaderboard); // Broadcast leaderboard to all connected clients
    } catch (error) {
      console.error('Error retrieving leaderboard:', error);
    }
  }

  // Define routes
  app.post('/api/github', githubController.handleGithubEvent);
  app.get('/api/leaderboard', leaderboardController.handleLeaderboardEvent);

  // Start HTTP server
  server.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
    
    // Initial leaderboard broadcast
    updateAndBroadcastLeaderboard();
    
    // Set up interval to update and broadcast leaderboard every 1 minute (60000 ms)
    //const broadcastInterval = setInterval(updateAndBroadcastLeaderboard, 60000);
    
    // Handle server shutdown
    process.on('SIGINT', () => {
      clearInterval(broadcastInterval);
      server.close(() => {
        console.log('Server shut down gracefully');
        process.exit(0);
      });
    });
  });
});
