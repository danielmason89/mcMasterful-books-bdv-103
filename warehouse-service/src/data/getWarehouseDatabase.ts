import mongoose from 'mongoose';
import { createMongoWarehouse } from '../adapters/mongoWarehouse';

export function getWarehouseDatabase(name?: string) {
  const dbName = name ?? Math.floor(Math.random() * 100000).toString();
  const db = mongoose.connection.useDb(dbName);
  return createMongoWarehouse(db);
}
