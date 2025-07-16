import mongoose from 'mongoose';
import { startServer } from './startServer';

async function bootstrap() {
  try {
    await mongoose.connect('mongodb://mongo-listings:27017/listings-db');
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