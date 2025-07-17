import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://mongo:27017/booksdb';

export async function connectToDatabase() {
  const uri = process.env.MONGO_URI || MONGO_URI;
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, {
      dbName: 'booksdb'
    });
    console.log(`✅ Connected to MongoDB at ${uri}`);
  }
}
