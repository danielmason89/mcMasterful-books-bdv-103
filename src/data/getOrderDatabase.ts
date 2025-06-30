import mongoose from 'mongoose';
import { createMongoOrder } from '../adapters/mongoOrder';

export function getOrderDatabase(name?: string) {
  const dbName = name ?? Math.floor(Math.random() * 100000).toString();
  const db = mongoose.connection.useDb(dbName);
  return createMongoOrder(db);
}
