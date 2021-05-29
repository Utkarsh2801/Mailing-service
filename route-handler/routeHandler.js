const asyncHandler = require("../helpers/asyncHandler");
const _ = require("underscore");
const Hashtag = require("../models/hashtag");
const User = require("../models/user");

// Job Creators
const {
  createJob,
  updateJob,
  createWelcomeEmailJob,
  createForgetPasswordEmailJob,
  createSignupVerificationJob,
} = require("../helpers/createJob");

// Queues
const {
  notificationMailQueue,
  generalMailQueue,
} = require("../helpers/queues");

// Import Redis Functions
const { redisGet, redisSet, redisExpire } = require("../helpers/redis");

// Convert into String
const stringify = (x) => JSON.stringify(x);

// Parse to json
const parseInjson = (x) => JSON.parse(x);

// Send notification Email
exports.sendEmailNotification = asyncHandler(async (req, res, next) => {
  let { hashtags } = req.body;

  let followers = await Hashtag.find({ hashtag: { $in: hashtags } }).populate(
    "follower"
  );

  if (!followers) {
    throw new Error("No followers to send the notification");
  }

  // All followers of hashtags
  let allFollowers = followers.reduce((acc, x) => {
    return _.union(acc, x.follower);
  }, []);

  allFollowers.forEach(async (follower) => {
    let stringId = stringify(follower._id);

    try {
      // Check if redis has previous notifications for user
      let preScheduled = await redisGet(stringId);

      if (!preScheduled) {
        // Create a new job
        let job = createJob(hashtags, follower);
        job.time = Date.now();
        if (job.fullName === "Utkarsh Tripathi") {
          let x = await notificationMailQueue.add(job, {
            delay: 50000,
          });
          x.data.time = Date.now();
          x.data.id = x.id;

          // Setting job data to redis
          redisSet(stringId, stringify(x.data));

          // Setting TTL of object
          redisExpire(stringId, 40);
        }
      } else {
        // Redis has previous notifications for user

        preScheduled = parseInjson(preScheduled);

        // Get a scheduled job to update
        let job = await notificationMailQueue.getJob(preScheduled.id);

        // Update Object for redis caching
        preScheduled = updateJob(
          preScheduled,
          preScheduled.count + 1,
          hashtags
        );

        // Update job in task queue
        await job.update({
          ...job.data,
          ["message"]: preScheduled.message,
          ["count"]: preScheduled.count,
          ["hashtags"]: preScheduled.hashtags,
          ["hashtagList"]: preScheduled.hashtagList,
        });

        // Time of expiration of redis object

        let expireTime = 40 - parseInt((Date.now() - preScheduled.time) / 1000);

        // Check if before updating in the redis cache expire time is passed
        if (expireTime >= 5) {
          redisSet(stringId, stringify(preScheduled));
          redisExpire(stringId, expireTime);
        }
      }
    } catch (err) {
      // Sending the error response
      res.json({
        success: false,
        message: "Something went wrong",
      });
    }
  });

  res.send({
    success: true,
    message: "Jobs has been scheduled",
  });
});

// Send Welcome Email
exports.sendWelcomeEmail = asyncHandler(async (req, res, next) => {
  const { email, fullName } = req.body;

  if (!email || !fullName) {
    res.json({
      success: false,
      message: "Please provide required information",
    });
  }

  let job = createWelcomeEmailJob("WELCOME", fullName, email);

  await generalMailQueue.add(job);

  res.json({
    success: true,
    message: "Welcome Email job has been scheduled",
  });
});

// Send Reset Password Email
exports.sendResetPasswordEmail = asyncHandler(async (req, res, next) => {
  const { resetToken, email, fullName } = req.body;

  if (!email || !fullName || !resetToken) {
    res.json({
      success: false,
      message: "Please provide required information",
    });
  }

  let job = createForgetPasswordEmailJob(
    "FORGET_PASSWORD",
    fullName,
    resetToken,
    email
  );

  await generalMailQueue.add(job);

  res.json({
    success: true,
    message: "Forget Password Email job has been scheduled",
  });
});

// Send signup verification email
exports.sendSignUpVerificationEmail = asyncHandler(async (req, res, next) => {
  const { email, verificationCode } = req.body;

  if (!email || !verificationCode) {
    res.json({
      success: false,
      message: "Please provide required information",
    });
  }

  let job = createSignupVerificationJob(
    "EMAIL_VERIFICATION",
    email,
    verificationCode
  );

  await generalMailQueue.add(job);

  res.json({
    success: true,
    message: "Verification Email job has been scheduled",
  });
});
