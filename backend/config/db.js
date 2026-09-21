const mongoose = require('mongoose');
const dns = require('dns');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config();

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

// Disable command buffering so queries instantly fallback to in-memory store if DB is disconnected/offline
mongoose.set('bufferCommands', false);

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://rahuldropyhub_db_user:Wouchify%402026@cluster0.shilkmv.mongodb.net/wouchify?appName=Cluster0';

let cachedConnection = null;
let isConnecting = false;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnection && isConnecting) {
    try {
      await cachedConnection;
      return mongoose.connection;
    } catch (err) {
      cachedConnection = null;
      isConnecting = false;
    }
  }

  isConnecting = true;
  cachedConnection = mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 1500,
    connectTimeoutMS: 1500,
    maxPoolSize: 10,
    minPoolSize: 1,
    socketTimeoutMS: 1500,
  });

  try {
    await cachedConnection;
    isConnecting = false;
    console.log('✅ Connected to MongoDB Atlas successfully');
    return mongoose.connection;
  } catch (err) {
    cachedConnection = null;
    isConnecting = false;
    console.error('❌ MongoDB Atlas connection error:', err.message);
    throw err;
  }
}

module.exports = { connectDB, MONGO_URI };
