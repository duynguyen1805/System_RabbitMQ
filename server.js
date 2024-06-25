"use strict";

const consumerMessageService = require("./src/services/consumerQueue.service");

// const queueName = "test-topic-queue";
// consumerMessageService
//   .consumerToQueue(queueName)
//   .then(() => {
//     console.log("Message Consumer is running... with Queue name: ", queueName);
//   })
//   .catch((error) => {
//     console.error("Message Consumer error: ", error);
//   });

consumerMessageService
  .consumnerToQueueNormal()
  .then(() => {
    console.log("Message Consumer Normal is running...");
  })
  .catch((error) => {
    console.error("Message Consumer Normal error: ", error);
  });

consumerMessageService
  .consumnerToQueueFailed()
  .then(() => {
    console.log("Message Consumer Failed is running...");
  })
  .catch((error) => {
    console.error("Message Consumer Failed error: ", error);
  });
