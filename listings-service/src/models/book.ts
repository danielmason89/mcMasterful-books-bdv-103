/**
 * Defines the Mongoose schema and model for books stored in MongoDB.
 * This schema is used for validation and interaction with the database.
 */
import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  name: String,
  author: String,
  price: Number,
  image: String,
  description: String
});

export const BookModel = mongoose.model('Book', BookSchema);
