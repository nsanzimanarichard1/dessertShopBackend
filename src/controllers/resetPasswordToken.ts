import bcrypt from "bcryptjs";
import { passwordChangedEmail } from "../templates/emailTemplates";
import { UserModel } from "../models/user";
import { Request, Response } from "express";
import crypto from "crypto"
import {sendEmailSafe} from "../utils/sendEmailSafe"
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await UserModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    sendEmailSafe(
      user.email,
      "Password changed successfully ✅",
      passwordChangedEmail()
    );

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
