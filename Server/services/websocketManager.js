const { Server } = require('socket.io'); // Import socket.io library

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

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    // Optionally, send a welcome message to the new client
    socket.send('Welcome to the WebSocket server');
  });
}

function broadcastLeaderboard(leaderboard) {
  if (io) {
    io.emit('leaderboard_update', leaderboard); // Emit the leaderboard update to all connected clients
  }
}



module.exports = { initWebSocketServer, broadcastLeaderboard };
