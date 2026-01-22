import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/user";
import { UserRole } from "../types/dessert";
import { sendEmailSafe } from "../utils/sendEmailSafe";
import { welcomeEmail } from "../templates/emailTemplates";
/**
 * CREATE USER (Public Register)
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const conflictField =
        existingUser.email === email ? "Email" : "Username";
      return res
        .status(409)
        .json({ message: `${conflictField} is already taken` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role: UserRole.CUSTOMER, // force default role
    });
    //send email
    sendEmailSafe(
  user.email,
  "Welcome to Dessert Shop 🎉",
  welcomeEmail(user.username)
);



    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      
    });
  } catch {
    res.status(500).json({ message: "Failed to create user" });
  }
  
};


/**
 * GET ALL USERS (Admin only)
 */
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await UserModel.find().select("-password");
    res.status(200).json(users);
  } catch {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};


/**
 * GET USER BY ID
 * Admin can access any user
 * User can only access their own profile
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { id } = req.params;
    const loggedInUser = req.user;

    // Authorization check
    if (
      loggedInUser.role !== UserRole.ADMIN &&
      loggedInUser._id !== id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await UserModel.findOne({ _id: id }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};


/**
 * UPDATE USER
 * - User can update own profile
 * - Admin can update any user (including role)
 */
export const updateUserById = async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.user!;
    const { id } = req.params;
    const { username, email, password, role } = req.body;

    // Authorization check
    if (
      loggedInUser.role !== UserRole.ADMIN &&
      loggedInUser._id.toString() !== id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) user.username = username;
    if (email) user.email = email;

    // Only admin can change role
    if (role && loggedInUser.role === UserRole.ADMIN) {
      user.role = role;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    res.status(500).json({ message: "Failed to update user" });
  }
};

/**
 * DELETE USER (Admin only)
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch {
    res.status(500).json({ message: "Failed to delete user" });
  }
};
