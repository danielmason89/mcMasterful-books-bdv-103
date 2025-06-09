import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  books: { type: Map, of: Number, required: true }
});

export default mongoose.model('Order', orderSchema);
