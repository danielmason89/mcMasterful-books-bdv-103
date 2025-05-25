/**
 * Book structure definition.
 * Matches the fields in the book JSON file.
 */
export type BookID = string;

export interface Book {
  id?: BookID,
  name: string,
  author: string,
  description: string,
  price: number,
  image: string,
};


/**
 * Filter type for optional price range queries.
 */
const API_BASE = 'http://localhost:3000';

/**
 * Fetches a list of books from the backend.
 * Optionally filters results by an array of price ranges.
 *
 * @param filters - Optional array of price range filters
 * @returns A promise that resolves to an array of books
 * @throws If the request fails or the server returns a non-OK status
 */
async function listBooks(filters?: Array<{ from?: number; to?: number }>): Promise<Book[]> {
  const query = filters ? `?filters=${encodeURIComponent(JSON.stringify(filters))}` : "";
  const res = await fetch(`${API_BASE}/books${query}`);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json() as Promise<Book[]>;
}

/**
 * Creates a new book or updates an existing one based on the presence of an ID.
 *
 * - Sends a POST request to create a book
 * - Sends a PUT request to update an existing book
 *
 * @param book - Book data, including optional `id` for updates
 * @returns A promise that resolves to the ID of the created or updated book
 * @throws If the request fails or the server returns a non-OK status
 */
async function createOrUpdateBook(book: Book & { id?: string }): Promise<string> {
  const method = book.id ? "PUT" : "POST";
  const res = await fetch(`${API_BASE}/books`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Failed to save book");
  const { id } = await res.json() as { id: string };
  return id;
}

/**
 * Deletes a book by its unique ID.
 *
 * @param bookId - The ID of the book to be deleted
 * @returns A promise that resolves when deletion is complete
 * @throws If the request fails or the server returns a non-OK status
 */
async function removeBook(bookId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/books/${bookId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete book");
}

export default {
  listBooks,
  createOrUpdateBook,
  removeBook,
};
