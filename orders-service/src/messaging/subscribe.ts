import amqp from 'amqplib';

export async function subscribeToBookAdded(callback: (book: any) => void) {
  const conn = await amqp.connect('amqp://rabbitmq');
  const channel = await conn.createChannel();
  await channel.assertExchange('books', 'fanout', { durable: false });
  const q = await channel.assertQueue('', { exclusive: true });
  channel.bindQueue(q.queue, 'books', '');

  channel.consume(q.queue, (msg) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      if (data.type === 'BookAdded') callback(data);
    }
  }, { noAck: true });
}
