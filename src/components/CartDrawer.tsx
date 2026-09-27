import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
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

  if (!isCartDrawerOpen) return null;

  const freeShippingLeft = Math.max(0, siteSettings.freeShippingThreshold - cartSubtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromoCode(promoInput);
      setPromoInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-full max-w-md bg-[#FAF9F5] shadow-2xl flex flex-col border-l border-neutral-200">
          {/* Header */}
          <div className="p-5 sm:p-6 bg-white border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#997C24]" />
              <h2 className="font-serif text-xl font-normal text-neutral-900 tracking-wide">
                Shopping Bag ({cartCount})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-black rounded-full"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#1C1C1C] text-white px-6 py-2.5 text-xs text-center border-b border-neutral-800">
            {freeShippingLeft > 0 ? (
              <p>
                Add <span className="font-semibold text-[#D4AF37]">${freeShippingLeft.toLocaleString()}</span> more to unlock Complimentary Armored Courier
              </p>
            ) : (
              <p className="text-[#E5D7B7] font-semibold flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                You have qualified for Complimentary Insured Courier
              </p>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-200/60 mx-auto flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-serif text-lg text-neutral-800">Your bag is empty</p>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                    Explore our Los Angeles boutique collections to select timeless diamond pieces.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigateTo('shop');
                  }}
                  className="px-6 py-3 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Explore Creations
                </button>
              </div>
            ) : (
              cart.map((item, idx) => {
                const unitPrice = item.product.salePrice || item.product.price;
                return (
                  <div
                    key={`${item.product.id}-${idx}`}
                    className="flex gap-4 p-3.5 bg-white border border-neutral-200/80 shadow-xs"
                  >
                    {/* Item Image */}
                    <img
                      src={item.product.thumbnail || item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover flex-shrink-0 border border-neutral-100"
                    />

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-sm text-neutral-900 line-clamp-1 leading-snug">
                            {item.product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-neutral-400 hover:text-red-600 p-0.5 ml-2"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          {item.selectedMetal || item.product.metalType}
                          {item.selectedSize ? ` • Size ${item.selectedSize}` : ''}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-100">
                        {/* Quantity */}
                        <div className="flex items-center border border-neutral-200 text-xs">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-neutral-600 hover:bg-neutral-100"
                          >
                            -
                          </button>
                          <span className="px-2.5 font-medium">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-neutral-600 hover:bg-neutral-100"
                          >
                            +
                          </button>
                        </div>

                        {/* Price Subtotal */}
                        <span className="font-serif text-sm font-semibold text-neutral-900">
                          ${(unitPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Calculations & Actions */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 bg-white border-t border-neutral-200 space-y-4">
              {/* Promo code */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Promo code (e.g. BROADWAY)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-neutral-200 text-xs px-3 py-2 pl-8 uppercase placeholder:normal-case focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Apply
                </button>
              </form>

              {promoCode && (
                <div className="text-[11px] text-[#997C24] font-medium flex items-center justify-between bg-[#D4AF37]/10 px-2.5 py-1">
                  <span>Privilege &quot;{promoCode}&quot; Active</span>
                  <span>-${cartDiscount.toLocaleString()}</span>
                </div>
              )}

              {/* Subtotals */}
              <div className="space-y-1.5 text-xs text-neutral-600 border-t border-neutral-100 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-900">${cartSubtotal.toLocaleString()}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#997C24]">
                    <span>Discount Privilege</span>
                    <span>-${cartDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>{cartShipping === 0 ? 'Complimentary' : `$${cartShipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax ({siteSettings.taxRatePercent}%)</span>
                  <span>${cartTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Estimated Total</span>
                  <span>${cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigateTo('checkout');
                  }}
                  className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigateTo('cart');
                  }}
                  className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  View Full Bag
                </button>
              </div>

              <div className="text-center text-[10px] text-neutral-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>256-Bit Encrypted Secure Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
