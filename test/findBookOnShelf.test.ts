import assignment4 from '../adapter/assignment-4.js'

import { it, expect } from 'vitest'

import BookModel from '../src/models/book.js'
import ShelfModel from '../src/models/shelf.js'

it('finds all shelves and counts for a book', async () => {
  const book = await BookModel.create({ name: 'Shelf Lookup', author: 'S', description: '', image: '', price: 10 })
  await ShelfModel.insertMany([
    { bookId: book._id.toString(), shelf: 'A', count: 1 },
    { bookId: book._id.toString(), shelf: 'B', count: 2 }
  ])

  const result = await assignment4.findBookOnShelf(book._id.toString())
  expect(result).toEqual([
    { shelf: 'A', count: 1 },
    { shelf: 'B', count: 2 }
  ])
})