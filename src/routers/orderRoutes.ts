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

// User
router.post("/orders", protect, createOrder);
router.get("/orders/my", protect, getMyOrders);
router.get("/orders/:id", protect, getOrderById);

// Admin
router.get("/orders", protect, requireAdmin, getAllOrdersAdmin);
router.put("/orders/:id/status", protect, requireAdmin, updateOrderStatus);

export default router;
