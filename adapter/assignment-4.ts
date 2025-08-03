import previous_assignment from './assignment-4.js'
import { BookModel } from '../listings-service/src/models/book.js'
import { warehouse } from '../warehouse-service/src/adapters/warehouse.js'
import { order } from '../orders-service/src/adapter/order.js'
import { publishBookAdded, publishBookStocked } from '../shared/messaging/publisher.js'

// Types
export type BookID = string
export type ShelfId = string
export type OrderId = string

export interface Book {
  id?: BookID
  name: string
  author: string
  description: string
  price: number
  image: string
  stock?: number
}

export interface Filter {
  from?: number
  to?: number
  name?: string
  author?: string
}

// Integration logic
async function listBooks(filters?: Filter[]): Promise<Book[]> {
  const books = await previous_assignment.listBooks(filters)

  return await Promise.all(
    books.map(async (book) => {
      const stock = await warehouse.getTotalStock(book.id!)
      return { ...book, stock }
    })
  )
}

async function lookupBookById(bookId: BookID): Promise<Book> {
  const book = await BookModel.findById(bookId).lean()
  if (!book) throw new Error('Book not found')
  const stock = await warehouse.getTotalStock(bookId)
  return { ...book, stock }
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
  const id = await previous_assignment.createOrUpdateBook(book)
  const newBook = await BookModel.findById(id).lean()
  if (newBook) await publishBookAdded(newBook)
  return id
}

async function removeBook(bookId: BookID): Promise<void> {
  await previous_assignment.removeBook(bookId)
}

async function placeBooksOnShelf(bookId: BookID, numberOfBooks: number): Promise<void> {
  const book = await BookModel.findById(bookId).lean<{ name: string }>()
  if (!book) throw new Error(`Book not found: ${bookId}`)
  await warehouse.placeBooksOnShelf(bookId, book.name, numberOfBooks)
  await publishBookStocked(bookId, numberOfBooks)
}

async function orderBooks(bookQuantities: Record<BookID, number>): Promise<{ orderId: OrderId }> {
  for (const bookId in bookQuantities) {
    const book = await BookModel.findById(bookId).lean()
    if (!book) throw new Error(`Invalid book ID: ${bookId}`)
  }
  const bookIds: string[] = []
  for (const [bookId, quantity] of Object.entries(bookQuantities)) {
    for (let i = 0; i < quantity; i++) bookIds.push(bookId)
  }
  return await order.createOrder(bookIds)
}

async function findBookOnShelf(bookId: BookID): Promise<Array<{ shelf: ShelfId, count: number }>> {
  const shelves = ['1', '2', '3']
  const results = await Promise.all(
    shelves.map(async (shelf) => {
      const res = await warehouse.findBookOnShelf(bookId, shelf)
      if (res && !Array.isArray(res)) return { shelf, count: res.count }
      return null
    })
  )
  return results.filter(Boolean) as Array<{ shelf: ShelfId, count: number }>
}

async function fulfilOrder(orderId: OrderId, booksFulfilled: Array<{ book: BookID, shelf: ShelfId, numberOfBooks: number }>): Promise<void> {
  return await order.fulfilOrder(orderId, booksFulfilled, warehouse)
}

async function listOrders(): Promise<Array<{ orderId: OrderId, books: Record<BookID, number> }>> {
  return await order.listOrders()
}

const assignment = 'assignment-8'

export default {
  assignment,
  createOrUpdateBook,
  removeBook,
  listBooks,
  lookupBookById,
  placeBooksOnShelf,
  orderBooks,
  findBookOnShelf,
  fulfilOrder,
  listOrders
}
