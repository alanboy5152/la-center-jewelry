import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { ToastContainer } from './components/ToastContainer';
import { WhatsAppChatbot } from './components/WhatsAppChatbot';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { WishlistPage } from './pages/WishlistPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { PolicyPage } from './pages/PolicyPages';
import { CustomerAuthPage } from './pages/CustomerAuthPage';
import { CustomerProfilePage } from './pages/CustomerProfilePage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const MainRouter: React.FC = () => {
  const { currentRoute, isAdminLoggedIn, siteSettings } = useApp();

  // Keep page title synchronized
  useEffect(() => {
    document.title = `${siteSettings.businessName} | Fine Jewelry & Luxury Atelier`;
  }, [siteSettings.businessName]);

  // Handle Admin view without storefront header/footer for distraction-free management
  if (currentRoute === 'admin-dashboard') {
    return (
      <div className="min-h-screen bg-[#121212] text-white overflow-x-hidden w-full max-w-full">
        {isAdminLoggedIn ? <AdminDashboardPage /> : <AdminLoginPage />}
        <ToastContainer />
      </div>
    );
  }

  if (currentRoute === 'admin-login') {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex flex-col justify-center items-center w-full max-w-full">
        <main className="w-full max-w-full flex-1 flex items-center justify-center">
          <AdminLoginPage />
        </main>
        <ToastContainer />
      </div>
    );
  }

  // Render storefront route
  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product-details':
        return <ProductDetailPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'search':
        return <SearchResultsPage />;
      case 'privacy-policy':
        return <PolicyPage type="privacy" />;
      case 'terms-conditions':
        return <PolicyPage type="terms" />;
      case 'shipping-policy':
        return <PolicyPage type="shipping" />;
      case 'return-policy':
        return <PolicyPage type="returns" />;
      case 'customer-auth':
        return <CustomerAuthPage />;
      case 'customer-account':
        return <CustomerProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-neutral-900 selection:bg-[#D4AF37] selection:text-black w-full max-w-full">
      {/* Top Announcement Bar & Sticky Luxury Header */}
      <Header />

      {/* Main Content View */}
      <main className="flex-1 w-full max-w-full">
        {renderCurrentPage()}
      </main>

      {/* Luxury Footer with Business Coordinates & Links */}
      <Footer />

      {/* Global Interactive Elements */}
      <CartDrawer />
      <QuickViewModal />
      <WhatsAppChatbot />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
