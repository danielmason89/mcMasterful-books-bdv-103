import mongoose from 'mongoose';
import { createServer } from '../src/createServer';
import { subscribeToBookAdded } from '../src/messaging/subscribe';

export async function startServer(port = 3001) {
  await mongoose.connect('mongodb://mongo:27017/order-db');
  await subscribeToBookAdded((book) => {
    console.log('BookAdded event received in order-service:', book);
  });

  const app = await createServer();
  const server = app.listen(port, () => {
    console.log(`Order service running at http://localhost:${port}`);
  });

  return { address: `http://localhost:${port}`, close: () => server.close() };
}