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
};

module.exports = consumerMessageService;
