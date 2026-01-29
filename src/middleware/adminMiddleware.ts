import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user";
import { UserRole } from "../types/dessert";

interface AuthRequest extends Request {
  user?: string;
}

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await UserModel.findById(req.user);
    if (!user || user.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: "Admin access only" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};