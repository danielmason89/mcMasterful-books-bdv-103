import amqp from 'amqplib';

let channel: amqp.Channel;

export async function connectToMessageBus() {
  const connection = await amqp.connect('amqp://rabbitmq');
  channel = await connection.createChannel();
}

export async function publishEvent(queue: string, message: object) {
  if (!channel) throw new Error('Channel not initialized');
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
}

export async function subscribe(queue: string, handler: (msg: unknown) => void) {
  if (!channel) throw new Error('Channel not initialized');
  await channel.assertQueue(queue);
  channel.consume(queue, (msg) => {
    if (msg) {
      handler(JSON.parse(msg.content.toString()));
      channel.ack(msg);
    }
  });
}
