export interface OrderAdapter {
  createOrder(bookIds: string[]): Promise<{ orderId: string }>;
  listOrders(): Promise<
    Array<{ orderId: string; books: Record<string, number> }>
  >;
  fulfilOrder(
    orderId: string,
    tasks: Array<{ book: string; shelf: string; numberOfBooks: number }>,
    warehouse: WarehouseAdapter
  ): Promise<void>;
}

export interface WarehouseAdapter {
  placeBooksOnShelf(
    bookId: string,
    shelf: string,
    count: number
  ): Promise<void>;
  getBooksOnShelf(
    bookId: string
  ): Promise<Array<{ shelf: string; count: number }>>;
  getTotalStock(bookId: string): Promise<number>;
  removeBooksFromShelf(
    bookId: string,
    shelf: string,
    count: number
  ): Promise<void>;
  findBookOnShelf(
    bookId: string
  ): Promise<Array<{ shelf: string; count: number }>>;
}
