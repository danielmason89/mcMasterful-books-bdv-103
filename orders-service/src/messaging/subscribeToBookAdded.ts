import { connectToMessageBroker } from '../lib/connectToMessageBroker';

export async function subscribeToBookAdded(onMessage: (book: any) => void) {
  const channel = await connectToMessageBroker();

  const queue = 'book-added';
  await channel.assertQueue(queue, { durable: false });

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const book = JSON.parse(msg.content.toString());
      onMessage(book);
      channel.ack(msg);
    }
  });
}