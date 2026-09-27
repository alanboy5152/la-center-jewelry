import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Gem,
  Package,
  Heart,
  LogOut,
  Save,
  Check,
  Calendar,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export const CustomerProfilePage: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    logoutUser,
    orders,
    wishlistIds,
    products,
    navigateTo,
  } = useApp();

  // If not logged in, prompt sign in
  if (!currentUser) {
    return (
      <div className="py-20 px-4 max-w-lg mx-auto text-center">
        <div className="w-14 h-14 rounded-full bg-[#FAF0E6] text-[#997C24] flex items-center justify-center mx-auto mb-4">
          <User className="w-7 h-7" />
        </div>
        <h2 className="font-serif text-2xl font-normal text-neutral-900 mb-2">
          Patron Profile Access
        </h2>
        <p className="text-xs text-neutral-600 mb-6">
          Please sign up or sign in to your personal client profile to view your saved jewelry sizing, preferences, and orders.
        </p>
        <button
          type="button"
          onClick={() => navigateTo('customer-auth')}
          className="px-6 py-2.5 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#b8952b] cursor-pointer"
        >
          Sign In / Create Profile
        </button>
      </div>
    );
  }

  // Active Tab: 'profile' | 'orders' | 'sizing'
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'sizing'>('profile');

  // Local edit states
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [preferredMetal, setPreferredMetal] = useState(currentUser.preferredMetal || '18k Yellow Gold');
  const [ringSize, setRingSize] = useState(currentUser.ringSize || '7.0');
  const [dateOfBirth, setDateOfBirth] = useState(currentUser.dateOfBirth || '');
  const [anniversaryDate, setAnniversaryDate] = useState(currentUser.anniversaryDate || '');

  // Address
  const [street, setStreet] = useState(currentUser.address?.street || '');
  const [city, setCity] = useState(currentUser.address?.city || '');
  const [state, setState] = useState(currentUser.address?.state || 'CA');
  const [zip, setZip] = useState(currentUser.address?.zip || '');

  // User's past orders
  const userOrders = orders.filter(
    (o) => o.customer.email.toLowerCase() === currentUser.email.toLowerCase()
  );

  // Wishlist products
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      phone: phone.trim() || undefined,
      preferredMetal,
      ringSize,
      dateOfBirth: dateOfBirth || undefined,
      anniversaryDate: anniversaryDate || undefined,
      address: {
        street,
        city,
        state,
        zip,
        country: 'United States',
      },
    });
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FAF9F5] text-neutral-900 min-h-[85vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-200">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="hover:text-black cursor-pointer"
              >
                Home
              </button>
              <span>/</span>
              <span className="text-neutral-900 font-medium">Patron Salon</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-neutral-900">
              {currentUser.name}’s Profile
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Client Member since {new Date(currentUser.createdAt).toLocaleDateString()} • Verified Patron
            </p>
          </div>

          <button
            type="button"
            onClick={logoutUser}
            className="px-4 py-2 border border-neutral-300 hover:border-neutral-500 text-neutral-700 hover:text-black text-xs uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* 3-Tab Selector */}
        <div className="flex gap-2 sm:gap-4 border-b border-neutral-200 pb-px mb-8 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-[#D4AF37] text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            <User className="w-4 h-4 text-[#D4AF37]" />
            <span>Personal Profile &amp; Address</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sizing')}
            className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sizing'
                ? 'border-[#D4AF37] text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            <Gem className="w-4 h-4 text-[#D4AF37]" />
            <span>Jewelry Sizing &amp; Atelier Vault</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#D4AF37] text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            <Package className="w-4 h-4 text-[#D4AF37]" />
            <span>My Orders ({userOrders.length})</span>
          </button>
        </div>

        {/* TAB 1: PERSONAL PROFILE & ADDRESS */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <h2 className="font-serif text-xl font-medium text-neutral-900 pb-2 border-b border-neutral-100">
                Contact &amp; Personal Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-neutral-700 tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:bg-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-neutral-700 tracking-wider mb-1.5">
                    Email Address (Registered)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full bg-neutral-100 border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-neutral-700 tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (213) 555-0199"
                  className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:bg-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <h3 className="font-serif text-lg font-medium text-neutral-900 pt-4 pb-2 border-b border-neutral-100">
                Default Atelier Delivery Address
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-neutral-700 tracking-wider mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. 650 S Hill St #402"
                    className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:bg-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-neutral-700 tracking-wider mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Los Angeles"
                      className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:bg-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-semibold text-neutral-700 tracking-wider mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="CA"
                      className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:bg-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-semibold text-neutral-700 tracking-wider mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="90014"
                      className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:bg-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  id="save-profile-btn"
                  className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#b8952b] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Profile</span>
                </button>
              </div>
            </div>

            {/* Sidebar Patron Card */}
            <div className="space-y-6">
              <div className="bg-[#18120E] text-white p-6 border border-[#3E2D25] shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
                <span className="px-2 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest block w-fit mb-4">
                  Atelier Patron
                </span>
                <p className="font-serif text-2xl text-white font-normal mb-1">{currentUser.name}</p>
                <p className="text-xs text-neutral-400 font-mono mb-4">{currentUser.email}</p>
                <div className="border-t border-[#2F211A] pt-3 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Preferred Metal:</span>
                    <span className="text-[#E5D7B7] font-medium">{currentUser.preferredMetal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Ring Size:</span>
                    <span className="text-[#E5D7B7] font-medium">US {currentUser.ringSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Total Orders:</span>
                    <span className="text-white font-bold">{userOrders.length}</span>
                  </div>
                </div>
              </div>

              {/* Wishlist quick peek */}
              <div className="bg-white border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif text-base font-medium text-neutral-900 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-[#D4AF37]" />
                    <span>Saved Wishlist</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => navigateTo('wishlist')}
                    className="text-[11px] text-[#997C24] hover:underline"
                  >
                    View All ({wishlistIds.length})
                  </button>
                </div>
                {wishlistProducts.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {wishlistProducts.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => navigateTo('product-details', { productId: item.id })}
                        className="cursor-pointer border border-neutral-100 hover:border-[#D4AF37] transition-colors"
                      >
                        <img
                          src={item.thumbnail || item.images[0]}
                          alt={item.name}
                          className="w-full h-16 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400">Your wishlist is currently empty.</p>
                )}
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: JEWELRY SIZING & ATELIER VAULT */}
        {activeTab === 'sizing' && (
          <form onSubmit={handleSaveProfile} className="bg-white border border-neutral-200 p-6 sm:p-8 max-w-3xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="font-serif text-xl font-medium text-neutral-900">
                  Jewelry Sizing &amp; Special Milestones
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  We use these details for tailor-fit ring adjustments and curated anniversary reminders.
                </p>
              </div>
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase font-semibold text-neutral-700 tracking-wider mb-2">
                  Preferred Precious Metal
                </label>
                <select
                  value={preferredMetal}
                  onChange={(e) => setPreferredMetal(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:bg-white focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="18k Yellow Gold">18k Yellow Gold</option>
                  <option value="14k Yellow Gold">14k Yellow Gold</option>
                  <option value="18k White Gold">18k White Gold</option>
                  <option value="Platinum (950)">Platinum (950)</option>
                  <option value="18k Rose Gold">18k Rose Gold</option>
                  <option value="925 Sterling Silver">925 Sterling Silver</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-neutral-700 tracking-wider mb-2">
                  Finger / Ring Size (US Standard)
                </label>
                <select
                  value={ringSize}
                  onChange={(e) => setRingSize(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:bg-white focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="4.0">Size 4.0 (14.9 mm)</option>
                  <option value="4.5">Size 4.5 (15.3 mm)</option>
                  <option value="5.0">Size 5.0 (15.7 mm)</option>
                  <option value="5.5">Size 5.5 (16.1 mm)</option>
                  <option value="6.0">Size 6.0 (16.5 mm)</option>
                  <option value="6.5">Size 6.5 (16.9 mm)</option>
                  <option value="7.0">Size 7.0 (17.3 mm - Standard)</option>
                  <option value="7.5">Size 7.5 (17.7 mm)</option>
                  <option value="8.0">Size 8.0 (18.1 mm)</option>
                  <option value="8.5">Size 8.5 (18.5 mm)</option>
                  <option value="9.0">Size 9.0 (18.9 mm)</option>
                  <option value="9.5">Size 9.5 (19.4 mm)</option>
                  <option value="10.0">Size 10.0 (19.8 mm)</option>
                  <option value="10.5">Size 10.5 (20.2 mm)</option>
                  <option value="11.0">Size 11.0 (20.6 mm)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs uppercase font-semibold text-neutral-700 tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Birthday (Optional)</span>
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:bg-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-neutral-700 tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Wedding / Anniversary Date (Optional)</span>
                </label>
                <input
                  type="date"
                  value={anniversaryDate}
                  onChange={(e) => setAnniversaryDate(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 focus:bg-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#b8952b] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Sizing Preferences</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {userOrders.length > 0 ? (
              userOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-neutral-900">
                        {order.orderNumber}
                      </span>
                      <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item(s)
                    </p>
                    <div className="flex gap-2 pt-2">
                      {order.items.map((item, idx) => (
                        <img
                          key={idx}
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover border border-neutral-200"
                          title={item.name}
                        />
                      ))}
                    </div>

                    {/* Thank You & Dispatch Status Notice */}
                    <div className="mt-3 p-3 bg-[#FAF8F5] border border-[#E8DFC9] rounded-xs text-xs text-neutral-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-[#997C24] font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          {order.status === 'shipped'
                            ? 'Order Dispatched & Shipped'
                            : 'Thank you for your purchase!'}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-600">
                        {order.status === 'shipped'
                          ? 'Your purchased items have been dispatched with official invoice via fully insured courier and will arrive shortly.'
                          : 'Your order is being prepared and will be dispatched shortly. Your invoice is ready.'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-neutral-500">Order Total</p>
                    <p className="font-serif text-xl font-medium text-neutral-900">
                      ${order.total.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-neutral-400 block mt-1">
                      Payment Method: {order.paymentMethod}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-neutral-200 p-12 text-center max-w-lg mx-auto">
                <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                <h4 className="font-serif text-lg text-neutral-800">No Orders Yet</h4>
                <p className="text-xs text-neutral-500 mt-1 mb-5">
                  Browse our fine diamond collections and bespoke jewelry creations to place your first atelier order.
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo('shop')}
                  className="px-6 py-2.5 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider"
                >
                  Explore Collection
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
