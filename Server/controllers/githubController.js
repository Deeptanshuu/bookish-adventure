const { getTeamByGithubUsername, updateTeamPoints } = require('../services/teamService');
const { getDifficultyAndPoints } = require('../utils/helpers');
const { broadcastLeaderboard } = require('../services/websocketManager');

async function handleGithubEvent(req, res) {
  try {
    const event = req.headers['x-github-event'];
    const payload = req.body;

    console.log(`Received GitHub event: ${event}`);

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

            // Fetch and broadcast the updated leaderboard
            const leaderboard = await getLeaderboard();
            broadcastLeaderboard(leaderboard);

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
}


module.exports = { handleGithubEvent };
