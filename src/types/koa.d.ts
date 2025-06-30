import type { OrderAdapter, WarehouseAdapter } from './adapters';

declare module 'koa' {
  interface DefaultState {
    orders: OrderAdapter;
    warehouse: WarehouseAdapter;
  }
}