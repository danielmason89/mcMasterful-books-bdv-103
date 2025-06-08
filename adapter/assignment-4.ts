import previous_assignment from './assignment-3.js'
import ShelfModel from '../src/models/shelf.js'
import BookModel from '../src/models/book.js'
import OrderModel from '../src/models/order.js'

export type BookID = string

export interface Book {
  id?: BookID
  name: string
  author: string
  description: string
  price: number
  image: string
  stock?: number
};

export interface Filter {
  from?: number
  to?: number
  name?: string
  author?: string
};

// If multiple filters are provided, any book that matches at least one of them should be returned
// Within a single filter, a book would need to match all the given conditions
async function listBooks (filters?: Filter[]): Promise<Book[]> {
  const books = await previous_assignment.listBooks(filters)

  const shelves = await ShelfModel.find()
  const stockMap: Record<string, number> = {}

  for (const shelf of shelves) {
    const bookId = shelf.bookId?.toString?.() ?? ''
    const count = typeof shelf.count === "number" ? shelf.count : Number(shelf.count);
    stockMap[bookId] = (stockMap[bookId] || 0) + count
  }

  return books.map(book => ({
    ...book,
    stock: stockMap[book.id ?? ''] || 0
  }))
}

async function createOrUpdateBook (book: Book): Promise<BookID> {
  return await previous_assignment.createOrUpdateBook(book)
}

async function removeBook (book: BookID): Promise<void> {
  await previous_assignment.removeBook(book)
}

async function lookupBookById (bookId: BookID): Promise<Book> {
  const book = await BookModel.findById(bookId)
  if (!book) throw new Error('Book not found')

  const shelfEntries = await ShelfModel.find({ bookId })
  const totalStock = shelfEntries.reduce((sum, entry) => sum + Number(entry.count), 0)

  return {
    ...book.toObject(),
    id: book._id.toString(),
    stock: totalStock
  }
}

export type ShelfId = string
export type OrderId = string

async function placeBooksOnShelf (bookId: BookID, numberOfBooks: number, shelf: ShelfId): Promise<void> {
  const existing = await ShelfModel.findOne({ bookId, shelf })
  if (existing) {
    existing.count += numberOfBooks
    await existing.save()
  } else {
    await ShelfModel.create({ bookId, shelf, count: numberOfBooks })
  }
}

async function orderBooks (order: BookID[]): Promise<{ orderId: OrderId }> {
  const orderMap: Record<BookID, number> = {}
  for (const bookId of order) {
    orderMap[bookId] = (orderMap[bookId] || 0) + 1
  }

  const orderDoc = await OrderModel.create({ books: orderMap })
  return { orderId: orderDoc._id.toString() }
}

async function findBookOnShelf (book: BookID): Promise<Array<{ shelf: ShelfId, count: number }>> {
  throw new Error("Todo")
}

async function fulfilOrder (order: OrderId, booksFulfilled: Array<{ book: BookID, shelf: ShelfId, numberOfBooks: number }>): Promise<void> {
  throw new Error("Todo")
}

async function listOrders (): Promise<Array<{ orderId: OrderId, books: Record<BookID, number> }>> {
  throw new Error("Todo")
}

const assignment = 'assignment-4'

export default {
  assignment,
  createOrUpdateBook,
  removeBook,
  listBooks,
  placeBooksOnShelf,
  orderBooks,
  findBookOnShelf,
  fulfilOrder,
  listOrders,
  lookupBookById
}
