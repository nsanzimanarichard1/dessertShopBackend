import { Express } from "express";
import { Router } from "express";
import { forgotPassword } from "../controllers/forgot-password";
import { resetPassword } from "../controllers/resetPasswordToken";

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Password Reset
 *   description: Password recovery and reset
 */

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset email
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Email not found or validation error
 *       500:
 *         description: Failed to send reset email
 */
router.post("/auth/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Reset password with token from email
 *     tags: [Password Reset]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Reset token received in email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: NewPassword123!
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token, or validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to reset password
 */
router.post("/auth/reset-password/:token", resetPassword);

// export router to use in app.ts 
    export default router;