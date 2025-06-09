import assignment4 from '../adapter/assignment-4.js'

import { it, expect } from 'vitest'

import BookModel from '../src/models/book.js'
import ShelfModel from '../src/models/shelf.js'

import { beforeAll } from 'vitest'
import { connectToDatabase } from '../src/lib/db.js'

beforeAll(async () => {
  await connectToDatabase()
}, 60000)

it('fulfills an order by updating shelf stock', async () => {
  const book = await BookModel.create({
    name: 'Fulfill',
    author: 'Some Author',
    description: '',
    image: '',
    price: 10
  })

  // Add 3 books to shelf
  await ShelfModel.create({ bookId: book._id.toString(), shelf: "1", count: 4 })

  // Create an order for 2 books
  const { orderId } = await assignment4.orderBooks([
    book._id.toString(),
    book._id.toString()
  ])

  // Fulfill order by removing 2 books
  await assignment4.fulfilOrder(orderId, [
    { book: book._id.toString(), shelf: "1", numberOfBooks: 2 }
  ])

  // Check the shelf now has 1 book left
  const shelf = await ShelfModel.findOne({
    bookId: book._id.toString(),
    shelf: "1"
  })

  expect(shelf?.count).toBe(2)
})
