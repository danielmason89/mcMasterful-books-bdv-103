import WarehousePort from '../ports/warehouse'

let shelfData: Record<string, Record<string, number>> = {}

export const memoryWarehouse: WarehousePort & { reset(): void } = {
  placeBooksOnShelf(bookId, shelf, count) {
    shelfData[bookId] ??= {}
    shelfData[bookId][shelf] = (shelfData[bookId][shelf] ?? 0) + count
  },

  getBooksOnShelf(bookId) {
    return Promise.resolve(
      Object.entries(shelfData[bookId] ?? {}).map(([shelf, count]) => ({
        shelf,
        count,
      }))
    )
  },

  getTotalStock(bookId) {
    return Promise.resolve(
      Object.values(shelfData[bookId] ?? {}).reduce((sum, c) => sum + c, 0)
    )
  },

  removeBooksFromShelf(bookId, shelf, count) {
    const current = shelfData[bookId]?.[shelf] ?? 0
    if (current < count) throw new Error('Not enough stock')
    shelfData[bookId][shelf] -= count
    if (shelfData[bookId][shelf] === 0) delete shelfData[bookId][shelf]
  },

  findBookOnShelf(bookId) {
    return Promise.resolve(
      Object.entries(shelfData[bookId] ?? {}).map(([shelf, count]) => ({
        shelf,
        count,
      }))
    )
  },

  reset() {
    shelfData = {}
  }
}
