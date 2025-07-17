import type { OrderAdapter } from '../adapter/memoryOrder';

declare module 'koa' {
  interface DefaultState {
    orders: OrderAdapter;
  }
}
