import { connectToMessageBroker } from '../lib/connectToMessageBroker';

export async function publishBookAdded(book: any) {
  const channel = await connectToMessageBroker();
  const queue = 'book-added';

  await channel.assertQueue(queue, { durable: false });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(book)));
}