const nodemailer = require('nodemailer');
const config = require('../config/mailer.config');

module.exports = sendEmail;

async function sendEmail({ to, subject, html, from = config.emailFrom }) {
  // console.log(config);
  const transporter = nodemailer.createTransport(config.smtpOptions);
  await transporter.sendMail({ from, to, subject, html });
}
