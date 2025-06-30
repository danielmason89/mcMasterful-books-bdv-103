import http from 'http';
import { AddressInfo } from 'net';
import { createApp } from './createApp.js';
import { connectToDatabase } from './lib/db.js';

import { getOrderDatabase } from './data/getOrderDatabase.js';
import { getWarehouseDatabase } from './data/getWarehouseDatabase.js';

export async function startServer(port = 0, useRandomDb = false): Promise<{
  address: string;
  server: http.Server;
  close: () => Promise<void>;
}> {
  await connectToDatabase();

  const dbName = useRandomDb ? Math.floor(Math.random() * 100000).toString() : undefined;

  const orders = getOrderDatabase(dbName);
  const _warehouse = getWarehouseDatabase(dbName);

  const app = createApp({ orders, _warehouse });

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      const addressInfo = server.address() as AddressInfo;
      resolve({
        address: `http://localhost:${addressInfo.port}`,
        server,
        close: () =>
          new Promise((res, rej) => server.close((err) => (err ? rej(err) : res()))),
      });
    });
  });
}
