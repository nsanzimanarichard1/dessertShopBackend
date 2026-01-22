import { sendEmail } from "../services/emailService";

export const sendEmailSafe = async (
  to: string,
  subject: string,
  html: string
) => {
  try {
    await sendEmail(to, subject, html);
  } catch (error) {
    console.error("📧 Email failed:", error);
    // ❗ DO NOT throw
  }
};