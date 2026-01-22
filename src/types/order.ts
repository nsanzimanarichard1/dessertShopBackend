export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPED = "shipped", 
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}


export interface OrderItem {
  dessertId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  snapshotName: string;     // snapshot
  snapshotPrice: number; 
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: string; 
  paymentMethod: "card" | "cash"; 
  createdAt: Date;
}
