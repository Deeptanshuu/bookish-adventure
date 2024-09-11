// services/websocketService.js
const WebSocket = require('ws');
const { getLeaderboard } = require('../controllers/teamController');

let wss;

function setupWebSocket() {
  wss = new WebSocket.Server({ port: 8080 });

  wss.on('connection', (ws) => {
    console.log('Client connected');
    sendLeaderboard(ws);

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
}

async function sendLeaderboard(ws) {
  const leaderboard = await getLeaderboard();
  ws.send(JSON.stringify(leaderboard));
}

async function broadcastLeaderboard() {
  const leaderboard = await getLeaderboard();
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(leaderboard));
    }
  });
}

module.exports = {
  setupWebSocket,
  broadcastLeaderboard,
};
