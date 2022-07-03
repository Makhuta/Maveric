const nodemailer = require("nodemailer");
require("dotenv").config();

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.BOT_MAIL,
    pass: process.env.BOT_MAIL_PASS
  }
});

var mailOptions = {
  from: process.env.BOT_MAIL,
  to: process.env.MY_MAIL,
  subject: "Info"
};

module.exports = function error_mail(input) {
  if (input.text) {
    mailOptions.text = input.text;
  } else if (input.attachment) {
    mailOptions.attachments = input.attachment;
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error);
    } else {
      console.info("Email sent: " + info.response);
    }
  });
};
