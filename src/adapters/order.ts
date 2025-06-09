import { memoryOrder } from './memoryOrder'
import { mongoOrder } from './mongoOrder'

export const order =
  process.env.USE_DB === 'true' ? mongoOrder : memoryOrder
