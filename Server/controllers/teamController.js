// controllers/teamController.js
let db;

// Set the database when the app is initialized
function setDatabase(database) {
  db = database;
}

async function getLeaderboard() {
  try {
    return await db.collection('Teams').find({ disqualified: false })
      .sort({ score: -1 })
      .toArray();
  } catch (error) {
    throw error;
  }
}

async function updateTeamPoints(username, difficulty, points) {
  try {
    await db.collection('Teams').updateOne(
      { "github_username": username },
      {
        $inc: {
          [`problems_solved.${difficulty}`]: 1,
          score: points
        }
      }
    );
  } catch (error) {
    throw error;
  }
}

module.exports = {
  setDatabase,
  getLeaderboard,
  updateTeamPoints,
};
