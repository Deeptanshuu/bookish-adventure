const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { connectToDatabase } = require('./config/database');
const githubController = require('./controllers/githubController');
const leaderboardController = require('./controllers/leaderboardController');
const { initWebSocketServer } = require('./services/websocketManager');
const { Server } = require('ws');


const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Database connection
connectToDatabase();

// Routes
app.post('/api/github', githubController.handleGithubEvent);
app.get('/api/leaderboard', leaderboardController.handleLeaderboardEvent);


// Start server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

initWebSocketServer(server);