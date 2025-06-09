export type BookID = string;
export type ShelfId = string;

export default interface WarehousePort {
  placeBooksOnShelf(bookId: string, shelf: string, count: number): void
  getBooksOnShelf(bookId: string): Promise<Array<{ shelf: string, count: number }>>
  getTotalStock(bookId: string): Promise<number>
  removeBooksFromShelf(bookId: string, shelf: string, count: number): void
  findBookOnShelf(bookId: BookID): Promise<Array<{ shelf: ShelfId, count: number }>>
}
