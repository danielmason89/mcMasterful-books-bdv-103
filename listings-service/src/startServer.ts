import http from 'http';
import { AddressInfo } from 'net';
import { createApp } from './createApp.js';
import { connectToDatabase } from './lib/db.js';

import { getOrderDatabase } from '../../orders-service/src/data/getOrderDatabase.js';
import { getWarehouseDatabase } from '../../warehouse-service/src/data/getWarehouseDatabase.js';

import { connectToMessageBus } from './lib/message-bus';

export async function startServer(
  port = 0,
  useRandomDb = false
): Promise<{
  address: string;
  server: http.Server;
  close: () => Promise<void>;
}> {
  await connectToDatabase();
  await connectToMessageBus();

  const dbName = useRandomDb
    ? Math.floor(Math.random() * 100000).toString()
    : undefined;

  const orders = getOrderDatabase(dbName);
  const _warehouse = getWarehouseDatabase(dbName);

  const warehouseAdapter = {
    findBookOnShelf: async (bookId: string) => {
      const shelves = ['A', 'B', 'C'];

      const results = await Promise.all(
        shelves.map(async (shelf) => {
          const found = await _warehouse.findBookOnShelf(bookId, shelf);
          return found ? { shelf, count: found.count } : null;
        })
      );

      return results.filter(
        (item): item is { shelf: string; count: number } => item !== null
      );
    },

    placeBooksOnShelf: (bookId: string, shelf: string, count: number) => 
      _warehouse.placeBooksOnShelf(bookId, shelf, count),
    getBooksOnShelf: _warehouse.getBooksOnShelf,
    getTotalStock: _warehouse.getTotalStock,
    removeBooksFromShelf: _warehouse.removeBooksFromShelf
  };

  const app = createApp({ orders, warehouse: warehouseAdapter });

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      const addressInfo = server.address() as AddressInfo;
      resolve({
        address: `http://localhost:${addressInfo.port}`,
        server,
        close: () =>
          new Promise((res, rej) =>
            server.close((err) => (err ? rej(err) : res()))
          )
      });
    });
  });
}