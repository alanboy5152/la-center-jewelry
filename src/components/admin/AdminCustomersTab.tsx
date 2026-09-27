import React, { useState } from 'react';
import {
  Users,
  Search,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  MessageCircle,
  Eye,
  Trash2,
  Plus,
  X,
  Check,
  Copy,
  Download,
  Filter,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { Customer, Order } from '../../types';
import { useApp } from '../../context/AppContext';

export const AdminCustomersTab: React.FC = () => {
  const { customers, orders, addCustomer, deleteCustomer, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'signup' | 'checkout' | 'vip'>('all');
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);
  const [messageCustomer, setMessageCustomer] = useState<Customer | null>(null);
  const [messageTemplate, setMessageTemplate] = useState<'thankyou' | 'dispatch' | 'welcome'>('thankyou');
  const [customMessageText, setCustomMessageText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Customer Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustCity, setNewCustCity] = useState('');
  const [newCustMetal, setNewCustMetal] = useState('18k Yellow Gold');
  const [newCustRingSize, setNewCustRingSize] = useState('7.0');

  // Stats calculation
  const totalCustomers = customers.length;
  const webSignupCount = customers.filter(
    (c) => c.source === 'website_signup' || (!c.ordersCount && !c.totalSpent)
  ).length;
  const totalValuation = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const vipCount = customers.filter((c) => (c.totalSpent || 0) >= 5000).length;
  const orderClientsCount = customers.filter((c) => (c.ordersCount || 0) > 0).length;

  // Filtered list
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm)) ||
      (c.address && c.address.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'signup') {
      return c.source === 'website_signup' || (!c.ordersCount && !c.totalSpent);
    }
    if (filterType === 'checkout') {
      return (c.ordersCount || 0) > 0 || c.source === 'store_checkout';
    }
    if (filterType === 'vip') {
      return (c.totalSpent || 0) >= 5000;
    }
    return true;
  });

  // Get orders associated with a customer
  const getCustomerOrders = (email: string): Order[] => {
    return orders.filter(
      (o) => o.customer.email.toLowerCase() === email.toLowerCase()
    );
  };

  const handleOpenMessageModal = (cust: Customer, defaultTemplate: 'thankyou' | 'dispatch' | 'welcome' = 'thankyou') => {
    setMessageCustomer(cust);
    setMessageTemplate(defaultTemplate);
    const relatedOrders = getCustomerOrders(cust.email);
    const latestOrder = relatedOrders[0];
    const orderId = latestOrder ? latestOrder.id : 'LAC-CONFIRMED';
    const orderVal = latestOrder ? `$${latestOrder.total.toLocaleString()}` : (cust.totalSpent ? `$${cust.totalSpent.toLocaleString()}` : '$0.00');

    if (defaultTemplate === 'thankyou') {
      setCustomMessageText(
        `Dear ${cust.name},\n\nThank you for choosing L.A Center Jewelry Inc!\n\nYour order #${orderId} is confirmed. Our Los Angeles atelier is preparing your fine jewelry piece with the utmost care.\n\nOrder Total: ${orderVal}\nDelivery Address: ${cust.address || 'Los Angeles, CA'}\n\nWe sincerely appreciate your patronage.\n\nWarm regards,\nL.A Center Jewelry Inc\n720 S Broadway, Los Angeles, CA\nPhone: +1 213-612-0106`
      );
    } else if (defaultTemplate === 'dispatch') {
      setCustomMessageText(
        `Dear ${cust.name},\n\nYour order #${orderId} from L.A Center Jewelry Inc has been safely dispatched along with your official appraisal and invoice.\n\nYour package is in transit via insured courier to: ${cust.address || 'Los Angeles, CA'}.\n\nInvoice Total: ${orderVal}\n\nIf you have any questions, please contact our concierge at +1 213-612-0106.\n\nWarm regards,\nL.A Center Jewelry Inc\n720 S Broadway, Los Angeles, CA`
      );
    } else {
      setCustomMessageText(
        `Dear ${cust.name},\n\nWelcome to L.A Center Jewelry Inc! Thank you for creating an account with us.\n\nYou now enjoy priority access to our exclusive diamond ring collections, bespoke salon consultations, and private patron showcases.\n\nVisit us at 720 S Broadway or contact +1 213-612-0106 for any bespoke assistance.\n\nWarm regards,\nL.A Center Jewelry Inc\n720 S Broadway, Los Angeles, CA`
      );
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(customMessageText);
    setIsCopied(true);
    showToast('Message copied to clipboard.', 'success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    if (!messageCustomer?.phone) {
      showToast('No phone number recorded for this client.', 'error');
      return;
    }
    const cleanPhone = messageCustomer.phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(customMessageText);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  const handleSendEmail = () => {
    if (!messageCustomer?.email) {
      showToast('No email address available for this client.', 'error');
      return;
    }
    const subject = encodeURIComponent(
      messageTemplate === 'dispatch'
        ? `L.A Center Jewelry - Order Dispatched & Invoice Confirmation`
        : messageTemplate === 'thankyou'
        ? `L.A Center Jewelry - Thank You for Your Order`
        : `Welcome to L.A Center Jewelry Inc`
    );
    const body = encodeURIComponent(customMessageText);
    window.location.href = `mailto:${messageCustomer.email}?subject=${subject}&body=${body}`;
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustEmail.trim()) {
      showToast('Name and email are required.', 'error');
      return;
    }

    const newCust: Customer = {
      id: 'cust-' + Date.now(),
      name: newCustName.trim(),
      email: newCustEmail.trim().toLowerCase(),
      phone: newCustPhone.trim() || '+1 (213) 612-0106',
      ordersCount: 0,
      totalSpent: 0,
      registeredAt: new Date().toISOString(),
      address: newCustCity.trim() || 'Los Angeles, CA',
      source: 'manual',
      status: 'active',
      preferredMetal: newCustMetal,
      ringSize: newCustRingSize,
    };

    addCustomer(newCust);
    setIsAddModalOpen(false);
    setNewCustName('');
    setNewCustEmail('');
    setNewCustPhone('');
    setNewCustCity('');
  };

  const handleExportCSV = () => {
    if (customers.length === 0) {
      showToast('No customer records to export.', 'info');
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Phone', 'Source', 'Total Orders', 'Total Spent', 'Registered Date', 'Address'];
    const rows = customers.map((c) => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.email}"`,
      `"${c.phone || ''}"`,
      `"${c.source || 'website'}"`,
      c.ordersCount || 0,
      c.totalSpent || 0,
      `"${c.registeredAt}"`,
      `"${(c.address || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lacenter_customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Customer directory exported successfully.', 'success');
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr || 'Recent';
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr || 'Recent';
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2D211B] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-white">
              Customer Data
            </h2>
            <span className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] uppercase font-bold px-2 py-0.5 tracking-wider">
              {totalCustomers} Registered
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Manage user accounts, order activity, and direct client notices.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-[#201815] hover:bg-[#2D211C] border border-[#3E2D25] text-neutral-300 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-initial px-4 py-2 bg-[#D4AF37] hover:bg-[#b8952b] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* 2. Single-Line Cloud Storage Status Bar */}
      <div className="bg-[#181210] border-l-4 border-[#D4AF37] px-3.5 py-2.5 text-xs text-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-1.5 py-0.5 bg-[#D4AF37] text-black font-bold text-[9px] uppercase tracking-wider shrink-0">
            Data Storage
          </span>
          <p className="text-neutral-400 text-xs truncate">
            All sign-ups and client profiles sync automatically to Google Cloud Firestore in real time.
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Firestore Synced
          </span>
        </div>
      </div>

      {/* 3. KPI Summary Cards (Mobile: 2x2 grid, Desktop: 4 cols) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Customers */}
        <div className="p-3 sm:p-4 bg-[#181210] border border-[#2D211B] rounded-xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block truncate">
              Total Clients
            </span>
            <span className="font-serif text-xl sm:text-2xl font-normal text-white mt-0.5 sm:mt-1 block">
              {totalCustomers}
            </span>
            <span className="text-[10px] text-neutral-500 mt-0.5 block truncate">Registered profiles</span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#201815] border border-[#3D2C22] flex items-center justify-center text-[#D4AF37] shrink-0 ml-2">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Online Sign-ups */}
        <div className="p-3 sm:p-4 bg-[#181210] border border-[#D4AF37]/35 rounded-xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] text-[#D4AF37] uppercase tracking-widest font-semibold block truncate">
              Web Sign-ups
            </span>
            <span className="font-serif text-xl sm:text-2xl font-normal text-[#FFF2B2] mt-0.5 sm:mt-1 block">
              {webSignupCount}
            </span>
            <span className="text-[10px] text-neutral-400 mt-0.5 block truncate">Website accounts</span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#261E1A] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0 ml-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Total Spend */}
        <div className="p-3 sm:p-4 bg-[#181210] border border-[#2D211B] rounded-xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block truncate">
              Total Purchases
            </span>
            <span className="font-serif text-xl sm:text-2xl font-normal text-white mt-0.5 sm:mt-1 block truncate">
              ${totalValuation.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-400 mt-0.5 block truncate">Across {orders.length} orders</span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#201815] border border-[#3D2C22] flex items-center justify-center text-emerald-400 shrink-0 ml-2">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* VIP Patrons */}
        <div className="p-3 sm:p-4 bg-[#181210] border border-[#2D211B] rounded-xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] text-neutral-400 uppercase tracking-widest font-semibold block truncate">
              VIP Tier
            </span>
            <span className="font-serif text-xl sm:text-2xl font-normal text-[#E5D8BE] mt-0.5 sm:mt-1 block">
              {vipCount}
            </span>
            <span className="text-[10px] text-neutral-500 mt-0.5 block truncate">$5,000+ spend</span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#201815] border border-[#3D2C22] flex items-center justify-center text-[#D4AF37] shrink-0 ml-2">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>

      {/* 4. Search & Filter Bar */}
      <div className="bg-[#181210] border border-[#2D211B] p-3 sm:p-4 flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, phone, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#120E0C] border border-[#3E2D25] text-white text-xs pl-9 pr-4 py-2 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-[10px] uppercase font-bold text-neutral-400 mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3 text-[#D4AF37]" />
            <span>Filter:</span>
          </span>

          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
              filterType === 'all'
                ? 'bg-[#D4AF37] text-black font-bold'
                : 'bg-[#201815] text-neutral-400 hover:text-white border border-[#3A2A22]'
            }`}
          >
            All ({totalCustomers})
          </button>

          <button
            type="button"
            onClick={() => setFilterType('signup')}
            className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
              filterType === 'signup'
                ? 'bg-[#D4AF37] text-black font-bold'
                : 'bg-[#201815] text-neutral-400 hover:text-white border border-[#3A2A22]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Sign-ups ({webSignupCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterType('checkout')}
            className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
              filterType === 'checkout'
                ? 'bg-[#D4AF37] text-black font-bold'
                : 'bg-[#201815] text-neutral-400 hover:text-white border border-[#3A2A22]'
            }`}
          >
            Orders ({orderClientsCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterType('vip')}
            className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
              filterType === 'vip'
                ? 'bg-[#D4AF37] text-black font-bold'
                : 'bg-[#201815] text-neutral-400 hover:text-white border border-[#3A2A22]'
            }`}
          >
            VIP ({vipCount})
          </button>
        </div>
      </div>

      {/* 5. Mobile Smart Card View (Visible below md) */}
      <div className="md:hidden space-y-3">
        {filteredCustomers.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 font-mono text-xs bg-[#181210] border border-[#2D211B]">
            No client records found.
          </div>
        ) : (
          filteredCustomers.map((c) => {
            const isSignup = c.source === 'website_signup' || (!c.ordersCount && !c.totalSpent);
            const isVip = (c.totalSpent || 0) >= 5000;
            const initials = c.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase();

            return (
              <div
                key={c.id}
                className="bg-[#181210] border border-[#2D211B] p-3.5 space-y-3 rounded-xs shadow-xs"
              >
                {/* Header Row: Initials, Name, Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#241A16] border border-[#3E2D25] text-[#D4AF37] font-semibold text-xs flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-serif font-medium text-white text-sm truncate">
                          {c.name}
                        </span>
                        {isSignup && (
                          <span className="px-1.5 py-0.2 bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 text-[9px] uppercase font-bold tracking-wider rounded-xs">
                            Sign-up
                          </span>
                        )}
                        {isVip && (
                          <span className="px-1.5 py-0.2 bg-purple-950/60 text-purple-300 border border-purple-800 text-[9px] uppercase font-bold tracking-wider rounded-xs">
                            VIP
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono block">
                        Registered: {formatDate(c.registeredAt)}
                      </span>
                    </div>
                  </div>

                  {/* Financial Stats */}
                  <div className="text-right shrink-0">
                    <span className="font-serif font-bold text-white text-sm block">
                      ${(c.totalSpent || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono block">
                      {c.ordersCount || 0} {c.ordersCount === 1 ? 'order' : 'orders'}
                    </span>
                  </div>
                </div>

                {/* Contact & Location Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-neutral-300 pt-1 border-t border-[#261E1A]">
                  <a
                    href={`mailto:${c.email}`}
                    className="flex items-center gap-1.5 text-neutral-300 hover:text-[#D4AF37] truncate"
                  >
                    <Mail className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </a>

                  {c.phone && (
                    <a
                      href={`tel:${c.phone}`}
                      className="flex items-center gap-1.5 text-neutral-300 hover:text-[#D4AF37] truncate"
                    >
                      <Phone className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span className="truncate">{c.phone}</span>
                    </a>
                  )}

                  <div className="flex items-center gap-1.5 text-neutral-400 truncate">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span className="truncate">{c.address || 'Los Angeles, CA'}</span>
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#261E1A]">
                  <button
                    type="button"
                    onClick={() => handleOpenMessageModal(c, isSignup && !c.ordersCount ? 'welcome' : 'dispatch')}
                    className="flex-1 py-1.5 px-2 bg-[#201815] hover:bg-[#2F211B] border border-[#3E2D25] text-[#D4AF37] text-xs font-medium rounded-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send Notice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveCustomer(c)}
                    className="py-1.5 px-3 bg-[#201815] hover:bg-[#2F211B] border border-[#3E2D25] text-neutral-300 text-xs font-medium rounded-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove record for "${c.name}"?`)) {
                        deleteCustomer(c.id);
                      }
                    }}
                    className="p-1.5 bg-[#201815] hover:bg-rose-950/60 border border-[#3E2D25] text-neutral-500 hover:text-rose-400 rounded-xs cursor-pointer transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 6. Desktop Customers Table (Visible md and up) */}
      <div className="hidden md:block bg-[#181210] border border-[#2D211B] overflow-x-auto shadow-md">
        <table className="w-full text-left text-xs text-neutral-300">
          <thead className="bg-[#120E0C] text-neutral-400 uppercase tracking-wider border-b border-[#2D211B]">
            <tr>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Registered</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Purchases</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#261E1A]">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-neutral-500 font-mono text-xs">
                  No client records found.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c) => {
                const isSignup = c.source === 'website_signup' || (!c.ordersCount && !c.totalSpent);
                const isVip = (c.totalSpent || 0) >= 5000;
                const initials = c.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase();

                return (
                  <tr key={c.id} className="hover:bg-[#201714] transition-colors">
                    {/* Name & Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#241A16] border border-[#3E2D25] text-[#D4AF37] font-semibold text-xs flex items-center justify-center shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-serif font-medium text-white text-sm">
                              {c.name}
                            </span>
                            {isSignup && (
                              <span className="px-1.5 py-0.2 bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 text-[9px] uppercase font-bold tracking-wider rounded-xs">
                                Sign-up
                              </span>
                            )}
                            {isVip && (
                              <span className="px-1.5 py-0.2 bg-purple-950/60 text-purple-300 border border-purple-800 text-[9px] uppercase font-bold tracking-wider rounded-xs">
                                VIP
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-neutral-500 font-mono block">
                            ID: {c.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-3.5 px-4 space-y-1">
                      <a
                        href={`mailto:${c.email}`}
                        className="text-neutral-300 hover:text-[#D4AF37] flex items-center gap-1.5"
                        title="Send Email"
                      >
                        <Mail className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="truncate max-w-[170px]">{c.email}</span>
                      </a>
                      {c.phone ? (
                        <div className="flex items-center gap-1.5 text-neutral-400">
                          <Phone className="w-3 h-3 text-neutral-500" />
                          <span>{c.phone}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-600 text-[10px] italic">No phone</span>
                      )}
                    </td>

                    {/* Registration Date */}
                    <td className="py-3.5 px-4">
                      <span className="text-neutral-300 block">{formatDate(c.registeredAt)}</span>
                      <span className="text-[10px] text-neutral-500 block">
                        {isSignup ? 'Direct Web Signup' : 'Order Checkout'}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-neutral-300">
                        <MapPin className="w-3 h-3 text-neutral-500 shrink-0" />
                        <span className="truncate max-w-[130px]">
                          {c.address || 'Los Angeles, CA'}
                        </span>
                      </div>
                    </td>

                    {/* Acquisitions & Total Spent */}
                    <td className="py-3.5 px-4">
                      <span className="font-serif font-bold text-white text-sm block">
                        ${(c.totalSpent || 0).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono block">
                        {c.ordersCount || 0} {c.ordersCount === 1 ? 'order' : 'orders'}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenMessageModal(c, isSignup && !c.ordersCount ? 'welcome' : 'dispatch')}
                          className="p-1.5 bg-[#201815] hover:bg-[#2F211B] border border-[#3E2D25] text-[#D4AF37] hover:text-white rounded-xs cursor-pointer transition-colors"
                          title="Send Customer Notice"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveCustomer(c)}
                          className="p-1.5 bg-[#201815] hover:bg-[#2F211B] border border-[#3E2D25] text-neutral-300 hover:text-white rounded-xs cursor-pointer transition-colors"
                          title="View Customer Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove record for "${c.name}"?`)) {
                              deleteCustomer(c.id);
                            }
                          }}
                          className="p-1.5 bg-[#201815] hover:bg-rose-950/60 border border-[#3E2D25] text-neutral-500 hover:text-rose-400 rounded-xs cursor-pointer transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 7. CUSTOMER DETAILS MODAL */}
      {activeCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="relative bg-[#181210] border border-[#3E2D25] text-white w-full max-w-2xl my-6 p-5 sm:p-7 shadow-2xl rounded-xs space-y-5">
            <div className="flex items-start justify-between pb-3.5 border-b border-[#2C1F19]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#241A16] border border-[#D4AF37] text-[#D4AF37] font-semibold text-sm sm:text-base flex items-center justify-center shrink-0">
                  {activeCustomer.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg sm:text-xl font-normal text-white">
                      {activeCustomer.name}
                    </h3>
                    {activeCustomer.source === 'website_signup' && (
                      <span className="px-2 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold uppercase rounded-xs">
                        Sign-up
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-neutral-400">
                    ID: {activeCustomer.id} • Registered {formatDate(activeCustomer.registeredAt)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveCustomer(null)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Coordinates & Preferences Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-[#140F0D] border border-[#2B1F19] space-y-2">
                <h4 className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider">
                  Contact Information
                </h4>
                <p className="flex items-center gap-2 text-neutral-200">
                  <Mail className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span className="truncate">{activeCustomer.email}</span>
                </p>
                <p className="flex items-center gap-2 text-neutral-200">
                  <Phone className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span>{activeCustomer.phone || 'None provided'}</span>
                </p>
                <p className="flex items-center gap-2 text-neutral-200">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span>{activeCustomer.address || 'Los Angeles, CA'}</span>
                </p>
              </div>

              <div className="p-3.5 bg-[#140F0D] border border-[#2B1F19] space-y-2">
                <h4 className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider">
                  Client Profile
                </h4>
                <div className="grid grid-cols-2 gap-2 text-neutral-300">
                  <div>
                    <span className="text-[10px] text-neutral-500 block">Preferred Metal:</span>
                    <span className="font-medium text-white">{activeCustomer.preferredMetal || '18k Yellow Gold'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block">Ring Size:</span>
                    <span className="font-medium text-white">{activeCustomer.ringSize || '7.0'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block">Total Purchases:</span>
                    <span className="font-serif font-bold text-[#D4AF37] text-sm">
                      ${(activeCustomer.totalSpent || 0).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block">Orders Placed:</span>
                    <span className="font-mono text-white">{activeCustomer.ordersCount || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order History */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs uppercase font-bold text-neutral-300 tracking-wider">
                  Order History ({getCustomerOrders(activeCustomer.email).length})
                </h4>
              </div>

              <div className="border border-[#2C1F19] divide-y divide-[#261E1A] bg-[#140F0D] max-h-44 overflow-y-auto">
                {getCustomerOrders(activeCustomer.email).length === 0 ? (
                  <div className="p-4 text-center text-neutral-500 text-xs italic">
                    This user has signed up but has not placed an order yet.
                  </div>
                ) : (
                  getCustomerOrders(activeCustomer.email).map((o) => (
                    <div key={o.id} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-white">{o.id}</span>
                          <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] uppercase font-bold">
                            {o.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-500">{o.createdAt} • {o.items.length} item(s)</span>
                      </div>
                      <span className="font-serif font-bold text-white">
                        ${o.total.toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 border-t border-[#2C1F19] flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setActiveCustomer(null);
                  handleOpenMessageModal(activeCustomer, 'dispatch');
                }}
                className="w-full sm:w-auto px-4 py-2 bg-[#D4AF37] hover:bg-[#b8952b] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Customer Notice</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCustomer(null)}
                className="w-full sm:w-auto px-4 py-2 bg-[#201815] hover:bg-[#2C211C] border border-[#3E2D25] text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. SEND CUSTOMER NOTICE MODAL */}
      {messageCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="relative bg-[#181210] border border-[#3E2D25] text-white w-full max-w-lg my-6 p-5 sm:p-7 shadow-2xl rounded-xs space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#2C1F19]">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-normal text-white">
                  Send Customer Notice
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Recipient: <strong className="text-white">{messageCustomer.name}</strong> ({messageCustomer.phone || messageCustomer.email})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMessageCustomer(null)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Selector */}
            <div className="grid grid-cols-3 gap-1.5 bg-[#120E0C] p-1 border border-[#2B1F19] rounded-xs">
              <button
                type="button"
                onClick={() => handleOpenMessageModal(messageCustomer, 'thankyou')}
                className={`py-2 px-1 text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer text-center truncate ${
                  messageTemplate === 'thankyou'
                    ? 'bg-[#D4AF37] text-black font-bold shadow-xs'
                    : 'text-neutral-400 hover:text-white hover:bg-[#201815]'
                }`}
              >
                1. Thank You
              </button>

              <button
                type="button"
                onClick={() => handleOpenMessageModal(messageCustomer, 'dispatch')}
                className={`py-2 px-1 text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer text-center truncate ${
                  messageTemplate === 'dispatch'
                    ? 'bg-[#D4AF37] text-black font-bold shadow-xs'
                    : 'text-neutral-400 hover:text-white hover:bg-[#201815]'
                }`}
              >
                2. Dispatched
              </button>

              <button
                type="button"
                onClick={() => handleOpenMessageModal(messageCustomer, 'welcome')}
                className={`py-2 px-1 text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer text-center truncate ${
                  messageTemplate === 'welcome'
                    ? 'bg-[#D4AF37] text-black font-bold shadow-xs'
                    : 'text-neutral-400 hover:text-white hover:bg-[#201815]'
                }`}
              >
                3. Welcome
              </button>
            </div>

            {/* Message Body Editor */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-neutral-300 block">
                Message Preview:
              </label>
              <textarea
                rows={7}
                value={customMessageText}
                onChange={(e) => setCustomMessageText(e.target.value)}
                className="w-full bg-[#100D0B] border border-[#3E2D25] text-xs text-white p-3 font-sans leading-relaxed focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Direct Send Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={handleCopyMessage}
                className="w-full sm:w-auto px-4 py-2 bg-[#201815] hover:bg-[#2C211C] border border-[#3E2D25] text-neutral-300 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'Copied' : 'Copy Text'}</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSendEmail}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-[#1F2937] hover:bg-[#374151] border border-[#4B5563] text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. ADD NEW CUSTOMER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="relative bg-[#181210] border border-[#3E2D25] text-white w-full max-w-lg my-6 p-5 sm:p-7 shadow-2xl rounded-xs space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#2C1F19]">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-normal text-white">
                  Add Customer
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Create a new client profile in the directory.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5 text-xs">
              <div>
                <label className="text-neutral-300 font-semibold block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="e.g. Victoria Sterling"
                  className="w-full bg-[#100D0B] border border-[#3E2D25] p-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newCustEmail}
                    onChange={(e) => setNewCustEmail(e.target.value)}
                    placeholder="patron@gmail.com"
                    className="w-full bg-[#100D0B] border border-[#3E2D25] p-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">
                    Telephone (WhatsApp)
                  </label>
                  <input
                    type="text"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="+1 213-612-0106"
                    className="w-full bg-[#100D0B] border border-[#3E2D25] p-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">
                    City, State
                  </label>
                  <input
                    type="text"
                    value={newCustCity}
                    onChange={(e) => setNewCustCity(e.target.value)}
                    placeholder="Beverly Hills, CA"
                    className="w-full bg-[#100D0B] border border-[#3E2D25] p-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 font-semibold block mb-1">
                    Ring Size
                  </label>
                  <input
                    type="text"
                    value={newCustRingSize}
                    onChange={(e) => setNewCustRingSize(e.target.value)}
                    placeholder="7.0"
                    className="w-full bg-[#100D0B] border border-[#3E2D25] p-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#2C1F19] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-[#201815] text-neutral-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D4AF37] text-black font-bold uppercase tracking-wider text-xs"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
