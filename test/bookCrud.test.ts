import assignment from '../adapter/assignment-4.js'

import BookModel from '../src/models/book.js'

import { describe, it, expect, beforeEach } from 'vitest'

import { beforeAll } from 'vitest'
import { connectToDatabase } from '../src/lib/db.js'

beforeAll(async () => {
  await connectToDatabase()
}, 60000)

describe('createOrUpdateBook() and removeBook()', () => {
  beforeEach(async () => {
    await BookModel.deleteMany({})
  })

  it('creates a book', async () => {
    const book = {
      name: 'New Book',
      author: 'Author X',
      description: 'Some desc',
      image: 'image.png',
      price: 50
    }

    const bookId = await assignment.createOrUpdateBook(book)
    expect(bookId).toBeDefined()

    const saved = await BookModel.findById(bookId)
    expect(saved?.name).toBe('New Book')
  })

  it('removes a book', async () => {
    const book = await BookModel.create({
      name: 'To Delete',
      author: 'Author',
      description: '',
      image: '',
      price: 20
    })

    await assignment.removeBook(book._id.toString())
    const deleted = await BookModel.findById(book._id)
    expect(deleted).toBeNull()
  })
})
