import mongoose from "mongoose";
import { BookModel } from "./models/book";

export function getListingsDatabase(name?: string) {
  const dbName = name ?? 'default';
  const db = mongoose.connection.useDb(dbName);
  return {
    BookModel: db.model("Book", BookModel.schema)
  };
}