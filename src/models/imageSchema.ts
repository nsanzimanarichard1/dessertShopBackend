import { Schema, model, models, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Image } from "../types/image";

export interface ImageDocument extends Image, Document<string> {}

const imageSchema = new Schema<ImageDocument>(
  {
    _id: { type: String, default: () => uuidv4() },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

export const ImageModel =
  models.Image || model<ImageDocument>("Image", imageSchema);
