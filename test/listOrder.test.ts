import assignment4 from '../adapter/assignment-4.js'
import { it, expect, beforeEach, beforeAll } from 'vitest'

import BookModel from '../src/models/book.js'
import OrderModel from '../src/models/order.js'
import ShelfModel from '../src/models/shelf.js'
import { connectToDatabase } from '../src/lib/db.js'

beforeAll(async () => {
  await connectToDatabase()
}, 60000)

beforeEach(async () => {
  await BookModel.deleteMany({})
  await ShelfModel.deleteMany({})
  await OrderModel.deleteMany({})
})

it('lists all orders with book quantities', async () => {
  const book = await BookModel.create({
    name: 'Test Book',
    author: 'Author',
    description: '',
    image: '',
    price: 10
  })

  await assignment4.placeBooksOnShelf(book._id.toString(), 2, '1')

  const bookId = book._id.toString();
  await assignment4.orderBooks({ [bookId]: 2 });

  const orders = await assignment4.listOrders()

  expect(orders[0].books[book._id.toString()]).toBe(2)
})
