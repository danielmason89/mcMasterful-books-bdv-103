import assignment4 from '../adapter/assignment-4.js'

import { describe, it, beforeEach, expect } from 'vitest'

import BookModel from '../src/models/book.js'
import ShelfModel from '../src/models/shelf.js'

import { beforeAll } from 'vitest'
import { connectToDatabase } from '../src/lib/db.js'

beforeAll(async () => {
  await connectToDatabase()
}, 60000)

describe('assignment-4: listBooks', () => {
  let bookId1: string
  let bookId2: string

  beforeEach(async () => {
    // Clean test DB
    await BookModel.deleteMany({})
    await ShelfModel.deleteMany({})

    // Create books
    const book1 = await BookModel.create({
      name: 'Stock Book A',
      author: 'Test Author',
      description: 'Testing stock',
      price: 20,
      image: 'image-a.jpg'
    })

    const book2 = await BookModel.create({
      name: 'Stock Book B',
      author: 'Another Author',
      description: 'More testing',
      price: 35,
      image: 'image-b.jpg'
    })

    bookId1 = book1._id.toString()
    bookId2 = book2._id.toString()

    // Add books to shelves
    await ShelfModel.insertMany([
      { bookId: bookId1, shelf: 1, count: 3 },
      { bookId: bookId1, shelf: 2, count: 2 },
      { bookId: bookId2, shelf: 3, count: 5 }
    ])
  })

  it('returns books with correct stock levels', async () => {
    const books = await assignment4.listBooks()

    const bookA = books.find((b: { id?: string }) => b.id === bookId1)
    const bookB = books.find((b: { id?: string }) => b.id === bookId2)

    expect(bookA).toBeDefined()
    expect(bookB).toBeDefined()

    expect(bookA?.stock).toBe(5) // 3 + 2
    expect(bookB?.stock).toBe(5) // 5
  })

  it('applies filters correctly and still includes stock', async () => {
    const filtered = await assignment4.listBooks([{ from: 30 }])
    expect(filtered.length).toBe(1)
    expect(filtered[0].name).toBe('Stock Book B')
    expect(filtered[0].stock).toBe(5)
  })
})
