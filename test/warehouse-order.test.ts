import { describe, it, expect, beforeEach } from 'vitest'
import { memoryWarehouse } from '../src/adapters/memoryWarehouse'
import { memoryOrder } from '../orders-service/src/adapter/memoryOrder'
import { v4 as uuid } from 'uuid'

// Mock BookID for testing
const testBookId = uuid()
const testShelfId = 'A1'

describe('Warehouse & Order Integration', () => {
  beforeEach(() => {
    memoryWarehouse.reset()
    memoryOrder.reset()
  })

  it('should add books to shelf and report total stock', async () => {
    await memoryWarehouse.placeBooksOnShelf(testBookId, testShelfId, 10)
    const stock = await memoryWarehouse.getTotalStock(testBookId)
    expect(stock).toBe(10)
  })

  it('should create an order with valid book IDs', async () => {
    const { orderId } = await memoryOrder.createOrder([testBookId, testBookId])
    const orders = await memoryOrder.listOrders()
    expect(orders.find(o => o.orderId === orderId)).toBeDefined()
    expect(orders[0].books[testBookId]).toBe(2)
  })

  it('should fulfil an order and decrease stock accordingly', async () => {
    // Add 10 books to shelf first
    await memoryWarehouse.placeBooksOnShelf(testBookId, testShelfId, 10)

    // Create an order for 2 books
    const { orderId } = await memoryOrder.createOrder([testBookId, testBookId])

    // Fulfil the order
    await memoryOrder.fulfilOrder(orderId, [
      { book: testBookId, shelf: testShelfId, numberOfBooks: 2 }
    ], memoryWarehouse)

    const stock = await memoryWarehouse.getTotalStock(testBookId)
    expect(stock).toBe(8) // 10 - 2 = 8
  })
})
