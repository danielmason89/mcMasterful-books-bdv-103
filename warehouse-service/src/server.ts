import { startServer } from './startServer.js';

startServer().then(({ address }) => {
  console.log(`🚀 Server running on ${address}`);
  console.log('✅ Server running at http://0.0.0.0:3000');
  console.log(`📘 Swagger UI available at ${address}/docs`);
}).catch((err) => {
  console.error('❌ Failed to start warehouse service:', err);
  process.exit(1);
});