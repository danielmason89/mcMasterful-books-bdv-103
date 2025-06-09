import previous_assignment from './assignment-3.js'
import BookModel from '../src/models/book.js'
import { memoryWarehouse } from '../src/adapters/memoryWarehouse.js'
import { memoryOrder } from '../src/adapters/memoryOrder.js'

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
      const stock = await memoryWarehouse.getTotalStock(book.id!)
      return { ...book, stock }
    })
  )
}

async function lookupBookById(bookId: BookID): Promise<Book> {
  const book = await BookModel.findById(bookId).lean<{
    _id: string
    name: string
    author: string
    description: string
    price: number
    image: string
  }>()

  if (!book) {
    throw new Error('Book not found')
  }
  const stock = await memoryWarehouse.getTotalStock(bookId)
  return { ...book, stock }
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
  return await previous_assignment.createOrUpdateBook(book)
}

async function removeBook(book: BookID): Promise<void> {
  await previous_assignment.removeBook(book)
}

async function placeBooksOnShelf(bookId: BookID, numberOfBooks: number, shelf: ShelfId): Promise<void> {
  await memoryWarehouse.placeBooksOnShelf(bookId, shelf, numberOfBooks)
}

async function orderBooks(order: BookID[]): Promise<{ orderId: OrderId }> {
  for (const id of order) {
    const book = await BookModel.findById(id).lean()
    if (!book) {
      throw new Error(`Invalid book ID: ${id}`)
    }
  }
  return await memoryOrder.createOrder(order)
}

async function findBookOnShelf(bookId: BookID): Promise<Array<{ shelf: ShelfId, count: number }>> {
  return await memoryWarehouse.findBookOnShelf(bookId)
}

async function fulfilOrder(orderId: OrderId, booksFulfilled: Array<{ book: BookID, shelf: ShelfId, numberOfBooks: number }>): Promise<void> {
  return await memoryOrder.fulfilOrder(orderId, booksFulfilled, memoryWarehouse)
}

async function listOrders(): Promise<Array<{ orderId: OrderId, books: Record<BookID, number> }>> {
  return await memoryOrder.listOrders()
}

const assignment = 'assignment-4'

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
