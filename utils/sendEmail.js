const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const sendEmail = async (name, email, emailToken, origin) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: "classmanagerapiv1@gmail.com",
    subject: "Confirm Email",
    html: `<h2>Welcome, ${name}</h2>
    <p>Thanks for registering on our website.</p>
    <p>Please, click the link below to verify your email:</p>
    <a href="http://${origin}/api/auth/verify-email?token=${emailToken}">Verify email</a>`,
  };
  return sgMail.send(msg);
};

module.exports = sendEmail;
