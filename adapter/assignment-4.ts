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
}

export interface Filter {
  from?: number
  to?: number
  name?: string
  author?: string
}

async function listBooks(filters?: Filter[]): Promise<Book[]> {
  const books = await BookModel.find().lean<{ _id: string } & Book>()
  const shelves = await ShelfModel.find().lean()

  const stockMap: Record<string, number> = {}
  for (const shelf of shelves) {
    const bookId = shelf.bookId?.toString?.() ?? ''
    const count = typeof shelf.count === 'number' ? shelf.count : Number(shelf.count)
    stockMap[bookId] = (stockMap[bookId] || 0) + count
  }

  let enrichedBooks: Book[] = Array.isArray(books) ? books.map((book: { _id: string } & Book) => ({
    id: book._id.toString(),
    name: book.name,
    author: book.author,
    description: book.description,
    price: book.price,
    image: book.image,
    stock: stockMap[book._id.toString()] || 0
  })) : []

  if (filters && filters.length > 0) {
    enrichedBooks = enrichedBooks.filter(book =>
      filters.some(filter =>
        (!filter.name || book.name.includes(filter.name)) &&
        (!filter.author || book.author.includes(filter.author)) &&
        (filter.from === undefined || book.price >= filter.from) &&
        (filter.to === undefined || book.price <= filter.to)
      )
    )
  }

  return enrichedBooks
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
  return await previous_assignment.createOrUpdateBook(book)
}

async function removeBook(book: BookID): Promise<void> {
  await previous_assignment.removeBook(book)
}

async function lookupBookById(bookId: BookID): Promise<Book> {
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

async function placeBooksOnShelf(bookId: BookID, numberOfBooks: number, shelf: ShelfId): Promise<void> {
  const existing = await ShelfModel.findOne({ bookId, shelf })
  if (existing) {
    existing.count += numberOfBooks
    await existing.save()
  } else {
    await ShelfModel.create({ bookId, shelf, count: numberOfBooks })
  }
}

async function orderBooks(order: BookID[]): Promise<{ orderId: OrderId }> {
  const orderMap: Record<BookID, number> = {}
  for (const bookId of order) {
    orderMap[bookId] = (orderMap[bookId] || 0) + 1
  }

  const orderDoc = await OrderModel.create({ books: orderMap })
  return { orderId: orderDoc._id.toString() }
}

async function findBookOnShelf(bookId: BookID): Promise<Array<{ shelf: ShelfId, count: number }>> {
  const entries = await ShelfModel.find({ bookId })
  return entries.map(entry => ({
    shelf: entry.shelf.toString(),
    count: Number(entry.count)
  }))
}

async function fulfilOrder(orderId: OrderId, booksFulfilled: Array<{ book: BookID, shelf: ShelfId, numberOfBooks: number }>): Promise<void> {
  const order = await OrderModel.findById(orderId)
  if (!order) throw new Error('Order not found')

  for (const { book, shelf, numberOfBooks } of booksFulfilled) {
    const shelfEntry = await ShelfModel.findOne({ bookId: book, shelf })
    if (!shelfEntry || Number(shelfEntry.count) < numberOfBooks) {
      throw new Error(`Not enough stock for book ${book} on shelf ${shelf}`)
    }

    shelfEntry.count = Number(shelfEntry.count) - numberOfBooks
    if (shelfEntry.count === 0) {
      await shelfEntry.deleteOne()
    } else {
      await shelfEntry.save()
    }
  }
}

async function listOrders(): Promise<Array<{ orderId: OrderId, books: Record<BookID, number> }>> {
  const orders = await OrderModel.find()
  return orders.map(order => ({
    orderId: order._id.toString(),
    books: Object.fromEntries(order.books)
  }))
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