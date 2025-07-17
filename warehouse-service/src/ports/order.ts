import { BookID, ShelfId, OrderId } from '../../../adapter/assignment-4'; // adjust the path if needed
import WarehousePort from '../../../src/ports/warehouse';

export interface OrderPort {
  createOrder(order: BookID[]): Promise<{ orderId: OrderId }>;
  placeOrder(bookIds: string[]): Promise<{ orderId: string }>;
  getNextUnfulfilledOrder(): Promise<{
    orderId: string;
    books: Record<string, number>;
  } | null>;
  markOrderFulfilled(orderId: string): void;
  listOrders(): Promise<
    Array<{ orderId: OrderId; books: Record<BookID, number> }>
  >;
  fulfilOrder(
    orderId: OrderId,
    booksFulfilled: Array<{
      book: BookID;
      shelf: ShelfId;
      numberOfBooks: number;
    }>,
    warehouse: WarehousePort
  ): Promise<void>;
}
