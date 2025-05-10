import { z } from "zod"
import createRouter from "koa-zod-router";
import adapter from '../adapter';

const router = createRouter();

// testing
// Zod schema for validating query parameters
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
            ("from" in filter ? typeof filter.from === "number" : true) &&
            ("to" in filter ? typeof filter.to === "number" : true)
        ),
        { message: "invalid filter" }
    })
})
router.get('/', (ctx) => {
    ctx.body = { message: 'Hello World' };
});

router.get('/books', async (ctx) => {
    const filters = ctx.query.filters as Array<{ from?: number, to?: number }>;
    // TODO: validate filters
    try {
        const books = await adapter.listBooks(filters);
        ctx.body = books;
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: `Failed to fetch books due to: ${error}` };
    }
});

function validateFilters(filters: any): boolean {
    // Check if filters exist and are an array
    if (!filters || !Array.isArray(filters)) {
        return false;
    }

    // Check each filter object in the array
    return filters.every(filter => {
        const from = parseFloat(filter.from);
        const to = parseFloat(filter.to);

        // Validate that 'from' and 'to' are numbers
        if (isNaN(from) || isNaN(to)) {
            return false;
        }

        // Validate that 'from' is less than or equal to 'to'
        return from <= to;
    });
}


export default router;
