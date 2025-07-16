export interface OrderPort {
  createOrder(bookIds: string[]): Promise<{ orderId: string }>;
  listOrders(): Promise<Array<{ orderId: string; books: Record<string, number> }>>;
  fulfilOrder(
    orderId: string,
    fulfilled: Array<{ book: string; shelf: string; numberOfBooks: number }>,
    warehouse: any
  ): Promise<void>;
}
