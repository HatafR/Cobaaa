import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

console.log("ENV Cek Masuk");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendEmail(to, subject, text) {
  return transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
  });
}

// Example usage: