
import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController";
import { requireAdmin } from "../middleware/adminMiddleware";
import { protect } from "../middleware/authMiddleware";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /api/all/category:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server error
 */

router.get("/all/category", getAllCategories);

/**
 * @swagger
 * /api/category/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
router.get("/category/:id", getCategoryById);

/**
 * @swagger
 * /api/create-category:
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cakes
 *               description:
 *                 type: string
 *                 example: All cake desserts
 *     responses:
 *       201:
 *         description: Category created successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin access only
 */
router.post("/create-category",protect, requireAdmin, createCategory);

/**
 * @swagger
 * /api/category/update-category/{id}:
 *   put:
 *     summary: Update category by ID (Admin only)
 *     tags: [Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       403:
 *         description: Admin access only
 *       404:
 *         description: Category not found
 */
router.put("/category/update-category/:id",protect, requireAdmin, updateCategory);
/**
 * @swagger
 * /api/delete-category/{id}:
 *   delete:
 *     summary: Delete category by ID (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       403:
 *         description: Admin access only
 *       404:
 *         description: Category not found
 */
router.delete("/delete-category/:id", protect, requireAdmin, deleteCategory);

export default router;
