import { beforeEach, afterEach } from 'vitest';
import { startServer } from '../src/startServer.js';

export interface TestContext {
  address: string;
  close: () => Promise<void>;
}

export function setupTestServer(context: TestContext) {
  beforeEach(async () => {
    const { address, close } = await startServer(0, true);
    context.address = address;
    context.close = close;
  });

  afterEach(async () => {
    await context.close();
  });
}
