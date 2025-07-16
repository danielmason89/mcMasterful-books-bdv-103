export interface WarehousePort {
  placeBooksOnShelf(bookId: string, shelf: string, count: number): Promise<void>;
  removeBooksFromShelf(bookId: string, shelf: string, count: number): Promise<void>;
  getBooksOnShelf(bookId: string): Promise<Array<{ shelf: string; count: number }>>;
  getTotalStock(bookId: string): Promise<number>;
  findBookOnShelf(bookId: string, shelf: string): Promise<{ shelf: string; count: number } | null>;
}