import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { startServer } from './startServer';

dotenv.config();

async function bootstrap() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/booksdb';
    await mongoose.connect(MONGO_URI, {
      dbName: 'booksdb',
    });

    console.log('🟢 Connected to MongoDB for listings-service');

    const { address } = await startServer(3003);
    console.log(`✅ Listings Service running on ${address}`);
    console.log(`📘 Swagger UI available at ${address}/docs`);
  } catch (error) {
    console.error('❌ Failed to start listings-service:', error);
    process.exit(1);
  }
}

bootstrap();
