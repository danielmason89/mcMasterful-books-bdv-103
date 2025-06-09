import assignment4 from '../adapter/assignment-4.js'

import { it, expect } from 'vitest';

import BookModel from '../src/models/book.js'
import ShelfModel from '../src/models/shelf.js'

import { beforeAll } from 'vitest'
import { connectToDatabase } from '../src/lib/db.js'

beforeAll(async () => {
  await connectToDatabase()
}, 60000)

it('returns book with total stock from shelves', async () => {
  const book = await BookModel.create({ name: 'Single Book', author: 'Lookup', description: '', image: '', price: 10 })
  await ShelfModel.insertMany([
    { bookId: book._id.toString(), shelf: 1, count: 2 },
    { bookId: book._id.toString(), shelf: 1, count: 1 }
  ])

  const result = await assignment4.lookupBookById(book._id.toString())
  expect(result.name).toBe('Single Book')
  expect(result.stock).toBe(3)
})
