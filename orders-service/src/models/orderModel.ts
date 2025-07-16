import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: String,
  books: { type: Map, of: Number }
});

export const OrderModel = mongoose.model('Order', orderSchema);