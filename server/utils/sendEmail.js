const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  let transporterOptions = null;
  if (ENVIRONMENT == "production") {
    transporterOptions = {
      service: "gmail",
      auth: {
        user: gmail,
        pass: gmailPass,
      },
    };
  } else {
    transporterOptions = {
      host: gmailHost,
      port: gmailPort,
      auth: {
        user: gmail,
        pass: gmailPass,
      },
    };
  }
  console.log(transporterOptions);
  const transporter = nodemailer.createTransport(transporterOptions);

  const emailOptions = {
    from: gmail,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
