const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDatabase = async () => {
  try {
    // For production, require MONGODB_URI
    if (process.env.NODE_ENV === 'production') {
      const mongoUri = process.env.MONGODB_URI;
      if (!mongoUri) {
        throw new Error('MONGODB_URI environment variable is required in production');
      }

      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      console.log('MongoDB connected successfully');
      return;
    }

    // For development, try MongoDB Atlas first, then fallback to in-memory
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/employee-management';
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
      console.log('MongoDB connected');
    } catch (atlasError) {
      console.log('MongoDB Atlas connection failed, starting in-memory MongoDB...', atlasError.message);
      try {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        console.log('In-memory MongoDB connected for development');
      } catch (memoryError) {
        console.error('Failed to start in-memory MongoDB', memoryError.message);
        throw memoryError;
      }
    }
  } catch (error) {
    console.error('Database connection failed:', error.message);
    throw error;
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('Database disconnected');
  } catch (error) {
    console.error('Error disconnecting database:', error);
  }
};

module.exports = { connectDatabase, disconnectDatabase };
