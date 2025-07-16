import { Router } from 'express';
import { warehouseAdapter } from '../adapters/warehouseAdapter';

export const router = Router();

router.post('/stock', async (req, res) => {
  const { bookId, shelf, count } = req.body;
  await warehouseAdapter.placeBooksOnShelf(bookId, shelf, count);
  res.status(200).send();
});

router.get('/stock/:bookId', async (req, res) => {
  const stock = await warehouseAdapter.getTotalStock(req.params.bookId);
  res.json({ stock });
});


// warehouse-service/src/models/shelfModel.ts
import mongoose from 'mongoose';

const shelfSchema = new mongoose.Schema({
  bookId: String,
  shelf: String,
  count: Number
});

export const ShelfModel = mongoose.model('Shelf', shelfSchema);