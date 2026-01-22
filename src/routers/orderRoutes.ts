import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatus,
} from "../controllers/orderController";
import { protect } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/adminMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order (User)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Order is created from user's cart
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Cart is empty or validation error
 *       401:
 *         description: Not authorized, no token
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to create order
 */
// User
router.post("/orders", protect, createOrder);

/**
 * @swagger
 * /api/orders/my:
 *   get:
 *     summary: Get current user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders sorted by newest first
 *       401:
 *         description: Not authorized, no token
 *       500:
 *         description: Failed to fetch orders
 */
router.get("/orders/my", protect, getMyOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID (User can view own orders, Admin can view all)
 *     tags: [Orders]
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
 *         description: Order details
 *       401:
 *         description: Not authorized, no token
 *       403:
 *         description: Access denied - can only view own orders
 *       404:
 *         description: Order not found
 *       500:
 *         description: Failed to fetch order
 */
router.get("/orders/:id", protect, getOrderById);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders sorted by newest first
 *       401:
 *         description: Not authorized, no token
 *       403:
 *         description: Admin access only
 *       500:
 *         description: Failed to fetch all orders
 */
// Admin
router.get("/orders", protect, requireAdmin, getAllOrdersAdmin);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED]
 *                 example: SHIPPED
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Cannot modify cancelled orders
 *       401:
 *         description: Not authorized, no token
 *       403:
 *         description: Admin access only
 *       404:
 *         description: Order not found
 *       500:
 *         description: Failed to update order
 */
router.put("/orders/:id/status", protect, requireAdmin, updateOrderStatus);

export default router;
