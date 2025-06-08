import { describe, it, expect, beforeAll } from 'vitest'
import assignment from '../adapter/assignment-4.js'
import BookModel from '../src/models/book.js'

describe('listBooks()', () => {
  beforeAll(async () => {
    await BookModel.deleteMany({})
    await BookModel.create([
      { name: 'Book A', author: 'Alice', price: 10, image: '', description: '' },
      { name: 'Book B', author: 'Bob', price: 20, image: '', description: '' },
      { name: 'Book C', author: 'Alice', price: 30, image: '', description: '' }
    ])
  })

  it('returns all books if no filters are provided', async () => {
    const books = await assignment.listBooks()
    expect(books).toHaveLength(3)
  })

  it('filters books by price range', async () => {
    const books = await assignment.listBooks([{ from: 15, to: 25 }])
    expect(books).toHaveLength(1)
    expect(books[0].name).toBe('Book B')
  })

  it('returns books that match at least one of multiple filters', async () => {
    const books = await assignment.listBooks([
      { author: 'Alice' },
      { from: 25 }
    ])
    expect(books.length).toBeGreaterThanOrEqual(2)
  })
})
