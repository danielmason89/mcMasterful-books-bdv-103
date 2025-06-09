export type BookID = string;
export type ShelfId = string;

export interface WarehousePort {
  placeBooksOnShelf(bookId: string, shelf: string, count: number): void
  getBooksOnShelf(bookId: string): Array<{ shelf: string, count: number }>
  getTotalStock(bookId: string): number
  removeBooksFromShelf(bookId: string, shelf: string, count: number): void
  findBookOnShelf(bookId: BookID): Array<{ shelf: ShelfId, count: number }> 
}
