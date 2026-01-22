// controllers/cartController.ts
import { Request, Response } from "express";
import { UserModel } from "../models/user";
import { CartItem } from "../types/dessert";

export const getCart = async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.user!._id)
    .populate("cart.dessertId");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(user.cart);
};



export const addToCart = async (req: Request, res: Response) => {
  const { dessertId, quantity } = req.body;

  if (!dessertId || quantity <= 0) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const user = await UserModel.findById(req.user!._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const item = user.cart.find(
    (i: CartItem) => i.dessertId === dessertId
  );

  if (item) {
    item.quantity += quantity;
  } else {
    user.cart.push({ dessertId, quantity });
  }

  await user.save();
  return res.status(200).json(user.cart);
};



export const updateCartItem = async (req: Request, res: Response) => {
  const { quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be greater than 0" });
  }

  const user = await UserModel.findById(req.user!._id);
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

  return res.status(200).json(user.cart);
};


export const removeCartItem = async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.user!._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.cart = user.cart.filter(
    (i: CartItem) => i.dessertId.toString() !== req.params.dessertId
  );

  await user.save();
  return res.status(200).json(user.cart);
};


export const clearCart = async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.user!._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.cart = [];
  await user.save();

  return res.status(204).send();
};





