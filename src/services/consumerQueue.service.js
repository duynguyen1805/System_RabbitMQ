"use strict";

const { connectToRabbitMQ, consumerQueue } = require("../dbs/init.rabbit");

// custom console.log
const log = console.log;
console.log = function () {
  log.apply(console, [new Date()].concat(arguments));
};

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

      //CASE: 1 - MQ processing error TTL ==> hot fix
      // const timeExpried = 0;
      // setTimeout(() => {
      //   channel.consume(notificationQueue, (message) => {
      //     console.log(
      //       "Send notificationQueue success with message: ",
      //       message.content.toString()
      //     );
      //     channel.ack(message);
      //   });
      // }, timeExpried);

      /* CASE: 2 - Logic error ==> hot fix */
      try {
        channel.consume(notificationQueue, (message) => {
          const numberTest = Math.random();
          console.log("numberTest:: ", numberTest);
          if (numberTest < 0.8) {
            throw new Error("numberTest < 0.8");
          }

          console.log(
            "SEND NOTIFICATION SUCCESS - Msg: ",
            message.content.toString()
          );
          channel.ack(message);
        });
      } catch (error) {
        // console.error("Send notification to QueueFailed ::: HOT FIX ", error);
        channel.nack(message, false, false);
        /*
         nack : negative acknowledge
         false: requeue? => có đẩy ngược lại queue lần nữa hay không, true => đẩy ngược lại, false => đẩy xuống queueFailed
         false: từ chối tất cả hay 1, false => chỉ msg hiện tại bị từ chối
        */
      }
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
