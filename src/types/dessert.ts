
export enum UserRole {
    ADMIN = "admin",
    CUSTOMER = "customer"
}

export enum DessertCategory {

  Waffle = "Waffle",
  CremeBrulee = "CremeBrulee",
  Macaron = "Macaron",
  Tiramisu = "Tiramisu",
  Baklava = "Baklava",
  Pie = "Pie",
  Cake = "Cake",
  Brownie = "Brownie",
  PannaCotta = "PannaCotta",
}

export interface Dessert {
  _id: string;
  name: string;
  category: DessertCategory;
  price: number;
  description: string;
  imageUrl: string;
  inStock: boolean;
  stock?: number;
}


export interface CartItem {
    dessertId: string; // Reference the Dessert _id
    quantity: number;
    addedAt: Date;
    // Optional: You can store 'priceAtTimeOfPurchase' 
    // if you want to keep a record for receipts.
}

export interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    role: UserRole; // Added the enum here
    createdAt: Date;
    cart: CartItem[]; // It is common to store the cart inside the User document in MongoDB
}