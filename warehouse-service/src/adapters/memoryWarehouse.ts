import { WarehousePort } from '../ports/warehousePort';

let shelfData: Record<string, Record<string, number>> = {};

export const memoryWarehouse: WarehousePort & { reset(): void } = {
  placeBooksOnShelf(bookId, shelf, count) {
    shelfData[bookId] ??= {};
    shelfData[bookId][shelf] = (shelfData[bookId][shelf] ?? 0) + count;
  },

  getBooksOnShelf(bookId) {
    return Promise.resolve(
      Object.entries(shelfData[bookId] ?? {}).map(([shelf, count]) => ({
        shelf,
        count
      }))
    );
  },

  getTotalStock(bookId) {
    return Promise.resolve(
      Object.values(shelfData[bookId] ?? {}).reduce((sum, c) => sum + c, 0)
    );
  },

  removeBooksFromShelf(bookId, shelf, count) {
    return new Promise<void>((resolve, reject) => {
      const current = shelfData[bookId]?.[shelf] ?? 0;
      if (current < count) {
        reject(new Error('Not enough stock'));
        return;
      }
      shelfData[bookId][shelf] -= count;
      if (shelfData[bookId][shelf] === 0) delete shelfData[bookId][shelf];
      resolve();
    });
  },

  findBookOnShelf(bookId) {
    return Promise.resolve(
      Object.entries(shelfData[bookId] ?? {}).map(([shelf, count]) => ({
        shelf,
        count
      }))
    );
  },

  reset() {
    shelfData = {};
  }
};
