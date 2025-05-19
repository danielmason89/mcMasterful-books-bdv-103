import mongoose from 'mongoose';
export type BookID = string;

export interface Book {
  id?: BookID;
  name: string;
  author: string;
  description?: string;
  price: number;
  image?: string;
}

const bookSchema = new mongoose.Schema<Book>({
  name: { type: String, required: true },
  author: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String
}, { timestamps: true });

const BookModel = mongoose.model('Book', bookSchema);

export default BookModel;