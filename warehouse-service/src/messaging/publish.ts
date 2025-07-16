import amqp from 'amqplib';
import { BookStockedEvent } from '../types/events';

let channel: amqp.Channel | null = null;

export async function connectToMessageBroker() {
  const connection = await amqp.connect('amqp://rabbitmq');
  channel = await connection.createChannel();
}

export async function publishBookStocked(event: BookStockedEvent) {
  if (!channel) throw new Error('AMQP channel not initialized');
  const queue = 'book-stocked';
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(event)), { persistent: true });
}