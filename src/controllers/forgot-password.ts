import { Request, Response } from "express";
import crypto from "crypto";
import { UserModel } from "../models/user";
import { generateResetToken } from "../utils/token";
import { sendEmailSafe } from "../utils/sendEmailSafe";
import { passwordResetEmail } from "../templates/emailTemplates";

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await UserModel.findOne({ email });

    // Always respond success (security best practice)
    if (!user) {
      return res.status(200).json({
        message: "If the email exists, a reset link was sent",
      });
    }

    const { rawToken, hashedToken } = generateResetToken();

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;

    sendEmailSafe(
      user.email,
      "Reset your password 🔐",
      passwordResetEmail(resetLink)
    );

    return res.status(200).json({
      message: "If the email exists, a reset link was sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
