// services/websocketManager.js
const { Server } = require('socket.io');
const { getLeaderboard } = require('../services/teamService'); // Import getLeaderboard

let io;

function initWebSocketServer(server) {
  io = new Server(server, {
    cors: {
      origin: '*', // Adjust the origin to your frontend URL
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    // Fetch and send the leaderboard to the newly connected client
    getLeaderboard()
      .then((leaderboard) => {
        socket.emit('leaderboard_update', leaderboard);
      })
      .catch((error) => {
        console.error('Error fetching leaderboard:', error);
      });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  });
}

// Broadcast the leaderboard to all connected clients
function broadcastLeaderboard(leaderboard) {
  if (io) {
    io.emit('leaderboard_update', leaderboard);
  }
}

module.exports = { initWebSocketServer, broadcastLeaderboard };
