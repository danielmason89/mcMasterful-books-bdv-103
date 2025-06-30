import type { OrderAdapter } from '../types/adapters';
import type { WarehouseAdapter } from '../types/adapters';

export interface AppOrderDatabaseState {
  order: OrderAdapter;
}

export interface AppWarehouseDatabaseState {
  warehouse: WarehouseAdapter;
}