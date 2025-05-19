import mongoose, { Schema } from 'mongoose';

const bookSchema = new Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String
}, { timestamps: true });


const BookModel =
  (mongoose.models?.Book) || mongoose.model('Book', bookSchema);

export default BookModel;
