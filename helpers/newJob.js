// Notification email job
class Job {
  constructor(message, count, hashtags, userId, fullName, email, token = null) {
    this.fullName = fullName;
    this.email = email;
    this.user = userId;
    this.message = message;
    this.count = count;
    this.hashtags = hashtags;
    this.hashtagList = hashtags.join(" ");
    this.token = token;
  }
}

// Welcome email job

class WelcomeJob {
  constructor(type, fullName, email) {
    this.type = type;
    this.fullName = fullName;
    this.email = email;
  }
}

// Forget password job

class ForgetPasswordJob {
  constructor(type, fullName, resetToken, email) {
    this.type = type;
    this.fullName = fullName;
    this.resetToken = resetToken;
    this.email = email;
  }
}

// Signup Verification Job

class SignupVerificationJob {
  constructor(type, email, verificationCode) {
    this.type = type;
    this.email = email;
    this.verificationCode = verificationCode;
  }
}

// Push Notification
class PushNotification {
  constructor(title, body, token) {
    (this.notification = {
      title,
      body,
    }),
      (this.token = token);
  }
}

module.exports = {
  Job,
  WelcomeJob,
  ForgetPasswordJob,
  SignupVerificationJob,
  PushNotification,
};
