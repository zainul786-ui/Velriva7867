export type ScreenName =
  | 'splash'
  | 'home'
  | 'productListing'
  | 'productDetails'
  | 'categories'
  | 'search'
  | 'wishlist'
  | 'cart'
  | 'checkout'
  | 'success'
  | 'profile'
  | 'orders'
  | 'trackOrder'
  | 'settings'
  | 'login'
  | 'adminLogin'
  | 'adminDashboard';

export interface NavigationState {
  currentScreen: ScreenName;
  history: { screen: ScreenName; params?: any }[];
  params?: any;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  rating: number;
  image: string;
  images: string[];
  category: string;
  description: string;
  reviews: Review[];
  viewsCount: number;
  likesCount: number;
  ordersCount: number;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isFlashSale?: boolean;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  customerEmail?: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  tracking: {
    status: string;
    description: string;
    time: string;
  }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  bannerImage: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  isLoggedIn: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface PromoBanner {
  id: string;
  title: string;
  sub: string;
  img: string;
  category: string;
}

export interface Coupon {
  code: string;
  discount: number;
  isActive: boolean;
}

