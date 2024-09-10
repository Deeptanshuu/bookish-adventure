const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

let db;
MongoClient.connect(mongoUri)
  .then(client => {
    console.log('Connected to Database');
    db = client.db('GDSC-1');  // Ensure this matches your database name
  })
  .catch(err => console.error('Failed to connect to Database:', err));

app.use(bodyParser.json());

app.post('/api/github', async (req, res) => {
  try {
    const event = req.headers['x-github-event'];
    const payload = req.body;

    console.log(`Received GitHub event: ${event}`);
    //console.log(payload);

    if (event === 'pull_request') {
      const action = payload.action;
      const isMerged = payload.pull_request.merged;
      const labels = payload.pull_request.labels;
      const prUser = payload.pull_request.user.login;

      if (action === 'closed' && isMerged) {
        const { difficulty, points } = getDifficultyAndPoints(labels);
        console.log(`Difficulty: ${difficulty}, Points: ${points}`);
        const team = await getTeamByGithubUsername(prUser);

        if (team) {
          if (!team.disqualified) {
            console.log(`Updating points for team: ${team.github_username}`);
            await updateTeamPoints(team.github_username, difficulty, points);
          } else {
            console.log(`Team ${team.github_username} is disqualified and will not receive points.`);
          }
        } else {
          console.warn(`Team not found for GitHub username: ${prUser}`);
        }
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('Error handling GitHub webhook:', error);
    res.sendStatus(500);
  }
});

async function getTeamByGithubUsername(username) {
  if (!db) {
    console.error('Database not initialized');
    return null;
  }
  return db.collection('Teams').findOne({ "github_username": username });
}

async function updateTeamPoints(username, difficulty, points) {
  try {
    const result = await db.collection('Teams').updateOne(
      { "github_username": username },
      {
        $inc: {
          [`problems_solved.${difficulty}`]: 1,
          score: points
        }
      }
    );
    console.log(`Update result: ${result.modifiedCount} document(s) updated.`);
  } catch (error) {
    console.error('Error updating team points:', error);
  }
}

function getDifficultyAndPoints(labels) {
  const difficultyLabels = {
    'easy': { difficulty: 'easy', points: 2 },
    'medium': { difficulty: 'medium', points: 4 },
    'hard': { difficulty: 'hard', points: 7 }
  };

  for (const label of labels) {
    if (difficultyLabels[label.name]) {
      return difficultyLabels[label.name];
    }
  }
  return { difficulty: 'unknown', points: 0 };
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
