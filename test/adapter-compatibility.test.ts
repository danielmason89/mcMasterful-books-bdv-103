import { describe, it, expect, beforeEach } from 'vitest'
import { memoryWarehouse } from '../src/adapters/memoryWarehouse'
import { mongoWarehouse } from '../src/adapters/mongoWarehouse'
import { connectToDatabase } from '../src/lib/db'
import ShelfModel from '../src/models/shelf' // Mongoose model

describe('Warehouse Adapter Compatibility', () => {
  beforeEach(async () => {
    await connectToDatabase()
    memoryWarehouse.reset()
    await ShelfModel.deleteMany({})
  })

  it('returns the same stock count for both adapters', async () => {
    const bookId = 'book-abc'
    const shelf = 'A1'

    await memoryWarehouse.placeBooksOnShelf(bookId, shelf, 3)
    const memoryStock = await memoryWarehouse.getTotalStock(bookId)

    await mongoWarehouse.placeBooksOnShelf(bookId, shelf, 3)
    const mongoStock = await mongoWarehouse.getTotalStock(bookId)

    expect(memoryStock).toEqual(mongoStock)
  })
})
