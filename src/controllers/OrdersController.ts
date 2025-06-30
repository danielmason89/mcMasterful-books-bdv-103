import { Body, Controller, Get, Post, Route, Tags } from 'tsoa';

@Route('orders')
@Tags('Orders')
export class OrdersController extends Controller {
  @Post()
  public async createOrder(@Body() bookIds: string[]): Promise<{ orderId: string }> {
    return { orderId: 'mock-order-id' };
  }

  /**
   * List all orders.
   */
  @Get()
  public async listOrders(): Promise<
    Array<{ orderId: string; books: Record<string, number> }>
  > {
    return [
      {
        orderId: 'mock-order-id',
        books: {
          abc123: 2
        }
      }
    ];
  }
}
