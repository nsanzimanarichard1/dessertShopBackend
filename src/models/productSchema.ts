// models/Product.ts
import { Schema, model, models, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface DessertDocument extends Document<string> {
  _id: string;
  name: string;
  category: string; // Reference to Category _id
  price: number;
  description: string;
  imageUrl: string;
  inStock: boolean;
  stock: number;
}

const productSchema = new Schema<DessertDocument>(
  {
    _id: { type: String, default: () => uuidv4() },
    name: { type: String, required: true },
    category: {
      type: String,
      ref: "Category",
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    inStock: { type: Boolean, default: true },
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
