// services/websocketManager.js
const { Server } = require('socket.io');
const { getLeaderboard } = require('../services/teamService');
const { getDatabase } = require('../config/database');

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


function setupChangeStream() {
  const db = getDatabase();
  const Teams = db.collection('Teams');
  const changeStream = Teams.watch();

  console.log('Change stream setup complete.');

  changeStream.on('change', async (change) => {
    //console.log('Change detected:', change);
    console.log('Change detected at database');

    try {
      const leaderboard = await getLeaderboard(); // Fetch updated leaderboard
      broadcastLeaderboard(leaderboard);
    } catch (error) {
      console.error('Error retrieving updated leaderboard:', error);
    }
  });

  changeStream.on('error', (error) => {
    console.error('Change stream error:', error);
    setTimeout(() => {
      console.log('Reconnecting to the change stream...');
      setupChangeStream(); // Attempt to reinitialize
    }, 5000); // Retry after 5 seconds
  });
}

module.exports = { initWebSocketServer, broadcastLeaderboard, setupChangeStream };
