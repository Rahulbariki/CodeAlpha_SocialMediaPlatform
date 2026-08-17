const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codealpha_socialmedia');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB Connection Warning: ${error.message}`);
    console.warn('Running server in fallback memory mode.');
  }
};

module.exports = connectDB;
