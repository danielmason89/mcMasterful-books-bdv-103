import createRouter from "koa-zod-router";
import { z, ZodError } from "zod"
import adapter from "../adapter/assignment-2";

const router = createRouter();

export function handleZodError(ctx: any, error: ZodError, message = "Invalid input") {
  ctx.status = 400;
  ctx.body = {
    error: message,
    details: error.errors.map(e => ({
      path: e.path.join('.'),
      message: e.message
    }))
  };
}

/**
 * Zod schema to validate the `filters` query parameter.
 * - Accepts a JSON string representing an array of filter objects.
 * - Each object can contain optional `from` and/or `to` numbers.
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

/**
 * Zod schema to validate the body of a POST request when creating or updating a book.
 */
const bookSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  author: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  price: z.number()
});

/**
 * Health check route
 * Simple endpoint to confirm the server is running.
 */
router.get('/', (ctx) => {
  ctx.body = { message: 'Hello There, Welcome to Assignment #2 BookStore API!' };
});

/**
 * GET /books
 * Fetches a list of books.
 * If `filters` query param is provided, it filters books by price range.
 * Example: /books?filters=[{"from":10,"to":25}]
 */
router.get('/books', async (ctx) => {
  try {
    const parsedQuery = filterSchema.parse(ctx.query);
    const books = await adapter.listBooks(parsedQuery.filters);
    ctx.body = books;
    } catch (err) {
        // Handle validation errors
        if (err instanceof ZodError) {
            return handleZodError(ctx, err);
          } else {
        // Handle general server errors
        ctx.status = 500;
        ctx.body = { error: `Failed to fetch books due to: ${(err as Error).message}` };
        }
    }
});

/**
 * POST /books
 * Adds a new book or updates an existing one.
 * Expects a valid book object in the request body.
 */
router.post('/books', async (ctx) => {
  try {
    const parsed = bookSchema.parse(ctx.request.body);
    const id = await adapter.createOrUpdateBook(parsed);
    ctx.status = parsed.id ? 200 : 201;
    ctx.body = { id };
  } catch (err) {
    if (err instanceof ZodError) {
      return handleZodError(ctx, err);
    } else {
      ctx.status = 400;
      ctx.body = { error: (err as Error).message };
    }
  }
});

/**
 * DELETE /books/:id
 * Deletes a book with the given ID.
 */
router.delete('/books/:id', async (ctx) => {
  try {
    const id = ctx.params.id;
    await adapter.removeBook(id);
    ctx.status = 204;
  } catch (err) {
    ctx.status = 400;
    ctx.body = { error: (err as Error).message };
  }
});

export default router;