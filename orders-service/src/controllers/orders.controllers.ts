import { Route, Controller, Post, Get, Body, Request } from 'tsoa';
import type { Request as KoaRequest } from 'koa';

import { Router } from 'express';
import { mongoOrder } from '../adapter/mongoOrder';

export const router = Router();
const orderAdapter = mongoOrder;

router.post('/orders', async (req, res) => {
  const { bookIds } = req.body;
  const order = await orderAdapter.createOrder(bookIds);
  res.json(order);
});

router.get('/orders', async (_req, res) => {
  const orders = await orderAdapter.listOrders();
  res.json(orders);
});

/**
 * Handles order creation and retrieval
 */
@Route('orders')
export class OrdersController extends Controller {
  /**
   * Create a new order
   * @param books List of book IDs
   */
  @Post()
  public async createOrder(
    @Body() books: string[],
    @Request() request: KoaRequest
  ): Promise<{ orderId: string }> {
    const ctx = request.ctx;
    return await ctx.state.order.createOrder(books);
  }

  /**
   * Get all orders
   */
  @Get()
  public async listOrders(
    @Request() request: KoaRequest
  ): Promise<Array<{ orderId: string; books: Record<string, number> }>> {
    const ctx = request.ctx;
    return await ctx.state.order.listOrders();
  }
}
