import { OrderPort } from '../ports/order';
import { v4 as uuid } from 'uuid';
import WarehousePort from '../ports/warehouse';
import { BookID } from '../../adapter/assignment-4';

let orderData: Record<string, Record<BookID, number>> = {};

export const memoryOrder: OrderPort & { reset(): void } = {
  async createOrder(bookIds) {
    const orderId = uuid();
    orderData[orderId] = {};
    for (const id of bookIds) {
      orderData[orderId][id] = (orderData[orderId][id] ?? 0) + 1;
    }
    return { orderId };
  },

  async listOrders() {
    return Object.entries(orderData).map(([orderId, books]) => ({
      orderId,
      books
    }));
  },

  async fulfilOrder(orderId, fulfilled, warehouse: WarehousePort) {
    for (const { book, shelf, numberOfBooks } of fulfilled) {
      warehouse.removeBooksFromShelf(book, shelf, numberOfBooks);
    }
    return;
  },

  // Stub implementation for placeOrder
  async placeOrder(bookIds: BookID[]) {
    return this.createOrder(bookIds);
  },

  async getNextUnfulfilledOrder() {
    const orderIds = Object.keys(orderData);
    if (orderIds.length === 0) return null;
    const orderId = orderIds[0];
    return { orderId, books: orderData[orderId] };
  },

  async markOrderFulfilled(orderId: string) {
    delete orderData[orderId];
    return;
  },

  reset() {
    orderData = {};
  }
};
