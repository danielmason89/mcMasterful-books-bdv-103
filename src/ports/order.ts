import { BookID, ShelfId, OrderId } from '../../adapter/assignment-4' // adjust the path if needed
import { WarehousePort } from './warehouse'

export interface OrderPort {
  createOrder(order: BookID[]): Promise<{ orderId: OrderId }>
  placeOrder(bookIds: string[]): string
  getNextUnfulfilledOrder(): { orderId: string, books: Record<string, number> }
  markOrderFulfilled(orderId: string): void
  listOrders(): Promise<Array<{ orderId: OrderId, books: Record<BookID, number> }>>
  fulfilOrder(orderId: OrderId, booksFulfilled: Array<{ book: BookID, shelf: ShelfId, numberOfBooks: number }>, warehouse: WarehousePort): Promise<void>
}