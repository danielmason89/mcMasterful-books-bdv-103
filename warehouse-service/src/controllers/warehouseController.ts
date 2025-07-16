import { Request, Response } from 'express';
import { ShelfModel } from '../models/ShelfModel';

export async function placeBooksOnShelf(req: Request, res: Response) {
  const { bookId } = req.params;
  const { shelf, count } = req.body;

  const result = await ShelfModel.updateOne(
    { bookId, shelf },
    { $inc: { count } },
    { upsert: true }
  );

  res.status(200).json({ success: true, result });
}

export async function findBookOnShelf(req: Request, res: Response) {
  const { bookId } = req.params;
  const shelves = await ShelfModel.find({ bookId });
  res.status(200).json({ shelves });
}