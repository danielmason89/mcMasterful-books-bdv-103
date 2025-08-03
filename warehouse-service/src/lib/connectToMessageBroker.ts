import amqp from 'amqplib';

const RABBITMQ_HOST =
  process.env.NODE_ENV === 'production' || process.env.USE_DOCKER === 'true'
    ? 'amqp://rabbitmq:5672'
    : 'amqp://localhost:5672';

export async function connectToMessageBroker() {
  try {
    console.log(`📡 Connecting to RabbitMQ at ${RABBITMQ_HOST}`);
    const connection = await amqp.connect(RABBITMQ_HOST);
    const channel = await connection.createChannel();

    process.once('SIGINT', () => {
      console.log('🔌 Closing RabbitMQ connection...');
      channel.close();
      connection.close();
    });

    console.log('✅ Connected to RabbitMQ');
    return { connection, channel };
  } catch (err) {
    console.error('❌ Failed to connect to RabbitMQ:', err);
    throw err;
  }
}
