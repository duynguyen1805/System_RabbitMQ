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
    await channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true, // đi chung với durable
    });

    // close connection
    await connection.close();
  } catch (error) {
    console.error("Cannot connect to RabbitMQ", error);
  }
};

const consumerQueue = async ({ channel, queueName }) => {
  try {
    await channel.assertQueue(queueName, {
      durable: true, // crash server > start lại > tiếp tục send a message in the queue
    });
    console.log("Waiting for messages...");

    // lang nghe message trong queueName
    channel.consume(
      queueName,
      (message) => {
        if (message !== null) {
          // console.log("Structured message: ", message);
          console.log(`Received message: ${message.content.toString()}`);
          /*
            process continue ...
            1. find User following that SHOP
            2. send message notification to User
            3. OK >> success
            4. error >> setup DLX (Dead Letter Exchange)
          */
        }
      },
      {
        noAck: true, // dữ liệu xử lý rồi thì không nhận nữa, false => sẽ gửi lại dữ liệu (có cũ đã xử lý rồi)
      }
    );
  } catch (error) {
    console.error(
      `Cannot listen queue ${queueName}, channel: ${channel}`,
      error
    );
    throw Error(`Cannot listen queue ${queueName}, channel: ${channel}`);
  }
};

module.exports = { connectToRabbitMQ, connectToRabbitMQForTest, consumerQueue };
