import mongoose, {type Connection } from 'mongoose';
import { Warehouse } from '../types/warehouse';

export function createMongoWarehouse(db: Connection): Warehouse {
  const warehouseSchema = new mongoose.Schema({
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    shelf: String,
    count: Number
  });

  const WarehouseModel = db.model('WarehouseBook', warehouseSchema, 'warehouse');

  return {
    async placeBooksOnShelf(bookId: string, shelf: string, count: number) {
      const bookObjectId = new mongoose.Types.ObjectId(bookId);
      const existing = await WarehouseModel.findOne({ bookId: bookObjectId, shelf });
  
      if (existing) {
        existing.count = (existing.count ?? 0) + count;
        await existing.save();
      } else {
        await WarehouseModel.create({ bookId: bookObjectId, shelf, count });
      }
    },
  
    async getBooksOnShelf(bookId: string) {
      const bookObjectId = new mongoose.Types.ObjectId(bookId);
      const docs = await WarehouseModel.find({ bookId: bookObjectId });
  
      return docs.map((d) => ({
        shelf: typeof d.shelf === 'string' ? d.shelf : '',
        count: typeof d.count === 'number' ? d.count : 0
      }));
    },
  
    async getTotalStock(bookId: string) {
      const bookObjectId = new mongoose.Types.ObjectId(bookId);
      const docs = await WarehouseModel.find({ bookId: bookObjectId });
  
      return docs.reduce((sum, d) => sum + (typeof d.count === 'number' ? d.count : 0), 0);
    },
  
    async removeBooksFromShelf(bookId: string, shelf: string, count: number) {
      const bookObjectId = new mongoose.Types.ObjectId(bookId);
      const doc = await WarehouseModel.findOne({ bookId: bookObjectId, shelf });
  
      if (!doc || typeof doc.count !== 'number' || doc.count < count)
        throw new Error('Not enough stock');
  
      doc.count -= count;
  
      if (doc.count === 0) {
        await doc.deleteOne();
      } else {
        await doc.save();
      }
    },

    async findBookOnShelf(bookId: string, shelf: string) {
      const bookObjectId = new mongoose.Types.ObjectId(bookId);
      const doc = await WarehouseModel.findOne({ bookId: bookObjectId, shelf });
  
      if (!doc) return null;
  
      return {
        count: typeof doc.count === 'number' ? doc.count : 0,
      };
    }
  };
}

const db = mongoose.connection;
export const mongoWarehouse = createMongoWarehouse(db);