import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  books: { type: Map, of: Number, required: true }
});

// Prevent model overwrite error in watch mode
const OrderModel =
  mongoose.models.Order || mongoose.model('Order', orderSchema);

export default OrderModel;
