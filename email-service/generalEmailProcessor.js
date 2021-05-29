const nodemailer = require("nodemailer");
const util = require("util");

// Create Transporter Object

let transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.SENDER_MAIL,
    pass: process.env.SENDER_PASS,
  },
});

const ejs = require("ejs");

const renderFile = util.promisify(ejs.renderFile).bind(ejs);

module.exports = async function (job) {
  let template;

  // Render The Required Template
  try {
    switch (job.data.type) {
      case "WELCOME":
        template = await renderFile(
          "/home/utkarsh/Desktop/feelin-notification-service/mail-templates/welcome.ejs",
          {
            data: job.data,
          }
        );
        break;
      case "EMAIL_VERIFICATION":
        template = await renderFile(
          "/home/utkarsh/Desktop/feelin-notification-service/mail-templates/verify_signup.ejs",
          {
            data: job.data,
          }
        );
        break;
      case "FORGET_PASSWORD":
        template = await renderFile(
          "/home/utkarsh/Desktop/feelin-notification-service/mail-templates/forget_password.ejs",
          {
            data: job.data,
          }
        );
        break;
    }

    let mailOptions = {
      from: `"Feelin 'Share what you feel' ${process.env.SENDER_MAIL}`,
      to: job.data.email,
      subject: "Feelin",
      text: "",
      html: template,
    };

    let info = await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(`email to ${job.data.email} could not be sent`);
  }

  if (info) {
    console.log(`email to ${job.data.email} could not be sent`);
  } else {
    console.log("error");
  }
};
