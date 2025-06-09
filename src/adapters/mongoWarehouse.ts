import WarehousePort from '../ports/warehouse'
import mongoose from 'mongoose'

// Schema for books on shelves
const warehouseSchema = new mongoose.Schema({
  bookId: String,
  shelf: String,
  count: Number
})

const WarehouseModel = mongoose.model('WarehouseBook', warehouseSchema, 'warehouse')

export const mongoWarehouse: WarehousePort = {
  async placeBooksOnShelf(bookId, shelf, count) {
    const existing = await WarehouseModel.findOne({ bookId, shelf })
    if (existing) {
      existing.count = (existing.count ?? 0) + count
      await existing.save()
    } else {
      await WarehouseModel.create({ bookId, shelf, count })
    }
  },

  async getBooksOnShelf(bookId) {
    const docs = await WarehouseModel.find({ bookId })
    return docs.map((d) => ({
      shelf: typeof d.shelf === 'string' ? d.shelf : '',
      count: typeof d.count === 'number' ? d.count : 0
    }))
  },

  async getTotalStock(bookId) {
    const docs = await WarehouseModel.find({ bookId })
    return docs.reduce((sum, d) => sum + (typeof d.count === 'number' ? d.count : 0), 0)
  },

  async removeBooksFromShelf(bookId, shelf, count) {
    const doc = await WarehouseModel.findOne({ bookId, shelf })
    if (!doc || (typeof doc.count !== 'number') || doc.count < count) throw new Error('Not enough stock')
    doc.count -= count
    if (doc.count === 0) {
      await doc.deleteOne()
    } else {
      await doc.save()
    }
  },

  async findBookOnShelf(bookId) {
    return await mongoWarehouse.getBooksOnShelf(bookId)
  }
}
