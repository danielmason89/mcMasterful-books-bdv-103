import assignment4 from '../adapter/assignment-4.js'
import { it, expect, beforeAll } from 'vitest'

import OrderModel from '../src/models/order.js'
import BookModel from '../src/models/book.js'
import { connectToDatabase } from '../src/lib/db.js'

beforeAll(async () => {
  await connectToDatabase()
}, 60000)

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

  // FIX: Use findOne instead of findById
  const order = await OrderModel.findOne({ orderId })

  expect(order?.books.get(book._id.toString())).toBe(2)
})
