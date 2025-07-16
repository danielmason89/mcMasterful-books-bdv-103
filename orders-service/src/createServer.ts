import express from 'express';
import { json } from 'body-parser';
import { router as orderRouter } from '../src/controllers/orderController';

export async function createServer() {
  const app = express();
  app.use(json());
  app.use('/api/orders', orderRouter);
  return app;
}
