import assignment4 from '../adapter/assignment-4.js'
import { it, expect, beforeAll, beforeEach } from 'vitest'

import OrderModel from '../src/models/order.js'
import BookModel from '../src/models/book.js'
import ShelfModel from '../src/models/shelf.js'
import { mongoWarehouse } from '../src/adapters/mongoWarehouse.js'

import { connectToDatabase } from '../src/lib/db.js'
import mongoose from 'mongoose'

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
  })

  const bookIdStr = book._id.toString()

  // 🔍 DOUBLE CHECK bookId match in WarehouseModel
  await mongoWarehouse.placeBooksOnShelf(bookIdStr, 'A1', 2)

  // 🔁 Wait for write to fully persist
  const placed = await ShelfModel.findOne({ bookId: new mongoose.Types.ObjectId(bookIdStr), shelf: 'A1' })
  expect(placed).not.toBeNull()
  expect(placed?.count).toBe(2)

  const { orderId } = await assignment4.orderBooks({
    [bookIdStr]: 2
  })

  const order = await OrderModel.findOne({ orderId })

  expect(order?.books[bookIdStr]).toBe(2)
})
