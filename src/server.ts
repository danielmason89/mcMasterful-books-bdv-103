import { startServer } from './startServer.js';

startServer(3000).then(({ address }) => {
  console.log(`🚀 Server running on ${address}`);
  console.log(`📘 Swagger UI available at ${address}/docs`);
});