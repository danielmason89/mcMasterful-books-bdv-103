import amqp from 'amqplib';

const RABBITMQ_HOST =
  process.env.NODE_ENV === 'production' || process.env.USE_DOCKER === 'true'
    ? 'amqp://rabbitmq'
    : 'amqp://localhost';

export async function connectToMessageBroker() {
  const connection = await amqp.connect(RABBITMQ_HOST);
  const channel = await connection.createChannel();
  return channel;
}