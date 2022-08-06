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
  let { attachment } = input;

  let { content, filename } = attachment;

  let SizeInMB = Math.ceil(new TextEncoder().encode(content).length / 1024 / 1024);

  if (SizeInMB < 20) {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error(error);
      } else {
        console.info("Email sent: " + info.response);
      }
    });
  } else {
    let NumberOfLoops = Math.ceil(SizeInMB / 20);
    for (let i = 0; i < NumberOfLoops; i++) {
      let newFilename = filename.split(".")[0] + `part${i + 1}/${NumberOfLoops}.` + filename.split(".")[1];
      let newContent = content.slice(i * 1048576 * 20, (i + 1) * 1048576 * 20);
      mailOptions.attachments = { filename: newFilename, content: newContent };
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error(error);
      } else {
        console.info(`Email sent part${i + 1}/${NumberOfLoops}: ` + info.response);
      }
    });
  }
};
