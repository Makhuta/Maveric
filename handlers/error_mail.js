require("module-alias/register");
require("dotenv").config();
const { mail, mailOptions } = require("@src/bot")

module.exports = function error_mail(input) {
    if (input.text) {
        mailOptions.text = input.text
    } else if (input.attachment) {
        mailOptions.attachments = input.attachment
    }


    mail.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}