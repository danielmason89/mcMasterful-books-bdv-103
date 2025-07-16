import mongoose from 'mongoose';
import { createServer } from '../src/createServer';
import { subscribeToBookAdded } from '../src/messaging/subscribe';

(async () => {
  await mongoose.connect('mongodb://mongo:27017/order-db');
  await subscribeToBookAdded((book) => {
    console.log('BookAdded event received in order-service:', book);
    // cache valid bookId or handle accordingly
  });
  const app = await createServer();
  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`Order service running on port ${port}`));
})();
