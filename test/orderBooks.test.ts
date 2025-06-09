import assignment4 from '../adapter/assignment-4.js'
import { it, expect, beforeAll, beforeEach } from 'vitest'

import OrderModel from '../src/models/order.js'
import BookModel from '../src/models/book.js'
import ShelfModel from '../src/models/shelf.js'

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
  })

  const { orderId } = await assignment4.orderBooks([
    book._id.toString(),
    book._id.toString()
  ])

  const order = await OrderModel.findOne({ orderId })

  expect(order?.books[book._id.toString()]).toBe(2)
})
