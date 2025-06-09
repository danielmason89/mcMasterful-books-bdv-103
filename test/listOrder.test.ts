import assignment4 from '../adapter/assignment-4.js'

import { it, expect } from 'vitest'

import BookModel from '../src/models/book.js'

it('lists all orders with book quantities', async () => {
  const book = await BookModel.create({ name: 'Lister', author: '', description: '', image: '', price: 10 })
  await assignment4.orderBooks([book._id.toString(), book._id.toString()])

  const orders = await assignment4.listOrders()
  expect(orders.length).toBeGreaterThan(0)
  expect(Object.keys(orders[0].books)).toContain(book._id.toString())
})