import mongoose, { Schema, Document, Model } from 'mongoose';

export type BookID = string;

export interface Book {
  id?: BookID;
  name: string;
  author: string;
  description?: string;
  price: number;
  image?: string;
}

interface BookDoc extends Document {
  name: string;
  author: string;
  description?: string;
  price: number;
  image?: string;
}

const bookSchema: Schema<BookDoc> = new Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String
}, { timestamps: true });


const BookModel: Model<BookDoc> =
  (mongoose.models?.Book as Model<BookDoc>) || mongoose.model<BookDoc>('Book', bookSchema);

export default BookModel;
