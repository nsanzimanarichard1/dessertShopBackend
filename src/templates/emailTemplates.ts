export const welcomeEmail = (name: string) => `
  <h2>Welcome ${name} 👋</h2>
  <p>Thank you for registering at Dessert Shop.</p>
`;

export const passwordResetEmail = (resetLink: string) => `
  <h2>Password Reset</h2>
  <p>Click the link below to reset your password:</p>
  <a href="${resetLink}">Reset Password</a>
  <p>This link expires in 15 minutes.</p>
`;

export const passwordChangedEmail = () => `
  <h2>Password Changed</h2>
  <p>Your password was successfully changed.</p>
`;

export const orderPlacedEmail = (orderId: string, total: number) => `
  <h2>Order Placed ✅</h2>
  <p>Your order <b>${orderId}</b> was placed successfully.</p>
  <p>Total: $${total}</p>
`;

export const orderStatusEmail = (
  orderId: string,
  status: string
) => `
  <h2>Order Update 📦</h2>
  <p>Your order <b>${orderId}</b> is now <b>${status}</b>.</p>
`;
