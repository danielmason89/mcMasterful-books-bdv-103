import { z } from "zod"
import createRouter from "koa-zod-router";
import adapter from '../adapter';

const router = createRouter();

// testing
// Zod schema for validating query parameters
/**
 * Zod schema to validate and parse the `filters` query param.
 * - Expects a JSON string representing an array of price filters.
 * - Each filter may include optional `from` and `to` numeric values.
 * - Invalid or missing input defaults to an empty array.
 */
const filterSchema = z.object({
    filters: z
    .string()
    .optional()
    .transform((val) => {
        try {
            const parsed = JSON.parse(val ?? "[]");
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    })
    .refine((arr) => {
        arr.every(
            (filter) =>
                typeof filter === "object" &&
            (filter.from === undefined || typeof filter.from === "number") &&
            (filter.to === undefined || typeof filter.to === "number")
        ),
        { message: "invalid input" }
    })
})

// Simple ping, (sanity test) route
router.get('/', (ctx) => {
    ctx.body = { message: 'Hello World' };
});

/**
 * GET /books
 * Returns a list of books, optionally filtered by price ranges.
 * Accepts a `filters` query parameter in JSON format.
 * Example: /books?filters=[{"from":10,"to":25}]
 */
router.get('/books', async (ctx) => {
    // TODO: validate filters - Completed
    try {
        const parsedQuery = filterSchema.parse(ctx.query);
        const filters = parsedQuery.filters;
        const books = await adapter.listBooks(filters);
        ctx.body = books;
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: `Failed to fetch books due to: ${error}` };
    }
});

export default router;