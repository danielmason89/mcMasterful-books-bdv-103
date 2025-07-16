import { OrderModel } from '../models/orderModel';
import { OrderPort } from '../ports/orderPorts';

export const orderAdapter: OrderPort = {
  async createOrder(bookIds) {
    const books: Record<string, number> = {};
    for (const bookId of bookIds) {
      books[bookId] = (books[bookId] || 0) + 1;
    }
    const order = await OrderModel.create({ orderId: crypto.randomUUID(), books });
    return { orderId: order.orderId };
  },

  async listOrders() {
    const orders = await OrderModel.find();
    return orders.map((o) => ({
      orderId: o.orderId,
      books: Object.fromEntries(o.books as Map<string, number>)
    }));
  },

  async fulfilOrder(orderId, fulfilled, warehouse) {
    for (const { book, shelf, numberOfBooks } of fulfilled) {
      await warehouse.removeBooksFromShelf(book, shelf, numberOfBooks);
    }
  }
};