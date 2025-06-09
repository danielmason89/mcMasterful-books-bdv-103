import assignment4 from '../adapter/assignment-4.js'

import { it, expect } from 'vitest'

import BookModel from '../src/models/book.js'
import OrderModel from '../src/models/order.js'

import { beforeAll } from 'vitest'
import { connectToDatabase } from '../src/lib/db.js'

beforeAll(async () => {
  await connectToDatabase()
}, 60000)

it('lists all orders with book quantities', async () => {

  await BookModel.deleteMany({})
  await OrderModel.deleteMany({})

  const book = await BookModel.create({ name: 'Lister', author: 'Some Author', description: '', image: '', price: 10 })

  console.log('Created book ID:', book._id.toString())

  await assignment4.orderBooks([book._id.toString(), book._id.toString()])

  const orders = await assignment4.listOrders()

  console.log('Books in first order:', Object.keys(orders[0].books))

  expect(orders.length).toBeGreaterThan(0)
  expect(Object.keys(orders[0].books)).toContain(book._id.toString())
})