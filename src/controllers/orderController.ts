import { Request, Response } from "express";
import { UserModel } from "../models/user";
import { OrderModel } from "../models/order";
import { OrderStatus } from "../types/order";
import { sendEmailSafe } from "../utils/sendEmailSafe";
import { welcomeEmail, orderPlacedEmail, orderStatusEmail } from "../templates/emailTemplates";
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

