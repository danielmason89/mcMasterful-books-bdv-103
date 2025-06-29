import { memoryWarehouse } from './memoryWarehouse';
import { mongoWarehouse } from './mongoWarehouse';

export const warehouse =
  process.env.USE_DB === 'true' || process.env.NODE_ENV === 'test'
    ? mongoWarehouse
    : memoryWarehouse;
