const nodemailer = require("nodemailer");

const sendEmail = async(options) =>{

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

  const info = await transporter.sendMail({
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // sender address
    to: options.email, // list of receivers
    subject:options.subject, // Subject line
    text: options.message, // plain text body
    html: "<b>This link is for reset password requested by you</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
}
module.exports = sendEmail;

