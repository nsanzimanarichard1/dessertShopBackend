import { Schema, model, models, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { UserRole, CartItem } from "../types/dessert";

/* --------------------
   User Document Type
--------------------- */
export interface UserDocument extends Document<string> {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  cart: CartItem[];
  resetPasswordToken?: string;//option
  resetPasswordExpires?: Date;//option
  createdAt: Date;
}

/* --------------------
   Cart Sub-Schema
--------------------- */
const cartItemSchema = new Schema<CartItem>(
  {
    dessertId: { type: String, required: true, ref: "Product" },
    quantity: { type: Number, required: true, min: 1 },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false } // cart items don't need their own _id
);

/* --------------------
   User Schema
--------------------- */
const userSchema = new Schema<UserDocument>(
  {
    _id: { type: String, default: () => uuidv4() },

    username: { type: String, required: true, unique: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    cart: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

export const UserModel =
  models.User || model<UserDocument>("User", userSchema);
