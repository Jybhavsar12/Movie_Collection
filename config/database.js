const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Remove deprecated options
      maxPoolSize: process.env.DB_MAX_POOL_SIZE || 10,
      serverSelectionTimeoutMS: process.env.DB_SERVER_SELECTION_TIMEOUT || 5000,
      socketTimeoutMS: 45000,
      // Removed: useNewUrlParser, useUnifiedTopology, bufferCommands, bufferMaxEntries
    });

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
