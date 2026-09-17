const { connectDB } = require('../backend/config/db');
const app = require('../backend/server');

// Pre-initiate database connection on cold start
connectDB().catch(err => {
  console.warn('Initial serverless DB connection warning:', err.message);
});

module.exports = app;

