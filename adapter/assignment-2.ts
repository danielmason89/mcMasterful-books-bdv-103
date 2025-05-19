import BookModel, { Book } from '../src/models/book';

/**
 * listBooks
 * Returns all books or filters by price range if provided.
 */
async function listBooks(filters?: Array<{ from?: number; to?: number }>): Promise<Book[]> {
  
    const query: any = {};
    if (filters?.length) {
      query.$or = filters.map(({ from, to }) => ({
        price: {
          ...(from !== undefined ? { $gte: from } : {}),
          ...(to !== undefined ? { $lte: to } : {})
        }
      }));
    }
    try {
      const books = await BookModel.find(query);
      return books.map((book: any) => ({
        ...book.toObject(),
        id: book._id.toString()
      }));
    } catch (err) {
      console.error("❌ Error fetching books:", err);
      throw err;
    }
  }
  

/**
 * createOrUpdateBook
 * Adds a new book or updates an existing one.
 */
async function createOrUpdateBook(book: Book & { id?: string }): Promise<string> {
  
    if (book.id) {
      const updated = await BookModel.findByIdAndUpdate(book.id, book, { new: true }) as any;
      return updated?._id?.toString() ?? book.id;
    } else {
      const created = await BookModel.create(book) as any;
      return created._id?.toString();
    }
  }
  
  /**
   * removeBook
   * Deletes a book from the database by ID.
   */
  async function removeBook(bookId: string): Promise<void> {
    await BookModel.findByIdAndDelete(bookId);
  }


export default {
    createOrUpdateBook,
    removeBook,
    listBooks
};