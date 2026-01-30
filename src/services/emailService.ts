import { Resend } from 'resend';
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  await resend.emails.send({
    from: 'Dessert Shop <onboarding@resend.dev>',
    to: [to],
    subject,
    html,
  });
};
