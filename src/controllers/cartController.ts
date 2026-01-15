// controllers/cartController.ts
import { Request, Response } from "express";
import { UserModel } from "../models/user";

export const getCart = async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.params.userId)
    .populate("cart.dessertId");

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user.cart);
};

export const addToCart = async (req: Request, res: Response) => {
  const { dessertId, quantity } = req.body;

  const user = await UserModel.findById(req.params.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const existingItem = user.cart.find(
    (item: any) => item.dessertId === dessertId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    user.cart.push({ dessertId, quantity, addedAt: new Date() });
  }

  await user.save();
  res.status(200).json(user.cart);
};

export const updateCartItem = async (req: Request, res: Response) => {
  const { quantity } = req.body;

  const user = await UserModel.findById(req.params.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const item = user.cart.find(
    (i: any) => i.dessertId === req.params.id
  );

  if (!item) return res.status(404).json({ message: "Item not found" });

  item.quantity = quantity;
  await user.save();

  res.json(user.cart);
};

export const removeCartItem = async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.params.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.cart = user.cart.filter(
    (item: any) => item.dessertId !== req.params.id
  );

  await user.save();
  res.json(user.cart);
};

export const clearCart = async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.params.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.cart = [];
  await user.save();

  res.status(204).send();
};





