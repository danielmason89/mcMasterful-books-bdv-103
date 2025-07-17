export type BookID = string;
export type ShelfId = string;

export type WarehousePort = {
  placeBooksOnShelf: (bookId: string, shelf: string, count: number) => void;
  getBooksOnShelf: (
    bookId: string
  ) => Promise<Array<{ shelf: string; count: number }>>;
  getTotalStock: (bookId: string) => Promise<number>;
  removeBooksFromShelf: (
    bookId: string,
    shelf: string,
    count: number
  ) => Promise<void>;
  findBookOnShelf: (
    shelf: string,
    bookId: BookID
  ) => Promise<Array<{ shelf: ShelfId; count: number }>>;
};
