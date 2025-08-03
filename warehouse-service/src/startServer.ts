import http from 'http';
import { AddressInfo } from 'net';
import express from 'express';
import amqp from 'amqplib';

import { connectToDatabase } from '../src/lib/db';
import { connectToMessageBroker } from '../src/lib/connectToMessageBroker';
import { getWarehouseDatabase } from '../src/data/getWarehouseDatabase';

const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';

export async function startServer(
  port = 0,
  useRandomDb = false
): Promise<{
  address: string;
  server: http.Server;
  close: () => Promise<void>;
}> {
  await connectToDatabase();

  try {
    console.log(`📡 Connecting to RabbitMQ at ${rabbitmqUrl}`);
    await amqp.connect(rabbitmqUrl); // Use this only if not handled in connectToMessageBroker()
    await connectToMessageBroker();
    console.log('✅ Connected to RabbitMQ');
  } catch (err) {
    console.error('❌ Failed to connect to RabbitMQ:', err);
    throw err;
  }

  const dbName = useRandomDb
    ? Math.floor(Math.random() * 100000).toString()
    : undefined;

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
    placeBooksOnShelf: _warehouse.placeBooksOnShelf,
    getBooksOnShelf: _warehouse.getBooksOnShelf,
    getTotalStock: _warehouse.getTotalStock,
    removeBooksFromShelf: _warehouse.removeBooksFromShelf,
  };

  const app = createApp({ orders: {}, warehouse: warehouseAdapter });

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      const addressInfo = server.address() as AddressInfo;
      resolve({
        address: `http://localhost:${addressInfo.port}`,
        server,
        close: () =>
          new Promise((res, rej) =>
            server.close((err: any) => (err ? rej(err) : res()))
          ),
      });
    });
  });
}

function createApp({
  orders,
  warehouse,
}: {
  orders: {};
  warehouse: {
    findBookOnShelf: (bookId: string) => Promise<{ shelf: string; count: number }[]>;
    placeBooksOnShelf: any;
    getBooksOnShelf: any;
    getTotalStock: any;
    removeBooksFromShelf: any;
  };
}) {
  const app = express();

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}
