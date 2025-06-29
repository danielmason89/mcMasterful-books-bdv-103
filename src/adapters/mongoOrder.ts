import OrderModel from '../models/order.js';
import { v4 as uuidv4 } from 'uuid';

export const mongoOrder = {
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
      books: Object.fromEntries(order.books)
    }));
  },

  async fulfilOrder(
    orderId: string,
    tasks: Array<{ book: string; shelf: string; numberOfBooks: number }>,
    warehouse: {
      removeBooksFromShelf: (
        book: string,
        shelf: string,
        numberOfBooks: number
      ) => Promise<void>;
    }
  ) {
    const order = await OrderModel.findOne({ orderId });
    if (!order) throw new Error('Order not found');

    for (const task of tasks) {
      const { book, shelf, numberOfBooks } = task;

      // ✅ This is the key line
      await warehouse.removeBooksFromShelf(book, shelf, numberOfBooks);

      const prev = order.books.get(book) || 0;
      order.books.set(book, prev - numberOfBooks);
    }

    await order.save();
  }
};
