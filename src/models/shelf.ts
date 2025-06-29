import mongoose from 'mongoose';

const shelfSchema = new mongoose.Schema({
  bookId: { type: String, required: true },
  shelf: { type: String, required: true },
  count: { type: Number, required: true }
});

const ShelfModel =
  mongoose.models.Shelf || mongoose.model('Shelf', shelfSchema);

export default ShelfModel;
