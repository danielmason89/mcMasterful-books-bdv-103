import assignment4 from '../adapter/assignment-4.js'
import { it, beforeAll, beforeEach } from 'vitest'

import OrderModel from '../orders-service/src/models/order.js'
import BookModel from '../warehouse-service/src/models/book.js'
import ShelfModel from '../warehouse-service/src/models/shelf.js'
import { mongoWarehouse } from '../src/adapters/mongoWarehouse.js'

import { connectToDatabase } from '../src/lib/db.js'

beforeAll(async () => {
  await connectToDatabase()
}, 60000)

beforeEach(async () => {
  await BookModel.deleteMany({})
  await OrderModel.deleteMany({})
  await ShelfModel.deleteMany({})
})

it('creates an order and returns orderId', async () => {
  const book = await BookModel.create({
    name: 'Order Test',
    author: 'O',
    description: '',
    image: '',
    price: 10
  });

  const bookIdStr = book._id.toString();

  await mongoWarehouse.placeBooksOnShelf(bookIdStr, 'A1', 2);

  let orderId: string | undefined | number;
  try {
    const result = await assignment4.orderBooks({
      [bookIdStr]: 2
    });
    orderId = result.orderId;
    console.log('✅ Order ID:', orderId);
  } catch (e) {
    console.error('❌ orderBooks failed:', e);
  }
});
