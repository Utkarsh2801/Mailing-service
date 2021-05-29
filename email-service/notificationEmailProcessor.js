const sendEmail = require("../helpers/sendEmail");
const { redisGet, redisSet, redisExpire } = require("../helpers/redis");
const { notificationQueue } = require("../helpers/queues");
const { createNotificationObject } = require("../helpers/createJob");

// Convert into String
const stringify = (x) => JSON.stringify(x);

// Parse to json
const parseInjson = (x) => JSON.parse(x);

module.exports = async function (job) {
  try {
    // Check if Redis has push notifications to send
    let preScheduledPushNotifications = await redisGet("notifications");

    if (!preScheduledPushNotifications) {
      // Create new notification object

      let notification = createNotificationObject(job);

      // Array of notifications
      let notifications = [];
      notifications.push(notification);

      let x = await notificationQueue.add(notifications, {
        delay: 100000,
      });

      // Object to store in redis
      let redisObj = {
        time: Date.now(),
        notifications,
        id: x.id,
      };

      // Store notifications to redis
      redisSet("notifications", stringify(redisObj));

      // Setting TTL of object
      redisExpire("notifications", 80);
    } else {
      // Redis has previous push notifications to send

      preScheduledPushNotifications = parseInjson(
        preScheduledPushNotifications
      );

      // Check if the batch of notifications is hang more than 850 messagges
      if (preScheduledPushNotifications.length >= 850) {
        redisRemove("notifications");
        // Create new notification object
        let notification = createNotificationObject(job);

        // Array of notifications
        let notifications = [];
        notifications.push(notification);

        await notificationQueue.add(notifications, {
          delay: 100000,
        });

        // Object to store in redis
        let redisObj = {
          time: Date.now(),
          notifications,
        };

        // Store notifications to redis
        redisSet("notifications", stringify(redisObj));

        // Setting TTL of object
        redisExpire("notifications", 80);
      } else {
        // Create new notification object
        let notification = createNotificationObject(job);

        let notificationJob = await notificationQueue.getJob(
          preScheduledPushNotifications.id
        );

        preScheduledPushNotifications.notifications.push(notification);

        await notificationJob.update(
          preScheduledPushNotifications.notifications
        );

        let expireTime =
          80 -
          parseInt((Date.now() - preScheduledPushNotifications.time) / 1000);

        // Check if before updating in the redis cache expire time is passed
        if (expireTime >= 10) {
          redisSet("notifications", stringify(preScheduledPushNotifications));
          redisExpire("notifications", expireTime);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }

  sendEmail(job);
};
