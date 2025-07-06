import { v4 as uuidv4 } from 'uuid';
import mongoose, { Connection } from 'mongoose';

interface WarehouseAdapter {
  removeBooksFromShelf: (
    book: string,
    shelf: string,
    numberOfBooks: number
  ) => Promise<void>;
}

interface OrderDocument extends mongoose.Document {
  orderId: string;
  books: Map<string, number>;
}

export function createMongoOrder(db: Connection) {
  const orderSchema = new mongoose.Schema({
    orderId: String,
    books: {
      type: Map,
      of: Number
    }
  });

  const OrderModel = db.model<OrderDocument>('Order', orderSchema, 'orders');

  return {
    async createOrder(bookIds: string[]) {
      const orderId = uuidv4();
      const booksMap = new Map<string, number>();

      for (const bookId of bookIds) {
        const count = booksMap.get(bookId) || 0;
        booksMap.set(bookId, count + 1);
      }

      const order = await OrderModel.create({
        orderId,
        books: booksMap
      });

      return { orderId: order.orderId };
    },

    async listOrders() {
      const orders = await OrderModel.find().lean();
      return orders.map((order) => ({
        orderId: order.orderId,
        books: Object.fromEntries(
          order.books instanceof Map ? order.books : new Map()
        )
      }));
    },

    async fulfilOrder(
      orderId: string,
      tasks: Array<{ book: string; shelf: string; numberOfBooks: number }>,
      warehouse: WarehouseAdapter
    ) {
      const order = await OrderModel.findOne({ orderId });
      if (!order) throw new Error('Order not found');

      for (const task of tasks) {
        const { book, shelf, numberOfBooks } = task;
        await warehouse.removeBooksFromShelf(book, shelf, numberOfBooks);
        if (!order.books) {
          order.books = new Map<string, number>();
        }
        const prev = order.books.get(book) || 0;
        order.books.set(book, prev - numberOfBooks);
      }

      await order.save();
    }
  };
}

export const mongoOrder = createMongoOrder(mongoose.connection);
