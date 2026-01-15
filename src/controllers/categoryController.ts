import { Request, Response } from "express";
import { CategoryModel } from "../models/category";

export const getAllCategories = async (req: Request, res: Response) => {
  const categories = await CategoryModel.find();
  res.json(categories);
};

export const getCategoryById = async (req: Request, res: Response) => {
  const category = await CategoryModel.findById(req.params.id);
  if (!category) return res.status(404).json({ message: "Not found" });
  res.json(category);
};

export const createCategory = async (req: Request, res: Response) => {
  const category = await CategoryModel.create(req.body);
  res.status(201).json(category);
};

export const updateCategory = async (req: Request, res: Response) => {
  const category = await CategoryModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
  await CategoryModel.findByIdAndDelete(req.params.id);
  res.status(204).send();
};
