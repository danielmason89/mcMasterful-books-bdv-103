import mongoose, { Connection, Model, Schema, InferSchemaType } from 'mongoose';

const ListingSchema = new Schema({
  name:        { type: String, required: true },
  author:      { type: String, required: true },
  description: { type: String, default: '' },
  price:       { type: Number, required: true },
  image:       { type: String }
});

export type ListingDoc = InferSchemaType<typeof ListingSchema>;


export function createMongoListings(conn: Connection): Model<ListingDoc> {
  return conn.models.Listing ?? conn.model<ListingDoc>('Listing', ListingSchema);
}

export function getListingsDatabase(name = 'default') {
  const db = mongoose.connection.useDb(name);
  return createMongoListings(db);
}