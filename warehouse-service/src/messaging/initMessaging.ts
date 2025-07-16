import amqp from 'amqplib';

export async function initMessaging() {
  const conn = await amqp.connect('amqp://rabbitmq');
  const ch = await conn.createChannel();

  await ch.assertQueue('BookAdded');
  ch.consume('BookAdded', async (msg) => {
    if (!msg) return;
    const content = JSON.parse(msg.content.toString());
    console.log('📘 BookAdded received:', content);
    // store book name if needed
    ch.ack(msg);
  });

  await ch.assertQueue('BookStocked');
  ch.consume('BookStocked', async (msg) => {
    if (!msg) return;
    const content = JSON.parse(msg.content.toString());
    console.log('📦 BookStocked received:', content);
    ch.ack(msg);
  });
}