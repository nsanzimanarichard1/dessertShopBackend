import express,{Request, Response} from "express"
// import controller functions from productController file from controllers folder
 import{ 
    getAllProducts,
    getProductById,
    createProduct,
    updateProductById,
    deleteProductById
 } from "../controllers/productController"
import { requireAdmin } from "../middleware/adminMiddleware";
import { protect } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";


// crete router variable
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *       500:
 *         description: Server error
 */

//get all products route
 router.get("/products", getAllProducts)
// get product by id 
/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

 router.get("/product/:id", getProductById)
 /**
 * @swagger
 * /api/create-product:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Chocolate Cake
 *               price:
 *                 type: number
 *                 example: 12.5
 *               description:
 *                 type: string
 *                 example: Delicious cake
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Not authorized, no token
 *       403:
 *         description: Admin access only
 *       500:
 *         description: Failed to create product
 */

 // crete product route
 router.post("/create-product",protect,requireAdmin,upload.single("image"), createProduct)

/**
 * @swagger
 * /api/update-product/{id}:
 *   patch:
 *     summary: Update a product by ID (Admin only)
 *     tags: [Products]
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
 *             example:
 *               price: 15
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       403:
 *         description: Admin access only
 *       500:
 *         description: Failed to update product
 */
 router.patch("/update-product/:id",protect,requireAdmin, updateProductById)
 /**
 * @swagger
 * /api/delete-product/{id}:
 *   delete:
 *     summary: Delete product by ID (Admin only)
 *     tags: [Products]
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
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       403:
 *         description: Admin access only
 *       500:
 *         description: Failed to delete product
 */

 router.delete("/delete-product/:id",protect,requireAdmin, deleteProductById);

// export router to use in app.ts 
    export default router;