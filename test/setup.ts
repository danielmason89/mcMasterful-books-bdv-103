import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

export default async function setup() {
  const instance = await MongoMemoryServer.create()
  const uri = instance.getUri()

  process.env.MONGO_URI = uri
  globalThis.__MONGOINSTANCE = instance

  await mongoose.connect(uri, {
    dbName: 'vitest'
  })
}
