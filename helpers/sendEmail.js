const nodemailer = require("nodemailer");
const util = require("util");

let transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.SENDER_MAIL,
    pass: process.env.SENDER_PASS,
  },
});

const ejs = require("ejs");
const renderFile = util.promisify(ejs.renderFile).bind(ejs);

const sendEmail = async (job) => {
  try {
    const template = await renderFile(
      "/home/utkarsh/Desktop/feelin-notification-service/mail-templates/notification.ejs",
      {
        data: job.data,
      }
    );

    let mailOptions = {
      from: `"Feelin 'Share what you feel' ${process.env.SENDER_MAIL}`,
      to: job.data.email[0],
      subject: "Feelin",
      text: "",
      html: template,
    };

    let info = await transporter.sendMail(mailOptions);

    if (!info) {
      console.log(`email to ${job.data.email[0]} could not be sent`);
    } else {
      console.log("Email Sent");
    }
  } catch (err) {
    console.log(`email to ${job.data.email[0]} could not be sent`);
  }
};

module.exports = sendEmail;
