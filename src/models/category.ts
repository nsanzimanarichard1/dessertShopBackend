// models/Category.ts
import { Schema, model, models, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface CategoryDocument extends Document<string> {
  _id: string;
  name: string;
  description?: string;
}

const categorySchema = new Schema<CategoryDocument>(
  {
    _id: { type: String, default: () => uuidv4() },
    name: { type: String, required: true, unique: true },
    description: String,
  },
  { timestamps: true }
);

export const CategoryModel =
  models.Category || model<CategoryDocument>("Category", categorySchema);
