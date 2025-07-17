import OrderModel from '../models/order';
import { OrderPort } from '../ports/order';

export const orderAdapter: OrderPort = {
  async createOrder(bookIds) {
    const books: Record<string, number> = {};
    for (const bookId of bookIds) {
      books[bookId] = (books[bookId] || 0) + 1;
    }
    const order = await OrderModel.create({ orderId: crypto.randomUUID(), books });
    if (!order.orderId || typeof order.orderId !== 'string') {
      throw new Error('Order creation failed: orderId is missing');
    }
    return { orderId: order.orderId };
  },

  async listOrders() {
    const orders = await OrderModel.find();
    return orders
      .filter((o) => typeof o.orderId === 'string')
      .map((o) => ({
        orderId: o.orderId as string,
        books: Object.fromEntries(o.books as Map<string, number>)
      }));
  },

  async fulfilOrder(orderId, fulfilled, warehouse) {
    for (const { book, shelf, numberOfBooks } of fulfilled) {
      await warehouse.removeBooksFromShelf(book, shelf, numberOfBooks);
    }
  },
  placeOrder: function (bookIds: string[]): Promise<{ orderId: string; }> {
    throw new Error('Function not implemented.');
  },
  getNextUnfulfilledOrder: function (): Promise<{ orderId: string; books: Record<string, number>; } | null> {
    throw new Error('Function not implemented.');
  },
  markOrderFulfilled: function (orderId: string): void {
    throw new Error('Function not implemented.');
  }
};
