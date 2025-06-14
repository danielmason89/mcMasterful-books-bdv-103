/**
 * Entry point of the Koa server.
 * Connects to MongoDB and starts the API server on a specified port.
 */

import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import qs from 'koa-qs';
import routes from './routes.js';
import { connectToDatabase } from './lib/db.js';

const app = new Koa();
app.use(cors());
qs(app);

app.use(bodyParser());
app.use(routes.allowedMethods());
app.use(routes.routes());

const PORT = 3000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  });
