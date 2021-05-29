let admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

module.exports = async function (job) {
  admin
    .messaging()
    .sendAll(job.data)
    .then((response) => {
      console.log(response.successCount + " messages were sent successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};
