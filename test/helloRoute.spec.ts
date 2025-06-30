import { it, expect } from 'vitest';
import { setupTestServer, TestContext } from './helpers';
import { DefaultApi, Configuration } from '../client';

const ctx = {} as TestContext;
setupTestServer(ctx);

it('should return greeting from /hello/{name}', async () => {
  const client = new DefaultApi(new Configuration({ basePath: ctx.address }));
  const res = await client.greet({ name: 'Daniel' });
  expect(res).toBe('Hello Daniel');
});
