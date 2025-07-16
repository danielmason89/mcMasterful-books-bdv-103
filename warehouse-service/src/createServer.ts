import express from 'express';
import { json } from 'body-parser';
import { connectToMessageBroker } from './messaging/publish';
import { router as warehouseRouter } from '../src/controllers/warehouseController';

export async function createServer() {
  await connectToMessageBroker();

  const app = express();
  app.use(json());

  app.use('/api/warehouse', warehouseRouter);

  return app;
}