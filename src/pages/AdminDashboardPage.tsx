import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Gem,
  Layers,
  Image as ImageIcon,
  Video,
  Home,
  Megaphone,
  ShoppingBag,
  Users,
  Star,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Check,
  RefreshCw,
  DollarSign,
  Package,
  Film,
  Sparkles,
  CreditCard,
  Upload,
  X,
  ShieldCheck,
  Activity,
  Key,
  MoreVertical,
  Share2,
  Instagram,
  Facebook,
  Youtube,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdminProductsTab } from '../components/admin/AdminProductsTab';
import { AdminHeroTab } from '../components/admin/AdminHeroTab';
import { AdminOrdersTab } from '../components/admin/AdminOrdersTab';
import { AdminBannersTab } from '../components/admin/AdminBannersTab';
import { AdminLogoTab } from '../components/admin/AdminLogoTab';
import { AdminPaymentsTab } from '../components/admin/AdminPaymentsTab';
import { AdminSecurityTab } from '../components/admin/AdminSecurityTab';
import { AdminPixelTab } from '../components/admin/AdminPixelTab';
import { AdminApiKeysTab } from '../components/admin/AdminApiKeysTab';
import { AdminSocialTab } from '../components/admin/AdminSocialTab';
import { AdminCustomersTab } from '../components/admin/AdminCustomersTab';
import { AdminWhatsAppTab } from '../components/admin/AdminWhatsAppTab';
import { Category, SiteSettings } from '../types';
import { optimizeImageFile } from '../utils/imageOptimizer';
import { saveCategoryImageDataUrl, removeCategoryImageDataUrl } from '../services/mediaStorage';
import { saveCategoryToFirestore } from '../services/firestoreSync';

export const AdminDashboardPage: React.FC = () => {
  const {
    adminUser,
    logoutAdmin,
    navigateTo,
    products,
    categories,
    orders,
    customers,
    homepageSections,
    updateHomepageSections,
    banners,
    siteSettings,
    updateSiteSettings,
    addCategory,
    updateCategory,
    deleteCategory,
    resetCategoriesToDefault,
    showToast,
    resetToFactoryDemo,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'products'
    | 'categories'
    | 'hero'
    | 'homepage'
    | 'banners'
    | 'orders'
    | 'customers'
    | 'reviews'
    | 'logo'
    | 'payments'
    | 'security'
    | 'pixel'
    | 'api-keys'
    | 'settings'
  >('overview');

  // Category modal
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catImageBlob, setCatImageBlob] = useState<Blob | null>(null);
  const [isOptimizingCatImage, setIsOptimizingCatImage] = useState(false);
  const [catImageMode, setCatImageMode] = useState<'upload' | 'url'>('upload');
  const [catImageFileName, setCatImageFileName] = useState('');
  const [catImageFileSize, setCatImageFileSize] = useState('');
  const [isCatDragging, setIsCatDragging] = useState(false);
  const catFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingCatId, setUploadingCatId] = useState<string | null>(null);
  const directFileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Direct 1-click upload from computer on category card
  const handleDirectCategoryUpload = async (cat: Category, file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP, GIF, SVG).', 'error');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      showToast('Image size exceeds 25MB limit. Please choose a smaller file.', 'error');
      return;
    }

    setUploadingCatId(cat.id);
    try {
      // Optimize to 900px max dimension & 0.78 quality for crisp jewelry display & ultra-safe size (~45-75 KB)
      const optimized = await optimizeImageFile(file, 900, 0.78);

      // 1. Immediately store permanent base64 in IndexedDB
      await saveCategoryImageDataUrl(cat.id, optimized.dataUrl);

      // 2. Update category in React state and local storage
      const updatedCat: Category = {
        ...cat,
        image: optimized.dataUrl,
      };
      updateCategory(updatedCat);

      // 3. Sync to Firestore cloud
      saveCategoryToFirestore(updatedCat).catch((err) => {
        console.warn('Firestore category sync warning:', err);
      });

      showToast(`"${cat.name}" image saved successfully (${optimized.sizeKb} KB).`, 'success');
    } catch (err) {
      console.error('Failed to directly upload category image:', err);
      showToast('Failed to upload image. Please try another file.', 'error');
    } finally {
      setUploadingCatId(null);
    }
  };

  // Settings local state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...siteSettings });
  const [settingsSubTab, setSettingsSubTab] = useState<
    'general' | 'whatsapp' | 'social' | 'security' | 'pixel' | 'apikeys' | 'logo'
  >('general');

  // Customer & Reviews Subtab state
  const [customerSubTab, setCustomerSubTab] = useState<'directory' | 'reviews'>('directory');

  // Mobile navigation drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Keep settingsForm in sync with siteSettings updates
  useEffect(() => {
    if (siteSettings) {
      setSettingsForm((prev) => ({
        ...siteSettings,
        ...prev,
        adminCredentials: siteSettings.adminCredentials || prev.adminCredentials,
        facebookPixel: siteSettings.facebookPixel || prev.facebookPixel,
        apiKeys: siteSettings.apiKeys || prev.apiKeys,
      }));
    }
  }, [siteSettings]);

  // Reviews local state
  const [allReviews, setAllReviews] = useState(() => {
    const stored = localStorage.getItem('la_center_jewelry_reviews');
    return stored ? JSON.parse(stored) : [];
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const handleCatFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP, GIF, SVG).', 'error');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      showToast('Image size exceeds 25MB limit. Please choose a smaller file.', 'error');
      return;
    }

    setIsOptimizingCatImage(true);
    try {
      const optimized = await optimizeImageFile(file, 900, 0.78);
      setCatImage(optimized.dataUrl);
      setCatImageBlob(optimized.blob);
      setCatImageFileName(file.name);
      setCatImageFileSize(`${optimized.sizeKb} KB (Optimized)`);
      showToast(`"${file.name}" optimized (${optimized.sizeKb} KB). Click "Save Category" to apply.`, 'success');
    } catch (err: any) {
      console.error('Error optimizing category image:', err);
      showToast('Failed to process image file. Please try another image.', 'error');
    } finally {
      setIsOptimizingCatImage(false);
    }
  };

  const handleCatDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsCatDragging(true);
  };

  const handleCatDragLeave = () => {
    setIsCatDragging(false);
  };

  const handleCatDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsCatDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleCatFileUpload(files[0]);
    }
  };

  const openAddCategory = () => {
    setEditingCat(null);
    setCatName('');
    setCatSlug(`cat-${Date.now()}`);
    setCatDesc('');
    setCatImage('https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop');
    setCatImageBlob(null);
    setCatImageMode('upload');
    setCatImageFileName('');
    setCatImageFileSize('');
    setIsCatModalOpen(true);
  };

  const openEditCategory = (cat: Category) => {
    setEditingCat(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDesc(cat.description);
    setCatImage(cat.image || '');
    setCatImageBlob(null);
    setCatImageMode('upload');
    setCatImageFileName('');
    setCatImageFileSize('');
    setIsCatModalOpen(true);
  };

  const handleDeleteCatImage = () => {
    setCatImage('');
    setCatImageBlob(null);
    setCatImageFileName('');
    setCatImageFileSize('');
    showToast('Category image removed. Click "Save Category" to confirm.', 'info');
  };

  const handleQuickDeleteCategoryImage = async (cat: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete the cover image for category "${cat.name}"?`)) return;
    try {
      await removeCategoryImageDataUrl(cat.id);
    } catch {}
    updateCategory({
      ...cat,
      image: '',
    });
    showToast(`Image removed from "${cat.name}".`, 'info');
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const targetId = editingCat ? editingCat.id : `cat-${Date.now()}`;

    // Persist permanent Base64 DataURL to IndexedDB for permanent durability
    if (catImage && catImage.startsWith('data:image')) {
      try {
        await saveCategoryImageDataUrl(targetId, catImage);
      } catch (err) {
        console.warn('IndexedDB write error for category image:', err);
      }
    } else if (!catImage.trim()) {
      try {
        await removeCategoryImageDataUrl(targetId);
      } catch {}
    }

    if (editingCat) {
      const updatedCat: Category = {
        ...editingCat,
        name: catName.trim(),
        slug: catSlug.trim() || editingCat.slug,
        description: catDesc.trim(),
        image: catImage.trim(),
      };
      updateCategory(updatedCat);
      saveCategoryToFirestore(updatedCat).catch((err) => {
        console.warn('Firestore category sync warning:', err);
      });
      showToast(`Category "${catName}" saved successfully.`, 'success');
    } else {
      const newCat: Category = {
        id: targetId,
        name: catName.trim(),
        slug: catSlug.trim() || `cat-${Date.now()}`,
        description: catDesc.trim(),
        image: catImage.trim(),
        order: categories.length + 1,
        productCount: 0,
        subcategories: [],
      };
      addCategory(newCat);
      saveCategoryToFirestore(newCat).catch((err) => {
        console.warn('Firestore new category sync warning:', err);
      });
      showToast(`New category "${catName}" created successfully.`, 'success');
    }
    setIsCatModalOpen(false);
    setCatImageBlob(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      ...settingsForm,
      adminCredentials: siteSettings.adminCredentials || settingsForm.adminCredentials,
      facebookPixel: siteSettings.facebookPixel || settingsForm.facebookPixel,
      apiKeys: siteSettings.apiKeys || settingsForm.apiKeys,
    });
    showToast('Storefront configurations saved successfully.', 'success');
  };

  const handleToggleSection = (key: keyof typeof homepageSections) => {
    updateHomepageSections({
      ...homepageSections,
      [key]: !homepageSections[key],
    });
    showToast(`Toggled homepage ${key} section.`, 'info');
  };

  const handleApproveReview = (id: string) => {
    const updated = allReviews.map((r: any) =>
      r.id === id ? { ...r, isApproved: true } : r
    );
    setAllReviews(updated);
    localStorage.setItem('la_center_jewelry_reviews', JSON.stringify(updated));
    showToast('Review approved for storefront display.', 'success');
  };

  const handleDeleteReview = (id: string) => {
    const updated = allReviews.filter((r: any) => r.id !== id);
    setAllReviews(updated);
    localStorage.setItem('la_center_jewelry_reviews', JSON.stringify(updated));
    showToast('Review deleted.', 'info');
  };

  const unapprovedReviewsCount = allReviews.filter((r: any) => !r.isApproved).length;

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Gem },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'hero', label: 'Hero Video', icon: Video },
    { id: 'banners', label: 'Banners', icon: Megaphone, badge: banners.length },
    { id: 'homepage', label: 'Homepage', icon: Home },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: orders.length },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    {
      id: 'customers',
      label: 'Customer Data',
      icon: Users,
      badge: unapprovedReviewsCount > 0 ? `${unapprovedReviewsCount} review` : customers.length,
    },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen md:h-screen bg-[#121212] text-white flex flex-col md:overflow-hidden w-full max-w-full overflow-x-hidden">
      {/* Top Navbar */}
      <header className="bg-[#1A1412] border-b border-[#2D211B] px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between sticky top-0 z-40 flex-shrink-0 w-full max-w-full">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile Three-Dot Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-neutral-300 hover:text-white hover:bg-[#2A1F1A] border border-[#3E2D25] rounded-xs cursor-pointer transition-colors"
            title="Open Admin Navigation"
            aria-label="Admin Navigation Menu"
          >
            <MoreVertical className="w-5 h-5 text-[#D4AF37]" />
          </button>

          {/* Website Logo */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center">
            {siteSettings?.logoUrl ? (
              <img
                src={siteSettings.logoUrl}
                alt="L.A Center Jewelry Monogram"
                className="w-full h-full object-contain filter drop-shadow-[0_1px_4px_rgba(212,175,55,0.4)]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            )}
          </div>

          {/* Website Name in Single Line */}
          <span className="font-serif text-sm sm:text-base md:text-lg font-medium text-white tracking-wide whitespace-nowrap truncate">
            L.A Center Jewelry
          </span>

          {/* Admin Master Control Badge (hidden on mobile, visible on desktop) */}
          <span className="hidden md:inline-flex bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] uppercase font-bold px-2 py-0.5 tracking-wider whitespace-nowrap">
            Admin Master Control
          </span>

          {/* Cloud DB Status (hidden on mobile) */}
          <span className="hidden lg:inline-flex items-center gap-1.5 bg-emerald-950/50 text-emerald-300 border border-emerald-800/60 text-[10px] font-mono font-medium px-2 py-0.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Cloud DB: Firestore Active
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Only Preview Storefront */}
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 bg-[#241C18] hover:bg-[#342721] border border-[#3E2D25] text-neutral-200 hover:text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors rounded-xs shadow-xs"
            title="Preview Storefront"
            aria-label="Preview Storefront"
          >
            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
            <span>Preview Storefront</span>
          </button>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#16110F] border-r border-[#2C211B] p-4 flex flex-col justify-between overflow-y-auto shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#2C211B] pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 shrink-0 flex items-center justify-center">
                    {siteSettings?.logoUrl ? (
                      <img
                        src={siteSettings.logoUrl}
                        alt="Monogram"
                        className="w-full h-full object-contain filter drop-shadow-[0_1px_4px_rgba(212,175,55,0.4)]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                    )}
                  </div>
                  <div>
                    <span className="font-serif text-sm font-medium text-white block leading-tight">
                      L.A Center Jewelry
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-mono">
                      Admin Control Navigation
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-xs hover:bg-[#261E1A] cursor-pointer"
                  title="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors whitespace-nowrap ${
                        isActive
                          ? 'bg-[#D4AF37] text-black font-bold shadow-xs'
                          : 'text-neutral-400 hover:text-white hover:bg-[#241C18]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-xs font-mono font-bold shrink-0 ml-2 ${
                            isActive ? 'bg-black text-[#D4AF37]' : 'bg-[#2A201A] text-neutral-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="mt-8 pt-4 border-t border-[#2C211B] text-xs space-y-3">
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span className="truncate">{adminUser?.name || 'Managing Director'}</span>
                <span className="font-mono text-[#D4AF37]">Active</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo('home');
                  }}
                  className="py-2 px-2 bg-[#201815] hover:bg-[#2D211C] border border-[#3A2A22] text-neutral-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Storefront</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logoutAdmin();
                  }}
                  className="py-2 px-2 bg-[#201815] hover:bg-rose-950/60 border border-[#3A2A22] text-neutral-300 hover:text-rose-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Admin Workspace with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row md:overflow-hidden min-h-0 w-full max-w-full overflow-x-hidden min-w-0">
        {/* Desktop & Tablet Sidebar (hidden on mobile, visible on md screens and up) */}
        <aside className="hidden md:flex md:w-56 lg:w-64 bg-[#16110F] border-r border-[#2C211B] p-3 lg:p-4 flex-shrink-0 md:h-full md:overflow-y-auto flex-col justify-between">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-bold shadow-xs'
                      : 'text-neutral-400 hover:text-white hover:bg-[#241C18]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-xs font-mono font-bold shrink-0 ml-2 ${
                        isActive ? 'bg-black text-[#D4AF37]' : 'bg-[#2A201A] text-neutral-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 pt-6 border-t border-[#2C211B] px-2 text-[11px] text-neutral-500 space-y-3">
            <div>
              <p className="font-semibold text-neutral-400">Atelier System</p>
              <p>v2.4.0 • Los Angeles CA</p>
            </div>

            {/* Logout Button with Icon */}
            <button
              type="button"
              onClick={logoutAdmin}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#201714] hover:bg-rose-950/60 border border-[#3E2D25] hover:border-rose-900 text-neutral-300 hover:text-rose-200 text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer rounded-xs"
              title="Sign out of Administrator"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Log Out</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('Reset entire catalog and database to pristine factory demo state?')) {
                  resetToFactoryDemo();
                }
              }}
              className="text-[10px] text-neutral-500 hover:text-[#D4AF37] underline pt-1 block cursor-pointer"
            >
              Reset to Factory Demo State
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-2 sm:p-6 md:p-8 bg-[#100D0B] overflow-y-auto min-h-0 w-full max-w-full min-w-0 overflow-x-hidden">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-normal text-white">
                  Executive Dashboard
                </h2>
                <p className="text-xs text-neutral-400">
                  Real-time salon operations, jewelry acquisitions, media vaults, and storefront metrics.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-[#181210] border border-[#2D211B]">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold">Total Revenue</span>
                    <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-white">
                    ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-[10px] text-emerald-400 font-mono">Live gross sales</span>
                </div>

                <div className="p-5 bg-[#181210] border border-[#2D211B]">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold">Fine Jewelry Pieces</span>
                    <Gem className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-white">{products.length}</p>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    Across {categories.length} suites
                  </span>
                </div>

                <div className="p-5 bg-[#181210] border border-[#2D211B]">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold">Client Orders</span>
                    <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-white">{orders.length}</p>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Active &amp; completed
                  </span>
                </div>

                <div className="p-5 bg-[#181210] border border-[#2D211B]">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold">Customers</span>
                    <Users className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-white">{customers.length}</p>
                  <span className="text-[10px] text-neutral-400 font-mono">Registered Customers</span>
                </div>
              </div>

              {/* Quick Actions & Recent Orders Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#181210] border border-[#2D211B] p-6 space-y-4">
                  <h3 className="font-serif text-lg font-medium text-white">
                    Quick Operational Shortcuts
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('products')}
                      className="p-3 bg-[#130E0C] hover:bg-[#201815] border border-[#2D211B] text-left text-xs"
                    >
                      <span className="text-[#D4AF37] font-semibold block">+ Add New Product</span>
                      <span className="text-[11px] text-neutral-400">Publish rings, gold or watches</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('hero')}
                      className="p-3 bg-[#130E0C] hover:bg-[#201815] border border-[#2D211B] text-left text-xs"
                    >
                      <span className="text-[#D4AF37] font-semibold block">Storefront Hero Control</span>
                      <span className="text-[11px] text-neutral-400">Toggle cinematic or live stream</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('categories')}
                      className="p-3 bg-[#130E0C] hover:bg-[#201815] border border-[#2D211B] text-left text-xs"
                    >
                      <span className="text-[#D4AF37] font-semibold block">Collections &amp; Categories</span>
                      <span className="text-[11px] text-neutral-400">Manage {categories.length} suites</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('banners')}
                      className="p-3 bg-[#130E0C] hover:bg-[#201815] border border-[#2D211B] text-left text-xs"
                    >
                      <span className="text-[#D4AF37] font-semibold block">Promotional Banners</span>
                      <span className="text-[11px] text-neutral-400">Sales &amp; bridal showcases</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('settings');
                        setSettingsSubTab('security');
                      }}
                      className="p-3 bg-[#130E0C] hover:bg-[#201815] border border-[#2D211B] text-left text-xs cursor-pointer"
                    >
                      <span className="text-[#D4AF37] font-semibold block flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Security &amp; Login</span>
                      </span>
                      <span className="text-[11px] text-neutral-400">Change Admin credentials</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('settings');
                        setSettingsSubTab('pixel');
                      }}
                      className="p-3 bg-[#130E0C] hover:bg-[#201815] border border-[#2D211B] text-left text-xs cursor-pointer"
                    >
                      <span className="text-blue-400 font-semibold block flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Facebook Pixel</span>
                      </span>
                      <span className="text-[11px] text-neutral-400">Ads campaign tracking</span>
                    </button>
                  </div>
                </div>

                <div className="bg-[#181210] border border-[#2D211B] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-medium text-white">
                      Recent Acquisitions
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-[#D4AF37] hover:underline font-semibold"
                    >
                      View All Orders →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {orders.slice(0, 3).map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3 bg-[#130E0C] border border-[#241B17] flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-mono font-semibold text-white">{ord.id}</p>
                          <p className="text-[11px] text-neutral-400">
                            {ord.customer.name || `${ord.customer.firstName} ${ord.customer.lastName}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-serif font-bold text-white">${ord.total.toLocaleString()}</p>
                          <span className="text-[10px] text-[#D4AF37]">{ord.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && <AdminProductsTab />}

          {/* TAB 3: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-normal text-white">
                    Collections &amp; Categories ({categories.length})
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Organize jewelry classifications, custom suites, and cover imagery.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Restore all default categories? Your current categories will be reset to factory defaults.')) {
                        resetCategoriesToDefault();
                      }
                    }}
                    className="px-3.5 py-2.5 border border-[#3E2D25] hover:border-neutral-400 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Reset categories to factory default"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>

                  <button
                    type="button"
                    onClick={openAddCategory}
                    className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Category</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-[#181210] border border-[#2D211B] overflow-hidden flex flex-col justify-between group/card relative"
                  >
                    {/* Hidden direct file input for this category */}
                    <input
                      type="file"
                      ref={(el) => {
                        directFileInputRefs.current[cat.id] = el;
                      }}
                      accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleDirectCategoryUpload(cat, e.target.files[0]);
                          e.target.value = '';
                        }
                      }}
                    />

                    <div className="relative aspect-video bg-[#120E0C] border-b border-[#2D211B] overflow-hidden group/img">
                      {cat.image ? (
                        <>
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop';
                            }}
                          />
                          {/* Quick change image overlay on hover */}
                          <div
                            onClick={() => directFileInputRefs.current[cat.id]?.click()}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                          >
                            <span className="px-3 py-1.5 bg-black/80 text-[#D4AF37] border border-[#D4AF37]/60 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Change Image</span>
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#130E0C]">
                          <ImageIcon className="w-8 h-8 text-neutral-600 mb-1" />
                          <p className="text-[11px] text-neutral-400">No Image</p>
                          <button
                            type="button"
                            onClick={() => directFileInputRefs.current[cat.id]?.click()}
                            disabled={uploadingCatId === cat.id}
                            className="mt-2.5 px-3 py-1.5 bg-[#D4AF37] hover:bg-[#b59226] text-black text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                          >
                            {uploadingCatId === cat.id ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Saving...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload Image</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Top Action Overlays */}
                      <div className="absolute top-2 inset-x-2 flex items-center justify-between pointer-events-none z-10">
                        {cat.image ? (
                          <button
                            type="button"
                            onClick={(e) => handleQuickDeleteCategoryImage(cat, e)}
                            className="pointer-events-auto px-2 py-0.5 bg-black/80 hover:bg-rose-950 text-neutral-300 hover:text-white border border-white/20 hover:border-rose-600 text-[10px] flex items-center gap-1 backdrop-blur-xs transition-colors cursor-pointer"
                            title="Delete image from category"
                          >
                            <Trash2 className="w-3 h-3 text-rose-400" />
                            <span className="text-[9px]">Delete</span>
                          </button>
                        ) : <span />}

                        <span className="bg-black/75 text-[#E5D7B7] text-[10px] px-2 py-0.5 font-mono border border-white/10">
                          {cat.productCount || 0} Pieces
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-base font-medium text-white">{cat.name}</h4>
                        <span className="text-[10px] font-mono text-neutral-500">Order: {cat.order}</span>
                      </div>
                      <p className="text-xs text-neutral-400 line-clamp-2">
                        {cat.description || 'No description provided.'}
                      </p>

                      <div className="pt-3 border-t border-[#261E1A] flex items-center justify-between">
                        {cat.image ? (
                          cat.image.startsWith('data:image') ? (
                            <span className="text-[10px] font-mono text-emerald-400 font-medium flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Permanent (Synced)
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-[#D4AF37] font-medium flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                              Image Attached
                            </span>
                          )
                        ) : (
                          <span className="text-[10px] font-mono text-neutral-500">
                            ✕ No Image
                          </span>
                        )}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => directFileInputRefs.current[cat.id]?.click()}
                            disabled={uploadingCatId === cat.id}
                            className="px-2 py-1 text-[10px] font-semibold bg-[#221712] hover:bg-[#34241C] text-[#E5D7B7] hover:text-white border border-[#443026] flex items-center gap-1 transition-colors cursor-pointer"
                            title="Upload image directly from computer"
                          >
                            {uploadingCatId === cat.id ? (
                              <RefreshCw className="w-3 h-3 animate-spin text-[#D4AF37]" />
                            ) : (
                              <Upload className="w-3 h-3 text-[#D4AF37]" />
                            )}
                            <span>{cat.image ? 'Change' : 'Upload'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditCategory(cat)}
                            className="p-1.5 text-neutral-400 hover:text-white"
                            title="Edit Category details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete category "${cat.name}"? This category and its settings will be permanently removed.`)) {
                                deleteCategory(cat.id);
                                showToast(`Deleted category "${cat.name}".`, 'info');
                              }
                            }}
                            className="p-1.5 text-neutral-400 hover:text-rose-400"
                            title="Delete Category permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Category Modal */}
              {isCatModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
                  <div className="bg-[#181210] border border-[#3E2D25] text-white p-6 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                    <button
                      type="button"
                      onClick={() => setIsCatModalOpen(false)}
                      className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white transition-colors"
                      title="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <h3 className="font-serif text-xl font-normal text-white mb-4">
                      {editingCat ? 'Edit Category' : 'Create Category'}
                    </h3>

                    <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                      <div>
                        <label className="uppercase font-semibold text-neutral-300 block mb-1">
                          Category Name
                        </label>
                        <input
                          type="text"
                          required
                          value={catName}
                          onChange={(e) => setCatName(e.target.value)}
                          placeholder="e.g. Necklaces, Rings, Bangles"
                          className="w-full bg-[#120E0C] border border-[#3E2D25] p-2.5 text-white focus:outline-hidden focus:border-[#D4AF37]"
                        />
                      </div>

                      {/* Category Cover Image with Computer Upload */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="uppercase font-semibold text-neutral-300 flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Category Image</span>
                          </label>

                          {/* Mode Toggle: Upload from PC vs URL */}
                          <div className="flex items-center bg-[#120E0C] border border-[#3E2D25] p-0.5 rounded-xs">
                            <button
                              type="button"
                              onClick={() => setCatImageMode('upload')}
                              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 ${
                                catImageMode === 'upload'
                                  ? 'bg-[#D4AF37] text-neutral-950 shadow-xs'
                                  : 'text-neutral-400 hover:text-white'
                              }`}
                            >
                              <Upload className="w-3 h-3" />
                              <span>Upload from Computer</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setCatImageMode('url')}
                              className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                                catImageMode === 'url'
                                  ? 'bg-[#D4AF37] text-neutral-950 shadow-xs'
                                  : 'text-neutral-400 hover:text-white'
                              }`}
                            >
                              Image URL
                            </button>
                          </div>
                        </div>

                        {catImageMode === 'upload' ? (
                          <div className="space-y-2">
                            {/* Hidden native file input */}
                            <input
                              ref={catFileInputRef}
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleCatFileUpload(e.target.files[0]);
                                }
                              }}
                              className="hidden"
                            />

                            {/* Dropzone container */}
                            <div
                              onClick={() => catFileInputRef.current?.click()}
                              onDragOver={handleCatDragOver}
                              onDragLeave={handleCatDragLeave}
                              onDrop={handleCatDrop}
                              className={`border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
                                isCatDragging
                                  ? 'border-[#D4AF37] bg-[#D4AF37]/10 scale-[0.99]'
                                  : 'border-[#3E2D25] hover:border-[#D4AF37]/70 bg-[#120E0C]'
                              }`}
                            >
                              <div className="flex flex-col items-center justify-center gap-1.5 py-1">
                                <div className="w-10 h-10 rounded-full bg-[#1F1714] border border-[#3E2D25] flex items-center justify-center text-[#D4AF37] mb-1">
                                  <Upload className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-bold text-white">
                                  Click to upload image from computer
                                </p>
                                <p className="text-[11px] text-neutral-400">
                                  Or drag &amp; drop image here
                                </p>
                                <p className="text-[10px] text-[#D4AF37] font-mono mt-0.5">
                                  JPG, PNG, WEBP, GIF, SVG (Optimized &amp; Permanent)
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <input
                              type="url"
                              value={catImage}
                              onChange={(e) => {
                                setCatImage(e.target.value);
                                setCatImageBlob(null);
                                setCatImageFileName('');
                                setCatImageFileSize('');
                              }}
                              placeholder="https://images.unsplash.com/..."
                              className="w-full bg-[#120E0C] border border-[#3E2D25] p-2.5 text-white focus:outline-hidden focus:border-[#D4AF37]"
                            />
                            <p className="text-[10px] text-neutral-500 mt-1">
                              Direct image URL (e.g., Unsplash or web image URL)
                            </p>
                          </div>
                        )}

                        {/* Optimizing Loading State */}
                        {isOptimizingCatImage && (
                          <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center gap-2.5 text-xs text-[#D4AF37]">
                            <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                            <span>Processing and optimizing image, please wait...</span>
                          </div>
                        )}

                        {/* Image Preview & Details */}
                        {catImage ? (
                          <div className="p-2.5 bg-[#120E0C] border border-[#3E2D25] flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative w-20 h-14 bg-neutral-900 border border-[#3E2D25] overflow-hidden shrink-0">
                                <img
                                  src={catImage}
                                  alt="Category Preview"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop';
                                  }}
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] font-bold text-white truncate block">
                                    {catImageFileName || 'Category Cover Image'}
                                  </span>
                                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                </div>
                                <p className="text-[10px] text-[#D4AF37] font-mono mt-0.5">
                                  {catImageFileSize
                                    ? `${catImageFileSize} • Computer upload (Permanent)`
                                    : 'Active category thumbnail'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => catFileInputRef.current?.click()}
                                className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-[#261E1A] hover:bg-[#3E2D25] text-neutral-300 hover:text-white border border-[#3E2D25] cursor-pointer flex items-center gap-1 transition-colors"
                                title="Choose another image from computer"
                              >
                                <Upload className="w-3 h-3 text-[#D4AF37]" />
                                <span>Change</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleDeleteCatImage}
                                className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-rose-950/70 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-800/80 cursor-pointer flex items-center gap-1 transition-colors"
                                title="Delete image from category"
                              >
                                <Trash2 className="w-3 h-3 text-rose-400" />
                                <span>Delete Image</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-[#120E0C] border border-[#2D211B] flex items-center justify-between text-xs text-neutral-400">
                            <div className="flex items-center gap-2">
                              <ImageIcon className="w-4 h-4 text-neutral-500" />
                              <span>No image selected</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => catFileInputRef.current?.click()}
                              className="px-2.5 py-1 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Upload Image</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="uppercase font-semibold text-neutral-300 block mb-1">
                          Short Description
                        </label>
                        <textarea
                          rows={3}
                          value={catDesc}
                          onChange={(e) => setCatDesc(e.target.value)}
                          placeholder="Summary of this jewelry category collection..."
                          className="w-full bg-[#120E0C] border border-[#3E2D25] p-2.5 text-white focus:outline-hidden focus:border-[#D4AF37]"
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2 border-t border-[#261E1A]">
                        <button
                          type="button"
                          onClick={() => setIsCatModalOpen(false)}
                          className="px-4 py-2 border border-[#3E2D25] text-neutral-300 hover:border-white transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#D4AF37] hover:bg-[#b59226] text-black font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                        >
                          Save Category
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: HERO BANNER SETTINGS */}
          {activeTab === 'hero' && <AdminHeroTab />}

          {/* TAB 5B: PROFESSIONAL BANNERS */}
          {activeTab === 'banners' && <AdminBannersTab />}

          {/* TAB 6: HOMEPAGE SECTIONS */}
          {activeTab === 'homepage' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-normal text-white">
                  Storefront Section Structure
                </h2>
                <p className="text-xs text-neutral-400">
                  Enable or disable homepage modules in real time. Configure auto-scrolling carousels for New Arrivals and Best Sellers.
                </p>
              </div>

              {/* Quick Info Banner for Moving Carousels */}
              <div className="p-4 bg-[#1E1916] border border-[#D4AF37]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">
                      Moving Carousels: New Arrivals & Best Selling
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      You can add or remove products from either moving section directly in the Products tab.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-[#b59226] text-neutral-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Gem className="w-3.5 h-3.5" />
                  <span>Curate Products</span>
                </button>
              </div>

              <div className="bg-[#181210] border border-[#2D211B] divide-y divide-[#261E1A]">
                {(() => {
                  const sectionOrder = [
                    'hero',
                    'categories',
                    'bestSelling',
                    'newArrivals',
                    'featured',
                    'banners',
                    'visitStore',
                    'reviews',
                  ];
                  const sortedEntries = Object.entries(homepageSections).sort((a, b) => {
                    const idxA = sectionOrder.indexOf(a[0]);
                    const idxB = sectionOrder.indexOf(b[0]);
                    return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
                  });

                  const titles: Record<string, { name: string; desc: string; isMoving?: boolean }> = {
                    hero: { name: 'Hero Video Banner', desc: 'Cinematic video banner with shop actions.' },
                    categories: { name: 'Category Showcase', desc: 'Curated rings, necklaces, bracelets, earrings.' },
                    bestSelling: { name: 'Best Selling Carousel', desc: 'Smooth auto-scrolling moving carousel with pause-on-hover.', isMoving: true },
                    newArrivals: { name: 'New Arrivals Carousel', desc: 'Smooth auto-scrolling moving carousel with pause-on-hover.', isMoving: true },
                    featured: { name: 'Featured Showcase', desc: 'Curated signature diamonds and fine jewelry with category filters.' },
                    banners: { name: 'Professional Banners', desc: 'Editorial showcase and bridal banner ribbons.' },
                    visitStore: { name: 'Visit Atelier Showroom', desc: 'Store hours, location, and private consultation form.' },
                    reviews: { name: 'Patron Testimonials', desc: 'Verified buyer testimonials and 5.0 Google rating badge.' },
                  };

                  return sortedEntries.map(([key, isEnabled]) => {
                    const meta = titles[key] || {
                      name: `${key.replace(/([A-Z])/g, ' $1')} Module`,
                      desc: 'Controls whether this section renders on the public homepage.',
                    };

                  return (
                    <div key={key} className="p-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white capitalize">
                            {meta.name}
                          </p>
                          {meta.isMoving && (
                            <span className="px-2 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-[9px] font-bold uppercase tracking-wider rounded-xs animate-pulse">
                              Moving Carousel
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {meta.desc}
                        </p>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={() => handleToggleSection(key as any)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]" />
                      </label>
                    </div>
                  );
                });
              })()}
              </div>
            </div>
          )}

          {/* TAB 7: ORDERS */}
          {activeTab === 'orders' && <AdminOrdersTab />}

          {/* TAB 8: PAYMENTS (Dedicated Payments Gateways & Payout Accounts) */}
          {activeTab === 'payments' && <AdminPaymentsTab />}

          {/* TAB 9: CUSTOMERS & REVIEWS */}
          {(activeTab === 'customers' || activeTab === 'reviews') && (
            <div className="space-y-6">
              {/* Header and Sub-tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2D211B] pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-normal text-white">
                    {customerSubTab === 'directory' ? 'Customer Directory' : 'Atelier Client Reviews'}
                  </h2>
                  <p className="text-xs text-neutral-400">
                    {customerSubTab === 'directory'
                      ? `Registered clientele, purchase histories, and client dossiers (${customers.length} total).`
                      : `Moderate genuine customer testimonials and review submissions (${allReviews.length} total).`}
                  </p>
                </div>

                {/* Subtab Toggle Buttons */}
                <div className="flex items-center gap-1.5 bg-[#16100E] p-1.5 border border-[#2D211B] rounded-xs">
                  <button
                    type="button"
                    onClick={() => setCustomerSubTab('directory')}
                    className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors ${
                      customerSubTab === 'directory'
                        ? 'bg-[#D4AF37] text-black font-bold shadow-xs'
                        : 'text-neutral-400 hover:text-white hover:bg-[#201815]'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Directory ({customers.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomerSubTab('reviews')}
                    className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors ${
                      customerSubTab === 'reviews'
                        ? 'bg-[#D4AF37] text-black font-bold shadow-xs'
                        : 'text-neutral-400 hover:text-white hover:bg-[#201815]'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>Reviews ({allReviews.length})</span>
                    {unapprovedReviewsCount > 0 && (
                      <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {unapprovedReviewsCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Subtab Content: Customer Directory */}
              {customerSubTab === 'directory' && <AdminCustomersTab />}

              {/* Subtab Content: Client Reviews */}
              {customerSubTab === 'reviews' && (
                <div className="space-y-4">
                  {allReviews.length === 0 ? (
                    <div className="p-8 text-center bg-[#181210] border border-[#2D211B] text-neutral-500 font-mono text-xs">
                      No customer reviews submitted yet.
                    </div>
                  ) : (
                    allReviews.map((rev: any) => (
                      <div
                        key={rev.id}
                        className="p-5 bg-[#181210] border border-[#2D211B] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                      >
                        <div className="space-y-1 max-w-xl">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-white">{rev.customerName}</span>
                            <span className="text-neutral-500 font-mono text-[11px]">{rev.productName}</span>
                            <div className="flex text-[#D4AF37]">
                              {[...Array(rev.rating || 5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="font-semibold text-neutral-200">{rev.title}</p>
                          <p className="text-neutral-400 font-light">{rev.comment}</p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!rev.isApproved ? (
                            <button
                              type="button"
                              onClick={() => handleApproveReview(rev.id)}
                              className="px-3 py-1.5 bg-emerald-900 text-emerald-200 hover:bg-emerald-800 text-[11px] font-semibold uppercase cursor-pointer"
                            >
                              Approve
                            </button>
                          ) : (
                            <span className="text-emerald-400 text-[11px] font-semibold uppercase flex items-center gap-1">
                              <Check className="w-3 h-3" /> Live
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteReview(rev.id)}
                            className="p-1.5 text-neutral-500 hover:text-rose-400 cursor-pointer"
                            title="Delete Review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 10: SETTINGS (Includes Security, Pixel, API Keys & Logo) */}
          {(activeTab === 'settings' ||
            activeTab === 'security' ||
            activeTab === 'pixel' ||
            activeTab === 'api-keys' ||
            activeTab === 'logo') && (
            <div className="space-y-3 sm:space-y-6 w-full max-w-full min-w-0">
              {/* Settings Sub-Navigation Menu */}
              <div className="w-full max-w-full min-w-0 overflow-hidden border-b border-[#2D211B] pb-1.5 sm:pb-2 bg-[#16100E] p-1 sm:p-2 rounded-xs">
                <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5 px-0.5">
                  <button
                    type="button"
                    onClick={() => setSettingsSubTab('general')}
                    className={`px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[10.5px] sm:text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-colors shrink-0 ${
                      settingsSubTab === 'general'
                        ? 'bg-[#D4AF37] text-black font-bold shadow-sm'
                        : 'text-neutral-400 hover:text-white hover:bg-[#201815]'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>General Store</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSettingsSubTab('whatsapp')}
                    className={`px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[10.5px] sm:text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-colors shrink-0 ${
                      settingsSubTab === 'whatsapp'
                        ? 'bg-[#25D366] text-black font-bold shadow-sm'
                        : 'text-neutral-400 hover:text-white hover:bg-[#201815]'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Chatbot</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSettingsSubTab('social')}
                    className={`px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[10.5px] sm:text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-colors shrink-0 ${
                      settingsSubTab === 'social'
                        ? 'bg-[#D4AF37] text-black font-bold shadow-sm'
                        : 'text-neutral-400 hover:text-white hover:bg-[#201815]'
                    }`}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Social Media</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSettingsSubTab('security')}
                    className={`px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[10.5px] sm:text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-colors shrink-0 ${
                      settingsSubTab === 'security'
                        ? 'bg-[#D4AF37] text-black font-bold shadow-sm'
                        : 'text-neutral-400 hover:text-white hover:bg-[#201815]'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Security &amp; Login</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSettingsSubTab('pixel')}
                    className={`px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[10.5px] sm:text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-colors shrink-0 ${
                      settingsSubTab === 'pixel'
                        ? 'bg-[#D4AF37] text-black font-bold shadow-sm'
                        : 'text-neutral-400 hover:text-white hover:bg-[#201815]'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Facebook Pixel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSettingsSubTab('apikeys')}
                    className={`px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[10.5px] sm:text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-colors shrink-0 ${
                      settingsSubTab === 'apikeys'
                        ? 'bg-[#D4AF37] text-black font-bold shadow-sm'
                        : 'text-neutral-400 hover:text-white hover:bg-[#201815]'
                    }`}
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>API Credentials</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSettingsSubTab('logo')}
                    className={`px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[10.5px] sm:text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-colors shrink-0 ${
                      settingsSubTab === 'logo'
                        ? 'bg-[#D4AF37] text-black font-bold shadow-sm'
                        : 'text-neutral-400 hover:text-white hover:bg-[#201815]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Brand Logo</span>
                  </button>
                </div>
              </div>

              {/* Subtab 0: WhatsApp Chatbot Studio */}
              {settingsSubTab === 'whatsapp' && <AdminWhatsAppTab />}

              {/* Subtab 1: Social Media */}
              {settingsSubTab === 'social' && <AdminSocialTab />}

              {/* Subtab 2: Security & Login */}
              {settingsSubTab === 'security' && <AdminSecurityTab />}

              {/* Subtab 3: Facebook Pixel */}
              {settingsSubTab === 'pixel' && <AdminPixelTab />}

              {/* Subtab 4: API Credentials */}
              {settingsSubTab === 'apikeys' && <AdminApiKeysTab />}

              {/* Subtab 5: Brand Logo Studio */}
              {settingsSubTab === 'logo' && <AdminLogoTab />}

              {/* Subtab 6: General Storefront Coordinates & Settings */}
              {settingsSubTab === 'general' && (
                <div className="space-y-2.5 sm:space-y-6 w-full max-w-full min-w-0">
                  <div>
                    <h2 className="font-serif text-lg sm:text-2xl font-normal text-white">
                      Storefront Configuration &amp; Business Coordinates
                    </h2>
                    <p className="text-[11px] sm:text-xs text-neutral-400">
                      Update official business address, phone, email, tax rate, and shipping policies.
                    </p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="bg-[#181210] border border-[#2D211B] p-3 sm:p-6 md:p-8 space-y-3 sm:space-y-6 text-xs w-full max-w-full min-w-0">
                    {/* Business Coordinates */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
                      <div>
                        <label className="uppercase font-semibold text-neutral-300 block mb-1 text-[11px] sm:text-xs">
                          Business Legal Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.businessName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, businessName: e.target.value })}
                          className="w-full bg-[#120E0C] border border-[#3E2D25] p-2 sm:p-2.5 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="uppercase font-semibold text-neutral-300 block mb-1 text-[11px] sm:text-xs">
                          Showroom Telephone *
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.phone}
                          onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                          className="w-full bg-[#120E0C] border border-[#3E2D25] p-2 sm:p-2.5 text-white text-xs"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="uppercase font-semibold text-neutral-300 flex items-center gap-1.5 text-[11px] sm:text-xs">
                            <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                            <span>WhatsApp Bot Number</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setSettingsSubTab('whatsapp')}
                            className="text-[10px] text-[#25D366] hover:underline cursor-pointer"
                          >
                            Bot Studio →
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="+1 213-612-0106"
                          value={settingsForm.whatsappNumber || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                          className="w-full bg-[#120E0C] border border-[#3E2D25] focus:border-[#25D366] p-2 sm:p-2.5 text-white font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="uppercase font-semibold text-neutral-300 block mb-1 text-[11px] sm:text-xs">
                        Storefront Physical Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="w-full bg-[#120E0C] border border-[#3E2D25] p-2 sm:p-2.5 text-white text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
                      <div>
                        <label className="uppercase font-semibold text-neutral-300 block mb-1 text-[11px] sm:text-xs">
                          Inquiries Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={settingsForm.email}
                          onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                          className="w-full bg-[#120E0C] border border-[#3E2D25] p-2 sm:p-2.5 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="uppercase font-semibold text-neutral-300 block mb-1 text-[11px] sm:text-xs">
                          Sales Tax Rate (%) *
                        </label>
                        <input
                          type="number"
                          step="0.05"
                          required
                          value={settingsForm.taxRatePercent}
                          onChange={(e) => setSettingsForm({ ...settingsForm, taxRatePercent: Number(e.target.value) })}
                          className="w-full bg-[#120E0C] border border-[#3E2D25] p-2 sm:p-2.5 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="uppercase font-semibold text-neutral-300 block mb-1 text-[11px] sm:text-xs">
                          Complimentary Shipping Threshold ($) *
                        </label>
                        <input
                          type="number"
                          required
                          value={settingsForm.freeShippingThreshold}
                          onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                          className="w-full bg-[#120E0C] border border-[#3E2D25] p-2 sm:p-2.5 text-white text-xs"
                        />
                      </div>
                    </div>

                    {/* Social Media Channels Section in General Store */}
                    <div className="pt-3 sm:pt-4 border-t border-[#261E1A] space-y-2.5 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                        <div>
                          <h4 className="font-serif text-xs sm:text-sm text-[#D4AF37] uppercase tracking-wider font-semibold">
                            Social Media Links (Follow The Atelier)
                          </h4>
                          <p className="text-[10.5px] sm:text-[11px] text-neutral-400">
                            Configure links for Instagram, Facebook, YouTube, and TikTok displayed in the footer.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSettingsSubTab('social')}
                          className="self-start sm:self-auto px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#201815] hover:bg-[#2C211C] border border-[#3E2D25] text-neutral-300 hover:text-white text-[9.5px] sm:text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <span>Dedicated Social Studio</span>
                          <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                        <div>
                          <label className="uppercase font-semibold text-neutral-300 block mb-1 flex items-center gap-1.5 text-[11px] sm:text-xs">
                            <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                            <span>Instagram URL</span>
                          </label>
                          <input
                            type="url"
                            value={settingsForm.socialLinks?.instagram || ''}
                            onChange={(e) =>
                              setSettingsForm({
                                ...settingsForm,
                                socialLinks: {
                                  ...settingsForm.socialLinks,
                                  instagram: e.target.value,
                                },
                              })
                            }
                            placeholder="https://instagram.com/lacenterjewelry"
                            className="w-full bg-[#120E0C] border border-[#3E2D25] p-2 sm:p-2.5 text-white placeholder:text-neutral-600 text-xs"
                          />
                        </div>

                        <div>
                          <label className="uppercase font-semibold text-neutral-300 block mb-1 flex items-center gap-1.5 text-[11px] sm:text-xs">
                            <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                            <span>Facebook URL</span>
                          </label>
                          <input
                            type="url"
                            value={settingsForm.socialLinks?.facebook || ''}
                            onChange={(e) =>
                              setSettingsForm({
                                ...settingsForm,
                                socialLinks: {
                                  ...settingsForm.socialLinks,
                                  facebook: e.target.value,
                                },
                              })
                            }
                            placeholder="https://facebook.com/lacenterjewelry"
                            className="w-full bg-[#120E0C] border border-[#3E2D25] p-2 sm:p-2.5 text-white placeholder:text-neutral-600 text-xs"
                          />
                        </div>

                        <div>
                          <label className="uppercase font-semibold text-neutral-300 block mb-1 flex items-center gap-1.5 text-[11px] sm:text-xs">
                            <Youtube className="w-3.5 h-3.5 text-[#FF0000]" />
                            <span>YouTube Channel URL</span>
                          </label>
                          <input
                            type="url"
                            value={settingsForm.socialLinks?.youtube || ''}
                            onChange={(e) =>
                              setSettingsForm({
                                ...settingsForm,
                                socialLinks: {
                                  ...settingsForm.socialLinks,
                                  youtube: e.target.value,
                                },
                              })
                            }
                            placeholder="https://youtube.com/@lacenterjewelry"
                            className="w-full bg-[#120E0C] border border-[#3E2D25] p-2 sm:p-2.5 text-white placeholder:text-neutral-600 text-xs"
                          />
                        </div>

                        <div>
                          <label className="uppercase font-semibold text-neutral-300 block mb-1 flex items-center gap-1.5 text-[11px] sm:text-xs">
                            <Share2 className="w-3.5 h-3.5 text-[#00f2fe]" />
                            <span>TikTok URL</span>
                          </label>
                          <input
                            type="url"
                            value={settingsForm.socialLinks?.tiktok || ''}
                            onChange={(e) =>
                              setSettingsForm({
                                ...settingsForm,
                                socialLinks: {
                                  ...settingsForm.socialLinks,
                                  tiktok: e.target.value,
                                },
                              })
                            }
                            placeholder="https://tiktok.com/@lacenterjewelry"
                            className="w-full bg-[#120E0C] border border-[#3E2D25] p-2 sm:p-2.5 text-white placeholder:text-neutral-600 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="uppercase font-semibold text-neutral-300 block mb-1 text-[11px] sm:text-xs">
                        SEO Meta Title
                      </label>
                      <input
                        type="text"
                        value={settingsForm.seo.title}
                        onChange={(e) => setSettingsForm({ ...settingsForm, seo: { ...settingsForm.seo, title: e.target.value } })}
                        className="w-full bg-[#120E0C] border border-[#3E2D25] p-2 sm:p-2.5 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="uppercase font-semibold text-neutral-300 block mb-1 text-[11px] sm:text-xs">
                        SEO Meta Description
                      </label>
                      <textarea
                        rows={2}
                        value={settingsForm.seo.description}
                        onChange={(e) => setSettingsForm({ ...settingsForm, seo: { ...settingsForm.seo, description: e.target.value } })}
                        className="w-full bg-[#120E0C] border border-[#3E2D25] p-2 sm:p-2.5 text-white text-xs"
                      />
                    </div>

                    <div className="pt-3 sm:pt-4 border-t border-[#261E1A] flex justify-end">
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save Store Settings</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
