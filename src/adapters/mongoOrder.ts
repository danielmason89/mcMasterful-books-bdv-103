import { OrderPort } from '../ports/order'
import mongoose from 'mongoose'
import WarehousePort from '../ports/warehouse'

const orderSchema = new mongoose.Schema({
  orderId: String,
  books: mongoose.Schema.Types.Mixed,
  fulfilled: { type: Boolean, default: false }
})

const OrderModel = mongoose.model('Order', orderSchema, 'orders')

export const mongoOrder: OrderPort = {
  async createOrder(bookIds) {
    const orderId = new mongoose.Types.ObjectId().toString()
    const orderMap: Record<string, number> = {}
    for (const id of bookIds) {
      orderMap[id] = (orderMap[id] ?? 0) + 1
    }
    await OrderModel.create({ orderId, books: orderMap, fulfilled: false })
    return { orderId }
  },

  async listOrders() {
    const orders = await OrderModel.find()
    return orders.map((o) => ({
      orderId: typeof o.orderId === 'string' ? o.orderId : String(o.orderId ?? ''),
      books: (o.books ?? {}) as Record<string, number>
    }))
  },

  async fulfilOrder(orderId, fulfilled, warehouse: WarehousePort) {
    for (const { book, shelf, numberOfBooks } of fulfilled) {
      await warehouse.removeBooksFromShelf(book, shelf, numberOfBooks)
    }
    const order = await OrderModel.findOne({ orderId })
    if (order) {
      order.fulfilled = true
      await order.save()
    } else {
      throw new Error('Order not found')
    }
  },

  // Added missing methods to satisfy OrderPort interface
  async placeOrder(bookIds: string[]) {
    return this.createOrder(bookIds)
  },

  async getNextUnfulfilledOrder() {
    const order = await OrderModel.findOne({ fulfilled: false })
    if (!order) return null
    return {
      orderId: typeof order.orderId === 'string' ? order.orderId : String(order.orderId ?? ''),
      books: (order.books ?? {}) as Record<string, number>
    }
  },

  async markOrderFulfilled(orderId: string) {
    const order = await OrderModel.findOne({ orderId })
    if (order) {
      order.fulfilled = true
      await order.save()
    } else {
      throw new Error('Order not found')
    }
  }
}
