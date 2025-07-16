import mongoose from 'mongoose';
import { createMongoListings } from '../models/listing.factory';

export function getListingsDatabase(name?: string) {
  const dbName = name ?? 'default';
  const db = mongoose.connection.useDb(dbName);
  return createMongoListings(db);          // ✅ now the symbol is in scope
}