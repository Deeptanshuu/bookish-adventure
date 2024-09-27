const { Server } = require('socket.io');
const { getLeaderboard } = require('../services/teamService');
const { getDatabase } = require('../config/database');

let io;

// Initialize WebSocket Server
function initWebSocketServer(server) {
  io = new Server(server, {
    cors: {
      origin: '*', // Adjust to match your frontend domain
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('New WebSocket connection:', socket.id);

    // Send the current leaderboard to the newly connected client
    sendLeaderboard(socket);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

// Helper to fetch and send leaderboard to a specific socket
async function sendLeaderboard(socket) {
  try {
    const leaderboard = await getLeaderboard();
    socket.emit('leaderboard_update', leaderboard);
  } catch (error) {
    console.error('Error sending leaderboard to client:', error);
  }
}

// Broadcast the leaderboard to all connected clients
function broadcastLeaderboard(leaderboard) {
  if (io) {
    io.emit('leaderboard_update', leaderboard);
    console.log('Broadcasted leaderboard to all clients.');
  }
}

// Set up MongoDB change stream and watch for updates
function setupChangeStream() {
  const db = getDatabase();
  const Teams = db.collection('Teams');
  const changeStream = Teams.watch();

  console.log('Change stream setup complete.');

  changeStream.on('change', async (change) => {
    //console.log('Change detected in Teams collection:', change);

    try {
      const leaderboard = await getLeaderboard(); // Fetch the updated leaderboard
      broadcastLeaderboard(leaderboard); // Broadcast to all connected clients
    } catch (error) {
      console.error('Error broadcasting updated leaderboard:', error);
    }
  });

  // Handle errors in the change stream and attempt reconnection
  changeStream.on('error', (error) => {
    console.error('Change stream error:', error);

    setTimeout(() => {
      console.log('Reconnecting to the change stream...');
      setupChangeStream(); // Attempt to reinitialize the stream
    }, 5000); // Retry after 5 seconds
  });
}

module.exports = { initWebSocketServer, broadcastLeaderboard, setupChangeStream };
