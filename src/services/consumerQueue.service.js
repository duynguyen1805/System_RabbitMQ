"use strict";

const { connectToRabbitMQ, consumerQueue } = require("../dbs/init.rabbit");

const consumerMessageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { connection, channel } = await connectToRabbitMQ();
      await consumerQueue({ channel, queueName });
    } catch (error) {
      console.error(
        "[consumerMessageService] Error when consumer message: ",
        error
      );
    }
  },

  // case processing
  consumnerToQueueNormal: async () => {
    try {
      const { connection, channel } = await connectToRabbitMQ();
      const notificationQueue = "notiQueue";

      // CASE processing error ==> hot fix
      //   setTimeout(() => {
      //     channel.consume(notificationQueue, (message) => {
      //       console.log(
      //         "Send notificationQueue success with message: ",
      //         message.content.toString()
      //       );
      //       channel.ack(message);
      //     });
      //   }, 15000);

      channel.consume(notificationQueue, (message) => {
        console.log(
          "Send notificationQueue success with message: ",
          message.content.toString()
        );
        channel.ack(message);
      });
    } catch (error) {
      console.error(
        "[consumerMessageService.consumnerToQueueNormal] Error when consumer message: ",
        error
      );
    }
  },

  // case failed processing
  consumnerToQueueFailed: async () => {
    try {
      const { connection, channel } = await connectToRabbitMQ();
      const notificationExchangeDLX = "notiExchangeDLX";
      const notificationRoutingKeyDLX = "notiRoutingKeyDLX";

      const notificationQueueHotFix = "notiQueueHotFix"; // queue hotfix handler message error

      await channel.assertExchange(notificationExchangeDLX, "direct", {
        durable: true,
      });

      const queueHotfix = await channel.assertQueue(notificationQueueHotFix, {
        exclusive: false,
      });

      await channel.bindQueue(
        queueHotfix.queue,
        notificationExchangeDLX,
        notificationRoutingKeyDLX
      );

      await channel.consume(
        queueHotfix.queue,
        (messageFailed) => {
          console.log(
            "This is notification error, pls hot fix:: ",
            messageFailed.content.toString()
          );
        },
        {
          noAck: true,
        }
      );
    } catch (error) {
      console.error(
        "[consumerMessageService.consumnerToQueueFailed] Error when consume messageFailed: ",
        error
      );
      throw Error(error);
    }
  },
};

module.exports = consumerMessageService;
