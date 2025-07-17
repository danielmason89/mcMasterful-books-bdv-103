import { it, beforeEach, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';

import ShelfModel from '../src/models/shelf.js';
import OrderModel from '../orders-service/src/models/order.js';
import BookModel from '../src/models/book.js';
import { connectToDatabase } from '../src/lib/db.js';
import { mongoOrder } from '../orders-service/src/adapter/mongoOrder.js';
import { mongoWarehouse } from '../src/adapters/mongoWarehouse.js';

beforeAll(async () => {
  await connectToDatabase();
}, 60000);

beforeEach(async () => {
  await mongoose.connection.collection('warehouse').deleteMany({});
  await BookModel.deleteMany({});
  await OrderModel.deleteMany({});
  await ShelfModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

it('fulfills an order by updating shelf stock', async () => {
  const book = await BookModel.create({
    name: 'Fulfill',
    author: 'Some Author',
    description: '',
    image: '',
    price: 10
  });

  const bookId = book._id.toString();
  const shelf = '1';

  await mongoWarehouse.placeBooksOnShelf(bookId, shelf, 3);

  const { orderId } = await mongoOrder.createOrder([bookId, bookId]);

  await mongoOrder.fulfilOrder(orderId, [
    { book: bookId, shelf, numberOfBooks: 2 }
  ], mongoWarehouse);

  const updated = await mongoose.connection.collection('warehouse').findOne({ bookId, shelf });

  expect(updated?.count).toBe(1);
});
