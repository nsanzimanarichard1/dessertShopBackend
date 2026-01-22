import nodemailer from "nodemailer";
import dotenv from "dotenv"

dotenv.config()
console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_PORT:", process.env.EMAIL_PORT);


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  await transporter.sendMail({
    from: `"Dessert Shop" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
