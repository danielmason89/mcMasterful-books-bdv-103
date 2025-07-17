import mongoose from "mongoose";
import { describe, it, expect, beforeEach } from 'vitest'
import { memoryWarehouse } from '../src/adapters/memoryWarehouse'
import { mongoWarehouse } from '../src/adapters/mongoWarehouse'
import { connectToDatabase } from '../src/lib/db'
import ShelfModel from '../warehouse-service/src/models/shelf'

describe('Warehouse Adapter Compatibility', () => {
  const bookId = new mongoose.Types.ObjectId().toString();

  beforeEach(async () => {
    await connectToDatabase()
    memoryWarehouse.reset()
    await ShelfModel.deleteMany({})
  })

  it('returns the same stock count for both adapters', async () => {
    await memoryWarehouse.placeBooksOnShelf(bookId, "1", 3)
    await mongoWarehouse.placeBooksOnShelf(bookId, "1", 3)

    const memoryStock = await memoryWarehouse.getTotalStock(bookId)
    const mongoStock = await mongoWarehouse.getTotalStock(bookId)

    expect(memoryStock).toEqual(mongoStock)
  })
})
