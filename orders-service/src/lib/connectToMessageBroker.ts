import amqp from 'amqplib';

const RABBITMQ_HOST =
  process.env.NODE_ENV === 'production' || process.env.USE_DOCKER === 'false'
    ? 'amqp://rabbitmq'
    : 'amqp://localhost';

export async function connectToMessageBroker() {
  console.log(`📡 Connecting to RabbitMQ at ${RABBITMQ_HOST}...`);

  try {
    const connection = await amqp.connect(RABBITMQ_HOST);
    const channel = await connection.createChannel();

    process.once('SIGINT', () => {
      console.log('👋 Closing RabbitMQ connection...');
      channel.close();
      connection.close();
    });

    console.log('✅ Connected to RabbitMQ successfully.');
    return channel;
  } catch (err) {
    console.error(`❌ Failed to connect to RabbitMQ at ${RABBITMQ_HOST}:`, err);
    throw err;
  }
}
