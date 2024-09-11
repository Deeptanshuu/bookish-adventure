const { getDatabase } = require('../config/database');

async function getTeamByGithubUsername(username) {
  const db = getDatabase();
  return db.collection('Teams').findOne({ "github_username": username });
}

async function updateTeamPoints(username, difficulty, points) {
  const db = getDatabase();
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


async function getLeaderboard() {
  const db = getDatabase();
  try {
      return await db.collection('Teams').find({ disqualified: false })
          .project({
              team_name: 1,
              score: 1,
              team_members: 1, // Include team_members if you want to show member names
              'problems_solved.easy': 1,
              'problems_solved.medium': 1,
              'problems_solved.hard': 1
          })
          .sort({ score: -1 })
          .toArray();
  } catch (error) {
      throw error;
  }
}

module.exports = { getTeamByGithubUsername, updateTeamPoints, getLeaderboard };
