import assignment4 from '../adapter/assignment-4.js'
import { it, expect, beforeAll } from 'vitest'
import BookModel from '../src/models/book.js'
import { connectToDatabase } from '../src/lib/db.js'

import mongoose from 'mongoose'

// Define or reuse the warehouse schema
const warehouseSchema = new mongoose.Schema({
  bookId: String,
  shelf: String,
  count: Number
})
const WarehouseModel = mongoose.models.WarehouseBook || mongoose.model('WarehouseBook', warehouseSchema, 'warehouse')

beforeAll(async () => {
  await connectToDatabase()
}, 60000)

it('finds all shelves and counts for a book', async () => {
  const book = await BookModel.create({
    name: 'Shelf Lookup',
    author: 'S',
    description: '',
    image: '',
    price: 10
  })

  await WarehouseModel.insertMany([
    { bookId: book._id, shelf: "1", count: 1 },
    { bookId: book._id, shelf: "2", count: 2 }
  ])

  const result = await assignment4.findBookOnShelf(book._id.toString())

  expect(result).toEqual([
    { shelf: "1", count: 1 },
    { shelf: "2", count: 2 }
  ])
})
