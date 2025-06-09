import mongoose from 'mongoose'

export default async function teardown() {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()

  const instance = globalThis.__MONGOINSTANCE
  if (instance) {
    await instance.stop()
  }
}