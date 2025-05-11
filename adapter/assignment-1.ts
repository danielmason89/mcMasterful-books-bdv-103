import books from './../mcmasteful-book-list.json';

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
async function listBooks(filters?: PriceFilter[]) : Promise<Book[]>{
    try {

        if (!filters || filters.length === 0) {
            // console.log(books, "<- all books");
            return books; // No filters, return all books
        }
        // console.log("running listBooks")
        return books.filter(book =>
            filters.some(filter =>
                (filter.from === undefined || book.price >= filter.from) &&
                (filter.to === undefined || book.price <= filter.to)
            )
        );
    } catch (err) {
        throw new Error(`Book filtering failed: ${(err as Error).message}`)
    }
}

const assignment = "assignment-1";

export default {
    assignment,
    listBooks
};
