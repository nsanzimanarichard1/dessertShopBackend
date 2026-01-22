import { Request, Response } from "express";
import fs from "fs";
import { ImageModel } from "../models/imageSchema";

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image required" });
  }

  const image = await ImageModel.create({
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    url: `/uploads/${req.file.filename}`,
  });

  res.status(201).json(image);
};

export const deleteImage = async (req: Request, res: Response) => {
  const image = await ImageModel.findById(req.params.id);
  if (!image) {
    return res.status(404).json({ message: "Image not found" });
  }

  fs.unlinkSync(`uploads/${image.filename}`);
  await image.deleteOne();

  res.status(200).json({ message: "Image deleted" });
};
