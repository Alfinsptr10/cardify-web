const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "cardify.official.id@gmail.com",
    pass: "tfoq qjhp lpmb oybr",
  },
  tls: {
    rejectUnauthorized: false,
  },
  logger: true,
  debug: true,
});

(async () => {
  try {
    await transporter.verify();
    console.log("SMTP VERIFIED");
  } catch (e) {
    console.error(e);
  }
})();