import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://mongo:27017/booksdb';

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI, {
      dbName: 'booksdb'
    });
    console.log('✅ Connected to MongoDB');
  }
}
