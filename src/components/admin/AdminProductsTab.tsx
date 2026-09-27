import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  Search,
  Sparkles,
  Star,
  Flame,
  X,
  Upload,
  Check,
  RefreshCw,
  Video,
  Play,
  Film,
  Gem,
  Image as ImageIcon,
  Scale,
} from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { optimizeImageFile } from '../../utils/imageOptimizer';
import { saveProductVideoBlob } from '../../services/mediaStorage';

export const PRESET_METALS = [
  { value: '18k Yellow Gold', label: '18k Yellow Gold' },
  { value: '18k White Gold', label: '18k White Gold' },
  { value: '18k Rose Gold', label: '18k Rose Gold' },
  { value: '14k Yellow Gold', label: '14k Yellow Gold' },
  { value: '14k White Gold', label: '14k White Gold' },
  { value: '14k Rose Gold', label: '14k Rose Gold' },
  { value: '22k Solid Gold', label: '22k Solid Gold' },
  { value: '24k Pure Gold', label: '24k Pure Gold' },
  { value: 'Platinum 950', label: 'Platinum 950' },
  { value: '925 Solid Sterling Silver', label: '925 Sterling Silver' },
  { value: '18k Two-Tone Gold', label: '18k Two-Tone Gold' },
  { value: '18k Tri-Color Gold', label: '18k Tri-Color Gold' },
  { value: 'Titanium', label: 'Titanium' },
];

export const PRESET_STONES = [
  { value: 'Natural Diamond', label: 'Natural Diamond' },
  { value: 'Lab-Grown Diamond', label: 'Lab-Grown Diamond' },
  { value: 'Moissanite', label: 'Moissanite' },
  { value: 'Ceylon Blue Sapphire', label: 'Ceylon Blue Sapphire' },
  { value: 'Burmese Ruby', label: 'Burmese Ruby' },
  { value: 'Colombian Emerald', label: 'Colombian Emerald' },
  { value: 'South Sea Pearl', label: 'South Sea Pearl' },
  { value: 'Tahitian Black Pearl', label: 'Tahitian Black Pearl' },
  { value: 'Tanzanite', label: 'Tanzanite' },
  { value: 'Aquamarine', label: 'Aquamarine' },
  { value: 'Opal', label: 'Opal' },
  { value: 'Amethyst', label: 'Amethyst' },
  { value: 'Topaz', label: 'Topaz' },
  { value: 'Cubic Zirconia', label: 'Cubic Zirconia (CZ)' },
  { value: 'No Stone / Plain Metal', label: 'No Stone / Plain Metal' },
];

export const AdminProductsTab: React.FC = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProductsToDefault,
    showToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategoryFilter, setSelectedSubcategoryFilter] = useState('all');
  const [curationFilter, setCurationFilter] = useState<'all' | 'newArrivals' | 'bestSellers' | 'published' | 'draft'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const confirmDeleteProduct = (prod: Product) => {
    deleteProduct(prod.id);
    showToast(`"${prod.name}" has been deleted.`, 'success');
    setProductToDelete(null);
  };

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [price, setPrice] = useState(0);
  const [salePrice, setSalePrice] = useState<number | undefined>(undefined);
  const [stockQuantity, setStockQuantity] = useState(10);
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [metalType, setMetalType] = useState('18k Yellow Gold');
  const [stoneType, setStoneType] = useState('Diamond');
  const [stoneColor, setStoneColor] = useState('D-F Colorless, VS1');
  const [size, setSize] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [brand, setBrand] = useState('L.A Center Jewelry Inc');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft' | 'out_of_stock'>('published');
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoPoster, setVideoPoster] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [videoSourceType, setVideoSourceType] = useState<'upload' | 'url'>('upload');
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoFileMeta, setVideoFileMeta] = useState<{ name: string; size: string } | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setSku(`LA-${Math.floor(1000 + Math.random() * 9000)}`);
    const initialCatId = categories[0]?.id || 'cat-rings';
    setCategoryId(initialCatId);
    const initialCat = categories.find((c) => c.id === initialCatId);
    setSubcategory(initialCat?.subcategories?.[0]?.name || 'Solitaire Rings');
    setPrice(3500);
    setSalePrice(undefined);
    setStockQuantity(5);
    setDescription('');
    setShortDescription('');
    setMetalType('18k Yellow Gold');
    setStoneType('Diamond');
    setStoneColor('G-H, VS2');
    setSize('Size 7');
    setWeight('4.8 grams');
    setDimensions('1.50 Carat Center');
    setBrand('L.A Center Jewelry Inc');
    setIsFeatured(false);
    setIsNewArrival(true);
    setIsBestSeller(false);
    setStatus('published');
    setImages(['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop']);
    setVideoUrl('');
    setVideoPoster('');
    setVideoTitle('');
    setVideoFileMeta(null);
    setVideoSourceType('upload');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setSku(product.sku);
    setCategoryId(product.categoryId);
    setSubcategory(product.subcategory || '');
    setPrice(product.price);
    setSalePrice(product.salePrice);
    setStockQuantity(product.stockQuantity);
    setDescription(product.description);
    setShortDescription(product.shortDescription || '');
    setMetalType(product.metalType);
    setStoneType(product.stoneType);
    setStoneColor(product.stoneColor || '');
    setSize(product.size || '');
    setWeight(product.weight || '');
    setDimensions(product.dimensions || '');
    setBrand(product.brand);
    setIsFeatured(product.isFeatured);
    setIsNewArrival(product.isNewArrival ?? false);
    setIsBestSeller(product.isBestSeller ?? false);
    setStatus(product.status);
    setImages(product.images && product.images.length > 0 ? product.images : [product.thumbnail]);
    if (product.videos && product.videos[0]) {
      setVideoUrl(product.videos[0].url);
      setVideoPoster(product.videos[0].poster || '');
      setVideoTitle(product.videos[0].title || '');
      setVideoSourceType(product.videos[0].url.startsWith('blob:') || product.videos[0].url.startsWith('data:') ? 'upload' : 'url');
    } else {
      setVideoUrl('');
      setVideoPoster('');
      setVideoTitle('');
      setVideoSourceType('upload');
    }
    setVideoFileMeta(null);
    setIsModalOpen(true);
  };

  const handleDuplicate = (p: Product) => {
    const duplicated: Product = {
      ...p,
      id: `prod-${Date.now()}`,
      name: `${p.name} (Copy)`,
      sku: `${p.sku}-CPY`,
      createdAt: new Date().toISOString(),
    };
    addProduct(duplicated);
    showToast(`Duplicated ${p.name}.`, 'success');
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput('');
      showToast('Image URL added.', 'success');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingImage(true);
      // High-efficiency web compression (~60-90 KB) to prevent LocalStorage and Firestore quota issues
      const optimized = await optimizeImageFile(file, 1000, 0.78);
      setImages((prev) => [...prev, optimized.dataUrl]);
      showToast(`Image uploaded successfully (${optimized.sizeKb} KB).`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Image upload failed.', 'error');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSetMainImage = (index: number) => {
    if (index === 0 || !images[index]) return;
    const selected = images[index];
    const filtered = images.filter((_, i) => i !== index);
    setImages([selected, ...filtered]);
    showToast('Set as main cover image.', 'success');
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      showToast('Please select a valid video file (MP4, WebM, MOV)', 'error');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      showToast('Video file must be under 100MB.', 'error');
      return;
    }

    try {
      setIsVideoUploading(true);
      const videoKey = `vid_${Date.now()}`;
      // Persist in local IndexedDB so it never expires across reloads
      const objectUrl = await saveProductVideoBlob(videoKey, file);
      setVideoUrl(objectUrl);
      setVideoTitle(file.name);
      setVideoFileMeta({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      });
      showToast(`Video uploaded successfully (${(file.size / (1024 * 1024)).toFixed(1)} MB).`, 'success');
    } catch (err: any) {
      console.error('Video upload failed', err);
      showToast('Failed to load video. Please try again.', 'error');
    } finally {
      setIsVideoUploading(false);
      e.target.value = '';
    }
  };

  const handleClearVideo = () => {
    setVideoUrl('');
    setVideoPoster('');
    setVideoTitle('');
    setVideoFileMeta(null);
    showToast('Video removed.', 'info');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Product name is required.', 'error');
      return;
    }

    const categoryObj = categories.find((c) => c.id === categoryId);
    const categoryName = categoryObj ? categoryObj.name : 'Jewelry';

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: name.trim(),
      slug: editingProduct ? editingProduct.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: sku.trim() || `LA-${Date.now().toString().slice(-4)}`,
      categoryId,
      categoryName,
      subcategory: subcategory.trim() || undefined,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      stockQuantity: Number(stockQuantity),
      description: description.trim() || 'Handcrafted fine jewelry piece from L.A Center Jewelry Inc.',
      shortDescription: shortDescription.trim() || description.slice(0, 100),
      material: metalType,
      metalType,
      stoneType,
      stoneColor,
      size,
      weight,
      dimensions,
      brand: brand.trim() || 'L.A Center Jewelry Inc',
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop'],
      thumbnail: images[0] || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop',
      videos: videoUrl ? [{ url: videoUrl, poster: videoPoster || images[0], title: videoTitle || name }] : [],
      isFeatured,
      isNewArrival,
      isBestSeller,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 1,
      tags: [categoryName, metalType, stoneType, ...(subcategory ? [subcategory] : [])],
      status,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingProduct) {
      updateProduct(productPayload);
      showToast(`Updated "${productPayload.name}".`, 'success');
    } else {
      addProduct(productPayload);
      showToast(`Created new product "${productPayload.name}".`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleToggleNewArrival = (prod: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = {
      ...prod,
      isNewArrival: !prod.isNewArrival,
      updatedAt: new Date().toISOString(),
    };
    updateProduct(updated);
    showToast(
      `"${prod.name}" ${!prod.isNewArrival ? 'added to' : 'removed from'} New Arrivals.`,
      'success'
    );
  };

  const handleToggleBestSeller = (prod: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = {
      ...prod,
      isBestSeller: !prod.isBestSeller,
      updatedAt: new Date().toISOString(),
    };
    updateProduct(updated);
    showToast(
      `"${prod.name}" ${!prod.isBestSeller ? 'added to' : 'removed from'} Best Selling.`,
      'success'
    );
  };

  const newArrivalsCount = products.filter((p) => p.isNewArrival).length;
  const bestSellersCount = products.filter((p) => p.isBestSeller).length;

  // Filtered list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSubcat =
      selectedSubcategoryFilter === 'all' || p.subcategory === selectedSubcategoryFilter;

    let matchesCuration = true;
    if (curationFilter === 'newArrivals') {
      matchesCuration = !!p.isNewArrival;
    } else if (curationFilter === 'bestSellers') {
      matchesCuration = !!p.isBestSeller;
    } else if (curationFilter === 'published') {
      matchesCuration = p.status === 'published';
    } else if (curationFilter === 'draft') {
      matchesCuration = p.status === 'draft';
    }

    return matchesSearch && matchesCat && matchesSubcat && matchesCuration;
  });

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-normal text-white">
            Fine Jewelry Products ({products.length})
          </h2>
          <p className="text-xs text-neutral-400">
            Manage catalogue, sub-categories, diamond grading details, media galleries, pricing, and stock.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Restore all default sample products? Your product catalogue will be reset.')) {
                resetProductsToDefault();
                showToast('Default products restored.', 'info');
              }
            }}
            className="px-3.5 py-2.5 border border-[#3E2D25] hover:border-neutral-400 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset products to default"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Creation</span>
          </button>
        </div>
      </div>

      {/* Quick Curation Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCurationFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold tracking-wider transition-colors cursor-pointer ${
            curationFilter === 'all'
              ? 'bg-[#D4AF37] text-neutral-950 font-bold shadow-xs'
              : 'bg-[#1E1916] text-neutral-300 hover:text-white border border-[#33261F]'
          }`}
        >
          All Products ({products.length})
        </button>
        <button
          type="button"
          onClick={() => setCurationFilter('newArrivals')}
          className={`px-3 py-1.5 text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
            curationFilter === 'newArrivals'
              ? 'bg-[#D4AF37] text-neutral-950 font-bold shadow-xs'
              : 'bg-[#1E1916] text-[#E5D7B7] hover:text-white border border-[#33261F]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>New Arrivals ({newArrivalsCount})</span>
        </button>
        <button
          type="button"
          onClick={() => setCurationFilter('bestSellers')}
          className={`px-3 py-1.5 text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
            curationFilter === 'bestSellers'
              ? 'bg-[#8C2D19] text-white font-bold shadow-xs'
              : 'bg-[#1E1916] text-amber-200 hover:text-white border border-[#33261F]'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-[#FCD34D] fill-current" />
          <span>Best Sellers ({bestSellersCount})</span>
        </button>
        <button
          type="button"
          onClick={() => setCurationFilter('published')}
          className={`px-3 py-1.5 text-xs font-semibold tracking-wider transition-colors cursor-pointer ${
            curationFilter === 'published'
              ? 'bg-emerald-800 text-emerald-100 font-bold shadow-xs'
              : 'bg-[#1E1916] text-neutral-400 hover:text-white border border-[#33261F]'
          }`}
        >
          Published
        </button>
        <button
          type="button"
          onClick={() => setCurationFilter('draft')}
          className={`px-3 py-1.5 text-xs font-semibold tracking-wider transition-colors cursor-pointer ${
            curationFilter === 'draft'
              ? 'bg-neutral-700 text-white font-bold shadow-xs'
              : 'bg-[#1E1916] text-neutral-400 hover:text-white border border-[#33261F]'
          }`}
        >
          Drafts
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#1A1A1A] border border-[#2D2D2D] p-4 flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, SKU, subcategory, or diamond..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121212] border border-[#333] text-white text-xs pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubcategoryFilter('all');
            }}
            className="bg-[#121212] border border-[#333] text-neutral-300 text-xs px-3 py-2.5 focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {selectedCategory !== 'all' && (
            <select
              value={selectedSubcategoryFilter}
              onChange={(e) => setSelectedSubcategoryFilter(e.target.value)}
              className="bg-[#121212] border border-[#333] text-[#D4AF37] text-xs px-3 py-2.5 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">All Subcategories</option>
              {categories
                .find((c) => c.id === selectedCategory)
                ?.subcategories?.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
            </select>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#1A1A1A] border border-[#2D2D2D] overflow-x-auto">
        <table className="w-full text-left text-xs text-neutral-300">
          <thead className="bg-[#141414] text-neutral-400 uppercase tracking-wider border-b border-[#2D2D2D]">
            <tr>
              <th className="py-3.5 px-4">Product</th>
              <th className="py-3.5 px-4">SKU</th>
              <th className="py-3.5 px-4">Category & Subcategory</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Stock</th>
              <th className="py-3.5 px-4 text-center">New Arrival</th>
              <th className="py-3.5 px-4 text-center">Best Seller</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262626]">
            {filteredProducts.map((prod) => (
              <tr key={prod.id} className="hover:bg-[#202020] transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.thumbnail}
                      alt={prod.name}
                      className="w-10 h-10 object-cover border border-[#333] flex-shrink-0"
                    />
                    <div>
                      <span className="font-serif text-sm font-medium text-white block">
                        {prod.name}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {prod.metalType} • {prod.stoneType}{prod.weight ? ` • ⚖️ ${prod.weight}` : ''}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-neutral-400">{prod.sku}</td>
                <td className="py-3 px-4">
                  <div className="font-medium text-white">{prod.categoryName}</div>
                  {prod.subcategory ? (
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded-xs text-[10px] bg-[#2A261A] text-[#D4AF37] border border-[#483F25] font-sans">
                      {prod.subcategory}
                    </span>
                  ) : (
                    <span className="text-[10px] text-neutral-500 italic">General</span>
                  )}
                </td>
                <td className="py-3 px-4 font-serif font-semibold text-white">
                  ${prod.price.toLocaleString()}
                  {prod.salePrice && (
                    <span className="block text-[10px] text-[#D4AF37]">
                      Sale: ${prod.salePrice.toLocaleString()}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] uppercase font-semibold ${
                      prod.stockQuantity > 2
                        ? 'bg-emerald-950 text-emerald-300'
                        : 'bg-amber-950 text-amber-300'
                    }`}
                  >
                    {prod.stockQuantity} in stock
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    type="button"
                    onClick={(e) => handleToggleNewArrival(prod, e)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
                      prod.isNewArrival
                        ? 'bg-[#D4AF37] text-neutral-950 shadow-xs hover:bg-[#b59226]'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                    }`}
                    title={prod.isNewArrival ? 'Click to remove from New Arrivals' : 'Click to add to New Arrivals'}
                  >
                    <Sparkles className={`w-3 h-3 ${prod.isNewArrival ? 'text-neutral-950' : 'text-neutral-500'}`} />
                    <span>{prod.isNewArrival ? 'Active' : '+ Add'}</span>
                  </button>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    type="button"
                    onClick={(e) => handleToggleBestSeller(prod, e)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
                      prod.isBestSeller
                        ? 'bg-[#8C2D19] text-white shadow-xs hover:bg-[#a6351d]'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                    }`}
                    title={prod.isBestSeller ? 'Click to remove from Best Selling' : 'Click to add to Best Selling'}
                  >
                    <Star className={`w-3 h-3 ${prod.isBestSeller ? 'fill-current text-[#FCD34D]' : 'text-neutral-500'}`} />
                    <span>{prod.isBestSeller ? 'Active' : '+ Add'}</span>
                  </button>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] uppercase font-semibold ${
                      prod.status === 'published'
                        ? 'bg-emerald-900/60 text-emerald-200'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {prod.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(prod)}
                      className="p-1.5 text-neutral-400 hover:text-white"
                      title="Edit Product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(prod)}
                      className="p-1.5 text-neutral-400 hover:text-[#D4AF37]"
                      title="Duplicate Product"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductToDelete(prod)}
                      className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="relative bg-[#1A1A1A] border border-[#333] text-white w-full max-w-3xl my-8 p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#2D2D2D] mb-6">
              <h3 className="font-serif text-xl font-normal text-white">
                {editingProduct ? 'Edit Jewelry Piece' : 'Add New Jewelry Piece'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase font-semibold text-neutral-300 block mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Royal Radiant Solitaire Ring"
                    className="w-full bg-[#121212] border border-[#333] p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-semibold text-neutral-300 block mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="LA-7201"
                    className="w-full bg-[#121212] border border-[#333] p-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Category & Subcategory, Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs uppercase font-semibold text-neutral-300 block mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => {
                      const newCatId = e.target.value;
                      setCategoryId(newCatId);
                      const catObj = categories.find((c) => c.id === newCatId);
                      if (catObj?.subcategories?.length) {
                        setSubcategory(catObj.subcategories[0].name);
                      } else {
                        setSubcategory('');
                      }
                    }}
                    className="w-full bg-[#121212] border border-[#333] p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase font-semibold text-neutral-300 block mb-1">
                    Sub-Category (Optional)
                  </label>
                  {categories.find((c) => c.id === categoryId)?.subcategories?.length ? (
                    <select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className="w-full bg-[#121212] border border-[#333] p-2.5 text-xs text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="">None / General</option>
                      {categories
                        .find((c) => c.id === categoryId)
                        ?.subcategories?.map((sub) => (
                          <option key={sub.id} value={sub.name}>
                            {sub.name}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="e.g. Solitaire Rings"
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className="w-full bg-[#121212] border border-[#333] p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs uppercase font-semibold text-neutral-300 block mb-1">
                    Regular Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-[#121212] border border-[#333] p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-semibold text-neutral-300 block mb-1">
                    Sale Price ($) (Optional)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={salePrice || ''}
                    onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 2950"
                    className="w-full bg-[#121212] border border-[#333] p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Stock & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase font-semibold text-neutral-300 block mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full bg-[#121212] border border-[#333] p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-semibold text-neutral-300 block mb-1">
                    Publication Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                    className="w-full bg-[#121212] border border-[#333] p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="published">Published (Visible in Shop)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Homepage Sliders & Showcase Curation */}
              <div className="p-4 bg-[#141414] border border-[#2D2D2D] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Homepage Display Curation</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* New Arrival Card */}
                  <div
                    onClick={() => setIsNewArrival(!isNewArrival)}
                    className={`p-3.5 border transition-all cursor-pointer flex items-center justify-between select-none ${
                      isNewArrival
                        ? 'bg-[#2A2315] border-[#D4AF37] text-white shadow-sm shadow-[#D4AF37]/20'
                        : 'bg-[#181818] border-[#333] text-neutral-400 hover:border-neutral-500 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors ${
                          isNewArrival ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'border-neutral-600 bg-neutral-900'
                        }`}
                      >
                        {isNewArrival && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>New Arrival</span>
                      </span>
                    </div>
                    {isNewArrival && (
                      <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.5 font-bold uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Best Seller Card */}
                  <div
                    onClick={() => setIsBestSeller(!isBestSeller)}
                    className={`p-3.5 border transition-all cursor-pointer flex items-center justify-between select-none ${
                      isBestSeller
                        ? 'bg-[#2A1515] border-[#8C2D19] text-white shadow-sm shadow-[#8C2D19]/20'
                        : 'bg-[#181818] border-[#333] text-neutral-400 hover:border-neutral-500 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors ${
                          isBestSeller ? 'bg-[#8C2D19] border-[#8C2D19] text-white' : 'border-neutral-600 bg-neutral-900'
                        }`}
                      >
                        {isBestSeller && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-[#FCD34D] fill-current" />
                        <span>Best Selling</span>
                      </span>
                    </div>
                    {isBestSeller && (
                      <span className="text-[10px] bg-[#8C2D19]/40 text-[#F87171] border border-[#8C2D19] px-1.5 py-0.5 font-bold uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Featured Showcase Card */}
                  <div
                    onClick={() => setIsFeatured(!isFeatured)}
                    className={`p-3.5 border transition-all cursor-pointer flex items-center justify-between select-none ${
                      isFeatured
                        ? 'bg-[#1E1B29] border-amber-500/80 text-white shadow-sm shadow-amber-500/20'
                        : 'bg-[#181818] border-[#333] text-neutral-400 hover:border-neutral-500 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors ${
                          isFeatured ? 'bg-amber-500 border-amber-500 text-black' : 'border-neutral-600 bg-neutral-900'
                        }`}
                      >
                        {isFeatured && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Gem className="w-3.5 h-3.5 text-amber-400" />
                        <span>Featured Showcase</span>
                      </span>
                    </div>
                    {isFeatured && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 font-bold uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Jewelry Specs & Attributes */}
              <div className="p-4 bg-[#141414] border border-[#2D2D2D] space-y-4">
                <div className="pb-2 border-b border-[#262626]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Jewelry Specifications &amp; Material</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Metal Type with Dropdown Button & Input */}
                  <div className="space-y-1.5 p-3 bg-[#181818] border border-[#2A2A2A] rounded-xs">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] uppercase font-bold text-neutral-200">
                        Precious Metal *
                      </label>
                      <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 px-1.5 py-0.5 rounded-xs font-semibold">
                        Dropdown
                      </span>
                    </div>

                    {/* Metal Dropdown Button */}
                    <select
                      value={PRESET_METALS.some((m) => m.value.toLowerCase() === metalType.toLowerCase()) ? metalType : 'custom'}
                      onChange={(e) => {
                        if (e.target.value !== 'custom') {
                          setMetalType(e.target.value);
                        }
                      }}
                      className="w-full bg-[#1F1916] border border-[#3E2D25] text-[#D4AF37] hover:border-[#D4AF37] p-2 text-xs font-medium focus:border-[#D4AF37] focus:outline-none cursor-pointer rounded-xs transition-colors"
                    >
                      <option value="" disabled>-- Select Metal --</option>
                      {PRESET_METALS.map((m) => (
                        <option key={m.value} value={m.value} className="bg-[#141414] text-white">
                          {m.label}
                        </option>
                      ))}
                      <option value="custom" className="bg-[#141414] text-[#D4AF37]">
                        + Custom Metal...
                      </option>
                    </select>

                    {/* Metal editable input */}
                    <input
                      type="text"
                      value={metalType}
                      onChange={(e) => setMetalType(e.target.value)}
                      placeholder="e.g. 18k Yellow Gold"
                      className="w-full bg-[#121212] border border-[#333] p-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none rounded-xs font-mono"
                    />
                  </div>

                  {/* Stone Type with Dropdown Button & Input */}
                  <div className="space-y-1.5 p-3 bg-[#181818] border border-[#2A2A2A] rounded-xs">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] uppercase font-bold text-neutral-200">
                        Stone / Gemstone *
                      </label>
                      <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 px-1.5 py-0.5 rounded-xs font-semibold">
                        Dropdown
                      </span>
                    </div>

                    {/* Stone Dropdown Button */}
                    <select
                      value={PRESET_STONES.some((s) => s.value.toLowerCase() === stoneType.toLowerCase()) ? stoneType : 'custom'}
                      onChange={(e) => {
                        if (e.target.value !== 'custom') {
                          setStoneType(e.target.value);
                        }
                      }}
                      className="w-full bg-[#1F1916] border border-[#3E2D25] text-[#D4AF37] hover:border-[#D4AF37] p-2 text-xs font-medium focus:border-[#D4AF37] focus:outline-none cursor-pointer rounded-xs transition-colors"
                    >
                      <option value="" disabled>-- Select Stone --</option>
                      {PRESET_STONES.map((s) => (
                        <option key={s.value} value={s.value} className="bg-[#141414] text-white">
                          {s.label}
                        </option>
                      ))}
                      <option value="custom" className="bg-[#141414] text-[#D4AF37]">
                        + Custom Stone...
                      </option>
                    </select>

                    {/* Stone editable input */}
                    <input
                      type="text"
                      value={stoneType}
                      onChange={(e) => setStoneType(e.target.value)}
                      placeholder="e.g. Natural Diamond"
                      className="w-full bg-[#121212] border border-[#333] p-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none rounded-xs font-mono"
                    />
                  </div>

                  {/* Item Weight Box */}
                  <div className="space-y-1.5 p-3 bg-[#181818] border border-[#2A2A2A] rounded-xs">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] uppercase font-bold text-neutral-200 flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Item Weight</span>
                      </label>
                      <span className="text-[9px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.5 rounded-xs font-mono font-bold">
                        grams / carats
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="e.g. 5.4g or 12g"
                        className="w-full bg-[#121212] border border-[#3E2D25] focus:border-[#D4AF37] p-2 pr-12 text-xs text-white focus:outline-none rounded-xs font-mono"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 pointer-events-none font-mono">
                        Weight
                      </span>
                    </div>

                    {/* Quick Weight Presets */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {['3.5g', '5.0g', '8.4g', '14.2g', '34g'].map((wt) => (
                        <button
                          key={wt}
                          type="button"
                          onClick={() => setWeight(`${wt}`)}
                          className="px-1.5 py-0.5 text-[10px] bg-[#221C18] hover:bg-[#342721] text-neutral-300 hover:text-[#D4AF37] border border-[#3A2D25] rounded-xs cursor-pointer transition-colors"
                        >
                          {wt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color & Clarity */}
                  <div className="space-y-1.5 p-3 bg-[#181818] border border-[#2A2A2A] rounded-xs">
                    <label className="text-[11px] uppercase font-bold text-neutral-200 block">
                      Color &amp; Clarity
                    </label>
                    <input
                      type="text"
                      value={stoneColor}
                      onChange={(e) => setStoneColor(e.target.value)}
                      placeholder="e.g. E Color, VVS1 or D-F Colorless"
                      className="w-full bg-[#121212] border border-[#333] p-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none rounded-xs"
                    />
                  </div>

                  {/* Size / Dimension */}
                  <div className="space-y-1.5 p-3 bg-[#181818] border border-[#2A2A2A] rounded-xs">
                    <label className="text-[11px] uppercase font-bold text-neutral-200 block">
                      Size / Dimension
                    </label>
                    <input
                      type="text"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      placeholder="e.g. Size 6.5, 18 inches, 7.5 inch"
                      className="w-full bg-[#121212] border border-[#333] p-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none rounded-xs"
                    />
                  </div>

                  {/* Dimensions / Center Stone */}
                  <div className="space-y-1.5 p-3 bg-[#181818] border border-[#2A2A2A] rounded-xs">
                    <label className="text-[11px] uppercase font-bold text-neutral-200 block">
                      Center Stone / Diamond Carat
                    </label>
                    <input
                      type="text"
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      placeholder="e.g. 1.50 Carat Center, 8mm"
                      className="w-full bg-[#121212] border border-[#333] p-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none rounded-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="text-xs uppercase font-semibold text-neutral-300 block mb-1">
                  Description &amp; Provenance
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the jewelry piece, diamond symmetry, and workshop origins..."
                  className="w-full bg-[#121212] border border-[#333] p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Images Gallery with Main Image Designation */}
              <div className="p-4 bg-[#141414] border border-[#2D2D2D] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-[#252525]">
                  <label className="text-xs uppercase font-bold tracking-wider text-[#D4AF37] block flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Product Images ({images.length})</span>
                  </label>

                  {images[0] && (
                    <div className="inline-flex items-center gap-1.5 bg-[#1C1810] border border-[#D4AF37]/50 px-2 py-0.5 text-[10px] text-[#D4AF37]">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Main Storefront Cover</span>
                    </div>
                  )}
                </div>

                {/* Main Image Spotlight & Add Controls */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  {/* Left: Main Cover Spotlight Box */}
                  <div className="md:col-span-4 bg-[#101010] border-2 border-[#D4AF37]/70 p-3 flex flex-col items-center justify-center text-center relative group">
                    <span className="absolute top-2 left-2 bg-[#D4AF37] text-black text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 z-10 flex items-center gap-1 shadow-sm">
                      <Star className="w-2.5 h-2.5 fill-current" /> Main Cover
                    </span>
                    {images[0] ? (
                      <div className="w-full aspect-square max-h-44 overflow-hidden bg-neutral-900 mt-5 border border-neutral-800">
                        <img
                          src={images[0]}
                          alt="Main Product Cover"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-square max-h-44 bg-neutral-900 mt-5 border border-dashed border-neutral-700 flex flex-col items-center justify-center text-neutral-500 p-4">
                        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Upload Button & URL Input */}
                  <div className="md:col-span-8 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        placeholder="Paste image URL (https://...)"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        className="flex-1 bg-[#121212] border border-[#333] p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-4 py-2 bg-neutral-800 text-neutral-200 text-xs font-semibold hover:bg-neutral-700 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Add URL
                      </button>

                      <label className="px-4 py-2 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 hover:bg-[#b59226] transition-colors whitespace-nowrap">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={isUploadingImage}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* All Uploaded Images Thumbnails */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                      {images.map((img, i) => {
                        const isMain = i === 0;
                        return (
                          <div
                            key={i}
                            className={`relative aspect-square border overflow-hidden group transition-all ${
                              isMain
                                ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/40'
                                : 'border-[#333] hover:border-neutral-500'
                            }`}
                          >
                            <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />

                            {/* Badge */}
                            <div className="absolute top-1 left-1 pointer-events-none">
                              {isMain ? (
                                <span className="bg-[#D4AF37] text-black text-[9px] font-bold px-1.5 py-0.5 flex items-center gap-1 shadow-sm">
                                  <Star className="w-2.5 h-2.5 fill-current" /> Main
                                </span>
                              ) : (
                                <span className="bg-black/75 text-neutral-300 text-[9px] px-1 py-0.5 font-mono">
                                  #{i + 1}
                                </span>
                              )}
                            </div>

                            {/* Actions on hover/touch */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                              {!isMain && (
                                <button
                                  type="button"
                                  onClick={() => handleSetMainImage(i)}
                                  className="w-full py-1 bg-[#D4AF37] text-black text-[9px] font-bold uppercase tracking-wider hover:bg-yellow-400 flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <Star className="w-2.5 h-2.5 fill-current" /> Set Main
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(i)}
                                className="w-full py-1 bg-red-600/90 text-white text-[9px] font-bold uppercase tracking-wider hover:bg-red-700 flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <X className="w-2.5 h-2.5" /> Delete
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Showcase Video */}
              <div className="p-4 bg-[#141414] border border-[#2D2D2D] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-[#252525]">
                  <label className="text-xs uppercase font-bold tracking-wider text-[#D4AF37] block flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5" />
                    <span>Product Showcase Video</span>
                  </label>

                  {/* Mode switcher */}
                  <div className="flex items-center gap-1 bg-[#1A1A1A] p-0.5 border border-[#333]">
                    <button
                      type="button"
                      onClick={() => setVideoSourceType('upload')}
                      className={`px-3 py-1 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                        videoSourceType === 'upload'
                          ? 'bg-[#D4AF37] text-black'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload Video</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoSourceType('url')}
                      className={`px-3 py-1 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                        videoSourceType === 'url'
                          ? 'bg-[#D4AF37] text-black'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Video className="w-3 h-3" />
                      <span>Video URL</span>
                    </button>
                  </div>
                </div>

                {/* Input forms depending on mode */}
                {videoSourceType === 'upload' ? (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <label className="w-full sm:w-auto px-5 py-2.5 bg-neutral-800 border border-neutral-700 text-neutral-100 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-neutral-700 hover:border-[#D4AF37] transition-all flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4 text-[#D4AF37]" />
                        <span>{isVideoUploading ? 'Uploading...' : 'Choose Video'}</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/ogg,video/quicktime"
                          onChange={handleVideoFileUpload}
                          disabled={isVideoUploading}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-neutral-400">
                        MP4, WebM, MOV (Max 100MB)
                      </span>
                    </div>

                    {videoFileMeta && (
                      <div className="flex items-center justify-between p-2.5 bg-[#1C1810] border border-[#D4AF37]/40 text-xs text-white">
                        <div className="flex items-center gap-2">
                          <Film className="w-4 h-4 text-[#D4AF37]" />
                          <span className="font-medium truncate max-w-xs">{videoFileMeta.name}</span>
                          <span className="text-[10px] text-neutral-400 font-mono">({videoFileMeta.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleClearVideo}
                          className="text-neutral-400 hover:text-rose-400 text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-neutral-400 block mb-1">
                          Direct Video URL (MP4, WebM)
                        </label>
                        <input
                          type="url"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="https://.../jewelry-showcase.mp4"
                          className="w-full bg-[#121212] border border-[#333] p-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-neutral-400 block mb-1">
                          Poster Image URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={videoPoster}
                          onChange={(e) => setVideoPoster(e.target.value)}
                          placeholder="https://.../video-poster.jpg"
                          className="w-full bg-[#121212] border border-[#333] p-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Video Player Preview if a video is added */}
                {videoUrl && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] uppercase font-semibold text-[#D4AF37] flex items-center gap-1">
                        <Play className="w-3 h-3 fill-current" /> Video Preview
                      </span>
                      <button
                        type="button"
                        onClick={handleClearVideo}
                        className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3 h-3" /> Remove Video
                      </button>
                    </div>
                    <div className="relative aspect-video max-w-md bg-black border border-neutral-800 overflow-hidden shadow-md">
                      <video
                        src={videoUrl}
                        poster={videoPoster || images[0]}
                        controls
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#2D2D2D] flex items-center justify-between gap-3">
                {editingProduct ? (
                  <button
                    type="button"
                    onClick={() => {
                      const prod = editingProduct;
                      setIsModalOpen(false);
                      setProductToDelete(prod);
                    }}
                    className="px-3.5 py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-800/80 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-rose-400" />
                    <span>Delete Product</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 border border-[#444] text-neutral-300 text-xs font-semibold hover:border-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
                  >
                    Save Creation
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom In-App Delete Confirmation Modal (Reliable in all browsers & iframes) */}
      {productToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#181210] border border-[#3E2D25] text-white p-6 w-full max-w-md shadow-2xl space-y-4 relative">
            <button
              type="button"
              onClick={() => setProductToDelete(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-full bg-rose-950/80 border border-rose-700/80 flex items-center justify-center shrink-0 text-rose-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="pr-6">
                <h3 className="font-serif text-lg font-medium text-white">
                  Confirm Product Deletion
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Are you sure you want to permanently delete this product?
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#120E0C] border border-[#2D211B] flex items-center gap-3">
              <div className="w-14 h-14 bg-neutral-900 border border-[#2D211B] overflow-hidden shrink-0">
                <img
                  src={
                    productToDelete.images[0] ||
                    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=300&auto=format&fit=crop'
                  }
                  alt={productToDelete.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">{productToDelete.name}</p>
                <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                  SKU: <span className="text-neutral-200">{productToDelete.sku}</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[#D4AF37] font-semibold text-xs">
                    ${productToDelete.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase px-1.5 py-0.5 bg-black/60 border border-[#2D211B]">
                    {productToDelete.subcategory || productToDelete.categoryId}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-rose-400/90 font-mono bg-rose-950/20 p-2.5 border border-rose-900/30">
              ⚠️ This will permanently remove the item from the catalog and storefront.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#261E1A]">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 border border-[#3E2D25] hover:border-neutral-500 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmDeleteProduct(productToDelete)}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-rose-900/30"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
