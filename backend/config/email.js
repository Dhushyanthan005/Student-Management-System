const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000,
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Student Management" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
