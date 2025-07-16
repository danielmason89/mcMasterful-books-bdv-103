import { WarehousePort } from '../ports/warehousePort';
import { ShelfModel } from '../models/ShelfModel';

export const warehouseAdapter: WarehousePort = {
  async placeBooksOnShelf(bookId, shelf, count) {
    await ShelfModel.updateOne(
      { bookId, shelf },
      { $inc: { count } },
      { upsert: true }
    );
  },

  async removeBooksFromShelf(bookId, shelf, count) {
    await ShelfModel.updateOne(
      { bookId, shelf },
      { $inc: { count: -count } }
    );
  },

  async getBooksOnShelf(bookId) {
    return await ShelfModel.find({ bookId });
  },

  async getTotalStock(bookId) {
    const all = await ShelfModel.find({ bookId });
    return all.reduce((sum, item) => sum + item.count, 0);
  },

  async findBookOnShelf(bookId, shelf) {
    const shelfEntry = await ShelfModel.findOne({ bookId, shelf });
    return shelfEntry ? { shelf, count: shelfEntry.count } : null;
  }
};