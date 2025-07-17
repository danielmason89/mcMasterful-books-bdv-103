import type { OrderAdapter } from '../../../src/types/adapters';
import type { WarehouseAdapter } from '../../../src/types/adapters';

export interface AppOrderDatabaseState {
  order: OrderAdapter;
}

export interface AppWarehouseDatabaseState {
  warehouse: WarehouseAdapter;
}
