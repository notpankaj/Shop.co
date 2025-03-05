const ejs = require("ejs");
const path = require("path");
const nodemailer = require("nodemailer");
const KEYS = require("../config/keys");

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: KEYS.GMAIL_SMTP_APP_EMAIL,
    pass: KEYS.GMAIL_SMTP_APP_PASSWORD,
  },
});

const sendForgetPasswordMail = async ({ to, code }) => {
  try {
    const templatePath = path.join(
      __dirname,
      "../templates/forgot-password-template.ejs"
    );
    const year = new Date().getFullYear() + 5;
    const html = await ejs.renderFile(templatePath, {
      to,
      code,
      year,
    });
    const result = await transporter.sendMail({
      to,
      subject: "Recovery Password | SHOP.CO",
      html: html,
    });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const MailUtils = {
  sendForgetPasswordMail,
};

module.exports = MailUtils;
