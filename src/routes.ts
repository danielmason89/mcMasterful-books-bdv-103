import {promises as fs} from "fs";
import path from "path";
import createRouter from "koa-zod-router";
import { z, ZodError } from "zod"

const router = createRouter();

// testing
// Zod schema for validating query parameters
/**
 * Validates the `filters` query parameter:
 * - Expects a JSON string representing an array of objects with optional `from` and `to` numbers.
 * - First, checks for valid JSON format.
 * - Then parses and transforms it into an array.
 * - Finally, ensures each object is well-structured.
 */
const filterSchema = z.object({
    filters: z
    .string()
    .optional()
    .refine((val) => {
        try {
          const parsed = JSON.parse(val ?? "[]");
          return Array.isArray(parsed);
        } catch {
          return false;
        }
      }, {
        message: "Invalid JSON format for filters"
      })
    .transform((val) => {
        try {
            const parsed = JSON.parse(val ?? "[]");
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        } 
    })
    .refine((arr): arr is Array<{ from?: number; to?: number }> =>
        arr.every(
            (filter) =>
                typeof filter === "object" &&
            (filter.from === undefined || typeof filter.from === "number") &&
            (filter.to === undefined || typeof filter.to === "number")
        ),
        { message: "invalid input" }
    )
})

async function fetchBooksFromFile(filters?: { from?: number; to?: number }[]) {
  const filePath = path.join(__dirname, '../mcmasteful-book-list.json');
  const data = await fs.readFile(filePath, 'utf-8');
  const books = JSON.parse(data);

  if (!filters || filters.length === 0) return books;

  return books.filter((book: any) =>
    filters.some((filter) =>
      (filter.from === undefined || book.price >= filter.from) &&
      (filter.to === undefined || book.price <= filter.to)
    )
  );
}

// Health check route
router.get('/', (ctx) => {
    ctx.body = { message: 'Hello World' };
});

/**
 * GET /books
 * Returns a list of books.
 * Optionally filters results by price ranges using a `filters` query parameter.
 * Example: /books?filters=[{"from":10,"to":25}]
 */
router.get('/books', async (ctx) => {
    // TODO: validate filters - Completed
    try {
        const parsedQuery = filterSchema.parse(ctx.query);
        const books = await fetchBooksFromFile(parsedQuery.filters);
        ctx.body = books;
    } catch (error) {
        // Handle validation errors
        if (error instanceof ZodError) {
            ctx.status = 400;
            ctx.body = {
              error: "Invalid input",
              details: error.errors.map(e => ({
                path: e.path.join('.'),
                message: e.message
              }))
            };
          } else {
        // Handle general server errors
        ctx.status = 500;
        ctx.body = { error: `Internal server error` };
        }
    }
});

export default router;