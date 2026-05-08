const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Retry after 5s instead of killing the process —
    // keeps the HTTP server alive so Railway healthcheck passes
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
