const nodemailer = require('nodemailer');
// const config = require('../config/mailer.config');

module.exports = sendEmail;

const config = {
  emailFrom: process.env.EMAIL_FROM_ADDRESS, 
  smtpOptions: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_AUTH_USER,
      pass: process.env.EMAIL_AUTH_PASS,
    },
  },
};

async function sendEmail({ to, subject, html, from = config.emailFrom }) {
  // console.log(config);
  const transporter = nodemailer.createTransport(config.smtpOptions);
  await transporter.sendMail({ from, to, subject, html });
}
