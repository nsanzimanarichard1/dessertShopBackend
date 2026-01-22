import { Request, Response } from "express";
import mongoose from "mongoose";
import { UserModel } from "../models/user";
import { OrderModel } from "../models/order";
import { OrderStatus } from "../types/order";
import { sendEmailSafe } from "../utils/sendEmailSafe";
import { welcomeEmail, orderPlacedEmail, orderStatusEmail } from "../templates/emailTemplates";
import { ProductModel } from "../models/productSchema";
export const createOrder = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.user!._id)
      .populate("cart.dessertId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = user.cart.map((item: any) => ({
      dessertId: item.dessertId._id,
      name: item.dessertId.name,
      price: item.dessertId.price,
      quantity: item.quantity,
      imageUrl: item.dessertId.imageUrl,
      snapshotName: item.dessertId.name,
      snapshotPrice: item.dessertId.price,
    }));

    const total = orderItems.reduce(
      (sum: number, item:any) => sum + item.snapshotPrice * item.quantity,
      0
    );
    

    const order = await OrderModel.create({
      userId: user._id,
      items: orderItems,
      total,
      status: OrderStatus.PENDING,
    });
    //send order to email
    sendEmailSafe(
  user.email,
  "Order Placed Successfully",
  orderPlacedEmail(order._id.toString(), order.total)
)

    // Clear cart AFTER order is saved
    user.cart = [];
    await user.save();

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create order" });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderModel.find({ userId: req.user!._id })
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch {
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await OrderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
  req.user!.role !== "admin" &&
  order.userId.toString() !== req.user!._id.toString()
) {
  return res.status(403).json({ message: "Access denied" });
}


    return res.status(200).json(order);
  } catch {
    return res.status(500).json({ message: "Failed to fetch order" });
  }
};


// admin
export const getAllOrdersAdmin = async (
  _req: Request,
  res: Response
) => {
  try {
    const orders = await OrderModel.find()
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch {
    return res.status(500).json({
      message: "Failed to fetch all orders",
    });
  }
};



export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const order = await OrderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === OrderStatus.CANCELLED) {
      return res.status(400).json({
        message: "Cancelled orders cannot be modified",
      });
    }
    const user = await UserModel.findById(order.req.user._id);
if (user) {
  sendEmailSafe(
    user.email,
    "Order Status Updated",
    orderStatusEmail(order._id.toString(), status)
  );
}


    order.status = status;
    await order.save();

    return res.status(200).json(order);
  } catch {
    return res.status(500).json({ message: "Failed to update order" });
  }
};

// create order with transaction

export const createOrderTx = async (
  userId: string,
  items: Array<{ dessertId: string; quantity: number }>
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("No items provided");
    }

    const orderItems: any[] = [];
    let total = 0;

    for (const item of items) {
      const product = await ProductModel.findById(item.dessertId).session(
        session
      );

      if (!product) {
        throw new Error(`Product ${item.dessertId} not found`);
      }

      // ensure numeric stock is available (if present)
      if (typeof product.stock === "number" && product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product._id}`);
      }

      const price = product.price;
      const quantity = item.quantity;

      orderItems.push({
        dessertId: product._id,
        name: product.name,
        price,
        quantity,
        imageUrl: product.imageUrl,
        snapshotName: product.name,
        snapshotPrice: price,
      });

      total += price * quantity;
    }

    // decrement stock for each product (if stock field exists)
    for (const item of items) {
      await ProductModel.findByIdAndUpdate(
        item.dessertId,
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }

    const created = await OrderModel.create(
      [{ userId, items: orderItems, total, status: OrderStatus.PENDING }],
      { session }
    );

    const order = Array.isArray(created) ? created[0] : created;

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// cancel order

export const cancelOrderTx = async (orderId: string, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  // find order by id and owner userId
  const order = await OrderModel.findOne({ _id: orderId, userId }).session(
    session
  );
  if (!order) throw new Error("Order not found");

  // NOTE: your Product schema currently does not track numeric `stock`.
  // If you add a `stock` field to products, you can restore inventory here:
  for (const item of order.items) {
    await ProductModel.findByIdAndUpdate(
      item.dessertId,
      { $inc: { stock: item.quantity } },
      { session }
    );
  }

  order.status = OrderStatus.CANCELLED;
  await order.save({ session });

  await session.commitTransaction();
  session.endSession();

  return order;
};
