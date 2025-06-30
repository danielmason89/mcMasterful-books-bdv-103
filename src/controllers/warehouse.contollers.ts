import {
  Route, Controller, Get, Path, Request
} from 'tsoa';
import type { BookID } from '../types/book';
import type { ParameterizedContext, DefaultContext, Request as KoaRequest } from 'koa';
import type { AppWarehouseDatabaseState } from '../state/index';

@Route('warehouse')
export class WarehouseController extends Controller {
  /**
   * Get all shelves where a book is placed, with counts
   */
  @Get('{book}')
  public async getBookInfo(
    @Path() book: BookID,
    @Request() request: KoaRequest
  ): Promise<Array<{ shelf: string; count: number }>> {
    const ctx: ParameterizedContext<AppWarehouseDatabaseState, DefaultContext> = request.ctx;
    return await ctx.state.warehouse.findBookOnShelf(book);
  }
}
