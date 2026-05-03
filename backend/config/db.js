const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://ems:2%40Akapondo@cluster0.ita4mdp.mongodb.net/?appName=Cluster0';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed', error);
    process.exit(1);
  }
};

module.exports = connectDatabase;
