import assignment4 from '../adapter/assignment-4.js'
import { it, expect, beforeAll, beforeEach } from 'vitest'

import OrderModel from '../src/models/order.js'
import BookModel from '../src/models/book.js'
import ShelfModel from '../src/models/shelf.js'
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
  // Create a book
  const book = await BookModel.create({
    name: 'Order Test',
    author: 'O',
    description: '',
    image: '',
    price: 10
  })

  // Add stock for the book using the mongoWarehouse adapter
  await mongoWarehouse.placeBooksOnShelf(book._id.toString(), 'A1', 2)

  // Create an order for 2 units of the book
  const { orderId } = await assignment4.orderBooks({
    [book._id.toString()]: 2
  })

  // Retrieve the order and check if the order has the correct quantity
  const order = await OrderModel.findOne({ orderId })

  expect(order?.books[book._id.toString()]).toBe(2)
})
