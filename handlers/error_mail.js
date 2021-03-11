require("module-alias/register");
require("dotenv").config();
const { mail, mailOptions } = require("@src/bot")

module.exports = function error_mail(error_message) {
    mailOptions.text = mailOptions.text.replace("&ERROR_OUT", error_message)

    mail.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}