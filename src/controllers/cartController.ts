// controllers/cartController.ts
import { Request, Response } from "express";
import { UserModel } from "../models/user";
import { CartItem } from "../types/dessert";

interface AuthRequest extends Request {
  user?: string;
}

export const getCart = async (req: AuthRequest, res: Response) => {
  const user = await UserModel.findById(req.user)
    .populate("cart.dessertId");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({
    success: true,
    data: user.cart
  });
};



export const addToCart = async (req: AuthRequest, res: Response) => {
  const { dessertId, quantity } = req.body;

  if (!dessertId || quantity <= 0) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const user = await UserModel.findById(req.user);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const item = user.cart.find(
    (i: CartItem) => i.dessertId.toString() === dessertId
  );

  if (item) {
    item.quantity += quantity;
  } else {
    user.cart.push({ dessertId, quantity, addedAt: new Date() });
  }

  await user.save();
  return res.status(200).json({
    success: true,
    message: "Item added to cart",
    data: user.cart
  });
};



export const updateCartItem = async (req: AuthRequest, res: Response) => {
  const { quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be greater than 0" });
  }

  const user = await UserModel.findById(req.user);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const item = user.cart.find(
    (i: CartItem) => i.dessertId.toString() === req.params.dessertId
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  item.quantity = quantity;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Cart item updated",
    data: user.cart
  });
};


export const removeCartItem = async (req: AuthRequest, res: Response) => {
  const user = await UserModel.findById(req.user);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.cart = user.cart.filter(
    (i: CartItem) => i.dessertId.toString() !== req.params.dessertId
  );

  await user.save();
  return res.status(200).json({
    success: true,
    message: "Item removed from cart",
    data: user.cart
  });
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  const user = await UserModel.findById(req.user);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.cart = [];
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Cart cleared"
  });
};





