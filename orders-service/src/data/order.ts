import { memoryOrder } from '../adapter/memoryOrder';
import { mongoOrder } from '../adapter/mongoOrder';

export const order = process.env.USE_DB === 'true' ? mongoOrder : memoryOrder;
