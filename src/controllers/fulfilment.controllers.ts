import {
  Route, Controller, Post, Query, Body, Request
} from 'tsoa';
import type { ParameterizedContext, DefaultContext, Request as KoaRequest } from 'koa';
import type { AppOrderDatabaseState, AppWarehouseDatabaseState } from '../state/index';

interface FulfilmentRequest {
  book: string;
  shelf: string;
  numberOfBooks: number;
}

/**
 * Handles fulfilling orders using shelf inventory
 */
@Route('fulfilment')
export class FulfilmentController extends Controller {
  /**
   * Fulfil an order by removing books from shelves
   * @param orderId The ID of the order to fulfill
   * @param booksFulfilled Array of books to fulfill
   */
  @Post()
public async fulfilOrder(
  @Query() orderId: string,
  @Body() booksFulfilled: FulfilmentRequest[],
  @Request() request: KoaRequest
): Promise<void> {
  const ctx = request.ctx as unknown as ParameterizedContext<
    AppOrderDatabaseState & AppWarehouseDatabaseState,
    DefaultContext
  >;
  await ctx.state.order.fulfilOrder(orderId, booksFulfilled, ctx.state.warehouse);
}
}
