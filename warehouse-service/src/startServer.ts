import express from 'express';
import mongoose from 'mongoose';
import { setupRoutes } from '../src/controllers/index';
import { initMessaging } from '../src/messaging/initMessaging';

export async function startServer() {
  await mongoose.connect(process.env.MONGO_URL || 'mongodb://mongo:27017/warehouse');

  const app = express();
  app.use(express.json());

  setupRoutes(app); // Setup API routes
  await initMessaging(); // Setup RabbitMQ messaging

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`📦 Warehouse Service listening on port ${port}`);
  });
}