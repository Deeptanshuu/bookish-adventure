// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

// Middleware to parse incoming JSON
app.use(bodyParser.json());

// Connect to MongoDB
let db;
MongoClient.connect(mongoUri)
  .then(client => {
    console.log('Connected to Database');
    db = client.db('GDSC-1');

    
  })
  .catch(err => console.error(err));

// Test route
app.get('/api/', (req, res) => {
  res.send('Hello, Hacktoberfest!');
});


// Handle incoming GitHub webhooks
app.post('/api/github', async (req, res) => {
  const event = req.headers['x-github-event']; // GitHub event type
  const payload = req.body; // GitHub payload

  console.log(`Received GitHub event: ${event}`);
  console.log(payload);

  if (event === 'pull_request') {
    const action = payload.action; // Action type (e.g., "opened", "closed")
    const isMerged = payload.pull_request.merged; // True if the PR is merged
    const labels = payload.pull_request.labels; // PR labels
    const prUser = payload.pull_request.user.login; // GitHub username of the PR author

    // Only process if the PR is closed and merged
    if (action === 'closed' && isMerged) {
      // Determine the difficulty and points based on labels
      const { difficulty, points } = getDifficultyAndPoints(labels);

      // Find the team by GitHub username
      const team = await getTeamByGithubUsername(prUser);

      if (team) {
        // Update the team's points and solved problem count
        await updateTeamPoints(team.github_username, difficulty, points);
      }
    }
  }

  res.sendStatus(200); // Respond OK
});

// Determine difficulty and points based on PR labels
function getDifficultyAndPoints(labels) {
  const difficultyMapping = {
    'easy': { difficulty: 'easy', points: 2 },
    'medium': { difficulty: 'medium', points: 4 },
    'hard': { difficulty: 'hard', points: 7 }
  };

  for (const label of labels) {
    if (difficultyMapping[label.name]) {
      return difficultyMapping[label.name];
    }
  }
  return { difficulty: 'unknown', points: 0 }; // Default if no label matches
}

// Find a team by GitHub username
async function getTeamByGithubUsername(username) {
  return db.Teams.findOne({ "github_username": username });
}

// Update team's points and solved problem count
async function updateTeamPoints(username, difficulty, points) {
  await db.Teams.updateOne(
    { "github_username": username },
    {
      $inc: {
        [`problems_solved.${difficulty}`]: 1,
        score: points
      }
    }
  );
}

  

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
