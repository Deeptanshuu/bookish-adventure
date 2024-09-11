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

module.exports = { getTeamByGithubUsername, updateTeamPoints };
