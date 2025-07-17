import amqp from 'amqplib';

const RABBITMQ_HOST =
  process.env.NODE_ENV === 'production' || process.env.USE_DOCKER === 'true'
    ? 'amqp://rabbitmq'
    : 'amqp://localhost';

export async function connectToMessageBroker() {
  const connection = await amqp.connect('amqp://rabbitmq:5672');
  const channel = await connection.createChannel();

  process.once('SIGINT', () => {
    channel.close();
    connection.close();
  });

  return { connection, channel };
}