import mongoose from 'mongoose';

const shelfSchema = new mongoose.Schema({
  bookId: String,
  shelf: String,
  count: Number,
});

export const ShelfModel = mongoose.model('Shelf', shelfSchema);