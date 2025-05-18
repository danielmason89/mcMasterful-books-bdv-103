import assignment1 from "./assignment-1";
import { v4 as uuid } from "uuid";

export type BookID = string;

export interface Book {
    id?: BookID,
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
};

// In-memory store
const books: Book[] = [];

/**
 * listBooks
 * Returns all books or filters by price range if provided.
 */
async function listBooks(filters?: Array<{from?: number, to?: number}>) : Promise<Book[]>{
    const books = await assignment1.listBooks(filters);
    return books.map(book => ({
        ...book,
        image: book.image ?? "",
        description: book.description ?? ""
    }));
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
    throw new Error("Todo")
}

async function removeBook(book: BookID): Promise<void> {
    throw new Error("Todo")
}

const assignment = "assignment-2";

export default {
    assignment,
    createOrUpdateBook,
    removeBook,
    listBooks
};