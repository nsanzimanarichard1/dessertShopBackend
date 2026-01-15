// routes/cartRoutes.ts
import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController";

const router = Router();

router.post("/:userId/items", addToCart);
router.get("/:userId", getCart);
router.put("/:userId/items/:id", updateCartItem);
router.delete("/:userId/items/:id", removeCartItem);
router.delete("/:userId", clearCart);

export default router;


