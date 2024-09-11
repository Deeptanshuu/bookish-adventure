const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { connectToDatabase } = require('./config/database');
const githubController = require('./controllers/githubController');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Database connection
connectToDatabase();

// Routes
app.post('/api/github', githubController.handleGithubEvent);
app.post('/api/leaderboard', githubController.handleLeaderboardEvent);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
