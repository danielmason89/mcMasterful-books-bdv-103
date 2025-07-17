import mongoose from 'mongoose';

const shelfSchema = new mongoose.Schema({
  bookId: String,
  shelf: String,
  count: Number,
});


const ShelfModel =
  mongoose.models.Shelf || mongoose.model('Shelf', shelfSchema);

export default ShelfModel;
