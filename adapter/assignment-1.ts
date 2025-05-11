import books from './../mcmasteful-book-list.json';

export interface Book {
    name: string,
    author: string,
    description?: string,
    price: number,
    image?: string,
};

type PriceFilter = { from?: number; to?: number };

// If you have multiple filters, a book matching any of them is a match.
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
