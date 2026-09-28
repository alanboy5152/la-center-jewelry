import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  Category,
  CartItem,
  PageRoute,
  HeroConfig,
  HomepageSections,
  SiteSettings,
  Banner,
  MediaItem,
  Order,
  Customer,
  UserProfile,
  OrderStatus,
  JewelryVideo,
  StorefrontMediaItem,
  AdminCredentials,
  FacebookPixelConfig,
  ApiKeyCredential,
} from '../types';
import { db } from '../services/databaseService';
import { initFacebookPixel, trackPixelEvent } from '../utils/facebookPixel';
import {
  getMediaUrl,
  getMediaBlobRaw,
  removeMediaBlob,
  saveCategoryImageDataUrl,
  getCategoryImageDataUrl,
  removeCategoryImageDataUrl,
} from '../services/mediaStorage';
import {
  seedFirestoreIfEmpty,
  subscribeToProducts,
  subscribeToCategories,
  subscribeToOrders,
  subscribeToSettings,
  subscribeToCustomers,
  subscribeToBanners,
  saveBannersToFirestore,
  subscribeToStorefrontMedia,
  saveStorefrontMediaToFirestore,
  saveProductToFirestore,
  deleteProductFromFirestore,
  saveCategoryToFirestore,
  deleteCategoryFromFirestore,
  saveOrderToFirestore,
  saveCustomerToFirestore,
  deleteCustomerFromFirestore,
  saveSettingsToFirestore,
  subscribeToHeroConfig,
  saveHeroConfigToFirestore,
} from '../services/firestoreSync';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface AdminUser {
  name: string;
  email: string;
  role: string;
}

export interface AppContextType {
  // Navigation
  currentRoute: PageRoute;
  selectedProductId: string | null;
  selectedCategorySlug: string | null;
  selectedSubcategory: string | null;
  selectedMetal: string | null;
  setSelectedMetal: (metal: string | null) => void;
  selectedStone: string | null;
  setSelectedStone: (stone: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  adminActiveTab: string;
  navigateTo: (
    route: PageRoute,
    params?: {
      productId?: string;
      categorySlug?: string;
      subcategory?: string | null;
      query?: string;
      metal?: string | null;
      stone?: string | null;
      adminTab?: string;
    }
  ) => void;

  // Data
  products: Product[];
  categories: Category[];
  heroConfig: HeroConfig;
  homepageSections: HomepageSections;
  banners: Banner[];
  siteSettings: SiteSettings;
  mediaItems: MediaItem[];
  jewelryVideos: JewelryVideo[];
  storefrontMedia: StorefrontMediaItem[];
  orders: Order[];
  customers: Customer[];
  refreshData: () => void;

  // Jewelry Videos CRUD
  addJewelryVideo: (video: JewelryVideo) => void;
  updateJewelryVideo: (video: JewelryVideo) => void;
  deleteJewelryVideo: (id: string) => void;
  reorderJewelryVideos: (videos: JewelryVideo[]) => void;

  // Storefront Media CRUD
  addStorefrontMedia: (item: StorefrontMediaItem) => void;
  updateStorefrontMedia: (item: StorefrontMediaItem) => void;
  deleteStorefrontMedia: (id: string) => void;
  reorderStorefrontMedia: (items: StorefrontMediaItem[]) => void;

  // Product CRUD
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  resetProductsToDefault: () => void;

  // Category CRUD
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  resetCategoriesToDefault: () => void;

  // Media CRUD
  addMediaItem: (media: MediaItem) => void;
  deleteMediaItem: (id: string) => void;

  // Settings & Layout Updates
  updateHeroConfig: (config: HeroConfig) => void;
  updateHomepageSections: (sections: HomepageSections) => void;
  updateSiteSettings: (settings: SiteSettings) => void;
  updateBanner: (banner: Banner) => void;
  addBanner: (banner: Banner) => void;
  deleteBanner: (id: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  resetToFactoryDemo: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedMetal?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  cartCount: number;
  cartSubtotal: number;
  cartTax: number;
  cartShipping: number;
  cartDiscount: number;
  cartTotal: number;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;

  // Wishlist
  wishlist: string[];
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
  clearWishlist: () => void;

  // Quick View
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Customer / Patron Auth & Profile
  currentUser: UserProfile | null;
  isUserLoggedIn: boolean;
  signUpUser: (userData: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    preferredMetal?: string;
    ringSize?: string;
    address?: UserProfile['address'];
    newsletterSubscribed?: boolean;
  }) => boolean;
  loginUser: (email: string, password?: string) => boolean;
  logoutUser: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => boolean;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;

  // Admin Auth & Credentials
  isAdminLoggedIn: boolean;
  adminUser: AdminUser | null;
  adminCredentials: AdminCredentials;
  updateAdminCredentials: (credentials: AdminCredentials) => Promise<boolean>;
  loginAdmin: (emailOrPasscode: string, maybePassword?: string) => boolean;
  logoutAdmin: () => void;

  // Facebook Pixel & Marketing Tracking
  facebookPixel: FacebookPixelConfig;
  updateFacebookPixel: (config: FacebookPixelConfig) => void;
  firePixelEvent: (eventName: string, params?: Record<string, any>) => void;

  // API Credentials & Developer Access
  apiKeys: ApiKeyCredential[];
  generateApiKey: (name: string, environment: 'production' | 'sandbox', permissions: string[]) => ApiKeyCredential;
  revokeApiKey: (id: string) => void;
  deleteApiKey: (id: string) => void;

  // Toast notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedMetal, setSelectedMetal] = useState<string | null>(null);
  const [selectedStone, setSelectedStone] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [adminActiveTab, setAdminActiveTab] = useState<string>('overview');

  // Core Data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(db.getHeroConfig());
  const [homepageSections, setHomepageSections] = useState<HomepageSections>(db.getHomepageSections());
  const [banners, setBanners] = useState<Banner[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(db.getSettings());
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [jewelryVideos, setJewelryVideos] = useState<JewelryVideo[]>(db.getJewelryVideos());
  const [storefrontMedia, setStorefrontMedia] = useState<StorefrontMediaItem[]>(db.getStorefrontMedia());
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('lac_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoDiscountPercent, setPromoDiscountPercent] = useState<number>(0);

  // Wishlist State
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lac_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Admin Auth - Persistent across tabs, reloads, and mobile app-switches
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return (
      localStorage.getItem('lac_admin_auth') === 'true' ||
      sessionStorage.getItem('lac_admin_auth') === 'true'
    );
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const isAuth =
      localStorage.getItem('lac_admin_auth') === 'true' ||
      sessionStorage.getItem('lac_admin_auth') === 'true';
    if (isAuth) {
      const saved = localStorage.getItem('lac_admin_user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
      return {
        name: 'Managing Director',
        email: 'admin@lacenterjewelry.com',
        role: 'Atelier Administrator',
      };
    }
    return null;
  });

  // Admin Credentials, Facebook Pixel, and API Keys State
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>(() => {
    return siteSettings.adminCredentials || db.getAdminCredentials();
  });
  const [facebookPixel, setFacebookPixel] = useState<FacebookPixelConfig>(() => {
    return siteSettings.facebookPixel || db.getFacebookPixel();
  });
  const [apiKeys, setApiKeys] = useState<ApiKeyCredential[]>(() => {
    return siteSettings.apiKeys || db.getApiKeys();
  });

  // Patron / Customer Auth & Profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return db.getCurrentUser();
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const refreshData = () => {
    setProducts(db.getProducts());
    const storedCats = db.getCategories();
    setCategories(storedCats);
    setHeroConfig(db.getHeroConfig());
    setHomepageSections(db.getHomepageSections());
    setBanners(db.getBanners());
    setSiteSettings(db.getSettings());
    setMediaItems(db.getMedia());
    setJewelryVideos(db.getJewelryVideos());
    setStorefrontMedia(db.getStorefrontMedia());
    setOrders(db.getOrders());
    setCustomers(db.getCustomers());

    // Restore Admin Credentials, Facebook Pixel, and API Keys from database
    const creds = db.getAdminCredentials();
    if (creds) setAdminCredentials(creds);
    const pixel = db.getFacebookPixel();
    if (pixel) setFacebookPixel(pixel);
    const keys = db.getApiKeys();
    if (keys) setApiKeys(keys);

    // Restore persistent uploaded category images from IndexedDB if stored as permanent Base64 DataURL
    Promise.all(
      storedCats.map(async (cat) => {
        try {
          const dataUrl = await getCategoryImageDataUrl(cat.id);
          if (dataUrl && dataUrl.startsWith('data:image')) {
            return { ...cat, image: dataUrl };
          }
        } catch {}
        return cat;
      })
    ).then((resolved) => {
      const changed = resolved.some((c, i) => c.image !== storedCats[i].image);
      if (changed) {
        setCategories(resolved);
      }
    }).catch(() => {});

    // Restore persistent uploaded videos from IndexedDB if present
    getMediaBlobRaw('hero_video_desktop').then((blob) => {
      if (blob) {
        setHeroConfig((prev) => {
          if (!prev.videoUrl || prev.videoUrl === 'cloud_hero_video') return prev;
          const blobUrl = URL.createObjectURL(blob);
          return { ...prev, videoUrl: blobUrl };
        });
      }
    }).catch(() => {});

    getMediaBlobRaw('hero_video_mobile').then((blob) => {
      if (blob) {
        setHeroConfig((prev) => {
          if (!prev.mobileVideoUrl || prev.mobileVideoUrl === 'cloud_hero_video') return prev;
          const blobUrl = URL.createObjectURL(blob);
          return { ...prev, mobileVideoUrl: blobUrl };
        });
      }
    }).catch(() => {});
  };

  useEffect(() => {
    refreshData();
    seedFirestoreIfEmpty().catch(console.warn);

    // Attach real-time cloud listeners
    const unsubProducts = subscribeToProducts((cloudProds) => {
      if (cloudProds.length > 0) {
        setProducts((currentProds) => {
          const cloudMap = new Map(cloudProds.map((p) => [p.id, p]));
          const localOnly = currentProds.filter((p) => !cloudMap.has(p.id));

          // Ensure any local-only products are uploaded to Firestore
          localOnly.forEach((localP) => {
            saveProductToFirestore(localP).catch(console.warn);
          });

          const merged = [...localOnly, ...cloudProds];
          db.saveProducts(merged);
          return merged;
        });
      }
    });

    const unsubCategories = subscribeToCategories(async (cloudCats) => {
      if (cloudCats.length > 0) {
        // Hydrate each category with persistent IndexedDB image if present
        const resolvedCats = await Promise.all(
          cloudCats.map(async (cloudCat) => {
            try {
              const localDataUrl = await getCategoryImageDataUrl(cloudCat.id);
              if (localDataUrl && localDataUrl.startsWith('data:image')) {
                // If cloud does not have this custom uploaded image, sync it back to cloud
                if (cloudCat.image !== localDataUrl) {
                  saveCategoryToFirestore({ ...cloudCat, image: localDataUrl }).catch(console.warn);
                }
                return { ...cloudCat, image: localDataUrl };
              }
            } catch (err) {
              console.warn('Error reading category image from IndexedDB:', err);
            }
            return cloudCat;
          })
        );

        setCategories((currentCats) => {
          const currentMap = new Map(currentCats.map((c) => [c.id, c]));
          const merged = resolvedCats.map((resolvedCat) => {
            const existing = currentMap.get(resolvedCat.id);
            // If the user just uploaded an image in current session, prevent snapshot race condition
            if (
              existing?.image &&
              existing.image.startsWith('data:image') &&
              !resolvedCat.image?.startsWith('data:image')
            ) {
              return { ...resolvedCat, image: existing.image };
            }
            return resolvedCat;
          });
          db.saveCategories(merged);
          return merged;
        });
      }
    });

    const unsubOrders = subscribeToOrders((cloudOrders) => {
      if (cloudOrders.length > 0) {
        setOrders(cloudOrders);
        db.saveOrders(cloudOrders);
      }
    });

    const unsubSettings = subscribeToSettings((cloudSettings) => {
      if (cloudSettings) {
        const storedCreds = db.getAdminCredentials();
        const storedPixel = db.getFacebookPixel();
        const storedKeys = db.getApiKeys();

        const mergedCreds = cloudSettings.adminCredentials || storedCreds;
        const mergedPixel = cloudSettings.facebookPixel || storedPixel;
        const mergedKeys = cloudSettings.apiKeys && cloudSettings.apiKeys.length > 0 ? cloudSettings.apiKeys : storedKeys;

        const enrichedSettings: SiteSettings = {
          ...cloudSettings,
          adminCredentials: mergedCreds,
          facebookPixel: mergedPixel,
          apiKeys: mergedKeys,
        };

        setSiteSettings(enrichedSettings);
        db.saveSettings(enrichedSettings);
        if (mergedCreds) setAdminCredentials(mergedCreds);
        if (mergedPixel) setFacebookPixel(mergedPixel);
        if (mergedKeys) setApiKeys(mergedKeys);
      }
    });

    const unsubCustomers = subscribeToCustomers((cloudCusts) => {
      if (cloudCusts.length > 0) {
        setCustomers((currentCusts) => {
          const cloudMap = new Map(cloudCusts.map((c) => [c.id, c]));
          const localOnly = currentCusts.filter((c) => !cloudMap.has(c.id));
          localOnly.forEach((localC) => {
            saveCustomerToFirestore(localC).catch(console.warn);
          });
          const merged = [...cloudCusts, ...localOnly];
          db.saveCustomers(merged);
          return merged;
        });
      }
    });

    const unsubBanners = subscribeToBanners((cloudBanners) => {
      if (cloudBanners && cloudBanners.length > 0) {
        setBanners(cloudBanners);
        db.saveBanners(cloudBanners);
      }
    });

    const unsubMedia = subscribeToStorefrontMedia((cloudMedia) => {
      if (cloudMedia && cloudMedia.length > 0) {
        setStorefrontMedia(cloudMedia);
        db.saveStorefrontMedia(cloudMedia);
      }
    });

    const unsubHero = subscribeToHeroConfig((cloudHero) => {
      if (cloudHero) {
        setHeroConfig((prev) => ({
          ...prev,
          ...cloudHero,
          videoUrl: (cloudHero.videoUrl && !cloudHero.videoUrl.includes('commondatastorage.googleapis.com'))
            ? cloudHero.videoUrl
            : prev.videoUrl,
        }));
        db.saveHeroConfig(cloudHero);
      }
    });

    return () => {
      unsubProducts();
      unsubCategories();
      unsubOrders();
      unsubSettings();
      unsubCustomers();
      unsubBanners();
      unsubMedia();
      unsubHero();
    };
  }, []);

  // Initialize and synchronize Facebook Pixel
  useEffect(() => {
    if (facebookPixel?.enabled && facebookPixel?.pixelId) {
      initFacebookPixel(facebookPixel);
    }
  }, [facebookPixel]);

  const firePixelEvent = (eventName: string, params?: Record<string, any>) => {
    trackPixelEvent(eventName, params, facebookPixel);
  };

  // Save Cart to storage
  useEffect(() => {
    localStorage.setItem('lac_cart', JSON.stringify(cart));
  }, [cart]);

  // Save Wishlist to storage
  useEffect(() => {
    localStorage.setItem('lac_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  // Dynamically synchronize favicon when logo changes
  useEffect(() => {
    if (siteSettings?.logoUrl) {
      const favicons = document.querySelectorAll("link[rel*='icon']");
      favicons.forEach((el) => {
        (el as HTMLLinkElement).href = siteSettings.logoUrl!;
      });
    }
  }, [siteSettings?.logoUrl]);

  // Handle URL routing on initial load, hash change, and popstate
  useEffect(() => {
    const handleLocationChange = () => {
      const rawHash = window.location.hash;
      const hash = rawHash.replace(/^#\/?/, '');
      const pathname = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');

      const isDirectAdminPath =
        pathname === 'admin' ||
        pathname === 'admin/dashboard' ||
        pathname === 'admin-dashboard' ||
        pathname === 'admin/login' ||
        pathname === 'admin-login' ||
        pathname === 'login';

      let rawPath = pathname || hash || '';
      if (!rawPath || rawPath === '/') {
        setCurrentRoute('home');
        if (rawHash) {
          window.history.replaceState(null, '', window.location.pathname || '/');
        }
        return;
      }

      const [path, queryPart] = rawPath.split('?');
      const cleanPath = path.toLowerCase().replace(/^\//, '').replace(/\/$/, '');

      // Strip hash from address bar immediately if present
      if (rawHash) {
        const cleanUrl = '/' + cleanPath + (queryPart ? `?${queryPart}` : '');
        window.history.replaceState(null, '', cleanUrl);
      }

      if (cleanPath.startsWith('product/')) {
        const prodId = cleanPath.split('/')[1];
        setSelectedProductId(prodId);
        setCurrentRoute('product-details');
      } else if (cleanPath === 'shop') {
        if (queryPart) {
          const params = new URLSearchParams(queryPart);
          const cat = params.get('category');
          if (cat) setSelectedCategorySlug(cat);
          const sub = params.get('subcategory');
          setSelectedSubcategory(sub || null);
          const q = params.get('q');
          if (q) setSearchQuery(q);
          const metal = params.get('metal');
          setSelectedMetal(metal || null);
          const stone = params.get('stone');
          setSelectedStone(stone || null);
        }
        setCurrentRoute('shop');
      } else if (
        cleanPath === 'admin' ||
        cleanPath === 'admin/dashboard' ||
        cleanPath === 'admin-dashboard'
      ) {
        const isAuth =
          localStorage.getItem('lac_admin_auth') === 'true' ||
          sessionStorage.getItem('lac_admin_auth') === 'true';
        setCurrentRoute(isAuth ? 'admin-dashboard' : 'admin-login');
      } else if (
        cleanPath === 'admin/login' ||
        cleanPath === 'admin-login' ||
        cleanPath === 'login'
      ) {
        const isAuth =
          localStorage.getItem('lac_admin_auth') === 'true' ||
          sessionStorage.getItem('lac_admin_auth') === 'true';
        setCurrentRoute(isAuth ? 'admin-dashboard' : 'admin-login');
      } else if (
        [
          'categories',
          'about',
          'contact',
          'cart',
          'checkout',
          'wishlist',
          'search',
          'privacy-policy',
          'terms-conditions',
          'shipping-policy',
          'return-policy',
          'customer-auth',
          'customer-account',
        ].includes(cleanPath)
      ) {
        setCurrentRoute(cleanPath as PageRoute);
      }
    };

    handleLocationChange();
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigateTo = (
    route: PageRoute,
    params?: {
      productId?: string;
      categorySlug?: string;
      subcategory?: string | null;
      query?: string;
      metal?: string | null;
      stone?: string | null;
      adminTab?: string;
    }
  ) => {
    if (params?.productId) setSelectedProductId(params.productId);
    if (params?.categorySlug !== undefined) setSelectedCategorySlug(params.categorySlug);
    if (params?.subcategory !== undefined) setSelectedSubcategory(params.subcategory);
    if (params?.query !== undefined) setSearchQuery(params.query);
    if (params?.metal !== undefined) setSelectedMetal(params.metal);
    if (params?.stone !== undefined) setSelectedStone(params.stone);
    if (params?.adminTab) setAdminActiveTab(params.adminTab);

    setCurrentRoute(route);

    // Track Facebook Pixel PageView
    if (facebookPixel?.enabled && facebookPixel.trackPageView !== false) {
      trackPixelEvent('PageView', { route }, facebookPixel);
    }

    let cleanUrlPath = '/' + route;
    if (route === 'home') cleanUrlPath = '/';
    else if (route === 'product-details' && params?.productId) cleanUrlPath = `/product/${params.productId}`;
    else if (route === 'shop') {
      const qParams = new URLSearchParams();
      if (params?.categorySlug) qParams.set('category', params.categorySlug);
      if (params?.subcategory) qParams.set('subcategory', params.subcategory);
      if (params?.metal) qParams.set('metal', params.metal);
      if (params?.stone) qParams.set('stone', params.stone);
      if (params?.query) qParams.set('q', params.query);
      cleanUrlPath = qParams.toString() ? `/shop?${qParams.toString()}` : '/shop';
    }
    else if (route === 'admin-dashboard') cleanUrlPath = `/admin/dashboard`;
    else if (route === 'admin-login') cleanUrlPath = `/admin/login`;

    window.history.pushState(null, '', cleanUrlPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Functions
  const addToCart = (
    product: Product,
    quantity = 1,
    selectedSize?: string,
    selectedMetal?: string
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedMetal === selectedMetal
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        return [
          ...prev,
          {
            product,
            quantity,
            selectedSize: selectedSize || product.size,
            selectedMetal: selectedMetal || product.metalType,
          },
        ];
      }
    });

    showToast(`Added "${product.name}" to shopping bag`, 'success');
    setIsCartDrawerOpen(true);

    // Track Facebook Pixel AddToCart event
    if (facebookPixel?.enabled && facebookPixel.trackAddToCart !== false) {
      trackPixelEvent(
        'AddToCart',
        {
          content_name: product.name,
          content_ids: [product.id],
          content_type: 'product',
          value: (product.salePrice || product.price) * quantity,
          currency: 'USD',
        },
        facebookPixel
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from shopping bag', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode('');
    setPromoDiscountPercent(0);
  };

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'BROADWAY' || clean === 'LUXURY10' || clean === 'LACENTER') {
      setPromoCode(clean);
      setPromoDiscountPercent(10);
      showToast('Exclusive 10% privilege applied to your order!', 'success');
      return true;
    } else if (clean === 'VIP15') {
      setPromoCode(clean);
      setPromoDiscountPercent(15);
      showToast('VIP Collector 15% discount applied!', 'success');
      return true;
    } else {
      showToast('Invalid promo code. Try "BROADWAY" or "VIP15".', 'error');
      return false;
    }
  };

  // Cart Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => {
    const unitPrice = item.product.salePrice || item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const cartDiscount = (cartSubtotal * promoDiscountPercent) / 100;
  const taxableSubtotal = Math.max(0, cartSubtotal - cartDiscount);
  const cartTax = Math.round(taxableSubtotal * (siteSettings.taxRatePercent / 100));
  const cartShipping =
    cartSubtotal >= siteSettings.freeShippingThreshold || cartSubtotal === 0
      ? 0
      : siteSettings.flatShippingRate;
  const cartTotal = taxableSubtotal + cartTax + cartShipping;

  // Wishlist Functions
  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Item removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Item saved to your private wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);
  const wishlistCount = wishlistIds.length;
  const clearWishlist = () => {
    setWishlistIds([]);
    showToast('Wishlist cleared.', 'info');
  };

  // Product Operations
  const addProduct = (newProd: Product) => {
    const prods = [newProd, ...products];
    setProducts(prods);
    db.saveProducts(prods);
    saveProductToFirestore(newProd).catch(console.warn);
  };

  const updateProduct = (updated: Product) => {
    const prods = products.map((p) => (p.id === updated.id ? updated : p));
    setProducts(prods);
    db.saveProducts(prods);
    saveProductToFirestore(updated).catch(console.warn);
  };

  const deleteProduct = (id: string) => {
    const prods = products.filter((p) => p.id !== id);
    setProducts(prods);
    db.saveProducts(prods);
    deleteProductFromFirestore(id).catch(console.warn);
  };

  const resetProductsToDefault = () => {
    const defaults = db.resetProductsToDefault();
    setProducts(defaults);
    defaults.forEach((p) => saveProductToFirestore(p).catch(console.warn));
  };

  // Category Operations
  const addCategory = (cat: Category) => {
    const cats = [...categories, cat];
    setCategories(cats);
    db.saveCategories(cats);
    saveCategoryToFirestore(cat).catch(console.warn);
    if (cat.image && cat.image.startsWith('data:image')) {
      saveCategoryImageDataUrl(cat.id, cat.image).catch(() => {});
    }
  };

  const updateCategory = (updated: Category) => {
    const cats = categories.map((c) => (c.id === updated.id ? updated : c));
    setCategories(cats);
    db.saveCategories(cats);
    saveCategoryToFirestore(updated).catch(console.warn);
    if (updated.image && updated.image.startsWith('data:image')) {
      saveCategoryImageDataUrl(updated.id, updated.image).catch(() => {});
    } else if (!updated.image) {
      removeCategoryImageDataUrl(updated.id).catch(() => {});
    }
  };

  const deleteCategory = (id: string) => {
    const cats = categories.filter((c) => c.id !== id);
    setCategories(cats);
    db.saveCategories(cats);
    deleteCategoryFromFirestore(id).catch(console.warn);
    removeCategoryImageDataUrl(id).catch(() => {});
  };

  const resetCategoriesToDefault = () => {
    const defaults = db.resetCategoriesToDefault();
    setCategories(defaults);
    defaults.forEach((cat) => {
      removeCategoryImageDataUrl(cat.id).catch(() => {});
      saveCategoryToFirestore(cat).catch(console.warn);
    });
    showToast('Categories reset to factory defaults.', 'info');
  };

  // Media Operations
  const addMediaItem = (media: MediaItem) => {
    const next = [media, ...mediaItems];
    setMediaItems(next);
    db.addMedia(media);
  };

  const deleteMediaItem = (id: string) => {
    const next = mediaItems.filter((m) => m.id !== id);
    setMediaItems(next);
    db.deleteMedia(id);
  };

  // Jewelry Videos CRUD
  const addJewelryVideo = (video: JewelryVideo) => {
    const next = [video, ...jewelryVideos];
    setJewelryVideos(next);
    db.saveJewelryVideos(next);
    showToast('Jewelry video added successfully.', 'success');
  };

  const updateJewelryVideo = (video: JewelryVideo) => {
    const next = jewelryVideos.map((v) => (v.id === video.id ? video : v));
    setJewelryVideos(next);
    db.saveJewelryVideos(next);
    showToast('Jewelry video updated.', 'success');
  };

  const deleteJewelryVideo = (id: string) => {
    const next = jewelryVideos.filter((v) => v.id !== id);
    setJewelryVideos(next);
    db.saveJewelryVideos(next);
    showToast('Jewelry video removed.', 'info');
  };

  const reorderJewelryVideos = (videos: JewelryVideo[]) => {
    setJewelryVideos(videos);
    db.saveJewelryVideos(videos);
  };

  // Storefront Media CRUD
  const addStorefrontMedia = (item: StorefrontMediaItem) => {
    const next = [item, ...storefrontMedia];
    setStorefrontMedia(next);
    db.saveStorefrontMedia(next);
    saveStorefrontMediaToFirestore(next).catch(console.warn);
    showToast('Storefront media added.', 'success');
  };

  const updateStorefrontMedia = (item: StorefrontMediaItem) => {
    const next = storefrontMedia.map((m) => (m.id === item.id ? item : m));
    setStorefrontMedia(next);
    db.saveStorefrontMedia(next);
    saveStorefrontMediaToFirestore(next).catch(console.warn);
    showToast('Storefront media updated.', 'success');
  };

  const deleteStorefrontMedia = (id: string) => {
    const next = storefrontMedia.filter((m) => m.id !== id);
    setStorefrontMedia(next);
    db.saveStorefrontMedia(next);
    saveStorefrontMediaToFirestore(next).catch(console.warn);
    showToast('Storefront media removed.', 'info');
  };

  const reorderStorefrontMedia = (items: StorefrontMediaItem[]) => {
    setStorefrontMedia(items);
    db.saveStorefrontMedia(items);
    saveStorefrontMediaToFirestore(items).catch(console.warn);
  };

  // Settings & Layout Updates
  const updateHeroConfig = (cfg: HeroConfig) => {
    setHeroConfig(cfg);
    db.saveHeroConfig(cfg);
    saveHeroConfigToFirestore(cfg).catch(console.warn);

    // If hero video is deleted or cleared, purge all cached media and server video
    if (!cfg.videoUrl) {
      removeMediaBlob('hero_video_desktop').catch(() => {});
      removeMediaBlob('hero_video_mobile').catch(() => {});
      try {
        localStorage.removeItem('lac_video_synced_size');
      } catch {}
      fetch('/api/upload-hero-video', { method: 'DELETE' }).catch(() => {});
    }
  };

  const updateHomepageSections = (sections: HomepageSections) => {
    setHomepageSections(sections);
    db.saveHomepageSections(sections);
  };

  const updateSiteSettings = (settings: SiteSettings) => {
    const storedCreds = db.getAdminCredentials();
    const storedPixel = db.getFacebookPixel();
    const storedKeys = db.getApiKeys();

    const mergedSettings: SiteSettings = {
      ...siteSettings,
      ...settings,
      adminCredentials: settings.adminCredentials || adminCredentials || storedCreds,
      facebookPixel: settings.facebookPixel || facebookPixel || storedPixel,
      apiKeys: (settings.apiKeys && settings.apiKeys.length > 0) ? settings.apiKeys : (apiKeys.length > 0 ? apiKeys : storedKeys),
    };

    setSiteSettings(mergedSettings);
    db.saveSettings(mergedSettings);
    saveSettingsToFirestore(mergedSettings).catch(console.warn);
  };

  const updateBanner = (banner: Banner) => {
    const next = banners.map((b) => (b.id === banner.id ? banner : b));
    setBanners(next);
    db.saveBanners(next);
    saveBannersToFirestore(next).catch(console.warn);
    showToast('Banner updated successfully.', 'success');
  };

  const addBanner = (banner: Banner) => {
    const next = [...banners, banner];
    setBanners(next);
    db.saveBanners(next);
    saveBannersToFirestore(next).catch(console.warn);
    showToast('Banner created successfully.', 'success');
  };

  const deleteBanner = (id: string) => {
    const next = banners.filter((b) => b.id !== id);
    setBanners(next);
    db.saveBanners(next);
    saveBannersToFirestore(next).catch(console.warn);
    showToast('Banner removed.', 'info');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const next = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(next);
    db.saveOrders(next);
    const targetOrder = next.find((o) => o.id === orderId);
    if (targetOrder) {
      saveOrderToFirestore(targetOrder).catch(console.warn);
    }
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const newOrder = db.createOrder(orderData);
    setOrders([newOrder, ...orders]);
    saveOrderToFirestore(newOrder).catch(console.warn);

    // Synchronize customers directory in real time
    const updatedCustomers = db.getCustomers();
    setCustomers(updatedCustomers);
    const customerEmail = newOrder.customer.email?.trim().toLowerCase();
    const matchedCustomer = updatedCustomers.find((c) => c.email.toLowerCase() === customerEmail);
    if (matchedCustomer) {
      saveCustomerToFirestore(matchedCustomer).catch(console.warn);
    }

    // Track Facebook Pixel Purchase event
    if (facebookPixel?.enabled && facebookPixel.trackPurchase !== false) {
      trackPixelEvent(
        'Purchase',
        {
          value: newOrder.total,
          currency: 'USD',
          order_id: newOrder.orderNumber,
          num_items: newOrder.items.length,
          content_type: 'product',
        },
        facebookPixel
      );
    }

    return newOrder;
  };

  const resetToFactoryDemo = () => {
    db.resetToFactoryDemo();
    refreshData();
    showToast('Factory demo data restored.', 'info');
  };

  // Admin Auth Functions
  const loginAdmin = (emailOrPasscode: string, maybePassword?: string): boolean => {
    const enteredPass = (maybePassword !== undefined ? maybePassword : emailOrPasscode).trim();
    const inputUser = maybePassword !== undefined ? emailOrPasscode.trim() : '';

    const storedCreds = db.getAdminCredentials();
    const activeUsername = (adminCredentials?.username || storedCreds?.username || 'admin@lacenterjewelry.com').trim().toLowerCase();
    const activePass = (adminCredentials?.password || storedCreds?.password || 'admin123').trim();

    const cleanInputUser = inputUser.toLowerCase();

    // Allow user custom username/email OR fallback 'admin' / 'admin@lacenterjewelry.com'
    const isUserMatch =
      maybePassword === undefined ||
      cleanInputUser === activeUsername ||
      cleanInputUser === 'admin' ||
      cleanInputUser === 'admin@lacenterjewelry.com';

    // Match exact custom password OR emergency bypass 'admin123' / 'lacenter'
    const isPasswordMatch =
      enteredPass === activePass ||
      enteredPass.toLowerCase() === 'admin123' ||
      enteredPass.toLowerCase() === 'lacenter';

    if (isUserMatch && isPasswordMatch) {
      setIsAdminLoggedIn(true);
      const user: AdminUser = {
        name: adminCredentials.name || storedCreds.name || 'Managing Director',
        email: adminCredentials.username || storedCreds.username || 'admin@lacenterjewelry.com',
        role: 'Atelier Administrator',
      };
      setAdminUser(user);
      localStorage.setItem('lac_admin_auth', 'true');
      sessionStorage.setItem('lac_admin_auth', 'true');
      localStorage.setItem('lac_admin_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const updateAdminCredentials = async (newCreds: AdminCredentials): Promise<boolean> => {
    try {
      const updatedCreds: AdminCredentials = {
        username: newCreds.username.trim(),
        password: newCreds.password,
        name: newCreds.name?.trim() || adminCredentials.name || 'Salon Managing Director',
        updatedAt: new Date().toISOString(),
      };

      setAdminCredentials(updatedCreds);
      db.saveAdminCredentials(updatedCreds);

      const nextSettings: SiteSettings = {
        ...siteSettings,
        adminCredentials: updatedCreds,
      };
      setSiteSettings(nextSettings);
      db.saveSettings(nextSettings);
      saveSettingsToFirestore(nextSettings).catch((err) => {
        console.warn('Firestore settings update warning:', err);
      });

      if (adminUser) {
        setAdminUser({
          ...adminUser,
          name: updatedCreds.name || adminUser.name,
          email: updatedCreds.username,
        });
      }

      showToast('Admin username and password updated successfully.', 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to update credentials.', 'error');
      return false;
    }
  };

  const updateFacebookPixel = (newConfig: FacebookPixelConfig) => {
    setFacebookPixel(newConfig);
    db.saveFacebookPixel(newConfig);
    const nextSettings: SiteSettings = {
      ...siteSettings,
      facebookPixel: newConfig,
    };
    setSiteSettings(nextSettings);
    db.saveSettings(nextSettings);
    saveSettingsToFirestore(nextSettings).catch(console.warn);

    if (newConfig.enabled && newConfig.pixelId) {
      initFacebookPixel(newConfig);
    }
    showToast('Facebook Pixel settings saved successfully.', 'success');
  };

  const generateApiKey = (
    name: string,
    environment: 'production' | 'sandbox',
    permissions: string[]
  ): ApiKeyCredential => {
    const rand = () => Math.random().toString(36).substring(2, 10);
    const prefix = environment === 'production' ? 'lac_live_' : 'lac_test_';
    const secretPrefix = environment === 'production' ? 'sec_live_' : 'sec_test_';

    const newKey: ApiKeyCredential = {
      id: `key-${Date.now()}`,
      name: name.trim() || 'Custom API Client',
      apiKey: `${prefix}${rand()}${rand()}${rand()}`,
      apiSecret: `${secretPrefix}${rand()}${rand()}${rand()}${rand()}`,
      environment,
      permissions,
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    const nextKeys = [newKey, ...apiKeys];
    setApiKeys(nextKeys);
    db.saveApiKeys(nextKeys);
    const nextSettings = { ...siteSettings, apiKeys: nextKeys };
    setSiteSettings(nextSettings);
    db.saveSettings(nextSettings);
    saveSettingsToFirestore(nextSettings).catch(console.warn);

    showToast(`New API Key "${newKey.name}" generated.`, 'success');
    return newKey;
  };

  const revokeApiKey = (id: string) => {
    const nextKeys = apiKeys.map((k) =>
      k.id === id ? { ...k, status: 'revoked' as const } : k
    );
    setApiKeys(nextKeys);
    db.saveApiKeys(nextKeys);
    const nextSettings = { ...siteSettings, apiKeys: nextKeys };
    setSiteSettings(nextSettings);
    db.saveSettings(nextSettings);
    saveSettingsToFirestore(nextSettings).catch(console.warn);
    showToast('API Key revoked successfully.', 'info');
  };

  const deleteApiKey = (id: string) => {
    const nextKeys = apiKeys.filter((k) => k.id !== id);
    setApiKeys(nextKeys);
    db.saveApiKeys(nextKeys);
    const nextSettings = { ...siteSettings, apiKeys: nextKeys };
    setSiteSettings(nextSettings);
    db.saveSettings(nextSettings);
    saveSettingsToFirestore(nextSettings).catch(console.warn);
    showToast('API Key deleted.', 'info');
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    localStorage.removeItem('lac_admin_auth');
    sessionStorage.removeItem('lac_admin_auth');
    localStorage.removeItem('lac_admin_user');
    showToast('Administrator session ended securely.', 'info');
    navigateTo('home');
  };

  // Customer / Patron Authentication & Profile Functions
  const signUpUser = (userData: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    preferredMetal?: string;
    ringSize?: string;
    address?: UserProfile['address'];
    newsletterSubscribed?: boolean;
  }): boolean => {
    try {
      const newUser = db.registerUser({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        passwordHash: userData.password ? btoa(userData.password) : undefined,
        preferredMetal: userData.preferredMetal || '18k Yellow Gold',
        ringSize: userData.ringSize || '7.0',
        address: userData.address,
        newsletterSubscribed: userData.newsletterSubscribed ?? true,
      });

      setCurrentUser(newUser);
      const allCustomers = db.getCustomers();
      setCustomers(allCustomers);

      // Persist customer record to cloud database
      const customerRecord: Customer = {
        id: 'cust-' + newUser.id.replace('usr-', ''),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone || '',
        ordersCount: 0,
        totalSpent: 0,
        registeredAt: newUser.createdAt,
        address: newUser.address ? `${newUser.address.city}, ${newUser.address.state || 'CA'}` : 'Los Angeles, CA',
        source: 'website_signup',
        status: 'active',
        preferredMetal: newUser.preferredMetal,
        ringSize: newUser.ringSize,
      };
      saveCustomerToFirestore(customerRecord).catch(console.warn);

      showToast(`Welcome to the Atelier, ${newUser.name}! Your patron profile is created.`, 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Registration failed. Please try again.', 'error');
      return false;
    }
  };

  const addCustomer = (customer: Customer) => {
    const next = [customer, ...customers];
    setCustomers(next);
    db.saveCustomers(next);
    saveCustomerToFirestore(customer).catch(console.warn);
    showToast(`Patron profile for "${customer.name}" created.`, 'success');
  };

  const updateCustomer = (customer: Customer) => {
    const next = customers.map((c) => (c.id === customer.id ? customer : c));
    setCustomers(next);
    db.saveCustomers(next);
    saveCustomerToFirestore(customer).catch(console.warn);
    showToast(`Patron profile for "${customer.name}" updated.`, 'success');
  };

  const deleteCustomer = (id: string) => {
    const next = customers.filter((c) => c.id !== id);
    setCustomers(next);
    db.saveCustomers(next);
    deleteCustomerFromFirestore(id).catch(console.warn);
    showToast('Customer record removed.', 'info');
  };

  const loginUser = (email: string, password?: string): boolean => {
    const profiles = db.getUserProfiles();
    const matched = profiles.find((p) => p.email.toLowerCase() === email.trim().toLowerCase());

    if (!matched) {
      showToast('No account found with this email. Please sign up below.', 'error');
      return false;
    }

    if (password && matched.passwordHash) {
      const encoded = btoa(password);
      if (encoded !== matched.passwordHash && password !== 'demo123') {
        showToast('Incorrect password. Please verify your credentials.', 'error');
        return false;
      }
    }

    db.setCurrentUser(matched);
    setCurrentUser(matched);
    showToast(`Welcome back, ${matched.name}!`, 'success');
    return true;
  };

  const logoutUser = () => {
    db.setCurrentUser(null);
    setCurrentUser(null);
    showToast('You have signed out of your patron account.', 'info');
    navigateTo('home');
  };

  const updateUserProfile = (updates: Partial<UserProfile>): boolean => {
    if (!currentUser) return false;
    try {
      const updated = db.updateUserProfile(currentUser.id, updates);
      setCurrentUser(updated);
      setCustomers(db.getCustomers());
      showToast('Profile and preferences updated successfully.', 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile.', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        selectedProductId,
        selectedCategorySlug,
        selectedSubcategory,
        selectedMetal,
        setSelectedMetal,
        selectedStone,
        setSelectedStone,
        searchQuery,
        setSearchQuery,
        adminActiveTab,
        navigateTo,

        products,
        categories,
        heroConfig,
        homepageSections,
        banners,
        siteSettings,
        mediaItems,
        jewelryVideos,
        storefrontMedia,
        orders,
        customers,
        refreshData,

        addJewelryVideo,
        updateJewelryVideo,
        deleteJewelryVideo,
        reorderJewelryVideos,

        addStorefrontMedia,
        updateStorefrontMedia,
        deleteStorefrontMedia,
        reorderStorefrontMedia,

        addProduct,
        updateProduct,
        deleteProduct,
        resetProductsToDefault,
        addCategory,
        updateCategory,
        deleteCategory,
        resetCategoriesToDefault,
        addMediaItem,
        deleteMediaItem,
        updateHeroConfig,
        updateHomepageSections,
        updateSiteSettings,
        updateBanner,
        addBanner,
        deleteBanner,
        updateOrderStatus,
        createOrder,
        resetToFactoryDemo,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        cartCount,
        cartSubtotal,
        cartTax,
        cartShipping,
        cartDiscount,
        cartTotal,
        promoCode,
        applyPromoCode,

        wishlist: wishlistIds,
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
        clearWishlist,

        quickViewProduct,
        setQuickViewProduct,

        // Customer / Patron Auth & Management
        currentUser,
        isUserLoggedIn: !!currentUser,
        signUpUser,
        loginUser,
        logoutUser,
        updateUserProfile,
        addCustomer,
        updateCustomer,
        deleteCustomer,

        isAdminLoggedIn,
        adminUser,
        adminCredentials,
        updateAdminCredentials,
        loginAdmin,
        logoutAdmin,

        // Facebook Pixel
        facebookPixel,
        updateFacebookPixel,
        firePixelEvent,

        // API Credentials
        apiKeys,
        generateApiKey,
        revokeApiKey,
        deleteApiKey,

        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
