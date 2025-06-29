/**
 * Entry point of the Koa server.
 * Connects to MongoDB and starts the API server on a specified port.
 */

import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import qs from 'koa-qs';
import Router from '@koa/router';
import { koaSwagger } from 'koa2-swagger-ui';
import * as swaggerDocument from './generated/swagger.json';

import zodRouter from './routes.js'; // your existing koa-zod-router
import { RegisterRoutes } from './generated/routes';
import { connectToDatabase } from './lib/db.js';

const app = new Koa();
qs(app);
app.use(cors());
app.use(bodyParser());

const mainRouter = new Router();

RegisterRoutes(mainRouter);

mainRouter.use(zodRouter.routes());
mainRouter.use(zodRouter.allowedMethods());

app.use(mainRouter.routes());
app.use(mainRouter.allowedMethods());

app.use(
  koaSwagger({
    routePrefix: '/docs',
    specPrefix: '/docs/spec',
    exposeSpec: true,
    swaggerOptions: {
      spec: swaggerDocument,
    },
  })
);

const PORT = 3000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📘 Swagger UI available at http://localhost:${PORT}/docs`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  });
