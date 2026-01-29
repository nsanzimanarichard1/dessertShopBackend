declare global {
  namespace Express {
    interface Request {
      user?: string; // User ID from JWT token
    }
  }
}