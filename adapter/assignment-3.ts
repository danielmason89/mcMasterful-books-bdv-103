import previous_assignment from './assignment-2'
import BookModel from '../src/models/book'

export type BookID = string

export interface Book {
  id?: BookID
  name: string
  author: string
  description: string
  price: number
  image: string
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
  if (!filters || filters.length === 0) {
    const allBooks = await BookModel.find({});
    return allBooks.map((b) => ({ ...b.toObject(), id: b._id.toString() }));
  }

  const mongoFilters = filters.map((filter) => {
    const conditions: Record<string, unknown> = {};
    if (filter.from !== undefined || filter.to !== undefined) {
      conditions.price = {
      ...(filter.from !== undefined ? { $gte: filter.from } : {}),
      ...(filter.to !== undefined ? { $lte: filter.to } : {})
    }
  }
    if (filter.name) {
      conditions.name = { $regex: filter.name, $options: 'i' };
    }
    if (filter.author) {
      conditions.author = { $regex: filter.author, $options: 'i' };
    }
    return conditions;
  });

  const books = await BookModel.find({ $or: mongoFilters });
  return books.map((b) => ({ ...b.toObject(), id: b._id.toString() }));
}

async function createOrUpdateBook (book: Book): Promise<BookID> {
  return await previous_assignment.createOrUpdateBook(book)
}

async function removeBook (book: BookID): Promise<void> {
  await previous_assignment.removeBook(book)
}

const assignment = 'assignment-3'

export default {
  assignment,
  createOrUpdateBook,
  removeBook,
  listBooks
}
