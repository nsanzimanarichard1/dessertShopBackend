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
    stock: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// Virtual field for inStock status
productSchema.virtual('inStock').get(function() {
  return this.stock > 0;
});

// Include virtuals in JSON output
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

//indexing to search
productSchema.index({
  "name":"text",
  "description": "text"
})

export const ProductModel =
  models.Product || model<DessertDocument>("Product", productSchema);
