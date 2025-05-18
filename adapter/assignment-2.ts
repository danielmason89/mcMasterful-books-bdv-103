import assignment1 from "./assignment-1";
import { v4 as uuid } from "uuid";

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

/**
 * listBooks
 * Returns all books or filters by price range if provided.
 */
async function listBooks(filters?: Array<{from?: number, to?: number}>) : Promise<Book[]>{
    let result = books;

    if (filters?.length) {
        result = books.filter(book =>
            filters.some(({ from, to}) =>
                (from === undefined || book.price >= from) &&
                (to === undefined || book.price <= to))
            );
        }
    return result;
}

/**
 * createOrUpdateBook
 * Adds a new book if no ID exists, otherwise updates existing book.
 */
async function createOrUpdateBook(book: Book): Promise<BookID> {
    if (book.id) {
        const index = books.findIndex(b => b.id === book.id);
        if (index !== -1) {
            books[index] = { ...books[index], ...book};
            return book.id;
        }
    }

    const newBook: Book & { id: BookID } = { ...book, id: uuid() };
    books.push(newBook);
    return newBook.id;
}

/**
 * removeBook
 * Removes a book by ID from the list.
 */
async function removeBook(book: BookID): Promise<void> {
    const index = books.findIndex(b => b.id === book);
    if ( index !== -1) {
        books.splice(index, 1);
    }
}

const assignment = "assignment-2";

export default {
    assignment,
    createOrUpdateBook,
    removeBook,
    listBooks
};