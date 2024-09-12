const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  
  try {
    const client = await MongoClient.connect(mongoUri);
    console.log('Connected to Database');
    db = client.db('GDSC-1');
  } catch (error) {
    console.error('Failed to connect to Database:', error);
  }
}

function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}



module.exports = { connectToDatabase , getDatabase };
