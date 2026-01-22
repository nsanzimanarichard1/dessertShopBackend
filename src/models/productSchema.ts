// models/Product.ts
import { Schema, model, models, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Dessert, DessertCategory } from "../types/dessert";

export interface DessertDocument extends Dessert, Document<string> {}

const productSchema = new Schema<DessertDocument>(
  {
    _id: { type: String, default: () => uuidv4() },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: Object.values(DessertCategory),
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    imageUrl: { type: String, ref: "Image", required: true },
    inStock: { type: Boolean, default: true },
    // numeric stock level for inventory management
    stock: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

//indexing to search

productSchema.index({
  "name":"text",
  "description": "text"
})

export const ProductModel =
  models.Product || model<DessertDocument>("Product", productSchema);
