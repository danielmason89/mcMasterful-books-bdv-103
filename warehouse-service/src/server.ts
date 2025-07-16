import { startServer } from '../src/startServer';

startServer().catch((err) => {
  console.error('Failed to start warehouse service:', err);
  process.exit(1);
});