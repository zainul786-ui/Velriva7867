import React, { createContext, useContext, useState, useEffect } from 'react';
import { ScreenName, NavigationState, Product, CartItem, Order, User, AppNotification, PromoBanner, Coupon } from '../types';
import { MOCK_PRODUCTS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AppContextType {
  // Navigation
  navigation: NavigationState;
  navigateTo: (screen: ScreenName, params?: any) => void;
  goBack: () => void;
  
  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  incrementProductViews: (productId: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  
  // Recently Viewed
  recentlyViewed: string[];
  addToRecentlyViewed: (productId: string) => void;
  
  // Orders
  orders: Order[];
  placeOrder: (shippingDetails: Order['shippingAddress']) => Order;
  updateOrderStatus: (orderId: string, status: Order['status'], trackingDetails?: string) => void;
  
  // Promo Banners & Ads
  promoBanners: PromoBanner[];
  updatePromoBanners: (banners: PromoBanner[]) => void;

  // Discount Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Auth
  currentUser: User;
  loginUser: (email: string, password: string) => Promise<boolean | string>;
  registerUser: (name: string, email: string, password: string, phone: string) => Promise<boolean | string>;
  sendLoginOtp: (phone: string) => Promise<{ success: boolean; offlineFallback?: boolean; devOtp?: string; error?: string }>;
  verifyLoginOtp: (phone: string, otp: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logoutUser: () => void;
  updateUserProfile: (name: string, phone: string) => Promise<boolean>;
  isAdmin: boolean;
  loginAdmin: () => boolean;
  logoutAdmin: () => void;
  accounts: any[];
  
  // Notifications
  notifications: AppNotification[];
  markNotificationsAsRead: () => void;
  addNotification: (title: string, body: string) => void;
  
  // Toast notifications
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Website custom logo (base64 or URL)
  logo: string;
  updateLogo: (base64OrUrl: string) => void;

  // Customer support channels (Admin configurable)
  supportInstagram: string;
  supportYoutube: string;
  supportEmail: string;
  supportPhone: string;
  updateSupportLinks: (links: { supportInstagram: string; supportYoutube: string; supportEmail: string; supportPhone: string }) => void;
  getApiUrl: (endpoint: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_BANNERS: PromoBanner[] = [
  {
    id: 'banner_1',
    title: 'DROP 09: LIGHTSPEEDS',
    sub: 'Save 50% on all premium wireless headphones archives.',
    img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop',
    category: 'headphones',
  },
  {
    id: 'banner_2',
    title: 'PREMIUM ACTIVE OUD ENTITY',
    sub: 'Elevate your aesthetic aura with rich olfactory Mystic extracts.',
    img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop',
    category: 'perfume',
  },
];

const DEFAULT_COUPONS: Coupon[] = [
  { code: 'VEL50', discount: 50, isActive: true },
  { code: 'WELCOME10', discount: 10, isActive: true },
  { code: 'SUPEROFF', discount: 30, isActive: true }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Navigation state
  const [navigation, setNavigation] = useState<NavigationState>({
    currentScreen: 'splash',
    history: [{ screen: 'splash' }],
  });

  // 2. Products state (Local Storage / Defaults)
  const [products, setProducts] = useState<Product[]>([]);

  // 3. Cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  // 4. Wishlist state
  const [wishlist, setWishlist] = useState<string[]>([]);

  // 5. Recently Viewed
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  // 6. Orders state
  const [orders, setOrders] = useState<Order[]>([]);

  // 7. Auth state
  const [currentUser, setCurrentUser] = useState<User>({
    id: '',
    name: '',
    email: '',
    phone: '',
    isLoggedIn: false,
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // 8. Notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // 9. Toast State
  const [toast, setToast] = useState<AppContextType['toast']>(null);

  // Promo Banners State
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>([]);
  // Coupons State
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  // Applied Coupon in checkout/cart state
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Accounts state (local cache of registration DB)
  const [accounts, setAccounts] = useState<any[]>([]);

  // 10. Website dynamic custom logo state viewable across app with gold SVG fallback
  const [logo, setLogo] = useState<string>(() => {
    return localStorage.getItem('velriva_logo') || '';
  });

  const updateLogo = async (base64OrUrl: string) => {
    setLogo(base64OrUrl);
    localStorage.setItem('velriva_logo', base64OrUrl);
    
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('app_settings')
          .upsert({ key: 'logo', value: base64OrUrl }, { onConflict: 'key' });
        
        if (error) {
          console.warn("Failed to sync logo to Supabase table app_settings:", error.message);
          showToast('Saved locally. Please run the SQL script in Supabase!', 'error');
        } else {
          showToast('Brand Logo synced to Supabase!', 'success');
        }
      } catch (err: any) {
        console.warn("Supabase logo write failed:", err);
        showToast('Saved locally. Please run the SQL script in Supabase!', 'error');
      }
    } else {
      showToast('Brand Logo updated (Local/Offline mode)!', 'success');
    }
  };

  // Configurable Support Channels
  const [supportInstagram, setSupportInstagram] = useState<string>(() => {
    return localStorage.getItem('velriva_support_instagram') || 'https://www.instagram.com/velriva_store.786?igsh=MWJlbzVjOG96aWFzMg==';
  });
  const [supportYoutube, setSupportYoutube] = useState<string>(() => {
    return localStorage.getItem('velriva_support_youtube') || 'https://youtube.com/@velriva?si=je8rcw_kLp1s7BdE';
  });
  const [supportEmail, setSupportEmail] = useState<string>(() => {
    return localStorage.getItem('velriva_support_email') || 'velriva7867@gmail.com';
  });
  const [supportPhone, setSupportPhone] = useState<string>(() => {
    return localStorage.getItem('velriva_admin_whatsapp_number') || '919690986010';
  });

  const updateSupportLinks = (links: { supportInstagram: string; supportYoutube: string; supportEmail: string; supportPhone: string }) => {
    setSupportInstagram(links.supportInstagram);
    setSupportYoutube(links.supportYoutube);
    setSupportEmail(links.supportEmail);
    setSupportPhone(links.supportPhone);

    localStorage.setItem('velriva_support_instagram', links.supportInstagram);
    localStorage.setItem('velriva_support_youtube', links.supportYoutube);
    localStorage.setItem('velriva_support_email', links.supportEmail);
    localStorage.setItem('velriva_admin_whatsapp_number', links.supportPhone);

    showToast('Customer Support channels updated successfully!', 'success');
  };

  const getApiUrl = (endpoint: string): string => {
    const metaEnv = (import.meta as any).env || {};
    const customBackend = metaEnv.VITE_BACKEND_URL || metaEnv.VITE_API_URL;
    if (customBackend) {
      const cleanBase = customBackend.endsWith('/') ? customBackend.slice(0, -1) : customBackend;
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
      return `${cleanBase}${cleanEndpoint}`;
    }

    if (typeof window !== 'undefined' && (
      window.location.hostname.includes('run.app') || 
      window.location.hostname.includes('localhost') || 
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.includes('gitpod.io')
    )) {
      return endpoint;
    }

    return `https://ais-pre-htphy24awtencdv6abtodd-54386008569.asia-southeast1.run.app${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  };

  // Load initial data from localStorage on Mount
  useEffect(() => {
    // Intercept and parse deep linked product ID if present in browser URL query string
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const sharedId = urlParams.get('productId');
      if (sharedId) {
        sessionStorage.setItem('velriva_shared_product_id', sharedId);
        // Sanitize browser URL for a cleaner address bar experience
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
      }
    } catch (e) {
      console.warn("Deep linking parser non-critical error:", e);
    }

    // Products
    const storedProducts = localStorage.getItem('velriva_products');
    if (storedProducts) {
      try {
        const parsed = JSON.parse(storedProducts);
        const hasOldCategories = parsed.some((p: any) => 
          ['outerwear', 'footwear', 'accessories', 'tech'].includes(p.category) && 
          !['headphones', 'charger', 'airpods', 'watches', 'perfume'].includes(p.category)
        );
        if (hasOldCategories || parsed.length < MOCK_PRODUCTS.length) {
          localStorage.setItem('velriva_products', JSON.stringify(MOCK_PRODUCTS));
          setProducts(MOCK_PRODUCTS);
        } else {
          setProducts(parsed);
        }
      } catch (err) {
        localStorage.setItem('velriva_products', JSON.stringify(MOCK_PRODUCTS));
        setProducts(MOCK_PRODUCTS);
      }
    } else {
      localStorage.setItem('velriva_products', JSON.stringify(MOCK_PRODUCTS));
      setProducts(MOCK_PRODUCTS);
    }

    // Cart
    const storedCart = localStorage.getItem('velriva_cart');
    if (storedCart) setCart(JSON.parse(storedCart));

    // Wishlist
    const storedWishlist = localStorage.getItem('velriva_wishlist');
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

    // Recently Viewed
    const storedRecent = localStorage.getItem('velriva_recent');
    if (storedRecent) setRecentlyViewed(JSON.parse(storedRecent));

    // Orders
    const storedOrders = localStorage.getItem('velriva_orders');
    if (storedOrders) setOrders(JSON.parse(storedOrders));

    // User session
    const storedUser = localStorage.getItem('velriva_user');
    if (storedUser) setCurrentUser(JSON.parse(storedUser));

    // Admin state
    const storedAdmin = localStorage.getItem('velriva_admin_logged_in');
    if (storedAdmin === 'true') setIsAdmin(true);

    // Notifications
    const storedNotifications = localStorage.getItem('velriva_notifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      const defaultNotifs: AppNotification[] = [
        {
          id: 'notif_1',
          title: 'Welcome to VELORA!',
          body: 'Get premium products delivered to your doorstep. COD is available nationwide.',
          time: 'Just now',
          read: false,
        }
      ];
      localStorage.setItem('velriva_notifications', JSON.stringify(defaultNotifs));
      setNotifications(defaultNotifs);
    }

    // Promo Banners
    const storedBanners = localStorage.getItem('velriva_banners');
    if (storedBanners) {
      setPromoBanners(JSON.parse(storedBanners));
    } else {
      localStorage.setItem('velriva_banners', JSON.stringify(DEFAULT_BANNERS));
      setPromoBanners(DEFAULT_BANNERS);
    }

    // Coupons
    const storedCoupons = localStorage.getItem('velriva_coupons');
    if (storedCoupons) {
      setCoupons(JSON.parse(storedCoupons));
    } else {
      localStorage.setItem('velriva_coupons', JSON.stringify(DEFAULT_COUPONS));
      setCoupons(DEFAULT_COUPONS);
    }

    // Accounts Store Initialization
    const storedAccounts = localStorage.getItem('velriva_accounts');
    const defaultAccounts = [
      {
        id: 'usr_default',
        name: 'Zain Ul Amaan',
        email: 'zainulamaan4@gmail.com',
        phone: '+91 9690986010',
        password: 'velriva@786',
        cart: [],
        wishlist: [],
        orders: []
      }
    ];
    if (storedAccounts) {
      try {
        const parsed = JSON.parse(storedAccounts);
        const migrated = parsed.map((acc: any) => {
          if (acc.email === 'zainulamaan4@gmail.com' && (acc.password === 'password123' || !acc.password)) {
            return { ...acc, password: 'velriva@786' };
          }
          return acc;
        });
        localStorage.setItem('velriva_accounts', JSON.stringify(migrated));
        setAccounts(migrated);
      } catch (e) {
        localStorage.setItem('velriva_accounts', JSON.stringify(defaultAccounts));
        setAccounts(defaultAccounts);
      }
    } else {
      localStorage.setItem('velriva_accounts', JSON.stringify(defaultAccounts));
      setAccounts(defaultAccounts);
    }

    // Load from Supabase if configured and connected
    const initSupabaseData = async () => {
      if (!isSupabaseConfigured || !supabase) return;
      try {
        // A. Load products
        const { data: dbProducts, error: prodErr } = await supabase
          .from('products')
          .select('*');

        if (!prodErr && dbProducts && dbProducts.length > 0) {
          const mapped: Product[] = dbProducts.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            oldPrice: Number(p.old_price || p.price * 2),
            discount: Number(p.discount || 50),
            rating: Number(p.rating || 5.0),
            image: p.image,
            images: Array.isArray(p.images) ? p.images : [],
            category: p.category,
            description: p.description || '',
            viewsCount: Number(p.views_count || 0),
            likesCount: Number(p.likes_count || 0),
            ordersCount: Number(p.orders_count || 0),
            sizes: Array.isArray(p.sizes) ? p.sizes : [],
            colors: Array.isArray(p.colors) ? p.colors : [],
            isFeatured: Boolean(p.is_featured),
            isTrending: Boolean(p.is_trending),
            isFlashSale: Boolean(p.is_flash_sale),
            stock: Number(p.stock || 0),
            reviews: Array.isArray(p.reviews) ? p.reviews : [],
          }));
          setProducts(mapped);
          localStorage.setItem('velriva_products', JSON.stringify(mapped));
        }

        // B. Load Profiles / Reseller accounts
        const { data: dbProfiles, error: profErr } = await supabase
          .from('profiles')
          .select('*');

        if (!profErr && dbProfiles) {
          const mappedAccounts = dbProfiles.map((p: any) => ({
            id: p.id,
            name: p.name,
            email: p.email,
            phone: p.phone || '',
            password: p.password,
            cart: [],
            wishlist: [],
            orders: []
          }));
          setAccounts(mappedAccounts);
          localStorage.setItem('velriva_accounts', JSON.stringify(mappedAccounts));
        }

        // C. Load active coupons
        const { data: dbCoupons, error: coupErr } = await supabase
          .from('coupons')
          .select('*');

        if (!coupErr && dbCoupons && dbCoupons.length > 0) {
          const mappedCoupons: Coupon[] = dbCoupons.map((c: any) => ({
            code: c.code,
            discount: Number(c.discount),
            isActive: Boolean(c.is_active)
          }));
          setCoupons(mappedCoupons);
          localStorage.setItem('velriva_coupons', JSON.stringify(mappedCoupons));
        }

        // D. Load branding app settings (Custom Logo) securely from brand settings table
        try {
          const { data: logoSetting, error: logoErr } = await supabase
            .from('app_settings')
            .select('*')
            .eq('key', 'logo')
            .maybeSingle();

          if (!logoErr && logoSetting && logoSetting.value) {
            setLogo(logoSetting.value);
            localStorage.setItem('velriva_logo', logoSetting.value);
          }
        } catch (logoCatch) {
          console.warn("Logo load from app_settings failed. Schema might not exist yet.", logoCatch);
        }
      } catch (err) {
        console.warn("Failed to load initial Supabase data:", err);
      }
    };

    initSupabaseData();
  }, []);

  // Helper to show custom micro toast
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Dynamic state-based orders synchronized from Supabase
  useEffect(() => {
    const fetchScopedOrders = async () => {
      if (!isSupabaseConfigured || !supabase) return;
      try {
        let orderQuery = supabase.from('orders').select('*');
        const isUserAdmin = isAdmin || localStorage.getItem('velriva_admin_logged_in') === 'true';
        
        if (!isUserAdmin) {
          if (currentUser && currentUser.isLoggedIn && currentUser.email) {
            orderQuery = orderQuery.eq('customer_email', currentUser.email.trim().toLowerCase());
          } else {
            setOrders([]);
            localStorage.setItem('velriva_orders', JSON.stringify([]));
            return;
          }
        }

        const { data: dbOrders, error: ordErr } = await orderQuery;
        if (!ordErr && dbOrders) {
          const mappedOrders: Order[] = dbOrders.map((o: any) => ({
            id: o.id,
            date: o.date,
            items: o.items || [],
            total: Number(o.total),
            status: o.status,
            customerEmail: o.customer_email || undefined,
            shippingAddress: o.shipping_address || {},
            tracking: o.tracking || []
          }));
          setOrders(mappedOrders);
          localStorage.setItem('velriva_orders', JSON.stringify(mappedOrders));
        }
      } catch (err) {
        console.error("Failed to load/sync scoped orders:", err);
      }
    };

    fetchScopedOrders();
  }, [isAdmin, currentUser?.isLoggedIn, currentUser?.email]);

  // Sync state helpers
  const updateAccountData = (email: string, data: { cart?: CartItem[]; wishlist?: string[]; orders?: Order[] }) => {
    if (!email) return;
    const storedAccounts = localStorage.getItem('velriva_accounts');
    const dbAccounts = storedAccounts ? JSON.parse(storedAccounts) : [];
    const updated = dbAccounts.map((acc: any) => {
      if (acc.email.toLowerCase() === email.toLowerCase()) {
        return {
          ...acc,
          ...data
        };
      }
      return acc;
    });
    localStorage.setItem('velriva_accounts', JSON.stringify(updated));
    setAccounts(updated);
  };

  const syncProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('velriva_products', JSON.stringify(newProducts));
  };

  const syncCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('velriva_cart', JSON.stringify(newCart));
    if (currentUser && currentUser.isLoggedIn && currentUser.email) {
      updateAccountData(currentUser.email, { cart: newCart });
    }
  };

  const syncWishlist = (newWishlist: string[]) => {
    setWishlist(newWishlist);
    localStorage.setItem('velriva_wishlist', JSON.stringify(newWishlist));
    if (currentUser && currentUser.isLoggedIn && currentUser.email) {
      updateAccountData(currentUser.email, { wishlist: newWishlist });
    }
  };

  const syncRecent = (newRecent: string[]) => {
    setRecentlyViewed(newRecent);
    localStorage.setItem('velriva_recent', JSON.stringify(newRecent));
  };

  const syncOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('velriva_orders', JSON.stringify(newOrders));
    if (currentUser && currentUser.isLoggedIn && currentUser.email) {
      updateAccountData(currentUser.email, { orders: newOrders });
    }
  };

  const syncPromoBanners = (newBanners: PromoBanner[]) => {
    setPromoBanners(newBanners);
    localStorage.setItem('velriva_banners', JSON.stringify(newBanners));
  };

  const syncCoupons = (newCoupons: Coupon[]) => {
    setCoupons(newCoupons);
    localStorage.setItem('velriva_coupons', JSON.stringify(newCoupons));
  };

  // Navigation Logic
  const navigateTo = (screen: ScreenName, params?: any) => {
    let finalScreen = screen;
    let finalParams = params;

    // Automatic Deep Link redirection
    if (finalScreen === 'home') {
      try {
        const cachedSharedId = sessionStorage.getItem('velriva_shared_product_id');
        if (cachedSharedId) {
          sessionStorage.removeItem('velriva_shared_product_id'); // consume deep link
          finalScreen = 'productDetails';
          finalParams = { productId: cachedSharedId };
        }
      } catch (e) {
        console.warn("Deep link consumption non-critical error:", e);
      }
    }

    setNavigation(prev => {
      // If we are navigating to home or splash, we can reset history stack
      let newHistory = [...prev.history];
      if (finalScreen === 'home' || finalScreen === 'splash') {
        newHistory = [{ screen: finalScreen, params: finalParams }];
      } else {
        newHistory.push({ screen: finalScreen, params: finalParams });
      }
      return {
        currentScreen: finalScreen,
        history: newHistory,
        params: finalParams,
      };
    });
  };

  const goBack = () => {
    setNavigation(prev => {
      if (prev.history.length <= 1) {
        return {
          currentScreen: 'home',
          history: [{ screen: 'home' }],
          params: undefined,
        };
      }
      const newHistory = [...prev.history];
      newHistory.pop(); // Pop current screen
      const prevScreen = newHistory[newHistory.length - 1];
      return {
        currentScreen: prevScreen.screen,
        history: newHistory,
        params: prevScreen.params,
      };
    });
  };

  // Products CRUD
  const addProduct = (p: Product) => {
    const updated = [p, ...products];
    syncProducts(updated);

    // Background sync to Supabase
    if (isSupabaseConfigured && supabase) {
      supabase.from('products').insert({
        id: p.id,
        name: p.name,
        price: p.price,
        old_price: p.oldPrice,
        discount: p.discount,
        rating: p.rating,
        image: p.image,
        images: p.images,
        category: p.category,
        description: p.description,
        views_count: p.viewsCount,
        likes_count: p.likesCount,
        orders_count: p.ordersCount,
        sizes: p.sizes,
        colors: p.colors,
        is_featured: p.isFeatured,
        is_trending: p.isTrending,
        is_flash_sale: p.isFlashSale,
        stock: p.stock,
        reviews: p.reviews
      }).then(({ error }) => {
        if (error) console.error("Supabase fail to add product:", error);
      });
    }

    showToast('Product added successfully!');
  };

  const updateProduct = (p: Product) => {
    const updated = products.map(item => (item.id === p.id ? p : item));
    syncProducts(updated);

    // Background sync to Supabase
    if (isSupabaseConfigured && supabase) {
      supabase.from('products').update({
        name: p.name,
        price: p.price,
        old_price: p.oldPrice,
        discount: p.discount,
        rating: p.rating,
        image: p.image,
        images: p.images,
        category: p.category,
        description: p.description,
        views_count: p.viewsCount,
        likes_count: p.likesCount,
        orders_count: p.ordersCount,
        sizes: p.sizes,
        colors: p.colors,
        is_featured: p.isFeatured,
        is_trending: p.isTrending,
        is_flash_sale: p.isFlashSale,
        stock: p.stock,
        reviews: p.reviews
      }).eq('id', p.id).then(({ error }) => {
        if (error) console.error("Supabase fail to update product:", error);
      });
    }

    showToast('Product updated successfully!');
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(item => item.id !== id);
    syncProducts(updated);

    // Background sync to Supabase
    if (isSupabaseConfigured && supabase) {
      supabase.from('products').delete().eq('id', id).then(({ error }) => {
        if (error) console.error("Supabase fail to delete product:", error);
      });
    }

    showToast('Product deleted successfully!', 'error');
  };

  const incrementProductViews = (productId: string) => {
    const targetProduct = products.find(p => p.id === productId);
    const newViews = targetProduct ? (targetProduct.viewsCount || 0) + 1 : 1;
    
    const updated = products.map(item =>
      item.id === productId ? { ...item, viewsCount: newViews } : item
    );
    syncProducts(updated);

    // Background sync to Supabase
    if (isSupabaseConfigured && supabase) {
      supabase.from('products').update({ views_count: newViews }).eq('id', productId).then();
    }
  };

  // Cart Logic
  const addToCart = (product: Product, quantity: number, size?: string, color?: string) => {
    const newCart = [...cart];
    const existingIndex = newCart.findIndex(
      item =>
        item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor === color
    );

    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({ product, quantity, selectedSize: size, selectedColor: color });
    }
    syncCart(newCart);
    showToast(`Added ${quantity} item(s) to Cart!`);
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    const newCart = cart.filter(
      item =>
        !(
          item.product.id === productId &&
          item.selectedSize === size &&
          item.selectedColor === color
        )
    );
    syncCart(newCart);
    showToast('Removed from Cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    const newCart = cart.map(item => {
      if (
        item.product.id === productId &&
        item.selectedSize === size &&
        item.selectedColor === color
      ) {
        return { ...item, quantity };
      }
      return item;
    });
    syncCart(newCart);
  };

  const clearCart = () => {
    syncCart([]);
  };

  // Wishlist Logic
  const toggleWishlist = (productId: string) => {
    let newWish: string[];
    if (wishlist.includes(productId)) {
      newWish = wishlist.filter(id => id !== productId);
      showToast('Removed from wishlist', 'info');
    } else {
      newWish = [...wishlist, productId];
      showToast('Added to wishlist', 'success');
    }
    syncWishlist(newWish);
  };

  // Recently Viewed
  const addToRecentlyViewed = (productId: string) => {
    const recent = recentlyViewed.filter(id => id !== productId);
    const updated = [productId, ...recent].slice(0, 10); // Max 10 items
    syncRecent(updated);
  };

  // Promo and coupon mutations
  const updatePromoBanners = (newBanners: PromoBanner[]) => {
    syncPromoBanners(newBanners);
    showToast('Promo banners updated!', 'success');
  };

  const addCoupon = (coupon: Coupon) => {
    const uppercaseCode = coupon.code.toUpperCase().trim();
    if (coupons.some(c => c.code === uppercaseCode)) {
      showToast('Coupon code already exists!', 'error');
      return;
    }
    const updated = [...coupons, { ...coupon, code: uppercaseCode }];
    syncCoupons(updated);
    showToast('Coupon added successfully!', 'success');
  };

  const deleteCoupon = (code: string) => {
    const updated = coupons.filter(c => c.code !== code);
    syncCoupons(updated);
    if (appliedCoupon?.code === code) {
      setAppliedCoupon(null);
    }
    showToast('Coupon code deleted!', 'error');
  };

  const applyCoupon = (code: string): boolean => {
    const searchCode = code.toUpperCase().trim();
    const coupon = coupons.find(c => c.code === searchCode && c.isActive);
    if (coupon) {
      setAppliedCoupon(coupon);
      showToast(`Coupon applied! ${coupon.discount}% Discount`, 'success');
      return true;
    } else {
      showToast('Invalid or inactive coupon code', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon code removed', 'info');
  };

  // Order Placement
  const placeOrder = (shippingDetails: Order['shippingAddress']) => {
    const orderId = `VEL-${Math.floor(100000 + Math.random() * 900000)}`;
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const discountAmount = appliedCoupon ? Math.round(subtotal * (appliedCoupon.discount / 100)) : 0;
    const finalTotal = Math.max(0, subtotal - discountAmount);

    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      items: [...cart],
      total: finalTotal,
      status: 'Pending',
      customerEmail: currentUser && currentUser.isLoggedIn ? currentUser.email : undefined,
      shippingAddress: shippingDetails,
      tracking: [
        {
          status: 'Order Implemented',
          description: 'Your order was successfully submitted to VELORA.',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    const updatedOrders = [newOrder, ...orders];
    syncOrders(updatedOrders);
    
    // Dispatch silent background WhatsApp notification to the configured Admin number
    const waPayload = {
      orderId: newOrder.id,
      customerName: shippingDetails.name || 'Anonymous Reseller',
      customerPhone: shippingDetails.phone || 'N/A',
      address: `${shippingDetails.address || ''}, ${shippingDetails.city || ''}, ${shippingDetails.state || ''} - ${shippingDetails.pincode || ''}`,
      items: newOrder.items,
      total: newOrder.total,
      date: newOrder.date,
      adminPhone: localStorage.getItem('velriva_admin_whatsapp_number') || ''
    };

    const apiTargetUrl = getApiUrl('/api/whatsapp/send');

    fetch(apiTargetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(waPayload)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        console.log("Background order WhatsApp alert dispatched successfully!");
      } else {
        console.warn("WhatsApp background dispatch notice:", data.error);
      }
    })
    .catch(err => {
      console.error("Failed to run automatic background WhatsApp notification:", err);
    });

    clearCart();
    setAppliedCoupon(null); // Clear active coupon on order complete
    
    // Add real-time notification
    addNotification(
      'Order Placed Successfully!',
      `Order ${orderId} has been placed. We will verify your Cash on Delivery (COD) order shortly.`
    );
    
    // Update product internal orderCounts
    const updatedProducts = products.map(prod => {
      const purchased = cart.find(c => c.product.id === prod.id);
      if (purchased) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - purchased.quantity),
          ordersCount: prod.ordersCount + purchased.quantity,
        };
      }
      return prod;
    });
    syncProducts(updatedProducts);

    // Dynamic Supabase Order Synchronization (Background)
    if (isSupabaseConfigured && supabase) {
      supabase.from('orders').insert({
        id: orderId,
        date: newOrder.date,
        items: [...cart],
        total: finalTotal,
        status: 'Pending',
        customer_email: currentUser && currentUser.isLoggedIn ? currentUser.email : null,
        shipping_address: shippingDetails,
        tracking: newOrder.tracking
      }).then(({ error }) => {
        if (error) {
          console.error("Supabase failed to record order entry:", error);
        } else {
          console.log("Order recorded dynamically in Supabase.");
        }
      });

      // Synchronize product stocks and order counters
      updatedProducts.forEach(prod => {
        const purchased = cart.find(c => c.product.id === prod.id);
        if (purchased) {
          supabase.from('products').update({
            stock: prod.stock,
            orders_count: prod.ordersCount
          }).eq('id', prod.id).then();
        }
      });
    }

    showToast('Your COD Order placed successfully!', 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], description?: string) => {
    const d = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const trackDescription = description || `Your shipping progress updated to: ${status}`;

    const updated = orders.map(order => {
      if (order.id === orderId) {
        const newTracking = [
          { status, description: trackDescription, time: d },
          ...order.tracking,
        ];

        // Background sync to Supabase Order Updates
        if (isSupabaseConfigured && supabase) {
          supabase.from('orders')
            .update({
              status: status,
              tracking: newTracking
            })
            .eq('id', orderId)
            .then(({ error }) => {
              if (error) console.error("Supabase fail to status sync:", error);
            });
        }

        return {
          ...order,
          status,
          tracking: newTracking,
        };
      }
      return order;
    });
    syncOrders(updated);
    addNotification(
      `Order Status: ${status}`,
      `Your VELORA order ${orderId} is now: ${status}`
    );
    showToast(`Order updated to: ${status}`);
  };

  // Authentication
  const registerUser = async (name: string, email: string, password: string, phone: string): Promise<boolean | string> => {
    const formattedEmail = email.trim().toLowerCase();

    // 1. SUPABASE PATH
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: existingProfile, error: getErr } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', formattedEmail)
          .maybeSingle();

        if (existingProfile) {
          return 'Account with this email already exists on Supabase!';
        }

        const newId = `usr_${Date.now()}`;
        const { error: insertErr } = await supabase
          .from('profiles')
          .insert({
            id: newId,
            name: name.trim(),
            email: formattedEmail,
            phone: phone.trim(),
            password: password
          });

        if (insertErr) {
          return `Supabase profile creation failed: ${insertErr.message}`;
        }

        // Login user
        const user: User = {
          id: newId,
          name: name.trim(),
          email: formattedEmail,
          phone: phone.trim(),
          isLoggedIn: true
        };
        setCurrentUser(user);
        localStorage.setItem('velriva_user', JSON.stringify(user));

        // Update local reseller cache
        const refreshedAccounts = [...accounts, { ...user, password }];
        setAccounts(refreshedAccounts);
        localStorage.setItem('velriva_accounts', JSON.stringify(refreshedAccounts));

        // Reset user active details
        setCart([]);
        setWishlist([]);
        setOrders([]);
        localStorage.setItem('velriva_cart', JSON.stringify([]));
        localStorage.setItem('velriva_wishlist', JSON.stringify([]));
        localStorage.setItem('velriva_orders', JSON.stringify([]));

        showToast(`Account created on Supabase! Welcome, ${name.trim()}!`, 'success');
        return true;
      } catch (err: any) {
        return `Supabase connection setup error: ${err.message || err}`;
      }
    }

    // 2. OFFLINE FALLBACK
    const storedAccounts = localStorage.getItem('velriva_accounts');
    const dbAccounts = storedAccounts ? JSON.parse(storedAccounts) : [];
    
    if (dbAccounts.some((acc: any) => acc.email.toLowerCase() === formattedEmail)) {
      return 'Account with this email already exists!';
    }

    const newAccount = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: formattedEmail,
      phone: phone.trim(),
      password: password,
      cart: [],
      wishlist: [],
      orders: []
    };

    const updated = [...dbAccounts, newAccount];
    localStorage.setItem('velriva_accounts', JSON.stringify(updated));
    setAccounts(updated);

    // Auto login
    const user: User = {
      id: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
      phone: newAccount.phone,
      isLoggedIn: true
    };
    setCurrentUser(user);
    localStorage.setItem('velriva_user', JSON.stringify(user));
    
    // Clear and set user's state
    setCart([]);
    setWishlist([]);
    setOrders([]);
    localStorage.setItem('velriva_cart', JSON.stringify([]));
    localStorage.setItem('velriva_wishlist', JSON.stringify([]));
    localStorage.setItem('velriva_orders', JSON.stringify([]));

    showToast(`Welcome back, ${newAccount.name}!`);
    return true;
  };

  const loginUser = async (email: string, password: string): Promise<boolean | string> => {
    const formattedEmail = email.trim().toLowerCase();

    // 1. SUPABASE PATH
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: account, error: getErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', formattedEmail)
          .maybeSingle();

        if (getErr) {
          return `Supabase profile fetch error: ${getErr.message}`;
        }
        if (!account) {
          return 'Account not found in Supabase! Register a new profile.';
        }
        if (account.password !== password) {
          return 'Incorrect security password. Try again!';
        }

        // Login success
        const user: User = {
          id: account.id,
          name: account.name,
          email: account.email,
          phone: account.phone || '',
          isLoggedIn: true
        };
        setCurrentUser(user);
        localStorage.setItem('velriva_user', JSON.stringify(user));

        // Fetch user historic orders from Supabase orders table
        const { data: userOrders, error: ordersErr } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_email', formattedEmail);

        const restoredOrders: Order[] = !ordersErr && userOrders
          ? userOrders.map((o: any) => ({
              id: o.id,
              date: o.date,
              items: o.items || [],
              total: Number(o.total),
              status: o.status,
              customerEmail: o.customer_email || undefined,
              shippingAddress: o.shipping_address || {},
              tracking: o.tracking || []
            }))
          : [];

        setOrders(restoredOrders);
        localStorage.setItem('velriva_orders', JSON.stringify(restoredOrders));

        setCart([]);
        setWishlist([]);
        localStorage.setItem('velriva_cart', JSON.stringify([]));
        localStorage.setItem('velriva_wishlist', JSON.stringify([]));

        showToast(`Verified via Supabase. Welcome, ${account.name}!`);
        return true;
      } catch (err: any) {
        return `Supabase query connection error: ${err.message || err}`;
      }
    }

    // 2. OFFLINE FALLBACK
    const storedAccounts = localStorage.getItem('velriva_accounts');
    const dbAccounts = storedAccounts ? JSON.parse(storedAccounts) : [];
    
    const account = dbAccounts.find((acc: any) => acc.email.toLowerCase() === formattedEmail);
    if (!account) {
      return 'Account not found! Register a new profile.';
    }
    if (account.password !== password) {
      return 'Incorrect security password. Try again!';
    }

    // Success login
    const user: User = {
      id: account.id,
      name: account.name,
      email: account.email,
      phone: account.phone,
      isLoggedIn: true
    };
    setCurrentUser(user);
    localStorage.setItem('velriva_user', JSON.stringify(user));

    // Restore user's saved items & orders!
    setCart(account.cart || []);
    setWishlist(account.wishlist || []);
    setOrders(account.orders || []);
    
    localStorage.setItem('velriva_cart', JSON.stringify(account.cart || []));
    localStorage.setItem('velriva_wishlist', JSON.stringify(account.wishlist || []));
    localStorage.setItem('velriva_orders', JSON.stringify(account.orders || []));

    showToast(`Session verified. Welcome back, ${account.name}!`);
    return true;
  };

  const logoutUser = () => {
    const user: User = { id: '', name: '', email: '', phone: '', isLoggedIn: false };
    setCurrentUser(user);
    localStorage.removeItem('velriva_user');

    // Clear active UI states so previous files don't leak
    setCart([]);
    setWishlist([]);
    setOrders([]);
    localStorage.setItem('velriva_cart', JSON.stringify([]));
    localStorage.setItem('velriva_wishlist', JSON.stringify([]));
    localStorage.setItem('velriva_orders', JSON.stringify([]));

    showToast('Logged out of user account', 'info');
  };

  const sendLoginOtp = async (phone: string): Promise<{ success: boolean; offlineFallback?: boolean; devOtp?: string; error?: string }> => {
    try {
      const trimmedPhone = phone.trim();
      if (!trimmedPhone) {
        return { success: false, error: 'Phone number is required' };
      }

      const response = await fetch(getApiUrl('/api/auth/send-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: trimmedPhone })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        return { 
          success: true, 
          offlineFallback: resData.offlineFallback, 
          devOtp: resData.devOtp 
        };
      } else {
        return { success: false, error: resData.error || resData.message || 'Failed to send OTP' };
      }
    } catch (e: any) {
      console.error('sendLoginOtp connection exception:', e);
      return { success: false, error: `Connection failed: ${e.message || e}` };
    }
  };

  const verifyLoginOtp = async (phone: string, otp: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const trimmedPhone = phone.trim();
      const trimmedOtp = otp.trim();

      if (!trimmedPhone || !trimmedOtp) {
        return { success: false, error: 'Phone and OTP are required' };
      }

      const response = await fetch(getApiUrl('/api/auth/verify-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: trimmedPhone, otp: trimmedOtp })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        return { success: false, error: resData.error || resData.message || 'Verification failed' };
      }

      // OTP verified successfully!
      // Now, try to load profile from Supabase with search query by phone
      let cleanPhone = trimmedPhone.replace(/\D/g, '');
      if (cleanPhone.length === 10) {
        cleanPhone = '91' + cleanPhone;
      }

      let matchedAccount: any = null;

      if (isSupabaseConfigured && supabase) {
        const { data: dbAccount, error: getErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('phone', cleanPhone);

        if (!getErr && dbAccount && dbAccount.length > 0) {
          matchedAccount = dbAccount[0];
        } else {
          // Fallback: search by original format
          const { data: dbAccountAlt } = await supabase
            .from('profiles')
            .select('*')
            .eq('phone', trimmedPhone);

          if (dbAccountAlt && dbAccountAlt.length > 0) {
            matchedAccount = dbAccountAlt[0];
          } else {
            // ALT fallback: match by last 10 digits
            const raw10Digits = cleanPhone.substring(cleanPhone.length - 10);
            if (raw10Digits.length === 10) {
              const { data: dbAccountAlt2 } = await supabase
                .from('profiles')
                .select('*')
                .like('phone', `%${raw10Digits}`);
              if (dbAccountAlt2 && dbAccountAlt2.length > 0) {
                matchedAccount = dbAccountAlt2[0];
              }
            }
          }
        }
      }

      // If offline or profile was not in database yet, look in offline accounts cache
      if (!matchedAccount) {
        const storedAccounts = localStorage.getItem('velriva_accounts');
        const dbAccounts = storedAccounts ? JSON.parse(storedAccounts) : [];
        matchedAccount = dbAccounts.find((acc: any) => {
          const accPhone = (acc.phone || '').replace(/\D/g, '');
          const searchPhone = cleanPhone;
          return accPhone.endsWith(searchPhone.substring(searchPhone.length - 10));
        });
      }

      if (!matchedAccount) {
         return { success: false, error: 'reseller_not_found' }; // UI redirect/warning identifier
      }

      // Successfully found profile! Let's build User object
      const user: User = {
        id: matchedAccount.id,
        name: matchedAccount.name,
        email: matchedAccount.email,
        phone: matchedAccount.phone || trimmedPhone,
        isLoggedIn: true
      };

      setCurrentUser(user);
      localStorage.setItem('velriva_user', JSON.stringify(user));

      // Restore orders from Supabase if active
      let restoredOrders: Order[] = [];
      if (isSupabaseConfigured && supabase) {
        const { data: userOrders } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_email', matchedAccount.email);

        if (userOrders) {
          restoredOrders = userOrders.map((o: any) => ({
            id: o.id,
            date: o.date,
            items: o.items || [],
            total: Number(o.total),
            status: o.status,
            customerEmail: o.customer_email || undefined,
            shippingAddress: o.shipping_address || {},
            tracking: o.tracking || []
          }));
        }
      } else {
        restoredOrders = matchedAccount.orders || [];
      }

      setOrders(restoredOrders);
      localStorage.setItem('velriva_orders', JSON.stringify(restoredOrders));

      setCart([]);
      setWishlist([]);
      localStorage.setItem('velriva_cart', JSON.stringify([]));
      localStorage.setItem('velriva_wishlist', JSON.stringify([]));

      showToast(`Welcome to VELRIVA, ${matchedAccount.name}!`, 'success');
      return { success: true, user };

    } catch (e: any) {
      console.error('verifyLoginOtp error:', e);
      return { success: false, error: `Verification failed: ${e.message || e}` };
    }
  };

  const updateUserProfile = async (name: string, phone: string): Promise<boolean> => {
    if (!currentUser.isLoggedIn || !currentUser.email) {
      showToast('You must be logged in to update your profile.', 'error');
      return false;
    }

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      showToast('Name cannot be empty.', 'error');
      return false;
    }

    // 1. If Supabase is configured, update backend
    if (isSupabaseConfigured && supabase) {
      try {
        const { error: updateErr } = await supabase
          .from('profiles')
          .update({ name: trimmedName, phone: trimmedPhone })
          .eq('email', currentUser.email.toLowerCase());

        if (updateErr) {
          showToast(`Supabase update failed: ${updateErr.message}`, 'error');
          return false;
        }
      } catch (err: any) {
        console.error('Supabase profile update failure', err);
        showToast('Supabase profile update failure.', 'error');
        return false;
      }
    }

    // 2. Update local currentUser state
    const updatedUser: User = {
      ...currentUser,
      name: trimmedName,
      phone: trimmedPhone
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('velriva_user', JSON.stringify(updatedUser));

    // 3. Update accounts cache
    const storedAccounts = localStorage.getItem('velriva_accounts');
    if (storedAccounts) {
      try {
        const parsed = JSON.parse(storedAccounts);
        const updatedAccounts = parsed.map((acc: any) => {
          if (acc.email.toLowerCase() === currentUser.email.toLowerCase()) {
            return {
              ...acc,
              name: trimmedName,
              phone: trimmedPhone
            };
          }
          return acc;
        });
        localStorage.setItem('velriva_accounts', JSON.stringify(updatedAccounts));
        setAccounts(updatedAccounts);
      } catch (e) {
        console.error('Failed to update accounts cache', e);
      }
    }

    showToast('Profile updated successfully!', 'success');
    return true;
  };

  const loginAdmin = () => {
    setIsAdmin(true);
    localStorage.setItem('velriva_admin_logged_in', 'true');
    showToast('Logged in as Administrator', 'success');
    return true;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('velriva_admin_logged_in');
    showToast('Logged out of Admin Dashboard', 'info');
  };

  // Notifications logic
  const addNotification = (title: string, body: string) => {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title,
      body,
      time: 'Just now',
      read: false,
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    localStorage.setItem('velriva_notifications', JSON.stringify(updated));
  };

  const markNotificationsAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('velriva_notifications', JSON.stringify(updated));
  };

  return (
    <AppContext.Provider
      value={{
        navigation,
        navigateTo,
        goBack,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        incrementProductViews,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        recentlyViewed,
        addToRecentlyViewed,
        orders,
        placeOrder,
        updateOrderStatus,
        promoBanners,
        updatePromoBanners,
        coupons,
        addCoupon,
        deleteCoupon,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        currentUser,
        loginUser,
        registerUser,
        sendLoginOtp,
        verifyLoginOtp,
        logoutUser,
        updateUserProfile,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        accounts,
        notifications,
        markNotificationsAsRead,
        addNotification,
        toast,
        showToast,
        logo,
        updateLogo,
        supportInstagram,
        supportYoutube,
        supportEmail,
        supportPhone,
        updateSupportLinks,
        getApiUrl,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};
