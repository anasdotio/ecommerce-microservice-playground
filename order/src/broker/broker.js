import amqplib from "amqplib";

let channel, connection;

async function connectToRabbitMQ() {
  if (connection) return connection;

  try {
    connection = await amqplib.connect(process.env.RABBITMQ_URL);
    console.log("Connected to RabbitMQ");
    channel = await connection.createChannel();
  } catch (err) {
    console.error("Error connecting to RabbitMQ:", err);
    throw err;
  }
}

async function publishToQueue(queueName, data = {}) {
  if (!channel && !connection) await connectToRabbitMQ();

  await channel.assertQueue(queueName, { durable: true });
  await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));

  console.log("Message published to queue:", queueName, data);
}

async function subscribeToQueue(queueName, callback) {
  if (!channel && !connection) await connectToRabbitMQ();

  await channel.assertQueue(queueName, { durable: true });
  await channel.consume(queueName, async (message) => {
    if (!message) return;

    const data = JSON.parse(message.content.toString());
    await callback(data);
    channel.ack(message);
  });
}

export {
  connectToRabbitMQ,
  publishToQueue,
  subscribeToQueue,
  connection,
  channel,
};
