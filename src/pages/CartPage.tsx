import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartTax,
    cartShipping,
    cartTotal,
    navigateTo,
    siteSettings,
    promoCode,
    applyPromoCode,
  } = useApp();

  const [promoInput, setPromoInput] = useState('');

  const freeShippingLeft = Math.max(0, siteSettings.freeShippingThreshold - cartSubtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromoCode(promoInput);
      setPromoInput('');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-neutral-200 pb-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-neutral-900">
              Your Shopping Bag
            </h1>
            <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
              {cartCount} {cartCount === 1 ? 'Creation Selected' : 'Creations Selected'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('shop')}
            className="mt-3 sm:mt-0 text-xs font-semibold text-neutral-700 hover:text-[#997C24] flex items-center gap-1.5 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Browsing
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white border border-neutral-200 p-16 text-center space-y-4 max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-[#FAF9F5] mx-auto flex items-center justify-center text-neutral-400">
              <ShoppingBag className="w-8 h-8 text-[#997C24]" />
            </div>
            <h2 className="font-serif text-2xl font-normal text-neutral-900">
              Your Bag is Currently Empty
            </h2>
            <p className="text-sm text-neutral-500 font-light leading-relaxed">
              Explore our fine jewelry suites, certified diamonds, and gold collections to select heirloom pieces.
            </p>
            <button
              type="button"
              onClick={() => navigateTo('shop')}
              className="mt-4 px-8 py-3.5 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-[0.2em] transition-colors"
            >
              Explore Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Shipping threshold notice */}
              <div className="p-4 bg-white border border-neutral-200 text-xs flex items-center justify-between">
                <span className="text-neutral-700">
                  {freeShippingLeft > 0 ? (
                    <>
                      Add <strong className="text-[#997C24]">${freeShippingLeft.toLocaleString()}</strong> more for complimentary armored shipping
                    </>
                  ) : (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Complimentary Armored Shipping Unlocked
                    </span>
                  )}
                </span>
                <span className="text-neutral-400 text-[11px] hidden sm:inline">Signature Required</span>
              </div>

              {/* Items Table */}
              <div className="bg-white border border-neutral-200 divide-y divide-neutral-100">
                {cart.map((item, idx) => {
                  const unitPrice = item.product.salePrice || item.product.price;
                  return (
                    <div
                      key={`${item.product.id}-${idx}`}
                      className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                    >
                      {/* Product Info */}
                      <div className="flex gap-4 items-center">
                        <img
                          src={item.product.thumbnail || item.product.images[0]}
                          alt={item.product.name}
                          className="w-24 h-24 object-cover border border-neutral-200 flex-shrink-0 cursor-pointer"
                          onClick={() => navigateTo('product-details', { productId: item.product.id })}
                        />
                        <div>
                          <span className="text-[11px] text-[#8C827A] uppercase tracking-wider block">
                            {item.product.categoryName}
                          </span>
                          <h3
                            onClick={() => navigateTo('product-details', { productId: item.product.id })}
                            className="font-serif text-lg font-medium text-neutral-900 hover:text-[#997C24] cursor-pointer"
                          >
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-neutral-500 mt-1">
                            {item.selectedMetal || item.product.metalType}
                            {item.selectedSize ? ` • Size ${item.selectedSize}` : ''}
                          </p>
                          <p className="text-xs font-mono text-neutral-400 mt-0.5">
                            SKU: {item.product.sku}
                          </p>
                        </div>
                      </div>

                      {/* Controls & Price */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-4">
                        <span className="font-serif text-lg font-bold text-neutral-900">
                          ${(unitPrice * item.quantity).toLocaleString()}
                        </span>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-neutral-300">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-xs font-semibold">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-neutral-400 hover:text-rose-600 p-1.5"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-neutral-200 p-6 space-y-5 shadow-xs">
                <h2 className="font-serif text-xl font-normal text-neutral-900 border-b border-neutral-200 pb-3">
                  Summary of Order
                </h2>

                {/* Promo Input */}
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Promo Code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-neutral-200 text-xs px-3 py-2.5 pl-9 uppercase placeholder:normal-case focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider"
                  >
                    Apply
                  </button>
                </form>

                {promoCode && (
                  <div className="text-xs text-[#997C24] font-medium flex items-center justify-between bg-[#D4AF37]/10 p-2.5">
                    <span>Code &quot;{promoCode}&quot; Applied</span>
                    <span>-${cartDiscount.toLocaleString()}</span>
                  </div>
                )}

                {/* Numbers breakdown */}
                <div className="space-y-2 text-xs text-neutral-600 border-t border-neutral-100 pt-4">
                  <div className="flex justify-between">
                    <span>Merchandise Subtotal</span>
                    <span className="font-semibold text-neutral-900">${cartSubtotal.toLocaleString()}</span>
                  </div>
                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-[#997C24]">
                      <span>Discount</span>
                      <span>-${cartDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Armored Courier Shipping</span>
                    <span>{cartShipping === 0 ? 'Complimentary' : `$${cartShipping}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sales Tax ({siteSettings.taxRatePercent}%)</span>
                    <span>${cartTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-serif font-bold text-neutral-900 pt-3 border-t border-neutral-200">
                    <span>Total Valuation</span>
                    <span>${cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigateTo('checkout')}
                  className="w-full py-4 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-[0.22em] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center text-[11px] text-neutral-400 flex items-center justify-center gap-1.5 pt-2">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>256-Bit SSL Encrypted Transaction</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
