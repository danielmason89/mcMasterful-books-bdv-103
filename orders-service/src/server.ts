import { startServer } from './startServer.js';

startServer(3001).then(({ address }) => {
  console.log(`🚀 Order Service running on ${address}`);
  console.log('✅ API available at http://0.0.0.0:3001/api/orders');
});
