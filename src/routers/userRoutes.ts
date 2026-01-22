import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUser,
} from "../controllers/userController";
import { requireAdmin } from "../middleware/adminMiddleware";
import { protect } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/create/user:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: richard
 *               email:
 *                 type: string
 *                 example: richard@gmail.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *               role:
 *                 type: string
 *                 example: USER
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email or username already taken
 *       500:
 *         description: Server error
 */

router.post("/create/user", createUser);

/**
 * @swagger
 * /api/all/user:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Failed to fetch users
 */
router.get("/all/user", protect, requireAdmin, getAllUsers);
/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to fetch user
 */
router.get("/user/:id", protect, getUserById);
/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Update user by ID but require admin permission so get token from admin
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: newusername
 *               email:
 *                 type: string
 *                 example: newemail@gmail.com
 *               password:
 *                 type: string
 *                 example: NewPassword123!
 *               role:
 *                 type: string
 *                 example: ADMIN
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to update user
 */
router.put("/user/:id",protect, updateUserById);
/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete user by ID require Admin permission so get token from admin
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to delete user
 */
router.delete("/user/:id",protect, requireAdmin, deleteUser);

// Admin updates user
router.put("/admin/user/:id", protect, requireAdmin, updateUserById);

export default router;
