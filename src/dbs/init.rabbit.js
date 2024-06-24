"use strict";

const amqplib = require("amqplib");

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqplib.connect("amqp://localhost"); // if change pwd => "amqp://username:password@localhost"
    if (!connection) {
      throw new Error("Cannot connect to RabbitMQ");
    }
    const channel = await connection.createChannel();

    return {
      connection,
      channel,
    };
  } catch (error) {
    console.error(error);
  }
};

const connectToRabbitMQForTest = async () => {
  try {
    const { connection, channel } = await connectToRabbitMQ();

    // publish message to queue
    const queueName = "test-topic-queue";
    const message = "Message to send from RabbitMQ, System_MQ";
    await channel.assertQueue(queueName, {
      durable: true, // crash server > start lại > tiếp tục send a message in the queue
    });
    await channel.sendToQueue(queueName, Buffer.from(message));

    // close connection
    await connection.close();
  } catch (error) {
    console.error("Cannot connect to RabbitMQ", error);
  }
};

module.exports = { connectToRabbitMQ, connectToRabbitMQForTest };
