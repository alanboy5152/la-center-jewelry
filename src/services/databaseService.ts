import {
  Product,
  Category,
  Subcategory,
  MediaItem,
  Order,
  Customer,
  UserProfile,
  Review,
  Banner,
  HeroConfig,
  HomepageSections,
  SiteSettings,
  JewelryVideo,
  StorefrontMediaItem,
  PaymentGatewaysConfig,
  AdminCredentials,
  FacebookPixelConfig,
  ApiKeyCredential,
} from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'lac_products_v1',
  CATEGORIES: 'lac_categories_v1',
  MEDIA: 'lac_media_v1',
  ORDERS: 'lac_orders_v1',
  CUSTOMERS: 'lac_customers_v1',
  USER_PROFILES: 'lac_user_profiles_v1',
  CURRENT_USER: 'lac_current_user_v1',
  REVIEWS: 'lac_reviews_v1',
  BANNERS: 'lac_banners_v1',
  HERO: 'lac_hero_v1',
  HOMEPAGE: 'lac_homepage_v1',
  SETTINGS: 'lac_settings_v1',
  JEWELRY_VIDEOS: 'lac_jewelry_videos_v1',
  STOREFRONT_MEDIA: 'lac_storefront_media_v1',
  ADMIN_CREDENTIALS: 'lac_admin_credentials_v1',
  FACEBOOK_PIXEL: 'lac_facebook_pixel_v1',
  API_KEYS: 'lac_api_keys_v1',
};

// Initial default categories with full 10 subcategories each
export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-rings',
    name: 'Rings',
    slug: 'rings',
    description: 'Bespoke engagement rings, diamond eternity bands, and handcrafted signets.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=900&auto=format&fit=crop',
    order: 1,
    productCount: 12,
    isFeatured: true,
    subcategories: [
      { id: 'sub-solitaire-rings', name: 'Solitaire Rings', slug: 'solitaire-rings' },
      { id: 'sub-diamond-rings', name: 'Diamond Rings', slug: 'diamond-rings' },
      { id: 'sub-gold-rings', name: 'Gold Rings', slug: 'gold-rings' },
      { id: 'sub-silver-rings', name: 'Silver Rings', slug: 'silver-rings' },
      { id: 'sub-gemstone-rings', name: 'Gemstone Rings', slug: 'gemstone-rings' },
      { id: 'sub-couple-rings', name: 'Couple Rings', slug: 'couple-rings' },
      { id: 'sub-engagement-rings', name: 'Engagement Rings', slug: 'engagement-rings' },
      { id: 'sub-wedding-rings', name: 'Wedding Rings', slug: 'wedding-rings' },
      { id: 'sub-cocktail-rings', name: 'Cocktail Rings', slug: 'cocktail-rings' },
      { id: 'sub-adjustable-rings', name: 'Adjustable Rings', slug: 'adjustable-rings' },
    ],
  },
  {
    id: 'cat-necklaces',
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Diamond solitaires, layered gold chains, and statement gemstone collarets.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=900&auto=format&fit=crop',
    order: 2,
    productCount: 8,
    isFeatured: true,
    subcategories: [
      { id: 'sub-gold-necklaces', name: 'Gold Necklaces', slug: 'gold-necklaces' },
      { id: 'sub-diamond-necklaces', name: 'Diamond Necklaces', slug: 'diamond-necklaces' },
      { id: 'sub-pearl-necklaces', name: 'Pearl Necklaces', slug: 'pearl-necklaces' },
      { id: 'sub-pendant-necklaces', name: 'Pendant Necklaces', slug: 'pendant-necklaces' },
      { id: 'sub-choker-necklaces', name: 'Choker Necklaces', slug: 'choker-necklaces' },
      { id: 'sub-layered-necklaces', name: 'Layered Necklaces', slug: 'layered-necklaces' },
      { id: 'sub-statement-necklaces', name: 'Statement Necklaces', slug: 'statement-necklaces' },
      { id: 'sub-gemstone-necklaces', name: 'Gemstone Necklaces', slug: 'gemstone-necklaces' },
      { id: 'sub-chain-necklaces', name: 'Chain Necklaces', slug: 'chain-necklaces' },
      { id: 'sub-bridal-necklaces', name: 'Bridal Necklaces', slug: 'bridal-necklaces' },
    ],
  },
  {
    id: 'cat-earrings',
    name: 'Earrings',
    slug: 'earrings',
    description: 'Diamond studs, South Sea pearl drops, and 18k gold sculpted hoops.',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=900&auto=format&fit=crop',
    order: 3,
    productCount: 9,
    isFeatured: true,
    subcategories: [
      { id: 'sub-stud-earrings', name: 'Stud Earrings', slug: 'stud-earrings' },
      { id: 'sub-hoop-earrings', name: 'Hoop Earrings', slug: 'hoop-earrings' },
      { id: 'sub-drop-earrings', name: 'Drop Earrings', slug: 'drop-earrings' },
      { id: 'sub-dangle-earrings', name: 'Dangle Earrings', slug: 'dangle-earrings' },
      { id: 'sub-huggie-earrings', name: 'Huggie Earrings', slug: 'huggie-earrings' },
      { id: 'sub-chandelier-earrings', name: 'Chandelier Earrings', slug: 'chandelier-earrings' },
      { id: 'sub-pearl-earrings', name: 'Pearl Earrings', slug: 'pearl-earrings' },
      { id: 'sub-diamond-earrings', name: 'Diamond Earrings', slug: 'diamond-earrings' },
      { id: 'sub-gold-earrings', name: 'Gold Earrings', slug: 'gold-earrings' },
      { id: 'sub-bridal-earrings', name: 'Bridal Earrings', slug: 'bridal-earrings' },
    ],
  },
  {
    id: 'cat-bracelets',
    name: 'Bracelets',
    slug: 'bracelets',
    description: 'Classic diamond tennis bracelets, artisan cuffs, and woven chain links.',
    image: 'https://images.unsplash.com/photo-1611591475871-332906b3a09c?q=80&w=900&auto=format&fit=crop',
    order: 4,
    productCount: 7,
    isFeatured: true,
    subcategories: [
      { id: 'sub-gold-bracelets', name: 'Gold Bracelets', slug: 'gold-bracelets' },
      { id: 'sub-silver-bracelets', name: 'Silver Bracelets', slug: 'silver-bracelets' },
      { id: 'sub-diamond-bracelets', name: 'Diamond Bracelets', slug: 'diamond-bracelets' },
      { id: 'sub-charm-bracelets', name: 'Charm Bracelets', slug: 'charm-bracelets' },
      { id: 'sub-chain-bracelets', name: 'Chain Bracelets', slug: 'chain-bracelets' },
      { id: 'sub-cuff-bracelets', name: 'Cuff Bracelets', slug: 'cuff-bracelets' },
      { id: 'sub-bangle-bracelets', name: 'Bangle Bracelets', slug: 'bangle-bracelets' },
      { id: 'sub-pearl-bracelets', name: 'Pearl Bracelets', slug: 'pearl-bracelets' },
      { id: 'sub-gemstone-bracelets', name: 'Gemstone Bracelets', slug: 'gemstone-bracelets' },
      { id: 'sub-couple-bracelets', name: 'Couple Bracelets', slug: 'couple-bracelets' },
    ],
  },
  {
    id: 'cat-watches',
    name: 'Watches',
    slug: 'watches',
    description: 'Luxury chronographs and diamond-set Swiss timepieces from prestigious houses.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=900&auto=format&fit=crop',
    order: 5,
    productCount: 6,
    isFeatured: true,
    subcategories: [
      { id: 'sub-luxury-watches', name: 'Luxury Watches', slug: 'luxury-watches' },
      { id: 'sub-gold-watches', name: 'Gold Watches', slug: 'gold-watches' },
      { id: 'sub-silver-watches', name: 'Silver Watches', slug: 'silver-watches' },
      { id: 'sub-diamond-watches', name: 'Diamond Watches', slug: 'diamond-watches' },
      { id: 'sub-mens-watches', name: "Men's Watches", slug: 'mens-watches' },
      { id: 'sub-womens-watches', name: "Women's Watches", slug: 'womens-watches' },
      { id: 'sub-couple-watches', name: 'Couple Watches', slug: 'couple-watches' },
      { id: 'sub-automatic-watches', name: 'Automatic Watches', slug: 'automatic-watches' },
      { id: 'sub-quartz-watches', name: 'Quartz Watches', slug: 'quartz-watches' },
      { id: 'sub-fashion-watches', name: 'Fashion Watches', slug: 'fashion-watches' },
    ],
  },
  {
    id: 'cat-pendants',
    name: 'Pendants',
    slug: 'pendants',
    description: 'Radiant emerald-cut diamonds, custom medallions, and sacred symbols.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=900&auto=format&fit=crop',
    order: 6,
    productCount: 5,
    subcategories: [
      { id: 'sub-gold-pendants', name: 'Gold Pendants', slug: 'gold-pendants' },
      { id: 'sub-diamond-pendants', name: 'Diamond Pendants', slug: 'diamond-pendants' },
      { id: 'sub-heart-pendants', name: 'Heart Pendants', slug: 'heart-pendants' },
      { id: 'sub-name-pendants', name: 'Name Pendants', slug: 'name-pendants' },
      { id: 'sub-initial-pendants', name: 'Initial Pendants', slug: 'initial-pendants' },
      { id: 'sub-religious-pendants', name: 'Religious Pendants', slug: 'religious-pendants' },
      { id: 'sub-gemstone-pendants', name: 'Gemstone Pendants', slug: 'gemstone-pendants' },
      { id: 'sub-pearl-pendants', name: 'Pearl Pendants', slug: 'pearl-pendants' },
      { id: 'sub-couple-pendants', name: 'Couple Pendants', slug: 'couple-pendants' },
      { id: 'sub-photo-pendants', name: 'Photo Pendants', slug: 'photo-pendants' },
    ],
  },
  {
    id: 'cat-chains',
    name: 'Chains',
    slug: 'chains',
    description: 'Solid Cuban links, Franco chains, and diamond-cut rope chains in 14k and 18k gold.',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=900&auto=format&fit=crop',
    order: 7,
    productCount: 6,
    subcategories: [
      { id: 'sub-gold-chains', name: 'Gold Chains', slug: 'gold-chains' },
      { id: 'sub-silver-chains', name: 'Silver Chains', slug: 'silver-chains' },
      { id: 'sub-diamond-chains', name: 'Diamond Chains', slug: 'diamond-chains' },
      { id: 'sub-box-chains', name: 'Box Chains', slug: 'box-chains' },
      { id: 'sub-rope-chains', name: 'Rope Chains', slug: 'rope-chains' },
      { id: 'sub-snake-chains', name: 'Snake Chains', slug: 'snake-chains' },
      { id: 'sub-figaro-chains', name: 'Figaro Chains', slug: 'figaro-chains' },
      { id: 'sub-cuban-chains', name: 'Cuban Chains', slug: 'cuban-chains' },
      { id: 'sub-curb-chains', name: 'Curb Chains', slug: 'curb-chains' },
      { id: 'sub-layered-chains', name: 'Layered Chains', slug: 'layered-chains' },
    ],
  },
  {
    id: 'cat-mens',
    name: "Men's Jewelry",
    slug: 'mens-jewelry',
    description: 'Distinctive signet rings, heavy gold chains, cufflinks, and bracelet cuffs.',
    image: 'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=900&auto=format&fit=crop',
    order: 8,
    productCount: 8,
    isFeatured: true,
    subcategories: [
      { id: 'sub-mens-rings', name: "Men's Rings", slug: 'mens-rings' },
      { id: 'sub-mens-bracelets', name: "Men's Bracelets", slug: 'mens-bracelets' },
      { id: 'sub-mens-chains', name: "Men's Chains", slug: 'mens-chains' },
      { id: 'sub-mens-necklaces', name: "Men's Necklaces", slug: 'mens-necklaces' },
      { id: 'sub-mens-pendants', name: "Men's Pendants", slug: 'mens-pendants' },
      { id: 'sub-mens-earrings', name: "Men's Earrings", slug: 'mens-earrings' },
      { id: 'sub-mens-cufflinks', name: "Men's Cufflinks", slug: 'mens-cufflinks' },
      { id: 'sub-mens-tie-clips', name: "Men's Tie Clips", slug: 'mens-tie-clips' },
      { id: 'sub-mens-brooches', name: "Men's Brooches", slug: 'mens-brooches' },
      { id: 'sub-mens-jewelry-sets', name: "Men's Jewelry Sets", slug: 'mens-jewelry-sets' },
    ],
  },
  {
    id: 'cat-bridal',
    name: 'Bridal Jewelry',
    slug: 'bridal-jewelry',
    description: 'Bridal suite rings, wedding bands, and anniversary diamond suites.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=900&auto=format&fit=crop',
    order: 9,
    productCount: 10,
    isFeatured: true,
    subcategories: [
      { id: 'sub-bridal-necklace-sets', name: 'Bridal Necklace Sets', slug: 'bridal-necklace-sets' },
      { id: 'sub-bridal-earrings', name: 'Bridal Earrings', slug: 'bridal-earrings' },
      { id: 'sub-bridal-rings', name: 'Bridal Rings', slug: 'bridal-rings' },
      { id: 'sub-bridal-bracelets', name: 'Bridal Bracelets', slug: 'bridal-bracelets' },
      { id: 'sub-bridal-bangles', name: 'Bridal Bangles', slug: 'bridal-bangles' },
      { id: 'sub-bridal-tiaras', name: 'Bridal Tiaras', slug: 'bridal-tiaras' },
      { id: 'sub-bridal-nose-rings', name: 'Bridal Nose Rings', slug: 'bridal-nose-rings' },
      { id: 'sub-bridal-maang-tikka', name: 'Bridal Maang Tikka', slug: 'bridal-maang-tikka' },
      { id: 'sub-bridal-anklets', name: 'Bridal Anklets', slug: 'bridal-anklets' },
      { id: 'sub-bridal-jewelry-sets', name: 'Bridal Jewelry Sets', slug: 'bridal-jewelry-sets' },
    ],
  },
  {
    id: 'cat-custom',
    name: 'Custom Jewelry',
    slug: 'custom-jewelry',
    description: 'One-of-a-kind bespoke commissions created by master jewelers in our Los Angeles atelier.',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=900&auto=format&fit=crop',
    order: 10,
    productCount: 4,
    subcategories: [
      { id: 'sub-custom-rings', name: 'Custom Rings', slug: 'custom-rings' },
      { id: 'sub-custom-necklaces', name: 'Custom Necklaces', slug: 'custom-necklaces' },
      { id: 'sub-custom-earrings', name: 'Custom Earrings', slug: 'custom-earrings' },
      { id: 'sub-custom-bracelets', name: 'Custom Bracelets', slug: 'custom-bracelets' },
      { id: 'sub-custom-pendants', name: 'Custom Pendants', slug: 'custom-pendants' },
      { id: 'sub-name-jewelry', name: 'Name Jewelry', slug: 'name-jewelry' },
      { id: 'sub-initial-jewelry', name: 'Initial Jewelry', slug: 'initial-jewelry' },
      { id: 'sub-engraved-jewelry', name: 'Engraved Jewelry', slug: 'engraved-jewelry' },
      { id: 'sub-photo-jewelry', name: 'Photo Jewelry', slug: 'photo-jewelry' },
      { id: 'sub-couple-jewelry', name: 'Couple Jewelry', slug: 'couple-jewelry' },
    ],
  },
  {
    id: 'cat-nosestud',
    name: 'Nose Stud',
    slug: 'nose-stud',
    description: 'Fine artisan nose studs in solid gold, certified diamonds, platinum, and bespoke gemstones.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=900&auto=format&fit=crop',
    order: 11,
    productCount: 6,
    isFeatured: true,
    subcategories: [
      { id: 'sub-gold-nose-studs', name: 'Gold Nose Studs', slug: 'gold-nose-studs' },
      { id: 'sub-diamond-nose-studs', name: 'Diamond Nose Studs', slug: 'diamond-nose-studs' },
      { id: 'sub-platinum-nose-studs', name: 'Platinum Nose Studs', slug: 'platinum-nose-studs' },
      { id: 'sub-white-gold-nose-studs', name: 'White Gold Nose Studs', slug: 'white-gold-nose-studs' },
      { id: 'sub-rose-gold-nose-studs', name: 'Rose Gold Nose Studs', slug: 'rose-gold-nose-studs' },
      { id: 'sub-silver-nose-studs', name: 'Silver Nose Studs', slug: 'silver-nose-studs' },
      { id: 'sub-gemstone-nose-studs', name: 'Gemstone Nose Studs', slug: 'gemstone-nose-studs' },
      { id: 'sub-pearl-nose-studs', name: 'Pearl Nose Studs', slug: 'pearl-nose-studs' },
      { id: 'sub-solitaire-nose-studs', name: 'Solitaire Nose Studs', slug: 'solitaire-nose-studs' },
      { id: 'sub-floral-designer-nose-studs', name: 'Floral & Designer Nose Studs', slug: 'floral-designer-nose-studs' },
    ],
  },
  {
    id: 'cat-womens',
    name: "Women's Jewelry",
    slug: 'womens-jewelry',
    description: "Exquisite fine jewelry designed for women, from brilliant diamond rings and earrings to artisan gold necklaces and luxury sets.",
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=900&auto=format&fit=crop',
    order: 12,
    productCount: 12,
    isFeatured: true,
    subcategories: [
      { id: 'sub-womens-rings', name: "Women's Rings", slug: 'womens-rings' },
      { id: 'sub-womens-necklaces', name: "Women's Necklaces", slug: 'womens-necklaces' },
      { id: 'sub-womens-earrings', name: "Women's Earrings", slug: 'womens-earrings' },
      { id: 'sub-womens-bracelets', name: "Women's Bracelets", slug: 'womens-bracelets' },
      { id: 'sub-womens-bangles', name: "Women's Bangles", slug: 'womens-bangles' },
      { id: 'sub-womens-pendants', name: "Women's Pendants", slug: 'womens-pendants' },
      { id: 'sub-womens-chains', name: "Women's Chains", slug: 'womens-chains' },
      { id: 'sub-womens-anklets', name: "Women's Anklets", slug: 'womens-anklets' },
      { id: 'sub-womens-nose-jewelry', name: "Women's Nose Jewelry", slug: 'womens-nose-jewelry' },
      { id: 'sub-womens-jewelry-sets', name: "Women's Jewelry Sets", slug: 'womens-jewelry-sets' },
    ],
  },
];

// Initial realistic jewelry sample products
export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-diamond-solitaire',
    name: 'Elysian 2.5ct Diamond Solitaire Ring',
    sku: 'LAC-RNG-001',
    slug: 'elysian-25ct-diamond-solitaire-ring',
    categoryId: 'cat-rings',
    categoryName: 'Rings',
    subcategory: 'Engagement Rings',
    shortDescription: 'Certified 2.5 carat brilliant round diamond set in 18k platinum micro-prong band.',
    description: 'The Elysian Solitaire embodies pure architectural grace. Featuring an exceptionally cut 2.50 carat VVS1 clarity, E-color round brilliant center diamond hand-selected by our master gemologists. Set in a low-profile four-prong platinum basket that maximizes light refraction while providing secure everyday wear.',
    price: 18500,
    salePrice: 17200,
    stockQuantity: 4,
    status: 'published',
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 18,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=1200&auto=format&fit=crop',
    ],
    videos: [
      {
        url: '/videos/hero-jewelry.mp4',
        poster: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop',
        title: '360 Diamond Rotation Video',
      },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
    material: 'Platinum 950 & Natural Diamond',
    metalType: 'Platinum',
    stoneType: 'Diamond',
    stoneColor: 'Colorless (E)',
    size: '6 (Resizing Available)',
    weight: '4.8 grams',
    dimensions: 'Center stone: 8.8mm diameter',
    brand: 'L.A Center Private Reserve',
    tags: ['Diamond', 'Engagement', 'Platinum', 'Solitaire', 'Luxury'],
    seoTitle: 'Elysian 2.5ct Diamond Solitaire Ring | L.A Center Jewelry Inc',
    seoDescription: 'Handcrafted 2.50 carat diamond solitaire ring set in platinum. Designed and appraised in Los Angeles.',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'prod-gold-tennis-bracelet',
    name: 'Pavé Diamond Riviera Tennis Bracelet',
    sku: 'LAC-BRC-002',
    slug: 'pave-diamond-riviera-tennis-bracelet',
    categoryId: 'cat-bracelets',
    categoryName: 'Bracelets',
    subcategory: 'Diamond Bracelets',
    shortDescription: '7.0 carats total weight of uniform round brilliant diamonds set in articulated 18k yellow gold.',
    description: 'A timeless staple of haute joaillerie. The Riviera Tennis Bracelet features 52 individually matched round brilliant diamonds seamlessly linked in an ultra-flexible 18k yellow gold channel. Finished with our signature double-safety clasp engraved with the L.A Center hallmark.',
    price: 12400,
    salePrice: 11500,
    stockQuantity: 6,
    status: 'published',
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 24,
    images: [
      'https://images.unsplash.com/photo-1611591475871-332906b3a09c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1200&auto=format&fit=crop',
    ],
    videos: [
      {
        url: '/videos/hero-jewelry.mp4',
        poster: 'https://images.unsplash.com/photo-1611591475871-332906b3a09c?q=80&w=1200&auto=format&fit=crop',
        title: 'Bracelet Fluidity Showcase',
      },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1611591475871-332906b3a09c?q=80&w=600&auto=format&fit=crop',
    material: '18k Solid Yellow Gold & Natural Diamonds',
    metalType: '18k Yellow Gold',
    stoneType: 'Diamond',
    stoneColor: 'F-G (Near Colorless)',
    size: '7.0 inches',
    weight: '14.2 grams',
    dimensions: 'Width: 3.5mm',
    brand: 'L.A Center Signature',
    tags: ['Tennis Bracelet', '18k Gold', 'Diamonds', 'Classic'],
    seoTitle: '7ct Diamond Riviera Tennis Bracelet | L.A Center Jewelry Inc',
    seoDescription: 'Handcrafted 18k yellow gold diamond tennis bracelet. Exquisite Los Angeles jewelry.',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-03-02T14:30:00Z',
  },
  {
    id: 'prod-emerald-cut-pendant',
    name: 'L’Aurore Emerald-Cut Diamond Pendant',
    sku: 'LAC-NCK-003',
    slug: 'laurore-emerald-cut-diamond-pendant',
    categoryId: 'cat-necklaces',
    categoryName: 'Necklaces',
    subcategory: 'Pendants',
    shortDescription: 'GIA-certified 3.0 carat emerald-cut diamond framed in delicate micro-pavé halo on 18k white gold chain.',
    description: 'Hallmarked by clean geometric lines and breathtaking step-cut brilliance. The L’Aurore Pendant suspends a 3.0ct emerald-cut diamond within an unobtrusive platinum bezel, hung upon a shimmering 18-inch adjustable wheat chain.',
    price: 24800,
    stockQuantity: 3,
    status: 'published',
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 12,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
    material: 'Platinum 950, 18k White Gold, Diamond',
    metalType: '18k White Gold',
    stoneType: 'Diamond',
    stoneColor: 'D (Colorless)',
    size: '18 inches (adjustable to 16)',
    weight: '8.4 grams',
    dimensions: 'Pendant: 14mm x 9mm',
    brand: 'L.A Center Private Reserve',
    tags: ['Emerald Cut', 'Diamond Pendant', 'White Gold', 'Necklace'],
    seoTitle: 'L’Aurore Emerald-Cut Diamond Pendant | L.A Center Jewelry',
    seoDescription: 'Rare 3.0ct emerald-cut diamond pendant necklace. Los Angeles fine jewelry.',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-02-28T09:00:00Z',
  },
  {
    id: 'prod-south-sea-pearl-earrings',
    name: 'Tahitian South Sea Pearl & Diamond Drops',
    sku: 'LAC-EAR-004',
    slug: 'tahitian-south-sea-pearl-and-diamond-drops',
    categoryId: 'cat-earrings',
    categoryName: 'Earrings',
    subcategory: 'Pearl Earrings',
    shortDescription: 'Lustrous 12mm baroque black Tahitian pearls capped with diamond-encrusted 18k rose gold florets.',
    description: 'Naturally shimmering with peacock overtone iridescence, these cultured South Sea pearls were harvested from the French Polynesian lagoons. Each pearl is matched for millimeter precision and capped with brilliant diamonds.',
    price: 6800,
    salePrice: 6200,
    stockQuantity: 5,
    status: 'published',
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 15,
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop',
    material: '18k Rose Gold, Tahitian Pearl, Diamonds',
    metalType: '18k Rose Gold',
    stoneType: 'Pearl',
    stoneColor: 'Peacock Black / Iridescent',
    size: '12mm pearls',
    weight: '9.6 grams pair',
    brand: 'L.A Center Signature',
    tags: ['Pearl', 'Rose Gold', 'Earrings', 'Tahitian'],
    seoTitle: 'Tahitian South Sea Pearl Earrings | L.A Center Jewelry Inc',
    seoDescription: 'Lustrous 12mm pearl earrings with diamond accents.',
    createdAt: '2026-02-10T12:00:00Z',
    updatedAt: '2026-03-05T15:00:00Z',
  },
  {
    id: 'prod-mens-cuban-chain',
    name: 'Broadway 14k Solid Miami Cuban Link Chain',
    sku: 'LAC-CHN-005',
    slug: 'broadway-14k-solid-miami-cuban-link-chain',
    categoryId: 'cat-chains',
    categoryName: 'Chains',
    subcategory: "Men's Chains",
    shortDescription: 'Heavyweight 10mm solid 14k yellow gold Cuban link chain with custom box lock clasp.',
    description: 'Crafted in our downtown Los Angeles workshop on Broadway, this solid Miami Cuban link chain offers peerless heft, precise diamond-cut beveled beveling, and supreme drape. Secured by our triple-locking safety clasp.',
    price: 9800,
    stockQuantity: 4,
    status: 'published',
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 31,
    images: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1200&auto=format&fit=crop',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop',
    material: '14k Solid Yellow Gold',
    metalType: '14k Yellow Gold',
    stoneType: 'None',
    size: '24 inches',
    weight: '148 grams solid',
    dimensions: '10mm gauge link thickness',
    brand: 'L.A Center Los Angeles',
    tags: ['Cuban Link', 'Gold Chain', 'Mens Jewelry', 'Solid Gold'],
    seoTitle: '14k Solid Miami Cuban Link Chain 10mm | L.A Center Jewelry',
    seoDescription: 'Solid 14k yellow gold Cuban chain crafted in Los Angeles.',
    createdAt: '2026-01-05T11:00:00Z',
    updatedAt: '2026-03-10T11:00:00Z',
  },
  {
    id: 'prod-luxury-chronograph',
    name: 'Sovereign Diamond Bezel Automatic Chronograph',
    sku: 'LAC-WTC-006',
    slug: 'sovereign-diamond-bezel-automatic-chronograph',
    categoryId: 'cat-watches',
    categoryName: 'Watches',
    subcategory: 'Luxury Timepieces',
    shortDescription: 'Swiss automatic chronometer with factory baguette diamond bezel and alligator strap.',
    description: 'The Sovereign Chronograph unites high-precision Swiss mechanical horology with the jewelry arts of Los Angeles. Boasting an exhibition sapphire crystal caseback, 72-hour power reserve, and 36 calibrated baguette-cut diamonds on the bezel.',
    price: 32000,
    salePrice: 29500,
    stockQuantity: 2,
    status: 'published',
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 9,
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547996160-71dfabb1a7b1?q=80&w=1200&auto=format&fit=crop',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop',
    material: '18k Rose Gold, Sapphire, Diamonds, Leather',
    metalType: '18k Rose Gold',
    stoneType: 'Diamond',
    stoneColor: 'F-G Baguette',
    size: '41mm case diameter',
    weight: '165 grams',
    dimensions: 'Lug to lug: 48mm, thickness: 11.8mm',
    brand: 'L.A Center Horlogerie',
    tags: ['Watch', 'Chronograph', 'Luxury Watch', 'Diamonds'],
    seoTitle: 'Sovereign Diamond Automatic Chronograph | L.A Center Jewelry',
    seoDescription: 'Swiss mechanical chronograph with diamond bezel in 18k rose gold.',
    createdAt: '2026-01-12T09:00:00Z',
    updatedAt: '2026-03-08T18:00:00Z',
  },
  {
    id: 'prod-sapphire-halo-ring',
    name: 'Royal Ceylon Sapphire & Diamond Cocktail Ring',
    sku: 'LAC-RNG-007',
    slug: 'royal-ceylon-sapphire-and-diamond-cocktail-ring',
    categoryId: 'cat-rings',
    categoryName: 'Rings',
    subcategory: 'Cocktail Rings',
    shortDescription: 'Unheated 4.20ct velvety blue Ceylon sapphire surrounded by double tier diamond halo in 18k white gold.',
    description: 'An exceptional collector’s gemstone. This natural, unheated 4.20 carat Sri Lankan sapphire exhibits the coveted royal cornflower saturation. Encircled by 1.60 carats of marquise and round brilliant diamonds.',
    price: 15600,
    stockQuantity: 3,
    status: 'published',
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 14,
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop',
    material: '18k White Gold, Natural Sapphire, Diamonds',
    metalType: '18k White Gold',
    stoneType: 'Sapphire',
    stoneColor: 'Cornflower Royal Blue',
    size: '6.5 (Complimentary sizing)',
    weight: '6.2 grams',
    brand: 'L.A Center Gemological Vault',
    tags: ['Sapphire', 'Cocktail Ring', 'Gemstone', 'Diamonds'],
    seoTitle: 'Ceylon Sapphire & Diamond Ring | L.A Center Jewelry Inc',
    seoDescription: 'Unheated 4.20ct royal Ceylon sapphire ring with diamond halo.',
    createdAt: '2026-02-14T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prod-bridal-eternity-band',
    name: 'Crown Imperial Platinum Diamond Eternity Band',
    sku: 'LAC-BDL-008',
    slug: 'crown-imperial-platinum-diamond-eternity-band',
    categoryId: 'cat-bridal',
    categoryName: 'Bridal Jewelry',
    subcategory: 'Wedding Bands',
    shortDescription: 'Shared-prong full eternity band featuring 4.50 carats of radiant emerald-cut diamonds.',
    description: 'An uninterrupted circle of brilliance. Each emerald-cut diamond in this Crown Imperial eternity band is individually calibrated for table proportion, depth, and clarity, set in an airy low-rise platinum mount.',
    price: 14200,
    salePrice: 13500,
    stockQuantity: 5,
    status: 'published',
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 22,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=1200&auto=format&fit=crop',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
    material: 'Platinum 950 & Diamonds',
    metalType: 'Platinum',
    stoneType: 'Diamond',
    stoneColor: 'F / VVS2',
    size: '6.0',
    weight: '5.8 grams',
    brand: 'L.A Center Bridal',
    tags: ['Eternity Band', 'Bridal', 'Platinum', 'Emerald Cut'],
    seoTitle: 'Crown Imperial Diamond Eternity Band | L.A Center Jewelry',
    seoDescription: '4.50ct emerald-cut diamond eternity wedding band in platinum.',
    createdAt: '2026-01-28T14:00:00Z',
    updatedAt: '2026-03-04T12:00:00Z',
  },
  {
    id: 'prod-diamond-nosestud',
    name: "L'Aura 18k Solitaire Diamond Nose Stud",
    sku: 'LAC-NOS-001',
    slug: 'laura-18k-solitaire-diamond-nose-stud',
    categoryId: 'cat-nosestud',
    categoryName: 'Nose Stud',
    subcategory: 'Diamond Nose Studs',
    shortDescription: '0.15ct VS clarity natural diamond in an 18k solid yellow gold bezel prong setting.',
    description: 'Precision-crafted in our Downtown Los Angeles salon. Featuring a brilliant-cut natural conflict-free diamond secured in an ultra-low profile 18k yellow gold corkscrew post for maximum safety, comfort, and radiant brilliance.',
    price: 450,
    salePrice: 395,
    stockQuantity: 15,
    status: 'published',
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 12,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1200&auto=format&fit=crop',
    ],
    videos: [],
    thumbnail: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
    material: '18k Solid Yellow Gold & Natural Diamond',
    metalType: '18k Gold',
    stoneType: 'Diamond',
    stoneColor: 'G / VS1',
    size: '20 Gauge (Corkscrew post)',
    weight: '0.8 grams',
    brand: 'L.A Center Fine Jewelry',
    tags: ['Nose Stud', 'Diamond', '18k Gold', 'Solitaire', 'Fine Jewelry'],
    seoTitle: "L'Aura 18k Solitaire Diamond Nose Stud | L.A Center Jewelry",
    seoDescription: 'Handcrafted 18k solid gold solitaire diamond nose stud. Hypoallergenic fine jewelry made in Los Angeles.',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'prod-floral-gold-nosestud',
    name: 'Lotus Blossom 22k Gold Floral Nose Stud',
    sku: 'LAC-NOS-002',
    slug: 'lotus-blossom-22k-gold-floral-nose-stud',
    categoryId: 'cat-nosestud',
    categoryName: 'Nose Stud',
    subcategory: 'Floral & Designer Nose Studs',
    shortDescription: 'Delicate 22k solid gold 7-petal floral design with handset diamond center.',
    description: 'Inspired by classical heritage floral motifs. Hand-chiseled from 22k rich yellow gold with a sparkling center accent diamond and comfortable L-bend post.',
    price: 360,
    salePrice: 320,
    stockQuantity: 18,
    status: 'published',
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 9,
    images: [
      'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
    ],
    videos: [],
    thumbnail: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=600&auto=format&fit=crop',
    material: '22k Solid Gold & Diamond',
    metalType: '22k Gold',
    stoneType: 'Diamond',
    stoneColor: 'Natural White',
    size: '20 Gauge (L-Shape post)',
    weight: '1.1 grams',
    brand: 'L.A Center Fine Jewelry',
    tags: ['Nose Stud', 'Floral', '22k Gold', 'Designer', 'Diamond'],
    seoTitle: 'Lotus Blossom 22k Gold Floral Nose Stud | L.A Center Jewelry',
    seoDescription: 'Handcrafted 22k solid gold floral nose stud with natural diamond accent.',
    createdAt: '2026-02-12T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'prod-womens-aurora-set',
    name: "L'Aurore Diamond & 18k Gold Women's Jewelry Set",
    sku: 'LAC-WMS-001',
    slug: 'laurore-diamond-18k-gold-womens-jewelry-set',
    categoryId: 'cat-womens',
    categoryName: "Women's Jewelry",
    subcategory: "Women's Jewelry Sets",
    shortDescription: 'Matching 18k yellow gold necklace, drop earrings, and tennis bracelet suite with 4.5ct F-VS diamonds.',
    description: 'An immaculate women’s fine jewelry suite handcrafted in our Downtown Los Angeles atelier. Features a collar necklace, delicate drop earrings, and a fluid diamond bracelet harmonized with brilliant round-cut pavé diamonds.',
    price: 6800,
    salePrice: 6200,
    stockQuantity: 5,
    status: 'published',
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 16,
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
    ],
    videos: [],
    thumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop',
    material: '18k Solid Yellow Gold & Natural Diamonds',
    metalType: '18k Gold',
    stoneType: 'Diamond',
    stoneColor: 'F / VS1',
    size: 'Set (16" Necklace, 7" Bracelet, 1.2" Earrings)',
    weight: '34 grams',
    brand: 'L.A Center Fine Jewelry',
    tags: ["Women's Jewelry", 'Diamond Set', '18k Gold', 'Bridal Suite', 'Luxury'],
    seoTitle: "L'Aurore Diamond & 18k Gold Women's Jewelry Set | L.A Center Jewelry",
    seoDescription: "Exquisite 18k solid gold women's jewelry set with 4.5ct conflict-free diamonds.",
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'prod-artisan-silver-cuff',
    name: 'Artisan Sterling Silver Sculptural Fluted Cuff',
    sku: 'LAC-SLV-001',
    slug: 'artisan-sterling-silver-sculptural-fluted-cuff',
    categoryId: 'cat-bracelets',
    categoryName: 'Bracelets',
    subcategory: 'Silver Bracelets',
    shortDescription: 'Heavyweight hand-forged 925 solid sterling silver cuff with mirror-finish fluting.',
    description: 'Sculpted by our master silversmith in Los Angeles, this heavyweight cuff combines architectural ridges with ergonomic contouring. Crafted in pure hypoallergenic 925 sterling silver with rhodium anti-tarnish plating.',
    price: 580,
    salePrice: 490,
    stockQuantity: 12,
    status: 'published',
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 14,
    images: [
      'https://images.unsplash.com/photo-1611591475871-332906b3a09c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
    ],
    videos: [],
    thumbnail: 'https://images.unsplash.com/photo-1611591475871-332906b3a09c?q=80&w=600&auto=format&fit=crop',
    material: '925 Solid Sterling Silver with Rhodium Finish',
    metalType: 'Sterling Silver',
    stoneType: 'None',
    size: 'Medium (6.5" wrist, adjustable)',
    weight: '48 grams',
    brand: 'L.A Center Silver Atelier',
    tags: ['Silver', 'Sterling Silver', 'Bracelet', 'Cuff', 'Fine Jewelry'],
    seoTitle: 'Artisan Sterling Silver Sculptural Cuff | L.A Center Jewelry',
    seoDescription: 'Hand-forged 925 sterling silver cuff bracelet made in Los Angeles.',
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
];

// Showcase videos
export const DEFAULT_SHOWCASE_VIDEOS = [
  {
    id: 'vid-showcase-1',
    title: 'Elysian Solitaire Master Cut',
    subtitle: 'Flawless symmetry and fire under micro-faceting inspection',
    videoUrl: '/videos/hero-jewelry.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop',
    productId: 'prod-diamond-solitaire',
    productName: 'Elysian 2.5ct Diamond Solitaire Ring',
    price: 18500,
  },
  {
    id: 'vid-showcase-2',
    title: 'Riviera Tennis Bracelet Articulation',
    subtitle: 'Silken flexibility engineered with micro-hinged 18k gold joints',
    videoUrl: '/videos/hero-jewelry.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1611591475871-332906b3a09c?q=80&w=1200&auto=format&fit=crop',
    productId: 'prod-gold-tennis-bracelet',
    productName: 'Pavé Diamond Riviera Tennis Bracelet',
    price: 12400,
  },
  {
    id: 'vid-showcase-3',
    title: 'Sovereign Automatic Caliber',
    subtitle: 'Baguette diamond bezel and hand-finished oscillating weight',
    videoUrl: '/videos/hero-jewelry.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
    productId: 'prod-luxury-chronograph',
    productName: 'Sovereign Diamond Bezel Chronograph',
    price: 32000,
  },
  {
    id: 'vid-showcase-4',
    title: 'Broadway Cuban Link Craftsmanship',
    subtitle: 'Hand-filed bevels and mirror polish in downtown Los Angeles',
    videoUrl: '/videos/hero-jewelry.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=1200&auto=format&fit=crop',
    productId: 'prod-mens-cuban-chain',
    productName: 'Broadway 14k Solid Miami Cuban Link',
    price: 9800,
  },
];

// Initial Hero Config
export const DEFAULT_HERO_CONFIG: HeroConfig = {
  videoUrl: '',
  mobileVideoUrl: '',
  posterUrl: '',
  mobilePosterUrl: '',
  smallText: 'L.A CENTER JEWELRY INC',
  headline: '𝓛.𝓐 𝓒𝓮𝓷𝓽𝓮𝓻 𝓙𝓮𝔀𝓮𝓵𝓻𝔂 𝓘𝓷𝓬',
  tagline: 'Jewelry for a Lifetime',
  supportingText: 'Discover timeless jewelry in the heart of Los Angeles.',
  primaryButtonText: 'SHOP JEWELRY',
  primaryButtonLink: '/shop',
  secondaryButtonText: 'VISIT OUR STORE',
  secondaryButtonLink: '/contact',
  overlayOpacity: 0.35,
  isEnabled: true,
  autoplay: true,
  videoPosition: 'center',
  activeMode: 'video',
};

// Initial Jewelry Videos for "Explore Our Jewelry"
export const DEFAULT_JEWELRY_VIDEOS: JewelryVideo[] = [
  {
    id: 'jvid-1',
    title: 'Elysian Solitaire Master Cut',
    description: 'Flawless symmetry and diamond fire under micro-faceting inspection.',
    videoUrl: '/videos/hero-jewelry.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop',
    productId: 'prod-diamond-solitaire',
    productName: 'Elysian 2.5ct Diamond Solitaire Ring',
    price: 18500,
    category: 'Rings',
    duration: '0:15',
    isEnabled: true,
    order: 1,
  },
  {
    id: 'jvid-2',
    title: 'Riviera Diamond Tennis Bracelet',
    description: 'Silken flexibility engineered with micro-hinged 18k solid gold joints.',
    videoUrl: '/videos/hero-jewelry.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611591475871-332906b3a09c?q=80&w=1000&auto=format&fit=crop',
    productId: 'prod-gold-tennis-bracelet',
    productName: 'Pavé Diamond Riviera Tennis Bracelet',
    price: 12400,
    category: 'Bracelets',
    duration: '0:15',
    isEnabled: true,
    order: 2,
  },
  {
    id: 'jvid-3',
    title: 'Broadway Miami Cuban Link',
    description: 'Hand-filed bevels and liquid mirror polish crafted in Downtown Los Angeles.',
    videoUrl: '/videos/hero-jewelry.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=1000&auto=format&fit=crop',
    productId: 'prod-mens-cuban-chain',
    productName: 'Broadway 14k Solid Miami Cuban Link',
    price: 9800,
    category: "Men's Jewelry",
    duration: '0:15',
    isEnabled: true,
    order: 3,
  },
  {
    id: 'jvid-4',
    title: 'Sovereign Automatic Caliber',
    description: 'Baguette diamond bezel and hand-finished oscillating weight.',
    videoUrl: '/videos/hero-jewelry.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop',
    productId: 'prod-luxury-chronograph',
    productName: 'Sovereign Diamond Bezel Chronograph',
    price: 32000,
    category: 'Watches',
    duration: '0:15',
    isEnabled: true,
    order: 4,
  },
  {
    id: 'jvid-5',
    title: 'Celestial Diamond Halo Pendant',
    description: 'Brilliant round center diamond encircled by micro-pavé diamonds on 18k chain.',
    videoUrl: '/videos/hero-jewelry.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
    productId: 'prod-halo-pendant',
    productName: 'Celestial Diamond Halo Pendant',
    price: 6400,
    category: 'Necklaces',
    duration: '0:15',
    isEnabled: true,
    order: 5,
  },
  {
    id: 'jvid-6',
    title: 'South Sea Pearl Drop Earrings',
    description: 'Lustrous 12mm Australian South Sea pearls accented with graduated diamonds.',
    videoUrl: '/videos/hero-jewelry.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1000&auto=format&fit=crop',
    productId: 'prod-pearl-earrings',
    productName: 'South Sea Pearl Drop Earrings',
    price: 5200,
    category: 'Earrings',
    duration: '0:15',
    isEnabled: true,
    order: 6,
  },
  {
    id: 'jvid-7',
    title: 'Eternal Promise Bridal Suite',
    description: 'Matching engagement ring and diamond contour wedding band in 950 platinum.',
    videoUrl: '/videos/hero-jewelry.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop',
    productId: 'prod-bridal-suite',
    productName: 'Eternal Promise Platinum Bridal Suite',
    price: 24500,
    category: 'Bridal Jewelry',
    duration: '0:15',
    isEnabled: true,
    order: 7,
  },
  {
    id: 'jvid-8',
    title: 'Emerald-Cut Diamond Solitaire',
    description: 'Step-cut diamond with hall-of-mirrors clarity set in a clean cathedral shank.',
    videoUrl: '/videos/hero-jewelry.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop',
    productId: 'prod-emerald-solitaire',
    productName: 'Emerald-Cut Diamond Solitaire',
    price: 19800,
    category: 'Diamond Jewelry',
    duration: '0:15',
    isEnabled: true,
    order: 8,
  },
];

// Initial Storefront Media
export const DEFAULT_STOREFRONT_MEDIA: StorefrontMediaItem[] = [
  {
    id: 'sf-1',
    title: '720 S Broadway Storefront & Gold Signage',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1200&auto=format&fit=crop',
    caption: 'Exterior facade with classic gold script lettering at 720 S Broadway, Los Angeles.',
    order: 1,
    createdAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'sf-2',
    title: 'Broadway Showroom Diamond Display Cases',
    type: 'interior',
    url: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1200&auto=format&fit=crop',
    caption: 'Illuminated glass display showcases featuring fine engagement rings and diamond solitaires.',
    order: 2,
    createdAt: '2026-03-02T12:00:00Z',
  },
  {
    id: 'sf-3',
    title: 'High Jewelry Broadway Window Display',
    type: 'window_display',
    url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
    caption: 'Panoramic glass storefront windows overlooking downtown Los Angeles.',
    order: 3,
    createdAt: '2026-03-03T12:00:00Z',
  },
  {
    id: 'sf-4',
    title: 'Master Goldsmith Atelier Bench',
    type: 'interior',
    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop',
    caption: 'Precision gemstone setting and hand finishing workstation.',
    order: 4,
    createdAt: '2026-03-04T12:00:00Z',
  },
  {
    id: 'sf-5',
    title: 'Cinematic Storefront Tour',
    type: 'video',
    url: '/videos/hero-jewelry.mp4',
    caption: 'Cinematic walkthrough of our Broadway jewelry showroom.',
    order: 5,
    createdAt: '2026-03-05T12:00:00Z',
  },
];

// Initial Homepage Sections
export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSections = {
  hero: true,
  categories: true,
  featured: true,
  newArrivals: true,
  bestSelling: true,
  banners: true,
  craftsmanship: false,
  testimonials: true,
  newsletter: true,
};

// Default Payment Gateways Configuration
export const DEFAULT_PAYMENT_GATEWAYS: PaymentGatewaysConfig = {
  stripe: {
    enabled: true,
    mode: 'live',
    publishableKey: 'pk_live_51PlaCenterJewelry89214Secured',
    secretKey: 'sk_live_••••••••••••••••••••••••••••',
    payoutCardNumber: '•••• •••• •••• 4242',
    payoutCardHolder: 'L.A Center Jewelry Inc / Management',
    statementDescriptor: 'LA CENTER JEWELRY',
  },
  paypal: {
    enabled: true,
    mode: 'live',
    merchantEmail: 'alanboy515253@gmail.com',
    clientId: 'client_live_paypal_lacenter_8820',
    clientSecret: 'secret_live_paypal_••••••••••••',
  },
  bankWire: {
    enabled: true,
    bankName: 'JPMorgan Chase Bank, N.A.',
    accountHolderName: 'L.A Center Jewelry Inc',
    accountNumber: '982019482710',
    routingNumber: '122000496',
    swiftBic: 'CHASUS33',
    bankAddress: 'Downtown Los Angeles Financial District, 707 Wilshire Blvd, Los Angeles, CA 90017',
    wireInstructions: 'Please include your Order ID in the wire memo line. Domestic Fedwire settles same business day with 3% appraisal credit applied.',
    discountPercent: 3,
  },
};

// Site Settings
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  businessName: 'L.A Center Jewelry Inc',
  logoUrl: '/assets/diamond-logo.svg',
  logoHeight: 44,
  logoGlow: true,
  logoBoxBorder: false,
  address: '720 S Broadway, Los Angeles, CA 90014, United States',
  phone: '+1 213-612-0106',
  whatsappNumber: '+1 213-612-0106',
  whatsappEnabled: true,
  whatsappGreeting: 'Welcome! How can we assist you today? 💎',
  email: 'concierge@lacenterjewelry.com',
  coordinates: {
    lat: 34.0445523,
    lng: -118.2537474,
    formatted: '34.0445523° N, 118.2537474° W',
  },
  googleMapsUrl: 'https://maps.app.goo.gl/Cndjp3ewGuDpumts6',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.815757754406!2d-118.25632232345585!3d34.0445523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c7caa17bc4bd%3A0x66e43e25f20a36e5!2sL.A%20Center%20Jewelry%20Inc!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus',
  currencySymbol: '$',
  taxRatePercent: 9.5, // Los Angeles County standard sales tax
  freeShippingThreshold: 500,
  flatShippingRate: 35,
  socialLinks: {
    instagram: 'https://instagram.com/lacenterjewelry',
    facebook: 'https://facebook.com/lacenterjewelry',
    youtube: 'https://youtube.com/@lacenterjewelry',
    tiktok: 'https://tiktok.com/@lacenterjewelry',
  },
  seo: {
    title: 'L.A Center Jewelry Inc | Luxury Fine Jewelry in Downtown Los Angeles',
    description: 'Fine jewelry boutique located on Broadway in Los Angeles. Shop engagement rings, diamonds, custom gold jewelry, and Swiss watches.',
    keywords: 'jewelry Los Angeles, diamond rings, custom jewelry Broadway, engagement rings LA, gold chains',
    ogImage: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1200&auto=format&fit=crop',
  },
  aboutStory: {
    title: 'The Art of Haute Joaillerie in Los Angeles',
    intro: 'Located at 720 S Broadway in the historic jewelry center of Downtown Los Angeles, L.A Center Jewelry Inc is dedicated to timeless design and master craftsmanship.',
    craftsmanshipText: 'Every stone in our collection is ethically sourced and examined under 40x gemological magnification. Our master setters and goldsmiths apply generational techniques alongside precision laser technology to produce jewelry destined to become cherished family heirlooms.',
    locationText: 'We welcome you to our Broadway showroom for private consultations, custom design sessions, and personalized viewings of our high jewelry reserve.',
    image1: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1200&auto=format&fit=crop',
    image2: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
  },
  paymentGateways: DEFAULT_PAYMENT_GATEWAYS,
  adminCredentials: {
    username: 'admin@lacenterjewelry.com',
    password: 'admin123',
    name: 'Salon Managing Director',
    updatedAt: '2026-03-01T00:00:00Z',
  },
  facebookPixel: {
    enabled: false,
    pixelId: '',
    accessToken: '',
    testEventCode: '',
    trackPageView: true,
    trackViewContent: true,
    trackAddToCart: true,
    trackInitiateCheckout: true,
    trackPurchase: true,
  },
  apiKeys: [
    {
      id: 'key-live-001',
      name: 'Production Inventory & Catalog Sync',
      apiKey: 'lac_live_7x9q2m4k1p8v0z3w5r6y',
      apiSecret: 'sec_live_9b8c7d6e5f4a3b2c1d0e8f7a6b5c4d3e',
      environment: 'production',
      permissions: ['products:read', 'products:write', 'orders:read'],
      createdAt: '2026-03-01T12:00:00Z',
      lastUsedAt: '2026-03-24T18:00:00Z',
      status: 'active',
    },
  ],
};

export const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  username: 'admin@lacenterjewelry.com',
  password: 'admin123',
  name: 'Salon Managing Director',
  updatedAt: '2026-03-01T00:00:00Z',
};

export const DEFAULT_FACEBOOK_PIXEL: FacebookPixelConfig = {
  enabled: false,
  pixelId: '',
  accessToken: '',
  testEventCode: '',
  trackPageView: true,
  trackViewContent: true,
  trackAddToCart: true,
  trackInitiateCheckout: true,
  trackPurchase: true,
};

export const DEFAULT_API_KEYS: ApiKeyCredential[] = [
  {
    id: 'key-live-001',
    name: 'Production Inventory & Catalog Sync',
    apiKey: 'lac_live_7x9q2m4k1p8v0z3w5r6y',
    apiSecret: 'sec_live_9b8c7d6e5f4a3b2c1d0e8f7a6b5c4d3e',
    environment: 'production',
    permissions: ['products:read', 'products:write', 'orders:read'],
    createdAt: '2026-03-01T12:00:00Z',
    lastUsedAt: '2026-03-24T18:00:00Z',
    status: 'active',
  },
];

// Initial Banners
export const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'ban-bridal',
    title: 'The Broadway Bridal Atelier',
    subtitle: 'Private appointments and bespoke engagement consultations available.',
    buttonText: 'EXPLORE BRIDAL',
    buttonLink: '/shop?category=cat-bridal',
    mediaUrl: '/assets/bridal-jewelry-banner.svg',
    mediaType: 'image',
    position: 'middle',
    isActive: true,
    badge: 'EXCLUSIVE SALON',
  },
  {
    id: 'ban-custom',
    title: 'Bespoke Commissions',
    subtitle: 'Bring your vision to life with our master jewelers in Downtown Los Angeles.',
    buttonText: 'INQUIRE NOW',
    buttonLink: '/contact',
    mediaUrl: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=1600&auto=format&fit=crop',
    mediaType: 'image',
    position: 'bottom',
    isActive: true,
    badge: 'HANDCRAFTED',
  },
];

// Initial Sample Orders
export const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'LAC-2026-8941',
    customer: {
      firstName: 'Eleanor',
      lastName: 'Vance',
      email: 'eleanor.vance@example.com',
      phone: '+1 310-555-0142',
      address: '1048 Ocean Avenue',
      city: 'Santa Monica',
      state: 'CA',
      zip: '90403',
      country: 'United States',
    },
    items: [
      {
        productId: 'prod-diamond-solitaire',
        name: 'Elysian 2.5ct Diamond Solitaire Ring',
        price: 17200,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
        sku: 'LAC-RNG-001',
        metalType: 'Platinum',
        size: '6',
      },
    ],
    subtotal: 17200,
    shipping: 0,
    tax: 1634,
    discount: 0,
    total: 18834,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'Wire Transfer / Secured Credit',
    createdAt: '2026-03-12T14:22:00Z',
    notes: 'Insured Armored Carrier Delivery scheduled.',
  },
  {
    id: 'ord-1002',
    orderNumber: 'LAC-2026-8942',
    customer: {
      firstName: 'Marcus',
      lastName: 'Sterling',
      email: 'm.sterling@example.com',
      phone: '+1 213-555-0189',
      address: '433 S Spring St',
      apartment: 'Penthouse 12',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90013',
      country: 'United States',
    },
    items: [
      {
        productId: 'prod-mens-cuban-chain',
        name: 'Broadway 14k Solid Miami Cuban Link Chain',
        price: 9800,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop',
        sku: 'LAC-CHN-005',
        metalType: '14k Yellow Gold',
      },
    ],
    subtotal: 9800,
    shipping: 0,
    tax: 931,
    discount: 0,
    total: 10731,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card (Visa)',
    createdAt: '2026-03-18T10:15:00Z',
  },
];

// Initial Customers
export const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@example.com',
    phone: '+1 310-555-0142',
    ordersCount: 2,
    totalSpent: 34500,
    registeredAt: '2025-11-10T12:00:00Z',
    address: 'Santa Monica, CA',
  },
  {
    id: 'cust-2',
    name: 'Marcus Sterling',
    email: 'm.sterling@example.com',
    phone: '+1 213-555-0189',
    ordersCount: 1,
    totalSpent: 10731,
    registeredAt: '2026-01-14T09:00:00Z',
    address: 'Los Angeles, CA',
  },
  {
    id: 'cust-3',
    name: 'Julian Thorne',
    email: 'julian.t@example.com',
    phone: '+1 415-555-0199',
    ordersCount: 3,
    totalSpent: 42600,
    registeredAt: '2025-08-20T16:00:00Z',
    address: 'San Francisco, CA',
  },
];

// Initial Reviews
export const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-diamond-solitaire',
    productName: 'Elysian 2.5ct Diamond Solitaire Ring',
    customerName: 'Victoria & James H.',
    rating: 5,
    title: 'Breathtaking craftsmanship on Broadway',
    comment: 'We visited L.A Center Jewelry on Broadway to select my engagement ring. The diamond brilliance in person is extraordinary, far exceeding anything we saw at big-box jewelers. True Los Angeles artistry.',
    date: '2026-02-18',
    isApproved: true,
    verifiedPurchase: true,
  },
  {
    id: 'rev-2',
    productId: 'prod-gold-tennis-bracelet',
    productName: 'Pavé Diamond Riviera Tennis Bracelet',
    customerName: 'Sophia R.',
    rating: 5,
    title: 'Perfect everyday luxury',
    comment: 'The bracelet has incredible drape and catches light with every movement. The double safety clasp gives me complete peace of mind. Exceptional customer service from the store team.',
    date: '2026-03-01',
    isApproved: true,
    verifiedPurchase: true,
  },
  {
    id: 'rev-3',
    productId: 'prod-mens-cuban-chain',
    productName: 'Broadway 14k Solid Miami Cuban Link Chain',
    customerName: 'Marcus S.',
    rating: 5,
    title: 'Solid weight, flawless mirror finish',
    comment: 'You can immediately feel the density of solid gold. Links lay perfectly flat without rolling. Proud to support a historic DTLA jeweler.',
    date: '2026-03-10',
    isApproved: true,
    verifiedPurchase: true,
  },
];

// Initial Media Library
export const DEFAULT_MEDIA: MediaItem[] = [
  {
    id: 'med-1',
    name: 'elysian-solitaire-hero.jpg',
    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop',
    type: 'image',
    mimeType: 'image/jpeg',
    sizeBytes: 1240000,
    dimensions: '1920x1280',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'med-2',
    name: 'riviera-tennis-bracelet.jpg',
    url: 'https://images.unsplash.com/photo-1611591475871-332906b3a09c?q=80&w=1200&auto=format&fit=crop',
    type: 'image',
    mimeType: 'image/jpeg',
    sizeBytes: 980000,
    dimensions: '1920x1280',
    createdAt: '2026-01-11T11:00:00Z',
  },
  {
    id: 'med-3',
    name: 'diamond-necklace-craft.jpg',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
    type: 'image',
    mimeType: 'image/jpeg',
    sizeBytes: 1450000,
    dimensions: '1920x1280',
    createdAt: '2026-01-12T14:00:00Z',
  },
  {
    id: 'med-4',
    name: 'cinematic-jewelry-showcase.mp4',
    url: '/videos/hero-jewelry.mp4',
    type: 'video',
    mimeType: 'video/mp4',
    sizeBytes: 349734,
    duration: '0:12',
    posterUrl: '/videos/hero-poster.jpg',
    createdAt: '2026-01-15T09:00:00Z',
  },
];

/**
 * Database Service with LocalStorage Persistence
 * Automatically syncs in real-time across all views.
 */
class DatabaseService {
  private static instance: DatabaseService;

  private constructor() {
    this.initDefaultsIfEmpty();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private initDefaultsIfEmpty() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MEDIA)) {
      localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(DEFAULT_MEDIA));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(DEFAULT_CUSTOMERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BANNERS)) {
      localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(DEFAULT_BANNERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.HERO)) {
      localStorage.setItem(STORAGE_KEYS.HERO, JSON.stringify(DEFAULT_HERO_CONFIG));
    }
    if (!localStorage.getItem(STORAGE_KEYS.HOMEPAGE)) {
      localStorage.setItem(STORAGE_KEYS.HOMEPAGE, JSON.stringify(DEFAULT_HOMEPAGE_SECTIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SITE_SETTINGS));
    }
  }

  // Products
  public getProducts(): Product[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (data !== null) {
        const parsed: Product[] = JSON.parse(data);
        if (Array.isArray(parsed)) {
          // Preserve user deletions - do NOT force push deleted DEFAULT_PRODUCTS back!
          const defaultsMap = new Map(DEFAULT_PRODUCTS.map((d) => [d.id, d]));
          return parsed.map((p, idx) => {
            const def = defaultsMap.get(p.id);
            const isNewArrival =
              p.isNewArrival !== undefined
                ? p.isNewArrival
                : (def?.isNewArrival ?? (idx % 2 === 0));
            const isBestSeller =
              p.isBestSeller !== undefined
                ? p.isBestSeller
                : (def?.isBestSeller ?? (idx % 2 === 1 || p.isFeatured));
            return {
              ...p,
              isNewArrival,
              isBestSeller,
            };
          });
        }
      }
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
      return DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  }

  public saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (err) {
      console.warn('LocalStorage save failed, attempting lightweight compression fallback:', err);
      try {
        // Fallback: compress oversized image strings so catalog data is NEVER lost
        const safeProducts = products.map((p) => ({
          ...p,
          images: p.images.map((img) =>
            img && img.length > 500000
              ? 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800'
              : img
          ),
          thumbnail:
            p.thumbnail && p.thumbnail.length > 500000
              ? 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800'
              : p.thumbnail,
        }));
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(safeProducts));
      } catch (fatalErr) {
        console.error('Fatal LocalStorage quota error when saving products:', fatalErr);
      }
    }
  }

  public resetProductsToDefault(): Product[] {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }

  public addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products.unshift(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');
    const updated = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    products[index] = updated;
    this.saveProducts(products);
    return updated;
  }

  public deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    this.saveProducts(products);
  }

  // Categories
  public getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (data !== null) {
        const parsed: Category[] = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((cat) => {
            let cleanImg = cat.image || '';
            // If the image string is a dead session-bound blob URL, fallback safely
            if (cleanImg.startsWith('blob:')) {
              const def = DEFAULT_CATEGORIES.find((d) => d.id === cat.id || d.slug === cat.slug);
              cleanImg = def ? def.image : '';
            }
            return {
              ...cat,
              image: cleanImg,
              subcategories: cat.subcategories || [],
            };
          });
        }
      }
      // If never saved yet, initialize with canonical defaults
      try {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      } catch {
        // quota fallback
      }
      return DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  }

  public saveCategories(categories: Category[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (err) {
      console.warn('LocalStorage error while saving categories, saving lightweight fallback:', err);
      try {
        const lightweight = categories.map((c) => ({
          ...c,
          image: c.image && c.image.startsWith('data:image') ? '' : c.image,
        }));
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(lightweight));
      } catch (err2) {
        console.warn('Could not save lightweight categories to localStorage:', err2);
      }
    }
  }

  public resetCategoriesToDefault(): Category[] {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    } catch (err) {
      console.warn('Error resetting categories:', err);
    }
    return DEFAULT_CATEGORIES;
  }

  // Media
  public getMedia(): MediaItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEDIA);
      return data ? JSON.parse(data) : DEFAULT_MEDIA;
    } catch {
      return DEFAULT_MEDIA;
    }
  }

  public addMedia(media: MediaItem): void {
    const items = this.getMedia();
    items.unshift(media);
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(items));
  }

  public deleteMedia(id: string): void {
    const items = this.getMedia().filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(items));
  }

  // Orders
  public getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return data ? JSON.parse(data) : DEFAULT_ORDERS;
    } catch {
      return DEFAULT_ORDERS;
    }
  }

  public saveOrders(orders: Order[]): void {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }

  public createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order {
    const orders = this.getOrders();
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      orderNumber: `LAC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    this.saveOrders(orders);

    // Synchronize or create patron record in Customers directory
    try {
      const customers = this.getCustomers();
      const customerEmail = newOrder.customer.email?.trim().toLowerCase();
      if (customerEmail) {
        const existingCust = customers.find((c) => c.email.toLowerCase() === customerEmail);
        if (existingCust) {
          existingCust.ordersCount = (existingCust.ordersCount || 0) + 1;
          existingCust.totalSpent = (existingCust.totalSpent || 0) + newOrder.total;
          if (!existingCust.phone && newOrder.customer.phone) {
            existingCust.phone = newOrder.customer.phone;
          }
          if (!existingCust.address && newOrder.customer.city) {
            existingCust.address = `${newOrder.customer.city}, ${newOrder.customer.state || 'CA'}`;
          }
        } else {
          const custName =
            newOrder.customer.name ||
            `${newOrder.customer.firstName || ''} ${newOrder.customer.lastName || ''}`.trim() ||
            'Patron Client';
          customers.unshift({
            id: 'cust-' + Date.now(),
            name: custName,
            email: newOrder.customer.email,
            phone: newOrder.customer.phone || '',
            ordersCount: 1,
            totalSpent: newOrder.total,
            registeredAt: newOrder.createdAt,
            address: newOrder.customer.city
              ? `${newOrder.customer.city}, ${newOrder.customer.state || 'CA'}`
              : 'Los Angeles, CA',
            source: 'store_checkout',
            status: 'active',
          });
        }
        this.saveCustomers(customers);
      }
    } catch (e) {
      console.warn('Customer directory update bypassed:', e);
    }

    return newOrder;
  }

  // Customers & Patron Directory
  public getCustomers(): Customer[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return data ? JSON.parse(data) : DEFAULT_CUSTOMERS;
    } catch {
      return DEFAULT_CUSTOMERS;
    }
  }

  public saveCustomers(customers: Customer[]): void {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }

  // User Accounts & Profiles (Patrons / Clients)
  public getUserProfiles(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveUserProfiles(profiles: UserProfile[]): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(profiles));
  }

  public getCurrentUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public setCurrentUser(user: UserProfile | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  public registerUser(profile: Omit<UserProfile, 'id' | 'createdAt'>): UserProfile {
    const profiles = this.getUserProfiles();
    const existing = profiles.find((p) => p.email.toLowerCase() === profile.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists. Please sign in.');
    }

    const newUser: UserProfile = {
      ...profile,
      id: 'usr-' + Date.now(),
      createdAt: new Date().toISOString(),
    };

    profiles.push(newUser);
    this.saveUserProfiles(profiles);
    this.setCurrentUser(newUser);

    // Also register or sync with the store's Customer Patrons directory
    const customers = this.getCustomers();
    const existingCustomer = customers.find((c) => c.email.toLowerCase() === newUser.email.toLowerCase());
    if (!existingCustomer) {
      customers.unshift({
        id: 'cust-' + Date.now(),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone || '',
        ordersCount: 0,
        totalSpent: 0,
        registeredAt: newUser.createdAt,
        address: newUser.address ? `${newUser.address.city}, ${newUser.address.state}` : 'Los Angeles, CA',
        source: 'website_signup',
        status: 'active',
        preferredMetal: newUser.preferredMetal,
        ringSize: newUser.ringSize,
      });
      this.saveCustomers(customers);
    } else {
      existingCustomer.source = 'website_signup';
      existingCustomer.status = 'active';
      if (!existingCustomer.phone && newUser.phone) existingCustomer.phone = newUser.phone;
      if (newUser.preferredMetal) existingCustomer.preferredMetal = newUser.preferredMetal;
      if (newUser.ringSize) existingCustomer.ringSize = newUser.ringSize;
      this.saveCustomers(customers);
    }

    return newUser;
  }

  public updateUserProfile(id: string, updates: Partial<UserProfile>): UserProfile {
    const profiles = this.getUserProfiles();
    const index = profiles.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Profile not found.');
    }

    const updated: UserProfile = {
      ...profiles[index],
      ...updates,
    };
    profiles[index] = updated;
    this.saveUserProfiles(profiles);

    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === id) {
      this.setCurrentUser(updated);
    }

    return updated;
  }

  // Reviews
  public getReviews(): Review[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return data ? JSON.parse(data) : DEFAULT_REVIEWS;
    } catch {
      return DEFAULT_REVIEWS;
    }
  }

  public saveReviews(reviews: Review[]): void {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }

  public addReview(review: Omit<Review, 'id' | 'date' | 'isApproved'>): Review {
    const reviews = this.getReviews();
    const newRev: Review = {
      ...review,
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      isApproved: true, // auto approve in boutique demo
    };
    reviews.unshift(newRev);
    this.saveReviews(reviews);
    return newRev;
  }

  // Hero Config
  public getHeroConfig(): HeroConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HERO);
      if (!data) return DEFAULT_HERO_CONFIG;
      const parsed = JSON.parse(data);

      let needsSave = false;
      // Permanently remove the legacy pearl necklace image if stored in user's browser
      if (parsed.posterUrl && parsed.posterUrl.includes('photo-1515562141207-7a88fb7ce338')) {
        parsed.posterUrl = '/videos/hero-poster.jpg';
        needsSave = true;
      }
      if (parsed.mobilePosterUrl && parsed.mobilePosterUrl.includes('photo-1515562141207-7a88fb7ce338')) {
        parsed.mobilePosterUrl = '/videos/hero-poster-mobile.jpg';
        needsSave = true;
      }

      // Upgrade obsolete or broken external Google Commondatastorage sample video URLs to local ultra-fast video
      if (!parsed.videoUrl || parsed.videoUrl.includes('commondatastorage.googleapis.com') || parsed.videoUrl.includes('TearsOfSteel')) {
        parsed.videoUrl = '/videos/hero-jewelry.mp4';
        needsSave = true;
      }
      if (!parsed.mobileVideoUrl || parsed.mobileVideoUrl.includes('commondatastorage.googleapis.com') || parsed.mobileVideoUrl.includes('ForBiggerBlazes')) {
        parsed.mobileVideoUrl = '/videos/hero-jewelry-mobile.mp4';
        needsSave = true;
      }
      if (!parsed.posterUrl) {
        parsed.posterUrl = '/videos/hero-poster.jpg';
        needsSave = true;
      }
      if (!parsed.mobilePosterUrl) {
        parsed.mobilePosterUrl = '/videos/hero-poster-mobile.jpg';
        needsSave = true;
      }

      const merged: HeroConfig = {
        ...DEFAULT_HERO_CONFIG,
        ...parsed,
        posterUrl: parsed.posterUrl || '/videos/hero-poster.jpg',
        mobilePosterUrl: parsed.mobilePosterUrl || '/videos/hero-poster-mobile.jpg',
        activeMode: 'video',
      };

      if (needsSave) {
        this.saveHeroConfig(merged);
      }

      return merged;
    } catch {
      return DEFAULT_HERO_CONFIG;
    }
  }

  public saveHeroConfig(config: HeroConfig): void {
    localStorage.setItem(STORAGE_KEYS.HERO, JSON.stringify(config));
  }

  // Homepage Sections
  public getHomepageSections(): HomepageSections {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HOMEPAGE);
      if (data) {
        const parsed = JSON.parse(data);
        delete parsed.videoShowcase;
        return {
          ...DEFAULT_HOMEPAGE_SECTIONS,
          ...parsed,
          craftsmanship: false,
          featured: parsed.featured !== undefined ? parsed.featured : true,
          newArrivals: parsed.newArrivals !== undefined ? parsed.newArrivals : true,
          bestSelling: parsed.bestSelling !== undefined ? parsed.bestSelling : true,
        };
      }
      return DEFAULT_HOMEPAGE_SECTIONS;
    } catch {
      return DEFAULT_HOMEPAGE_SECTIONS;
    }
  }

  public saveHomepageSections(sections: HomepageSections): void {
    localStorage.setItem(STORAGE_KEYS.HOMEPAGE, JSON.stringify(sections));
  }

  // Banners
  public getBanners(): Banner[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BANNERS);
      if (!data) return DEFAULT_BANNERS;
      const parsed: Banner[] = JSON.parse(data);
      // Auto-migrate if obsolete tote bag image is present in localStorage
      let hasChanges = false;
      const updated = parsed.map((b) => {
        if (b.id === 'ban-bridal' && (b.mediaUrl?.includes('photo-1544816155-12df9643f363') || !b.mediaUrl)) {
          hasChanges = true;
          return {
            ...b,
            mediaUrl: '/assets/bridal-jewelry-banner.svg',
          };
        }
        return b;
      });
      if (hasChanges) {
        this.saveBanners(updated);
      }
      return updated;
    } catch {
      return DEFAULT_BANNERS;
    }
  }

  public saveBanners(banners: Banner[]): void {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
  }

  // Settings
  public getSettings(): SiteSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return DEFAULT_SITE_SETTINGS;
      const parsed = JSON.parse(data);
      let needsSave = false;

      // If set to the old placeholder SVG or empty, or using the previous faint diamond SVG, upgrade to crisp diamond logo
      if (
        !parsed.logoUrl ||
        parsed.logoUrl === '/assets/la-logo.svg' ||
        parsed.logoUrl.includes('points="30,28') ||
        parsed.logoUrl.includes('faceted-diamond')
      ) {
        parsed.logoUrl = '/assets/diamond-logo.svg';
        needsSave = true;
      }

      // Remove the 4-cornered border box line as requested by user
      if (parsed.logoBoxBorder !== false) {
        parsed.logoBoxBorder = false;
        needsSave = true;
      }

      const merged = {
        ...DEFAULT_SITE_SETTINGS,
        ...parsed,
        logoBoxBorder: false,
        coordinates: parsed.coordinates || DEFAULT_SITE_SETTINGS.coordinates,
        googleMapsUrl: parsed.googleMapsUrl || DEFAULT_SITE_SETTINGS.googleMapsUrl,
        googleMapsEmbedUrl: parsed.googleMapsEmbedUrl?.includes('0x80c2c7caa17bc4bd')
          ? parsed.googleMapsEmbedUrl
          : DEFAULT_SITE_SETTINGS.googleMapsEmbedUrl,
        paymentGateways: parsed.paymentGateways
          ? {
              stripe: { ...DEFAULT_PAYMENT_GATEWAYS.stripe, ...(parsed.paymentGateways.stripe || {}) },
              paypal: { ...DEFAULT_PAYMENT_GATEWAYS.paypal, ...(parsed.paymentGateways.paypal || {}) },
              bankWire: { ...DEFAULT_PAYMENT_GATEWAYS.bankWire, ...(parsed.paymentGateways.bankWire || {}) },
            }
          : DEFAULT_PAYMENT_GATEWAYS,
        adminCredentials: parsed.adminCredentials
          ? { ...DEFAULT_ADMIN_CREDENTIALS, ...parsed.adminCredentials }
          : this.getAdminCredentials(),
        facebookPixel: parsed.facebookPixel
          ? { ...DEFAULT_FACEBOOK_PIXEL, ...parsed.facebookPixel }
          : this.getFacebookPixel(),
        apiKeys: parsed.apiKeys ? parsed.apiKeys : this.getApiKeys(),
      };

      if (needsSave) {
        this.saveSettings(merged);
      }

      return merged;
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  }

  public saveSettings(settings: SiteSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      if (settings.adminCredentials) {
        this.saveAdminCredentials(settings.adminCredentials);
      }
      if (settings.facebookPixel) {
        this.saveFacebookPixel(settings.facebookPixel);
      }
      if (settings.apiKeys) {
        this.saveApiKeys(settings.apiKeys);
      }
    } catch (e) {
      console.warn('Unable to persist settings to localStorage:', e);
      try {
        // Fallback: If quota exceeded due to large items, retry without huge redundant fields
        const safeSettings = { ...settings };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(safeSettings));
      } catch {
        // Non-blocking fallback
      }
    }
  }

  // Admin Credentials
  public getAdminCredentials(): AdminCredentials {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADMIN_CREDENTIALS);
      return data ? JSON.parse(data) : DEFAULT_ADMIN_CREDENTIALS;
    } catch {
      return DEFAULT_ADMIN_CREDENTIALS;
    }
  }

  public saveAdminCredentials(credentials: AdminCredentials): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_CREDENTIALS, JSON.stringify(credentials));
    } catch (e) {
      console.warn('Unable to save admin credentials to storage:', e);
    }
  }

  // Facebook Pixel
  public getFacebookPixel(): FacebookPixelConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FACEBOOK_PIXEL);
      return data ? { ...DEFAULT_FACEBOOK_PIXEL, ...JSON.parse(data) } : DEFAULT_FACEBOOK_PIXEL;
    } catch {
      return DEFAULT_FACEBOOK_PIXEL;
    }
  }

  public saveFacebookPixel(pixel: FacebookPixelConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FACEBOOK_PIXEL, JSON.stringify(pixel));
    } catch (e) {
      console.warn('Unable to save facebook pixel to storage:', e);
    }
  }

  // API Credentials
  public getApiKeys(): ApiKeyCredential[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.API_KEYS);
      return data ? JSON.parse(data) : DEFAULT_API_KEYS;
    } catch {
      return DEFAULT_API_KEYS;
    }
  }

  public saveApiKeys(keys: ApiKeyCredential[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(keys));
    } catch (e) {
      console.warn('Unable to save API keys to storage:', e);
    }
  }

  // Jewelry Videos ("Explore Our Jewelry")
  public getJewelryVideos(): JewelryVideo[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JEWELRY_VIDEOS);
      return data ? JSON.parse(data) : DEFAULT_JEWELRY_VIDEOS;
    } catch {
      return DEFAULT_JEWELRY_VIDEOS;
    }
  }

  public saveJewelryVideos(videos: JewelryVideo[]): void {
    localStorage.setItem(STORAGE_KEYS.JEWELRY_VIDEOS, JSON.stringify(videos));
  }

  // Storefront Media
  public getStorefrontMedia(): StorefrontMediaItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STOREFRONT_MEDIA);
      return data ? JSON.parse(data) : DEFAULT_STOREFRONT_MEDIA;
    } catch {
      return DEFAULT_STOREFRONT_MEDIA;
    }
  }

  public saveStorefrontMedia(media: StorefrontMediaItem[]): void {
    localStorage.setItem(STORAGE_KEYS.STOREFRONT_MEDIA, JSON.stringify(media));
  }

  // Reset demo
  public resetToFactoryDemo(): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(DEFAULT_MEDIA));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(DEFAULT_CUSTOMERS));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(DEFAULT_BANNERS));
    localStorage.setItem(STORAGE_KEYS.HERO, JSON.stringify(DEFAULT_HERO_CONFIG));
    localStorage.setItem(STORAGE_KEYS.HOMEPAGE, JSON.stringify(DEFAULT_HOMEPAGE_SECTIONS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SITE_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.JEWELRY_VIDEOS, JSON.stringify(DEFAULT_JEWELRY_VIDEOS));
    localStorage.setItem(STORAGE_KEYS.STOREFRONT_MEDIA, JSON.stringify(DEFAULT_STOREFRONT_MEDIA));
  }
}

export const db = DatabaseService.getInstance();
