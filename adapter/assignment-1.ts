/**
 * Book structure definition.
 * Matches the fields in the book JSON file.
 */
export interface Book {
    name: string,
    author: string,
    description?: string,
    price: number,
    image?: string,
};

/**
 * Filter type for optional price range queries.
 */
type PriceFilter = { from?: number; to?: number };
const API_BASE = 'http://localhost:3000';

// If you have multiple filters, a book matching any of them is a match.
/**
 * listBooks
 * -----------
 * Returns all books if no filters are provided.
 * Otherwise, returns books that fall within one or more of the specified price ranges.
 *
 * @param filters Optional array of price range filters
 * @returns Array of matching books
 */
async function listBooks(filters?: PriceFilter[]): Promise<Book[]> {
    try {
      const query = filters ? `?filters=${encodeURIComponent(JSON.stringify(filters))}` : '';
      const response = await fetch(`${API_BASE}/books${query}`);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      return data as Book[];
    } catch (err) {
      console.error("Error in listBooks:", err);
      throw new Error("Unable to fetch book data at this time.");
    }
  }

export default {
    assignment: "assignment-1",
    listBooks
};
