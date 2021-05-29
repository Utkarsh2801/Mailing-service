require("dotenv").config();

// Express
const express = require("express");

// Database connection
const { dbConnect } = require("./config/db");
dbConnect();

const {
  sendEmailNotification,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendSignUpVerificationEmail,
} = require("./route-handler/routeHandler");

// Express app
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.post("/newpost/send", sendEmailNotification);
app.post("/greetings/welcome", sendWelcomeEmail);
app.post("/password/reset", sendResetPasswordEmail);
app.post("/verify/email", sendSignUpVerificationEmail);

// Server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});

// Default error handler

app.use((err, req, res, next) => {
  console.log(err);
  res.send("Something Went wrong");
});
