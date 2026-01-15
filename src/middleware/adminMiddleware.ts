/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/dessert";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user; // set by auth middleware

  if (!user || user.role !== UserRole.ADMIN) {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
};


