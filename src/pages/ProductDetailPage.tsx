import React, { useState } from 'react';
import {
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Play,
  Check,
  Share2,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { db } from '../services/databaseService';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo,
    showToast,
  } = useApp();

  // Find product or fallback to first
  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>(product?.size || '');
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'returns'>('desc');
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Reviews state
  const allReviews = db.getReviews();
  const productReviews = allReviews.filter((r) => r.productId === product.id && r.isApproved);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!product) {
    return (
      <div className="py-24 text-center">
        <p className="font-serif text-2xl text-neutral-800">Product not found.</p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-4 px-6 py-2.5 bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-wider"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  // Combine media: images + videos
  const allMedia = [
    ...product.images.map((url) => ({ type: 'image' as const, url })),
    ...(product.videos?.map((v) => ({
      type: 'video' as const,
      url: v.url,
      poster: v.poster || product.thumbnail,
      title: v.title,
    })) || []),
  ];

  const currentMedia = allMedia[activeMediaIndex] || { type: 'image', url: product.thumbnail };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize || product.size);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize || product.size);
    navigateTo('checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard.', 'info');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      showToast('Please provide your name and review remarks.', 'error');
      return;
    }
    db.addReview({
      productId: product.id,
      productName: product.name,
      customerName: newReviewAuthor.trim(),
      rating: newReviewRating,
      title: newReviewTitle.trim() || 'Exquisite piece',
      comment: newReviewComment.trim(),
      verifiedPurchase: true,
    });
    showToast('Thank you for sharing your jewelry appraisal review.', 'success');
    setShowReviewForm(false);
    setNewReviewAuthor('');
    setNewReviewTitle('');
    setNewReviewComment('');
  };

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAF9F5] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="text-xs uppercase tracking-widest text-[#8C827A] flex items-center gap-2 mb-8">
          <button onClick={() => navigateTo('home')} className="hover:text-black">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigateTo('shop')} className="hover:text-black">
            Shop
          </button>
          <span>/</span>
          <button
            onClick={() => navigateTo('shop', { categorySlug: product.categoryId })}
            className="hover:text-black"
          >
            {product.categoryName}
          </button>
          <span>/</span>
          <span className="text-neutral-900 font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Product Showcase (Left: Media Gallery, Right: Details) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white border border-neutral-200 p-6 sm:p-10 shadow-xs mb-16">
          {/* Left Media Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails Sidebar */}
            {allMedia.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[560px] pb-2 md:pb-0 flex-shrink-0">
                {allMedia.map((media, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`relative w-20 h-20 flex-shrink-0 border-2 overflow-hidden bg-neutral-50 transition-colors ${
                      activeMediaIndex === idx ? 'border-[#D4AF37]' : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {media.type === 'video' ? (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    ) : (
                      <img src={media.url} alt="thumbnail" className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Media with Interactive Zoom Lens */}
            <div className="flex-1">
              <div
                className="relative aspect-square w-full bg-[#FAF9F5] border border-neutral-200 overflow-hidden flex items-center justify-center cursor-crosshair group"
                onMouseEnter={() => currentMedia.type === 'image' && setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                {currentMedia.type === 'video' ? (
                  <div className="w-full h-full bg-black">
                    <video
                      src={currentMedia.url}
                      poster={currentMedia.poster}
                      controls
                      autoPlay
                      muted
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <img
                    src={currentMedia.url}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-200"
                    style={
                      isZoomed
                        ? {
                            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                            transform: 'scale(2.2)',
                          }
                        : undefined
                    }
                  />
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                  {hasDiscount && (
                    <span className="bg-[#997C24] text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 shadow-md">
                      Special Reserve
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="bg-neutral-900 text-[#E5D7B7] text-[10px] uppercase font-bold tracking-widest px-3 py-1 shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Signature
                    </span>
                  )}
                </div>

                {currentMedia.type === 'image' && !isZoomed && (
                  <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md text-white/80 text-[10px] px-2.5 py-1 tracking-wider uppercase pointer-events-none">
                    Hover to Magnify
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Product Specifications & Purchasing (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Category, SKU & Share */}
              <div className="flex items-center justify-between text-xs text-[#8C827A] uppercase tracking-widest mb-1">
                <span>{product.categoryName} • {product.brand}</span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1 text-neutral-500 hover:text-black"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-neutral-900 leading-tight">
                {product.name}
              </h1>

              {/* SKU & Stock */}
              <div className="flex items-center gap-4 text-xs text-neutral-500 mt-2 font-mono">
                <span>SKU: {product.sku}</span>
                <span>•</span>
                <span className="text-emerald-600 font-sans font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock ({product.stockQuantity} available)
                </span>
              </div>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.rating) ? 'fill-current' : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-neutral-700">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-xs text-neutral-400">
                  ({product.reviewsCount} verified reviews)
                </span>
              </div>

              {/* Price & Savings */}
              <div className="mt-5 p-4 bg-[#FAF9F5] border border-neutral-200/80 flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-neutral-500 block mb-0.5">
                    Atelier Price
                  </span>
                  <div className="flex items-baseline gap-3">
                    {hasDiscount ? (
                      <>
                        <span className="font-serif text-3xl font-bold text-neutral-900">
                          ${product.salePrice?.toLocaleString()}
                        </span>
                        <span className="text-sm text-neutral-400 line-through">
                          ${product.price.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="font-serif text-3xl font-bold text-neutral-900">
                        ${product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {hasDiscount && (
                  <span className="text-xs font-semibold text-[#997C24]">
                    Save ${(product.price - (product.salePrice || 0)).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="mt-5 text-sm text-neutral-600 leading-relaxed font-light">
                {product.shortDescription || product.description}
              </p>

              {/* Options (Size / Metal) */}
              <div className="space-y-4 mt-6 pt-4 border-t border-neutral-100">
                {product.size && (
                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-neutral-800 block mb-1.5">
                      Selected Dimension / Size
                    </label>
                    <div className="p-2.5 bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-800">
                      {product.size} (Complimentary custom sizing available on request)
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mt-6 flex items-center gap-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-700">
                  Quantity
                </span>
                <div className="flex items-center border border-neutral-300 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 text-neutral-700 hover:bg-neutral-100 font-semibold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-bold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="px-3.5 py-2 text-neutral-700 hover:bg-neutral-100 font-semibold"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 border transition-colors ml-auto flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium ${
                    isSaved
                      ? 'border-[#D4AF37] bg-[#D4AF37] text-white'
                      : 'border-neutral-300 text-neutral-700 hover:border-black'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  <span>{isSaved ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>

              {/* Purchase Buttons */}
              <div className="space-y-3 mt-6">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-[0.22em] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-[0.22em] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#D4AF37]" />
                  <span>Immediate Direct Checkout</span>
                </button>
              </div>

              {/* Assurance badges */}
              <div className="pt-6 border-t border-neutral-100 grid grid-cols-2 gap-3 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Free Armored Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Appraisal Certificate</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#D4AF37]" />
                  <span>30-Day Inspection Return</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Lifetime Maintenance</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs (Description, Specifications, Armored Shipping, Returns) */}
        <div className="bg-white border border-neutral-200 mb-16">
          {/* Tab Navigation */}
          <div className="flex border-b border-neutral-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('desc')}
              className={`px-6 py-4 text-xs uppercase tracking-widest font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'desc'
                  ? 'border-[#D4AF37] text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              Description &amp; Origin
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-6 py-4 text-xs uppercase tracking-widest font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'border-[#D4AF37] text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              Gemological Specifications
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`px-6 py-4 text-xs uppercase tracking-widest font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'shipping'
                  ? 'border-[#D4AF37] text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              Armored Shipping
            </button>
            <button
              onClick={() => setActiveTab('returns')}
              className={`px-6 py-4 text-xs uppercase tracking-widest font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'returns'
                  ? 'border-[#D4AF37] text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-black'
              }`}
            >
              Returns &amp; Appraisal
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {activeTab === 'desc' && (
              <div className="max-w-3xl space-y-4 text-sm text-neutral-700 leading-relaxed font-light">
                <p>{product.description}</p>
                <p>
                  Handcrafted with meticulous precision at our Broadway atelier in Downtown Los Angeles. Every facet is inspected under gemological magnification to guarantee unparalleled fire, symmetry, and brilliance.
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-2xl">
                <table className="w-full text-xs text-neutral-700 divide-y divide-neutral-200">
                  <tbody className="divide-y divide-neutral-100">
                    <tr className="py-2.5 flex justify-between">
                      <td className="font-semibold text-neutral-900">Stock Keeping Unit (SKU)</td>
                      <td className="font-mono text-neutral-600">{product.sku}</td>
                    </tr>
                    <tr className="py-2.5 flex justify-between">
                      <td className="font-semibold text-neutral-900">Primary Precious Metal</td>
                      <td className="text-neutral-600">{product.metalType}</td>
                    </tr>
                    <tr className="py-2.5 flex justify-between">
                      <td className="font-semibold text-neutral-900">Primary Gemstone / Stone</td>
                      <td className="text-neutral-600">{product.stoneType}</td>
                    </tr>
                    {product.stoneColor && (
                      <tr className="py-2.5 flex justify-between">
                        <td className="font-semibold text-neutral-900">Stone Color &amp; Grade</td>
                        <td className="text-neutral-600">{product.stoneColor}</td>
                      </tr>
                    )}
                    {product.weight && (
                      <tr className="py-2.5 flex justify-between">
                        <td className="font-semibold text-neutral-900">Total Weight</td>
                        <td className="text-neutral-600">{product.weight}</td>
                      </tr>
                    )}
                    {product.dimensions && (
                      <tr className="py-2.5 flex justify-between">
                        <td className="font-semibold text-neutral-900">Dimensions</td>
                        <td className="text-neutral-600">{product.dimensions}</td>
                      </tr>
                    )}
                    <tr className="py-2.5 flex justify-between">
                      <td className="font-semibold text-neutral-900">Atelier Hallmark</td>
                      <td className="text-neutral-600">{product.brand}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed font-light">
                <h4 className="font-serif text-lg font-medium text-neutral-900">
                  Discreet &amp; Insured High-Value Delivery
                </h4>
                <p>
                  All purchases over $500 are dispatched via insured armored courier (FedEx Priority Alert / Malca-Amit or Brinks for ultra-high jewelry) with direct adult signature required.
                </p>
                <p>
                  Your jewelry arrives in our signature dark lacquer presentation box, sealed with tamper-evident security tape, accompanied by official gemological certificates and insurance valuation documentation.
                </p>
              </div>
            )}

            {activeTab === 'returns' && (
              <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed font-light">
                <h4 className="font-serif text-lg font-medium text-neutral-900">
                  30-Day Inspection &amp; Appraisal Guarantee
                </h4>
                <p>
                  We provide a 30-day appraisal return policy on all non-custom jewelry pieces in their original, unworn condition with intact security tags and original lab certification cards.
                </p>
                <p>
                  Should you require resizing, our Broadway Los Angeles goldsmiths provide one complimentary resizing within the first year of ownership.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white border border-neutral-200 p-6 sm:p-10 mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200">
            <div>
              <h3 className="font-serif text-2xl font-normal text-neutral-900">
                Atelier Client Reviews ({productReviews.length})
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Verified reviews from patrons who acquired this piece.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-[#D4AF37] hover:text-black text-white text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          {/* New Review Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="mb-10 p-6 bg-[#FAF9F5] border border-neutral-200 max-w-2xl space-y-4">
              <h4 className="font-serif text-base font-semibold text-neutral-900">
                Share Your Jewelry Acquisition Experience
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase font-medium text-neutral-700 block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder="e.g. Katherine M."
                    className="w-full bg-white border border-neutral-300 p-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase font-medium text-neutral-700 block mb-1">
                    Rating
                  </label>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="w-full bg-white border border-neutral-300 p-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value={5}>5 Stars - Exceptional Brilliance</option>
                    <option value={4}>4 Stars - High Quality</option>
                    <option value={3}>3 Stars - Satisfactory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase font-medium text-neutral-700 block mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  placeholder="e.g. Magnificent diamond setting"
                  className="w-full bg-white border border-neutral-300 p-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-xs uppercase font-medium text-neutral-700 block mb-1">
                  Comments &amp; Impressions
                </label>
                <textarea
                  rows={4}
                  required
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Describe the craftsmanship, brilliance, and showroom experience..."
                  className="w-full bg-white border border-neutral-300 p-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-wider"
              >
                Submit Review
              </button>
            </form>
          )}

          {/* Existing Reviews List */}
          {productReviews.length > 0 ? (
            <div className="space-y-6 divide-y divide-neutral-100">
              {productReviews.map((rev) => (
                <div key={rev.id} className="pt-6 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm text-neutral-900">{rev.customerName}</span>
                      {rev.verifiedPurchase && (
                        <span className="text-[10px] uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                          Verified Collector
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-neutral-400">{rev.date}</span>
                  </div>

                  <div className="flex text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-neutral-200'}`}
                      />
                    ))}
                  </div>

                  {rev.title && <h5 className="text-xs font-bold text-neutral-800">{rev.title}</h5>}
                  <p className="text-xs text-neutral-600 leading-relaxed font-light">{rev.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-500 py-6 text-center">
              Be the first to record a client testimonial for this creation.
            </p>
          )}
        </div>

        {/* Related Creations */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="mb-6">
              <span className="text-[11px] uppercase tracking-[0.26em] font-semibold text-[#997C24] block mb-1">
                Atelier Recommendations
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-neutral-900">
                Complementary Creations
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
