const {
  Job,
  SignupVerificationJob,
  WelcomeJob,
  ForgetPasswordJob,
  PushNotification,
} = require("./newJob");

// Create Notification job

const createJob = (hashtags, follower, count = 1) => {
  let message = `You have ${count} new posts in hashtags that you are following`;

  let hashtagList = hashtags.join(" ");

  let job = new Job(
    message,
    1,
    hashtags,
    follower._id,
    follower.fullname,
    follower.email,
    follower.deviceToken
  );

  return job;
};

// Update Notificaton Job

let updateJob = (job, count, hashtags) => {
  job.count = count;
  hashtags.forEach((hashtag) => {
    if (!job.hashtags.includes(hashtag)) {
      job.hashtags.push(hashtag);
    }
  });

  job.message = `You have ${count} new posts in hashtags that you are following.`;

  job.hashtagList = job.hashtags.join(" ");

  return job;
};

// Create signup verification job

let createSignupVerificationJob = (
  type = "EMAIL_VERIFICATION",
  email,
  verificationCode
) => {
  let job = new SignupVerificationJob(type, email, verificationCode);

  return job;
};

// Create Welcome Email job

let createWelcomeEmailJob = (type = "WELCOME", fullName, email) => {
  let job = new WelcomeJob(type, fullName, email);

  return job;
};

// Create forget password job

let createForgetPasswordEmailJob = (
  type = "FORGET_PASSWORD",
  fullName,
  resetToken,
  email
) => {
  let job = new ForgetPasswordJob(type, fullName, resetToken, email);

  return job;
};

let createNotificationObject = function (job) {
  let notification = new PushNotification(
    "Feelin",
    job.data.message,
    job.data.token
  );

  return notification;
};

module.exports = {
  createJob,
  updateJob,
  createSignupVerificationJob,
  createForgetPasswordEmailJob,
  createWelcomeEmailJob,
  createNotificationObject,
};
