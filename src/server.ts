import { startServer } from './startServer.js';

startServer(3000).then(({ address }) => {
  console.log(`🚀 Server running on ${address}`);
  console.log('✅ Server running at http://0.0.0.0:3000');
  console.log(`📘 Swagger UI available at ${address}/docs`);
});
