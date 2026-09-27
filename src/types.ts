export interface Product {
  id: string;
  name: string;
  sku: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  subcategory?: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  status: 'published' | 'draft' | 'out_of_stock';
  isFeatured: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewsCount: number;
  images: string[];
  videos?: { url: string; poster?: string; title?: string }[];
  thumbnail: string;
  material: string;
  metalType: string;
  stoneType: string;
  stoneColor?: string;
  size?: string;
  weight?: string;
  dimensions?: string;
  brand: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  productCount?: number;
  isFeatured?: boolean;
  subcategories?: Subcategory[];
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  mimeType: string;
  sizeBytes: number;
  dimensions?: string;
  duration?: string;
  posterUrl?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedMetal?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
  metalType?: string;
  size?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    name?: string;
    email: string;
    phone: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  paymentMethod: string;
  paymentGateway?: 'stripe' | 'paypal' | 'bank_wire';
  transactionId?: string;
  payoutDestination?: string;
  paymentDetails?: {
    cardBrand?: string;
    cardLast4?: string;
    paypalEmail?: string;
    bankName?: string;
    accountLast4?: string;
    routingNumber?: string;
    referenceCode?: string;
  };
  createdAt: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  avatarUrl?: string;
  address?: {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  preferredMetal?: string;
  ringSize?: string;
  dateOfBirth?: string;
  anniversaryDate?: string;
  newsletterSubscribed?: boolean;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalOrders?: number;
  totalSpent: number;
  registeredAt: string;
  address?: string;
  source?: 'website_signup' | 'store_checkout' | 'manual';
  status?: 'active' | 'vip' | 'inactive';
  preferredMetal?: string;
  ringSize?: string;
  notes?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  isApproved: boolean;
  verifiedPurchase: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  position: 'top' | 'middle' | 'bottom';
  isActive: boolean;
  badge?: string;
}

export interface HeroConfig {
  videoUrl: string;
  mobileVideoUrl?: string;
  posterUrl: string;
  mobilePosterUrl?: string;
  smallText: string;
  headline: string;
  tagline?: string;
  supportingText: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  overlayOpacity: number; // 0.1 to 0.9
  isEnabled: boolean;
  autoplay?: boolean;
  videoPosition?: 'center' | 'top' | 'bottom';
  activeMode?: 'video';
  uploadedVideoFileName?: string;
  uploadedVideoFileSize?: string;
}

export interface JewelryVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  productId?: string;
  productName?: string;
  price?: number;
  category?: string;
  duration?: string;
  isEnabled: boolean;
  order: number;
  displayOrder?: number;
}

export interface StorefrontMediaItem {
  id: string;
  title: string;
  type: 'photo' | 'interior' | 'window_display' | 'video' | 'promo' | 'image';
  tag?: 'storefront_exterior' | 'storefront_interior' | 'window_display' | 'jewelry_display' | 'promotional';
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  isHeroCandidate?: boolean;
  order: number;
  displayOrder?: number;
  createdAt: string;
}

export interface HomepageSections {
  hero: boolean;
  videoShowcase?: boolean;
  categories: boolean;
  featured: boolean;
  newArrivals?: boolean;
  bestSelling?: boolean;
  banners: boolean;
  craftsmanship: boolean;
  testimonials: boolean;
  newsletter: boolean;
}

export interface SiteSettings {
  businessName: string;
  logoUrl?: string;
  logoHeight?: number;
  logoGlow?: boolean;
  logoBoxBorder?: boolean;
  address: string;
  phone: string;
  whatsappNumber?: string;
  whatsappEnabled?: boolean;
  whatsappGreeting?: string;
  email: string;
  coordinates?: {
    lat: number;
    lng: number;
    formatted: string;
  };
  googleMapsUrl?: string;
  googleMapsEmbedUrl: string;
  currencySymbol: string;
  taxRatePercent: number;
  freeShippingThreshold: number;
  flatShippingRate: number;
  socialLinks: {
    instagram: string;
    facebook: string;
    youtube: string;
    tiktok: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
  };
  aboutStory: {
    title: string;
    intro: string;
    craftsmanshipText: string;
    locationText: string;
    image1: string;
    image2: string;
  };
  paymentGateways?: PaymentGatewaysConfig;
  adminCredentials?: AdminCredentials;
  facebookPixel?: FacebookPixelConfig;
  apiKeys?: ApiKeyCredential[];
}

export interface AdminCredentials {
  username: string; // Email or custom username (e.g. admin@lacenterjewelry.com)
  password: string; // Current administrative passcode/password
  name?: string; // Display name (e.g. Managing Director)
  updatedAt?: string;
}

export interface FacebookPixelConfig {
  enabled: boolean;
  pixelId: string;
  accessToken?: string; // Meta Conversions API Access Token
  testEventCode?: string; // Test event code from Meta Events Manager
  trackPageView: boolean;
  trackViewContent: boolean;
  trackAddToCart: boolean;
  trackInitiateCheckout: boolean;
  trackPurchase: boolean;
}

export interface ApiKeyCredential {
  id: string;
  name: string;
  apiKey: string; // Public API Key (e.g. lac_live_...)
  apiSecret: string; // Secret Key (e.g. sec_live_...)
  environment: 'production' | 'sandbox';
  permissions: string[]; // e.g. ['products:read', 'products:write', 'orders:read', 'orders:write']
  createdAt: string;
  lastUsedAt?: string;
  status: 'active' | 'revoked';
}

export interface StripeGatewayConfig {
  enabled: boolean;
  mode: 'live' | 'test';
  publishableKey: string;
  secretKey: string;
  payoutCardNumber: string; // Linked card where payout funds are sent
  payoutCardHolder: string;
  statementDescriptor: string; // e.g. "LA CENTER JEWELRY"
}

export interface PaypalGatewayConfig {
  enabled: boolean;
  mode: 'live' | 'sandbox';
  merchantEmail: string; // User's PayPal email where customer dollar payments go directly
  clientId: string;
  clientSecret?: string;
}

export interface BankWireGatewayConfig {
  enabled: boolean;
  bankName: string; // e.g. JPMorgan Chase Bank, N.A.
  accountHolderName: string; // e.g. L.A Center Jewelry Inc
  accountNumber: string; // Bank account number
  routingNumber: string; // 9-digit ABA/ACH routing
  swiftBic: string; // SWIFT / BIC code for wire transfers
  bankAddress: string;
  wireInstructions: string;
  discountPercent: number; // Promotional appraisal credit or discount for wire (e.g. 3%)
}

export interface PaymentGatewaysConfig {
  stripe: StripeGatewayConfig;
  paypal: PaypalGatewayConfig;
  bankWire: BankWireGatewayConfig;
}

export type PageRoute =
  | 'home'
  | 'shop'
  | 'product-details'
  | 'categories'
  | 'about'
  | 'contact'
  | 'cart'
  | 'checkout'
  | 'wishlist'
  | 'search'
  | 'privacy-policy'
  | 'terms-conditions'
  | 'shipping-policy'
  | 'return-policy'
  | 'customer-auth'
  | 'customer-account'
  | 'admin-login'
  | 'admin-dashboard';
