import { Router } from 'express';
import { orderAdapter } from '../adapter/orderAdapter';

export const router = Router();

router.post('/orders', async (req, res) => {
  const { bookIds } = req.body;
  const order = await orderAdapter.createOrder(bookIds);
  res.json(order);
});

router.get('/orders', async (_req, res) => {
  const orders = await orderAdapter.listOrders();
  res.json(orders);
});
