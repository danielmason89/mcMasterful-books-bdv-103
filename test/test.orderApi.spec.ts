import { describe, it, expect } from 'vitest';
import { OrdersApi, Configuration } from "../client";


describe('API: Order Routes', () => {
  it('should create an order', async () => {
    const client = new OrdersApi(new Configuration({ basePath: "http://localhost:3000/" }));
    const res = await client.createOrder({ requestBody: ['book-id-1', 'book-id-2']});
    expect(res.orderId).toBeDefined();
  });
});