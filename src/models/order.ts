import { Schema, model, models, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Order, OrderItem, OrderStatus } from "../types/order";

/* --------------------
   Order Document Type
--------------------- */
export interface OrderDocument extends Order, Document<string> {}

/* --------------------
   Order Item Schema
--------------------- */
const orderItemSchema = new Schema<OrderItem>(
  {
    dessertId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    imageUrl: { type: String, required: true },
  },
  { _id: false }
);

/* --------------------
   Order Schema
--------------------- */
const orderSchema = new Schema<OrderDocument>(
  {
    _id: { type: String, default: () => uuidv4() },

    userId: { type: String, required: true, ref: "User" },

    items: { type: [orderItemSchema], required: true },

    total: { type: Number, required: true },

    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
  },
  { timestamps: true }
);

export const OrderModel =
  models.Order || model<OrderDocument>("Order", orderSchema);
