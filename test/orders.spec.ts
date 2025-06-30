import { it, expect } from 'vitest';
import { setupTestServer, TestContext } from './helpers';
import { OrdersApi, Configuration } from '../client';


const ctx = {} as TestContext;
setupTestServer(ctx);

it('should create and list orders successfully', async () => {
  const client = new OrdersApi(new Configuration({ basePath: ctx.address }));

  // Create order
  const orderRes = await client.createOrder({
    requestBody: ['abc123', 'abc123']
  });

  expect(orderRes.orderId).toBeDefined();

  // List orders
  const listRes = await client.listOrders();
  expect(Array.isArray(listRes)).toBe(true);
  expect(listRes.length).toBeGreaterThan(0);
});
