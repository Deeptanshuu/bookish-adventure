const WebSocket = require('ws');

let wss;

function initWebSocketServer(server) {
  wss = new WebSocket.Server({ server });
  
  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    
    ws.on('message', (message) => {
      console.log(`Received message => ${message}`);
    });
    
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
    
    // Optionally, send a welcome message to the new client
    ws.send('Welcome to the WebSocket server');
  });
}

function broadcastLeaderboard(leaderboard) {
  if (wss) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(leaderboard));
      }
    });
  }
}

module.exports = { initWebSocketServer, broadcastLeaderboard };
