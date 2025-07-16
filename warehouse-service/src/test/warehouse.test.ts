import { warehouseAdapter } from '../adapters/warehouseAdapter';
import { expect, describe, it } from 'vitest';

describe('Warehouse Adapter', () => {
  it('should place books on a shelf and retrieve total stock', async () => {
    await warehouseAdapter.placeBooksOnShelf('book1', 'shelfA', 5);
    const total = await warehouseAdapter.getTotalStock('book1');
    expect(total).toBe(5);
  });

  it('should find book on a shelf', async () => {
    await warehouseAdapter.placeBooksOnShelf('book2', 'shelfB', 3);
    const result = await warehouseAdapter.findBookOnShelf('book2', 'shelfB');
    expect(result).toEqual({ shelf: 'shelfB', count: 3 });
  });

  it('should remove books from a shelf', async () => {
    await warehouseAdapter.placeBooksOnShelf('book3', 'shelfC', 4);
    await warehouseAdapter.removeBooksFromShelf('book3', 'shelfC', 2);
    const total = await warehouseAdapter.getTotalStock('book3');
    expect(total).toBe(2);
  });
});