import { Express } from 'express';
import { placeBooksOnShelf, findBookOnShelf } from './warehouseController';

export function setupRoutes(app: Express) {
  app.post('/stock/:bookId', placeBooksOnShelf);
  app.get('/stock/:bookId', findBookOnShelf);
}