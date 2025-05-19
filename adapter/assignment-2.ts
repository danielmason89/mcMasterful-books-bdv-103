import BookModel from '../src/models/book';

export type BookID = string;

export interface Book {
    id?: BookID,
    name: string,
    author: string,
    description?: string,
    price: number,
    image?: string,
};

// In-memory store
const books: Book[] = [];

const assignment = "assignment-2";

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
    
    return books.map((book: any) => ({
      ...book,
      id: book._id.toString()
    }));
  }
  

/**
 * createOrUpdateBook
 * Adds a new book or updates an existing one.
 */
async function createOrUpdateBook(book: Book & { id?: string }): Promise<string> {
  
    if (book.id) {
      const updated = await BookModel.findByIdAndUpdate(book.id, book, { new: true });
      return updated?._id.toString() ?? book.id;
    } else {
      const created = await BookModel.create(book);
      return created._id.toString();
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
    assignment,
    createOrUpdateBook,
    removeBook,
    listBooks
};