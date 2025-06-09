import { memoryWarehouse } from './memoryWarehouse'
import { mongoWarehouse } from './mongoWarehouse'

export const warehouse =
  process.env.USE_DB === 'true' ? mongoWarehouse : memoryWarehouse