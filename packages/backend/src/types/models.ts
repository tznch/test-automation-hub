export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  userId: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  itemId: number;
  quantity: number;
  price: number;
}

export interface File {
  id: number;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  uploadedBy?: number;
  createdAt: string;
}

export interface FeatureFlag {
  id: number;
  name: string;
  key: string;
  enabled: boolean;
  description?: string;
  rolloutPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface RefreshToken {
  id: number;
  userId: number;
  token: string;
  expiresAt: string;
  createdAt: string;
}
