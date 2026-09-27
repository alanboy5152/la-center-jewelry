import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Shield,
  Gem,
  LogOut,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// The canonical categories requested by user
const TARGET_MENU_CATEGORIES = [
  { name: 'Rings', id: 'cat-rings', slug: 'rings' },
  { name: 'Necklaces', id: 'cat-necklaces', slug: 'necklaces' },
  { name: 'Earrings', id: 'cat-earrings', slug: 'earrings' },
  { name: 'Bracelets', id: 'cat-bracelets', slug: 'bracelets' },
  { name: 'Watches', id: 'cat-watches', slug: 'watches' },
  { name: 'Pendants', id: 'cat-pendants', slug: 'pendants' },
  { name: 'Chains', id: 'cat-chains', slug: 'chains' },
  { name: "Men's Jewelry", id: 'cat-mens', slug: 'mens-jewelry' },
  { name: "Women's Jewelry", id: 'cat-womens', slug: 'womens-jewelry' },
  { name: 'Bridal Jewelry', id: 'cat-bridal', slug: 'bridal-jewelry' },
  { name: 'Custom Jewelry', id: 'cat-custom', slug: 'custom-jewelry' },
  { name: 'Nose Stud', id: 'cat-nosestud', slug: 'nose-stud' },
];

export const Header: React.FC = () => {
  const {
    currentRoute,
    navigateTo,
    cartCount,
    wishlistCount,
    setIsCartDrawerOpen,
    isAdminLoggedIn,
    currentUser,
    isUserLoggedIn,
    logoutUser,
    logoutAdmin,
    siteSettings,
    products,
    categories,
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [activeHoverCategoryId, setActiveHoverCategoryId] = useState<string>('cat-rings');
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [mobileExpandedCatId, setMobileExpandedCatId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<typeof products>([]);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize target categories with global category state for counts & accurate IDs
  const dropdownCategories = useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      slug: string;
      description?: string;
      subcategories: any[];
      productCount?: number;
    }> = [];

    // First, process canonical categories in order
    TARGET_MENU_CATEGORIES.forEach((target) => {
      const match = categories.find(
        (c) =>
          c.id === target.id ||
          c.name.toLowerCase() === target.name.toLowerCase() ||
          c.slug.toLowerCase() === target.slug.toLowerCase()
      );
      list.push({
        id: match ? match.id : target.id,
        name: match ? match.name : target.name,
        slug: match ? match.slug : target.slug,
        description: match?.description,
        subcategories: match?.subcategories || [],
        productCount: match?.productCount,
      });
    });

    // Also include any other categories in state that weren't in TARGET_MENU_CATEGORIES
    categories.forEach((cat) => {
      if (!list.some((item) => item.id === cat.id || item.slug === cat.slug)) {
        list.push({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          subcategories: cat.subcategories || [],
          productCount: cat.productCount,
        });
      }
    });

    return list;
  }, [categories]);

  const activeCategory = useMemo(() => {
    return (
      dropdownCategories.find((c) => c.id === activeHoverCategoryId) ||
      dropdownCategories[0]
    );
  }, [dropdownCategories, activeHoverCategoryId]);

  // Click outside listener for category dropdown and user menu dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsCategoryDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsCategoryDropdownOpen(false);
    }, 150);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle live search suggestion input
  useEffect(() => {
    if (searchInputValue.trim().length > 1) {
      const q = searchInputValue.toLowerCase();
      const matched = products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.categoryName.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q)) ||
            p.sku.toLowerCase().includes(q)
        )
        .slice(0, 5);
      setSearchSuggestions(matched);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchInputValue, products]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchInputValue.trim()) {
      navigateTo('search', { query: searchInputValue.trim() });
      setIsSearchOpen(false);
      setSearchInputValue('');
    }
  };

  const navLinks = [
    { label: 'Home', route: 'home' as const },
    { label: 'Shop', route: 'shop' as const },
    { label: 'Categories', route: 'categories' as const },
    { label: 'About', route: 'about' as const },
    { label: 'Contact', route: 'contact' as const },
  ];

  return (
    <>
      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/98 backdrop-blur-md shadow-md border-b border-neutral-200/90 py-3 sm:py-3.5'
            : 'bg-white border-b border-neutral-200/70 py-4 sm:py-4.5'
        }`}
        style={{ position: 'sticky', top: 0, zIndex: 50 }}
      >
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-1.5 sm:gap-4 lg:gap-6 xl:gap-8">
            {/* Mobile Menu Toggle */}
            <div className="flex items-center lg:hidden shrink-0">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1 sm:p-2 -ml-1 text-neutral-800 hover:text-black focus:outline-none"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Left: Luxury Brand Logo & Store Name */}
            <div className="min-w-0 flex-1 lg:flex-initial">
              <button
                type="button"
                id="header-brand-logo-btn"
                onClick={() => navigateTo('home')}
                className="text-left group focus:outline-none flex items-center gap-1.5 sm:gap-2.5 max-w-full cursor-pointer"
              >
                {/* Dedicated Logo - Clean borderless */}
                {siteSettings?.logoUrl ? (
                  <div
                    id="header-logo-box"
                    className="relative shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                    style={{
                      height: `${siteSettings?.logoHeight ? Math.min(Math.max(siteSettings.logoHeight, 28), 52) : 38}px`,
                      width: `${siteSettings?.logoHeight ? Math.min(Math.max(siteSettings.logoHeight, 28), 52) : 38}px`,
                    }}
                  >
                    <img
                      src={siteSettings.logoUrl}
                      alt={`${siteSettings?.businessName || 'L.A Center Jewelry'} Official Emblem`}
                      className={`w-full h-full object-contain select-none transition-all ${
                        siteSettings?.logoGlow !== false
                          ? 'filter drop-shadow-[0_2px_6px_rgba(212,175,55,0.45)]'
                          : ''
                      }`}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : null}

                {/* Store Name - Scaled responsively to prevent overflowing on small mobile screens */}
                <div className="flex items-center min-w-0 py-0.5">
                  <span className="font-brand-header text-xs xs:text-sm sm:text-base lg:text-xl xl:text-[22px] tracking-[0.04em] sm:tracking-[0.08em] font-semibold text-[#1A1A1A] group-hover:text-[#997C24] transition-colors uppercase whitespace-nowrap leading-normal">
                    L.A Center Jewelry
                  </span>
                </div>
              </button>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8 shrink-0">
              {navLinks.map((link) => {
                const isActive = currentRoute === link.route;

                if (link.route === 'categories') {
                  return (
                    <div
                      key={link.route}
                      className="relative"
                      ref={categoryDropdownRef}
                      onMouseEnter={handleDropdownMouseEnter}
                      onMouseLeave={handleDropdownMouseLeave}
                    >
                      <button
                        type="button"
                        onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
                        className={`text-xs uppercase tracking-[0.12em] xl:tracking-[0.2em] font-medium py-1 transition-colors relative flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                          isActive || isCategoryDropdownOpen
                            ? 'text-[#1A1A1A] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#D4AF37]'
                            : 'text-neutral-600 hover:text-black'
                        }`}
                        aria-expanded={isCategoryDropdownOpen}
                        aria-haspopup="true"
                      >
                        <span>Categories</span>
                        <ChevronDown
                          className={`w-3 h-3 transition-transform duration-200 ${
                            isCategoryDropdownOpen ? 'rotate-180 text-[#997C24]' : 'text-neutral-400'
                          }`}
                        />
                      </button>

                      {/* Desktop Categories Mega Dropdown Menu */}
                      {isCategoryDropdownOpen && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-50">
                          <div className="w-[780px] bg-white border border-neutral-200 shadow-2xl rounded-xs p-5 text-left">
                            {/* Top Header */}
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#997C24]">
                                  Fine Jewelry Collections
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsCategoryDropdownOpen(false);
                                  navigateTo('categories');
                                }}
                                className="text-[10px] uppercase tracking-wider text-neutral-600 hover:text-black font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                              >
                                <span>All Categories Index</span>
                                <ArrowRight className="w-3 h-3 text-[#997C24]" />
                              </button>
                            </div>

                            {/* Main Grid: Left = Categories list, Right = Selected Category's 10 Subcategories */}
                            <div className="grid grid-cols-12 gap-5">
                              {/* Left Column: Categories list (5 cols) */}
                              <div className="col-span-5 border-r border-neutral-100 pr-2.5 space-y-1 max-h-[460px] overflow-y-auto scrollbar-thin">
                                <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-neutral-400 mb-1.5 px-2">
                                  Select Category
                                </div>
                                {dropdownCategories.map((cat) => {
                                  const isHovered = cat.id === activeCategory.id;
                                  return (
                                    <button
                                      key={cat.id}
                                      type="button"
                                      onMouseEnter={() => setActiveHoverCategoryId(cat.id)}
                                      onClick={() => {
                                        setIsCategoryDropdownOpen(false);
                                        navigateTo('shop', { categorySlug: cat.id });
                                      }}
                                      className={`w-full group/cat flex items-center justify-between px-3 py-1.5 rounded-xs transition-all text-left cursor-pointer ${
                                        isHovered
                                          ? 'bg-[#FAF7EF] text-black font-semibold shadow-xs border-l-2 border-[#D4AF37]'
                                          : 'text-neutral-700 hover:bg-neutral-50 hover:text-black'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <span
                                          className={`w-1.5 h-1.5 rounded-full transition-colors shrink-0 ${
                                            isHovered ? 'bg-[#D4AF37]' : 'bg-neutral-300 group-hover/cat:bg-neutral-400'
                                          }`}
                                        />
                                        <span className="text-xs uppercase tracking-wider truncate">
                                          {cat.name}
                                        </span>
                                      </div>
                                      <ChevronRight
                                        className={`w-3.5 h-3.5 transition-transform shrink-0 ${
                                          isHovered ? 'text-[#997C24] translate-x-0.5' : 'text-neutral-300'
                                        }`}
                                      />
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Right Column: 10 Subcategories of active category (7 cols) */}
                              <div className="col-span-7 flex flex-col justify-between pl-1">
                                <div>
                                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-neutral-100">
                                    <div>
                                      <span className="text-xs font-serif font-semibold text-neutral-900 block">
                                        {activeCategory.name} Sub-Categories
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setIsCategoryDropdownOpen(false);
                                        navigateTo('shop', { categorySlug: activeCategory.id });
                                      }}
                                      className="text-[10px] uppercase font-semibold text-[#997C24] hover:text-black flex items-center gap-1 cursor-pointer shrink-0"
                                    >
                                      <span>All {activeCategory.name}</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  </div>

                                  {/* 10 Subcategories Grid */}
                                  <div className="grid grid-cols-2 gap-1.5">
                                    {(activeCategory.subcategories && activeCategory.subcategories.length > 0
                                      ? activeCategory.subcategories
                                      : []
                                    ).map((sub) => (
                                      <button
                                        key={sub.id || sub.name}
                                        type="button"
                                        onClick={() => {
                                          setIsCategoryDropdownOpen(false);
                                          navigateTo('shop', {
                                            categorySlug: activeCategory.id,
                                            subcategory: sub.name,
                                          });
                                        }}
                                        className="group/sub flex items-center justify-between px-2.5 py-1.5 rounded-xs hover:bg-[#FAF9F5] border border-transparent hover:border-[#E8DFCE] transition-colors text-left cursor-pointer"
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          <span className="w-1 h-1 rounded-full bg-[#D4AF37] opacity-60 group-hover/sub:opacity-100 shrink-0" />
                                          <span className="text-xs text-neutral-700 group-hover/sub:text-[#997C24] group-hover/sub:font-medium truncate">
                                            {sub.name}
                                          </span>
                                        </div>
                                        <ArrowRight className="w-2.5 h-2.5 text-neutral-300 opacity-0 group-hover/sub:opacity-100 transition-opacity shrink-0" />
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Atelier bottom highlight */}
                                <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[10px]">
                                  <span className="text-neutral-400 tracking-wide">
                                    Handcrafted in Los Angeles • Custom Diamonds & Gemstones
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsCategoryDropdownOpen(false);
                                      navigateTo('contact');
                                    }}
                                    className="text-[#997C24] hover:underline font-semibold cursor-pointer"
                                  >
                                    Custom Inquiry →
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={link.route}
                    type="button"
                    onClick={() => navigateTo(link.route)}
                    className={`text-xs uppercase tracking-[0.12em] xl:tracking-[0.2em] font-medium py-1 transition-colors relative whitespace-nowrap ${
                      isActive
                        ? 'text-[#1A1A1A] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#D4AF37]'
                        : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Right: Actions (Search, Wishlist, Cart, Account/Admin) - Compact on mobile so all 4 buttons are always fully visible */}
            <div className="flex items-center gap-0.5 sm:gap-1.5 md:gap-2.5 xl:gap-3 shrink-0">
              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1 sm:p-2 text-neutral-700 hover:text-black hover:bg-neutral-100/80 rounded-full transition-colors relative"
                aria-label="Search jewelry"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Wishlist Icon */}
              <button
                type="button"
                onClick={() => navigateTo('wishlist')}
                className="p-1 sm:p-2 text-neutral-700 hover:text-black hover:bg-neutral-100/80 rounded-full transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 sm:top-0.5 sm:right-0.5 bg-[#D4AF37] text-white text-[8px] sm:text-[10px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Shopping Cart Icon */}
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                className="p-1 sm:p-2 text-neutral-700 hover:text-black hover:bg-neutral-100/80 rounded-full transition-colors relative"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 sm:top-0.5 sm:right-0.5 bg-[#1A1A1A] text-[#E5D7B7] text-[8px] sm:text-[10px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Unified User / Admin Icon - Always visible and accessible on mobile */}
              <div className="relative shrink-0" ref={userMenuRef}>
                <button
                  type="button"
                  id="header-patron-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`p-1 sm:p-2 rounded-full transition-all relative flex items-center justify-center cursor-pointer ${
                    isAdminLoggedIn
                      ? 'bg-amber-100/90 text-[#997C24] ring-1 ring-[#D4AF37]'
                      : isUserLoggedIn
                      ? 'bg-neutral-100 text-neutral-900 ring-1 ring-neutral-300'
                      : 'text-neutral-800 hover:text-black hover:bg-neutral-100/80'
                  }`}
                  title={
                    isAdminLoggedIn
                      ? 'Admin Dashboard'
                      : isUserLoggedIn
                      ? `Account: ${currentUser?.name}`
                      : 'Account & Admin Portal'
                  }
                  aria-label="Admin & Patron Profile"
                  aria-expanded={isUserMenuOpen}
                >
                  <User
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      isAdminLoggedIn ? 'text-[#997C24]' : isUserLoggedIn ? 'text-[#997C24]' : 'text-neutral-800'
                    }`}
                  />
                  {(isUserLoggedIn || isAdminLoggedIn) && (
                    <span
                      className={`absolute bottom-0 right-0 sm:bottom-0.5 sm:right-0.5 w-2 h-2 rounded-full ring-2 ring-white ${
                        isAdminLoggedIn ? 'bg-emerald-500' : 'bg-[#D4AF37]'
                      }`}
                    ></span>
                  )}
                </button>

                {/* Unified User Menu Dropdown */}
                {isUserMenuOpen && (
                  <div
                    id="header-user-dropdown-menu"
                    className="absolute right-0 mt-2 w-64 sm:w-72 max-w-[calc(100vw-20px)] bg-white border border-neutral-200 shadow-2xl rounded-xs py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    {/* Header info bar */}
                    <div className="px-4 py-3 border-b border-neutral-100 bg-[#FAF9F5]">
                      {isUserLoggedIn ? (
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#997C24] font-bold">
                            Patron Profile
                          </p>
                          <p className="text-sm font-serif font-medium text-neutral-900 truncate">
                            {currentUser?.name}
                          </p>
                          <p className="text-[11px] text-neutral-500 truncate">{currentUser?.email}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
                            Welcome to Broadway Atelier
                          </p>
                          <p className="text-xs text-neutral-700 mt-0.5">
                            Sign in or create your patron profile
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Patron Actions */}
                    <div className="py-1">
                      {isUserLoggedIn ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              navigateTo('customer-account');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-black flex items-center justify-between transition-colors cursor-pointer"
                          >
                            <span className="flex items-center gap-2.5">
                              <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>My Patron Profile &amp; Orders</span>
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              navigateTo('wishlist');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-black flex items-center justify-between transition-colors cursor-pointer"
                          >
                            <span className="flex items-center gap-2.5">
                              <Heart className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Saved Wishlist ({wishlistCount})</span>
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              navigateTo('customer-auth');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs font-semibold text-neutral-900 hover:bg-[#FAF9F5] flex items-center justify-between transition-colors cursor-pointer"
                          >
                            <span className="flex items-center gap-2.5">
                              <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Sign In / Create Account</span>
                            </span>
                            <span className="text-[10px] text-[#997C24] uppercase tracking-wider font-bold">
                              Join
                            </span>
                          </button>
                        </>
                      )}
                    </div>

                    {/* Staff & Admin Section inside the Man Icon */}
                    <div className="border-t border-neutral-100 my-1 pt-1">
                      <div className="px-4 py-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                          Staff &amp; Salon Management
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigateTo(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-black flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5">
                          <Shield className={`w-3.5 h-3.5 ${isAdminLoggedIn ? 'text-emerald-600' : 'text-neutral-400'}`} />
                          <span>{isAdminLoggedIn ? 'Atelier Admin Dashboard' : 'Staff / Admin Portal'}</span>
                        </span>
                        {isAdminLoggedIn ? (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 font-bold uppercase tracking-wider">
                            Active
                          </span>
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                        )}
                      </button>
                    </div>

                    {/* Logout actions if logged in */}
                    {(isUserLoggedIn || isAdminLoggedIn) && (
                      <div className="border-t border-neutral-100 pt-1 mt-1">
                        {isUserLoggedIn && (
                          <button
                            type="button"
                            onClick={() => {
                              logoutUser();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-neutral-500 hover:bg-neutral-50 hover:text-red-600 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out Patron Profile</span>
                          </button>
                        )}
                        {isAdminLoggedIn && (
                          <button
                            type="button"
                            onClick={() => {
                              logoutAdmin();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-neutral-500 hover:bg-neutral-50 hover:text-red-600 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out Admin Panel</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Live Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-neutral-200 mt-4 pt-4 px-4 sm:px-6 lg:px-8 bg-[#FAF9F5] pb-5 shadow-lg">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="Search rings, diamond necklaces, Cuban chains, watches, or SKU..."
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-none px-5 py-3.5 pl-12 text-sm text-neutral-900 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] placeholder:text-neutral-400"
                />
                <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-4" />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 top-3.5 text-xs uppercase tracking-widest text-neutral-500 hover:text-black font-semibold"
                >
                  Close
                </button>
              </form>

              {/* Suggestions dropdown */}
              {searchSuggestions.length > 0 && (
                <div className="mt-2 bg-white border border-neutral-200 shadow-md divide-y divide-neutral-100">
                  <div className="p-2 text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                    Suggested Fine Jewelry
                  </div>
                  {searchSuggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        navigateTo('product-details', { productId: item.id });
                        setIsSearchOpen(false);
                      }}
                      className="p-3 hover:bg-neutral-50 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-10 h-10 object-cover border border-neutral-200"
                        />
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{item.name}</p>
                          <p className="text-xs text-neutral-500">
                            {item.categoryName} • SKU: {item.sku}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-[#997C24]">
                        ${(item.salePrice || item.price).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div
                    onClick={handleSearchSubmit}
                    className="p-2.5 text-center text-xs text-[#997C24] font-medium hover:underline cursor-pointer bg-neutral-50"
                  >
                    View all results for &quot;{searchInputValue}&quot; →
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#FAF9F5] shadow-2xl z-10">
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {siteSettings?.logoUrl ? (
                  <div className="w-9 h-9 shrink-0 flex items-center justify-center">
                    <img
                      src={siteSettings.logoUrl}
                      alt={`${siteSettings?.businessName || 'L.A Center Jewelry'} Monogram`}
                      className="w-full h-full object-contain filter drop-shadow-[0_2px_6px_rgba(212,175,55,0.4)] select-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : null}
                <div className="flex items-center py-0.5">
                  <span className="font-brand-header text-base tracking-[0.08em] font-bold text-neutral-900 uppercase leading-normal">
                    L.A Center Jewelry
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-neutral-500 hover:text-black"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 py-6 px-6 space-y-4 overflow-y-auto">
              <nav className="space-y-2">
                {navLinks.map((link) => {
                  if (link.route === 'categories') {
                    return (
                      <div key={link.route} className="border-b border-neutral-200/50 pb-1">
                        <button
                          type="button"
                          onClick={() => setIsMobileCategoriesOpen((prev) => !prev)}
                          className="flex items-center justify-between w-full text-left py-2.5 text-sm uppercase tracking-widest text-neutral-800 hover:text-black"
                        >
                          <span className={currentRoute === 'categories' ? 'font-bold text-[#997C24]' : ''}>
                            {link.label}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                              isMobileCategoriesOpen ? 'rotate-180 text-[#997C24]' : ''
                            }`}
                          />
                        </button>

                        {/* Collapsible Mobile Category List */}
                        {isMobileCategoriesOpen && (
                          <div className="pl-2 pr-1 py-2 space-y-1.5 bg-neutral-50/80 border-l-2 border-[#D4AF37] my-1.5 rounded-r-xs">
                            {dropdownCategories.map((cat) => {
                              const isExpanded = mobileExpandedCatId === cat.id;
                              return (
                                <div key={cat.id} className="border-b border-neutral-200/50 last:border-0 pb-1">
                                  <div className="flex items-center justify-between w-full">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigateTo('shop', { categorySlug: cat.id });
                                        setIsMobileMenuOpen(false);
                                      }}
                                      className="text-left py-1.5 px-2 text-xs uppercase tracking-wider text-neutral-800 hover:text-[#997C24] font-medium flex-1 cursor-pointer"
                                    >
                                      {cat.name}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setMobileExpandedCatId(isExpanded ? null : cat.id)}
                                      className="p-1.5 text-neutral-400 hover:text-black cursor-pointer"
                                      aria-label={`Expand ${cat.name} subcategories`}
                                    >
                                      <ChevronDown
                                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                          isExpanded ? 'rotate-180 text-[#997C24]' : ''
                                        }`}
                                      />
                                    </button>
                                  </div>

                                  {/* Subcategories list when expanded */}
                                  {isExpanded && cat.subcategories && cat.subcategories.length > 0 && (
                                    <div className="pl-3 pr-1 py-1 space-y-1 bg-white/90 rounded-xs mt-0.5 mb-1 border-l-2 border-[#D4AF37]/50">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          navigateTo('shop', { categorySlug: cat.id });
                                          setIsMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left py-1 px-1 text-[11px] font-semibold text-[#997C24] hover:underline cursor-pointer"
                                      >
                                        All {cat.name} Collection →
                                      </button>
                                      {cat.subcategories.map((sub) => (
                                        <button
                                          key={sub.id || sub.name}
                                          type="button"
                                          onClick={() => {
                                            navigateTo('shop', {
                                              categorySlug: cat.id,
                                              subcategory: sub.name,
                                            });
                                            setIsMobileMenuOpen(false);
                                          }}
                                          className="flex items-center gap-1.5 w-full text-left py-1 px-1 text-xs text-neutral-600 hover:text-black cursor-pointer"
                                        >
                                          <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
                                          <span>{sub.name}</span>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            <button
                              type="button"
                              onClick={() => {
                                navigateTo('categories');
                                setIsMobileMenuOpen(false);
                              }}
                              className="flex items-center justify-between w-full text-left py-2 px-2 text-xs uppercase tracking-wider text-[#997C24] font-bold pt-2.5 border-t border-neutral-200/60 cursor-pointer"
                            >
                              <span>View All Collections</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <button
                      key={link.route}
                      type="button"
                      onClick={() => {
                        navigateTo(link.route);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-between w-full text-left py-2.5 text-sm uppercase tracking-widest ${
                        currentRoute === link.route
                          ? 'font-bold text-[#997C24]'
                          : 'text-neutral-800 hover:text-black'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    </button>
                  );
                })}
              </nav>

              <div className="pt-6 border-t border-neutral-200 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    navigateTo('wishlist');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between w-full py-2 text-sm text-neutral-700"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4" /> Wishlist
                  </span>
                  {wishlistCount > 0 && (
                    <span className="bg-[#D4AF37] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsCartDrawerOpen(true);
                  }}
                  className="flex items-center justify-between w-full py-2 text-sm text-neutral-700"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> Shopping Bag
                  </span>
                  {cartCount > 0 && (
                    <span className="bg-neutral-900 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigateTo(isUserLoggedIn ? 'customer-account' : 'customer-auth');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between w-full py-2 text-sm text-neutral-700 font-medium"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#D4AF37]" />
                    {isUserLoggedIn ? `${currentUser?.name} (Patron Profile)` : 'Sign Up / Patron Profile'}
                  </span>
                  <span className="text-[11px] text-[#997C24] font-semibold uppercase">
                    {isUserLoggedIn ? 'View' : 'Join'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigateTo(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between w-full py-2.5 px-3 rounded-xs border text-xs font-medium transition-colors ${
                    isAdminLoggedIn
                      ? 'bg-amber-50 border-[#D4AF37] text-[#997C24]'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-800 hover:bg-neutral-100 hover:text-black'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <User className={`w-4 h-4 ${isAdminLoggedIn ? 'text-[#D4AF37]' : 'text-neutral-600'}`} />
                    <span className="font-semibold">
                      {isAdminLoggedIn ? 'Admin Dashboard' : 'Staff & Admin Portal'}
                    </span>
                  </span>
                  <span className="text-[10px] text-[#997C24] font-bold uppercase tracking-wider">
                    {isAdminLoggedIn ? 'Active' : 'Login'}
                  </span>
                </button>
              </div>

              <div className="pt-6 border-t border-neutral-200 text-xs text-neutral-600 space-y-2">
                <p className="font-semibold text-neutral-900">Showroom Visit</p>
                <p>{siteSettings.address}</p>
                <a
                  href={`tel:${siteSettings.phone.replace(/[^0-9+]/g, '')}`}
                  className="block text-[#997C24] font-medium"
                >
                  {siteSettings.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
