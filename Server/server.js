// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

// Middleware to parse incoming JSON
app.use(bodyParser.json());

// Connect to MongoDB
let db;
MongoClient.connect(mongoUri)
  .then(client => {
    console.log('Connected to Database');
    db = client.db('GDSC-1');

    
  })
  .catch(err => console.error(err));

// Test route
app.get('/api/', (req, res) => {
  res.send('Hello, Hacktoberfest!');
});


// Handle incoming GitHub webhooks
app.post('/api/github', (req, res) => {
    const event = req.headers['x-github-event'];
    const payload = req.body;
  
    console.log(`Received GitHub event: ${event}`);
    console.log(payload);
  
    res.sendStatus(200);  // Respond OK
});
  

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
