export interface MenuItem {
  id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  options: {
    sizes: string[];
    crusts: string[];
    toppings: string[];
  };
}

export interface OrderItem {
  id: string;
  name: string;
  size: string;
  crust: string;
  extras: string[];
  quantity: number;
  price: number;
}

export interface Order {
  id?: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: 'COD' | 'Online';
  paymentStatus: 'Pending' | 'Paid';
  status: 'Processing' | 'Preparing' | 'Out for Delivery' | 'Delivered';
  createdAt: any;
}

export interface Message {
  id?: string;
  name: string;
  email: string;
  message: string;
  adminReply?: string;
  status: 'unread' | 'read';
  createdAt: any;
}

export interface Deal {
  id?: string;
  title: string;
  description: string;
  discount: number;
  price: number;
  code: string;
  image: string;
}

export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  image: string;
  author: string;
  category: string;
  createdAt: any;
}

export interface SiteSettings {
  restaurantName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  openingHours: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
}
