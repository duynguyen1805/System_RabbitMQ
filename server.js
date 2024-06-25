"use strict";

const consumerMessageService = require("./src/services/consumerQueue.service");

const queueName = "test-topic-queue";
consumerMessageService
  .consumerToQueue(queueName)
  .then(() => {
    console.log("Message Consumer is running... with Queue name: ", queueName);
  })
  .catch((error) => {
    console.error("Message Consumer error: ", error);
  });
