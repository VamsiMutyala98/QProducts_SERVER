require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports = function sendEmail(data) {
  console.log(process.env.MAIL_USER, process.env.MAIL_PASS);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take our messages');
    } 
    }); 
    

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: data.to,
    subject: data.subject,
    html: data.html,
    attachments: data.attachments,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.info(error);
      return error;
    } else {
      console.info(`Email sent: ${info.response}`);
      return info;
    }
  });
};