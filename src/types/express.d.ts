import { User } from "./dessert";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}