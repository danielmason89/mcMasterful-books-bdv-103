import assignment4 from '../adapter/assignment-4.js'
import { it, expect, beforeAll } from 'vitest'

import BookModel from '../src/models/book.js'
import { connectToDatabase } from '../src/lib/db.js'

import mongoose from 'mongoose'

// Reuse existing Warehouse model
const warehouseSchema = new mongoose.Schema({
  bookId: String,
  shelf: String,
  count: Number
})
const WarehouseModel = mongoose.models.WarehouseBook || mongoose.model('WarehouseBook', warehouseSchema, 'warehouse')

beforeAll(async () => {
  await connectToDatabase()
}, 60000)

it('returns book with total stock from warehouse', async () => {
  const book = await BookModel.create({
    name: 'Single Book',
    author: 'Lookup',
    description: '',
    image: '',
    price: 10
  })

  await WarehouseModel.insertMany([
    { bookId: book._id.toString(), shelf: "1", count: 2 },
    { bookId: book._id.toString(), shelf: "1", count: 1 }
  ])

  const result = await assignment4.lookupBookById(book._id.toString())

  expect(result.name).toBe('Single Book')
  expect(result.stock).toBe(3)
})
