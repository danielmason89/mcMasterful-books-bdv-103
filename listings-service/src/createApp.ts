import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import qs from 'koa-qs';
import Router from '@koa/router';
import { koaSwagger } from 'koa2-swagger-ui';
import * as swaggerDocument from './generated/swagger.json';

import zodRouter from '../src/book.routes';
import { RegisterRoutes } from './generated/routes';

import type { OrderAdapter, WarehouseAdapter } from './types/adapters';
import path from 'path';
import fs from 'fs';

export function createApp(state: {
  orders: OrderAdapter;
  warehouse: WarehouseAdapter;
}) {
  const app = new Koa();

  qs(app);
  app.use(cors());
  app.use(bodyParser());

  app.use(async (ctx, next) => {
    ctx.state.orders = state.orders;
    ctx.state.warehouse = state.warehouse;
    await next();
  });

  const mainRouter = new Router();

  const swaggerPath = path.resolve(__dirname, './generated/swagger.json');
  mainRouter.get('/docs/spec/swagger.json', async (ctx) => {
    ctx.set('Content-Type', 'application/json');
    ctx.body = fs.readFileSync(swaggerPath, 'utf-8');
  });

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
        spec: swaggerDocument
      }
    })
  );

  return app;
}
