// routes/cartRoutes.ts
import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: User shopping cart management
 */

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart (Protected)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dessertId
 *               - quantity
 *             properties:
 *               dessertId:
 *                 type: string
 *                 example: e012e549-3ae9-48e5-8a25-3770d60826d5
 *               quantity:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized, no token
 *       404:
 *         description: User not found
 */

router.post("/cart", protect, addToCart);
/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user cart (Protected)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User cart retrieved successfully
 *       401:
 *         description: Not authorized, no token
 *       404:
 *         description: User not found
 */
router.get("/cart", protect, getCart);
/**
 * @swagger
 * /api/cart/{dessertId}:
 *   put:
 *     summary: Update cart item quantity (Protected)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dessertId
 *         required: true
 *         description: Dessert ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       400:
 *         description: Invalid quantity
 *       401:
 *         description: Not authorized, no token
 *       404:
 *         description: Item or user not found
 */
router.put("/cart/:dessertId", protect, updateCartItem);
/**
 * @swagger
 * /api/cart/{dessertId}:
 *   delete:
 *     summary: Remove item from cart (Protected)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dessertId
 *         required: true
 *         description: Dessert ID to remove
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       401:
 *         description: Not authorized, no token
 *       404:
 *         description: User not found
 */
router.delete("/cart/:dessertId", protect, removeCartItem);
/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Clear user cart (Protected)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       401:
 *         description: Not authorized, no token
 *       404:
 *         description: User not found
 */
router.delete("/cart", protect, clearCart);

export default router;


