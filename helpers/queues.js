const Queue = require("bull");

let notificationQueue = new Queue("notifications", process.env.REDIS_SERVER);

// Mailing queue for notifications
let notificationMailQueue = new Queue(
  "notificationMailQueue",
  process.env.REDIS_SERVER
);

// Mailnig queue for verification, reset password etc...
let generalMailQueue = new Queue("generalMailQueue", process.env.REDIS_SERVER);

// Handler Process for Notification Queue
notificationQueue.process(
  "/home/utkarsh/Desktop/feelin-notification-service/email-service/notificationQueueProcessor.js"
);

// Handler Process for Notification Email Queue
notificationMailQueue.process(
  "/home/utkarsh/Desktop/feelin-notification-service/email-service/notificationEmailProcessor.js"
);

// Handler Process for Genrela Purpose Mail Queue
generalMailQueue.process(
  "/home/utkarsh/Desktop/feelin-notification-service/email-service/generalEmailProcessor.js"
);

module.exports = {
  notificationQueue,
  generalMailQueue,
  notificationMailQueue,
};
