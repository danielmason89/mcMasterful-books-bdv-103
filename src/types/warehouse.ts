export interface Warehouse {
  placeBooksOnShelf(bookId: string, shelf: string, count: number): Promise<void>;
  getBooksOnShelf(bookId: string): Promise<{ shelf: string; count: number }[]>;
  getTotalStock(bookId: string): Promise<number>;
  removeBooksFromShelf(bookId: string, shelf: string, count: number): Promise<void>;
  findBookOnShelf(bookId: string, shelf: string): Promise<{ count: number } | null>;
}