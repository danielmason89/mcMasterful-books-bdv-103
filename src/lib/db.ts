/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * Ensures that only one connection is made during application runtime.
 */
import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://mongo:27017/booksdb';
const uri = process.env.MONGO_URI || MONGO_URI;

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, {
      dbName: 'booksdb'
    });
    console.log(`✅ Connected to MongoDB at ${uri}`);
  }
}
