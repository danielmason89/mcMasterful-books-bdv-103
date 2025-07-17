import { WarehousePort } from '../ports/warehousePort';
import ShelfModel from '../models/ShelfModel';

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
    return all.reduce((sum: any, item: { count: any; }) => sum + (typeof item.count === 'number' ? item.count : 0), 0);
  },

  async findBookOnShelf(shelf: string, bookId: string) {
    const shelfEntries = await ShelfModel.find({ bookId, shelf });
    return shelfEntries
      .filter((entry: { count: any; shelf: any; }) => typeof entry.count === 'number' && typeof entry.shelf === 'string')
      .map((entry: { shelf: string; count: number; }) => ({
        shelf: entry.shelf as string,
        count: entry.count as number
      }));
  }
};