// src/database.ts
import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://127.0.0.1:27017/Ninja-Legends'; 
// Change this to your desired Mongo connection string

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) {
    console.log('Already connected to MongoDB.');
    return;
  }
  try {
    await mongoose.connect(MONGO_URI, {
      // These options are for older mongoose versions:
      // useNewUrlParser: true, useUnifiedTopology: true
    });
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
