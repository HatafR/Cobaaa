import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "rizz.fatah@gmail.com",
    pass: "jgua howu qklp dwgx",
  },
});

export async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: "rizz.fatah@gmail.com",
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
}