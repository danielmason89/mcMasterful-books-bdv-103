import { OrderPort } from '../ports/order';
import { v4 as uuid } from 'uuid';

const orders: Array<{ id: string; books: Record<string, number>; fulfilled: boolean }> = [];

export const memoryOrder: OrderPort = {
  async createOrder(order) {
    const orderMap: Record<string, number> = {};
    order.forEach((id) => {
      orderMap[id] = (orderMap[id] ?? 0) + 1;
    });
    const id = uuid();
    orders.push({ id, books: orderMap, fulfilled: false });
    return { orderId: id };
  },

  placeOrder(bookIds) {
    const orderMap: Record<string, number> = {};
    bookIds.forEach((id) => {
      orderMap[id] = (orderMap[id] ?? 0) + 1;
    });
    const id = uuid();
    orders.push({ id, books: orderMap, fulfilled: false });
    return id;
  },

  getNextUnfulfilledOrder() {
    const next = orders.find((o) => !o.fulfilled);
    if (!next) throw new Error('No unfulfilled orders');
    return { orderId: next.id, books: next.books };
  },

  markOrderFulfilled(orderId) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');
    order.fulfilled = true;
  },

  async fulfilOrder(orderId) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');
    order.fulfilled = true;
  },

  async listOrders() {
    return orders.map((o) => ({
      orderId: o.id,
      books: o.books,
    }));
  },
};