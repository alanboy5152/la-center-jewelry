import React, { useState } from 'react';
import {
  Search,
  Eye,
  X,
  Check,
  Truck,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  Copy,
  Printer,
  Mail,
  Send,
  Sparkles,
  ExternalLink,
  Phone,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { useApp } from '../../context/AppContext';

export const AdminOrdersTab: React.FC = () => {
  const { orders, updateOrderStatus, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Customer Message Modal State
  const [messageOrder, setMessageOrder] = useState<Order | null>(null);
  const [messageType, setMessageType] = useState<'thankyou' | 'shipped'>('thankyou');
  const [customMessage, setCustomMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const statuses: OrderStatus[] = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ];

  const handleOpenMessage = (order: Order, type: 'thankyou' | 'shipped' = 'thankyou') => {
    setMessageOrder(order);
    setMessageType(type);
    const custName = order.customer.name || `${order.customer.firstName} ${order.customer.lastName}`.trim() || 'Valued Patron';
    const itemsList = order.items.map((it) => `${it.name} (x${it.quantity})`).join(', ');

    if (type === 'shipped') {
      setCustomMessage(
        `Dear ${custName},\n\nThank you for choosing L.A Center Jewelry Inc!\n\nYour order #${order.id} has been safely dispatched along with its official appraisal and invoice.\n\nItem(s): ${itemsList}\nInvoice Total: $${order.total.toLocaleString()}\nDestination: ${order.customer.address}, ${order.customer.city}, ${order.customer.state || 'CA'}\n\nYour fine jewelry piece is traveling in a fully insured armored transit courier and will arrive at your address shortly.\n\nFor any inquiries or bespoke assistance, contact us at +1 213-612-0106.\n\nWarm regards,\nL.A Center Jewelry Inc\n720 S Broadway, Los Angeles, CA`
      );
    } else {
      setCustomMessage(
        `Dear ${custName},\n\nThank you for your order with L.A Center Jewelry Inc!\n\nYour purchase (Order #${order.id}) has been confirmed. Our Los Angeles master goldsmiths are carefully preparing and inspecting your items.\n\nItem(s): ${itemsList}\nOrder Total: $${order.total.toLocaleString()}\nDelivery Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.state || 'CA'}\n\nYour package will be dispatched shortly with full insurance.\n\nWarm regards,\nL.A Center Jewelry Inc\n720 S Broadway, Los Angeles, CA\nPhone: +1 213-612-0106`
      );
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(customMessage);
    setIsCopied(true);
    showToast('Customer notification message copied to clipboard.', 'success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    if (!messageOrder?.customer.phone) {
      showToast('This customer has no phone number recorded.', 'error');
      return;
    }
    const cleanPhone = messageOrder.customer.phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(customMessage);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  const handleSendEmail = () => {
    if (!messageOrder?.customer.email) {
      showToast('No customer email found.', 'error');
      return;
    }
    const subject = encodeURIComponent(
      messageType === 'shipped'
        ? `L.A Center Jewelry - Order Dispatched & Official Invoice (#${messageOrder.id})`
        : `L.A Center Jewelry - Thank You for Your Purchase (#${messageOrder.id})`
    );
    const body = encodeURIComponent(customMessage);
    window.location.href = `mailto:${messageOrder.customer.email}?subject=${subject}&body=${body}`;
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder({ ...activeOrder, status: newStatus });
    }
    showToast(`Order ${orderId} marked as ${newStatus}.`, 'success');

    // If marked as shipped, suggest sending the dispatched message
    if (newStatus === 'shipped') {
      const targetOrder = orders.find((o) => o.id === orderId);
      if (targetOrder) {
        handleOpenMessage(targetOrder, 'shipped');
      }
    }
  };

  const filteredOrders = orders.filter((o) => {
    const custName = o.customer.name || `${o.customer.firstName} ${o.customer.lastName}`;
    const matchesStatus = selectedStatus === 'all' || o.status === selectedStatus;
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      custName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'shipped':
        return 'bg-sky-950 text-sky-300 border-sky-800';
      case 'processing':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'confirmed':
        return 'bg-indigo-950 text-indigo-300 border-indigo-800';
      case 'cancelled':
      case 'refunded':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-normal text-white">
            Client Acquisitions &amp; Orders ({orders.length})
          </h2>
          <p className="text-xs text-neutral-400">
            Track armored courier deliveries, verify payment settlements, and manage order statuses.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#1A1A1A] border border-[#2D2D2D] p-4 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121212] border border-[#333] text-white text-xs pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-[#121212] border border-[#333] text-neutral-300 text-xs px-3 py-2.5 focus:outline-none focus:border-[#D4AF37]"
        >
          <option value="all">All Order Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-[#1A1A1A] border border-[#2D2D2D] overflow-x-auto">
        <table className="w-full text-left text-xs text-neutral-300">
          <thead className="bg-[#141414] text-neutral-400 uppercase tracking-wider border-b border-[#2D2D2D]">
            <tr>
              <th className="py-3.5 px-4">Order ID</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Items</th>
              <th className="py-3.5 px-4">Valuation</th>
              <th className="py-3.5 px-4">Payment</th>
              <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions &amp; Messages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262626]">
            {filteredOrders.map((order) => {
              const customerName = order.customer.name || `${order.customer.firstName} ${order.customer.lastName}`;
              return (
              <tr key={order.id} className="hover:bg-[#202020] transition-colors">
                <td className="py-3.5 px-4 font-mono font-semibold text-white">
                  {order.id}
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-medium text-white block">{customerName}</span>
                  <span className="text-[10px] text-neutral-500">{order.customer.email}</span>
                </td>
                <td className="py-3.5 px-4 text-neutral-400">{order.createdAt}</td>
                <td className="py-3.5 px-4 text-neutral-300">
                  {order.items.reduce((acc, it) => acc + it.quantity, 0)} pcs
                </td>
                <td className="py-3.5 px-4 font-serif font-bold text-white">
                  ${order.total.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-neutral-300">
                  <div className="font-medium text-white text-xs">{order.paymentMethod}</div>
                  {order.transactionId && (
                    <div className="text-[10px] text-neutral-500 font-mono">{order.transactionId}</div>
                  )}
                  {order.payoutDestination && (
                    <div className="text-[10px] text-emerald-400/90 truncate max-w-[170px]" title={order.payoutDestination}>
                      {order.payoutDestination}
                    </div>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider border ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Message & Invoice Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenMessage(order, order.status === 'shipped' ? 'shipped' : 'thankyou')}
                      className="px-2.5 py-1 bg-[#231B17] hover:bg-[#342720] border border-[#D4AF37]/50 text-[#D4AF37] hover:text-[#FFF] text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      title="Send Invoice & Notice"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Notice &amp; Invoice</span>
                    </button>

                    {/* Inspect Button */}
                    <button
                      type="button"
                      onClick={() => setActiveOrder(order)}
                      className="p-1.5 bg-[#222] hover:bg-[#333] border border-[#444] text-neutral-300 hover:text-white cursor-pointer transition-colors"
                      title="View Full Order Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="relative bg-[#1A1A1A] border border-[#333] text-white w-full max-w-2xl my-8 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#2D2D2D] mb-6">
              <div>
                <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-semibold block">
                  Order Dossier
                </span>
                <h3 className="font-serif text-xl font-normal text-white">
                  {activeOrder.id} • {activeOrder.customer.name || `${activeOrder.customer.firstName} ${activeOrder.customer.lastName}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveOrder(null)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-xs">
              {/* Status Updater */}
              <div className="p-4 bg-[#141414] border border-[#2D2D2D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Current Fulfillment Status
                  </span>
                  <span
                    className={`inline-block mt-1 px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider border ${getStatusBadge(
                      activeOrder.status
                    )}`}
                  >
                    {activeOrder.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-neutral-400">Update to:</span>
                  <select
                    value={activeOrder.status}
                    onChange={(e) => handleStatusChange(activeOrder.id, e.target.value as OrderStatus)}
                    className="bg-[#1C1C1C] border border-[#444] text-white p-2 text-xs focus:outline-none focus:border-[#D4AF37]"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#141414] border border-[#262626] space-y-1">
                  <h4 className="text-[10px] uppercase font-bold text-neutral-400">
                    Patron Details
                  </h4>
                  <p className="font-medium text-white">
                    {activeOrder.customer.name || `${activeOrder.customer.firstName} ${activeOrder.customer.lastName}`}
                  </p>
                  <p className="text-neutral-400">{activeOrder.customer.email}</p>
                  <p className="text-neutral-400">{activeOrder.customer.phone}</p>
                </div>

                <div className="p-4 bg-[#141414] border border-[#262626] space-y-1">
                  <h4 className="text-[10px] uppercase font-bold text-neutral-400">
                    Insured Destination
                  </h4>
                  <p className="text-white">{activeOrder.customer.address}</p>
                  <p className="text-neutral-400">
                    {activeOrder.customer.city}, {activeOrder.customer.state} {activeOrder.customer.zip}
                  </p>
                  <p className="text-neutral-400">{activeOrder.customer.country}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-[10px] uppercase font-bold text-neutral-400 mb-2">
                  Acquired Jewelry Items
                </h4>
                <div className="divide-y divide-[#262626] border border-[#262626] bg-[#141414]">
                  {activeOrder.items.map((item, i) => (
                    <div key={i} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover border border-[#333]"
                        />
                        <div>
                          <p className="font-serif font-medium text-white">{item.name}</p>
                          <p className="text-[10px] text-neutral-500 font-mono">
                            SKU: {item.sku} • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-serif font-semibold text-white">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Gateway & Payout Receipt */}
              <div className="p-4 bg-[#181310] border border-[#3E2D22] space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Settlement &amp; Payout Routing</span>
                  </h4>
                  <span
                    className={`px-2 py-0.5 text-[9px] uppercase font-bold border ${
                      activeOrder.paymentStatus === 'paid'
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
                        : 'bg-amber-950/60 border-amber-500/50 text-amber-400'
                    }`}
                  >
                    Payment: {activeOrder.paymentStatus}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300">
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase">Payment Method:</span>
                    <span className="font-medium text-white">{activeOrder.paymentMethod}</span>
                  </div>
                  {activeOrder.transactionId && (
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase">Transaction / Wire ID:</span>
                      <span className="font-mono text-[#D4AF37]">{activeOrder.transactionId}</span>
                    </div>
                  )}
                  {activeOrder.payoutDestination && (
                    <div className="sm:col-span-2 bg-[#120E0C] p-2.5 border border-[#2D1F17]">
                      <span className="text-neutral-500 block text-[10px] uppercase mb-0.5">
                        Dollar Payout Destination:
                      </span>
                      <span className="text-emerald-400 font-mono text-[11px] font-medium leading-relaxed block">
                        {activeOrder.payoutDestination}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Totals */}
              <div className="p-4 bg-[#141414] border border-[#262626] space-y-1.5 text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${activeOrder.subtotal.toLocaleString()}</span>
                </div>
                {activeOrder.discount > 0 && (
                  <div className="flex justify-between text-[#D4AF37]">
                    <span>Privilege Discount</span>
                    <span>-${activeOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Armored Transport</span>
                  <span>{activeOrder.shipping === 0 ? 'Complimentary' : `$${activeOrder.shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax</span>
                  <span>${activeOrder.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-serif font-bold text-white pt-2 border-t border-[#333]">
                  <span>Total Settlement</span>
                  <span>${activeOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Customer Invoice & Message Dispatch Section */}
              <div className="p-4 bg-gradient-to-r from-[#1E1713] to-[#16110E] border border-[#D4AF37]/60 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-[#3D2C22]">
                  <div>
                    <h4 className="text-xs uppercase font-bold text-[#D4AF37] tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4" />
                      <span>Customer Notice &amp; Invoice</span>
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Send purchase confirmation or shipping invoice notice directly to the client.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleOpenMessage(activeOrder, 'thankyou')}
                    className="p-3 bg-[#241A15] hover:bg-[#34261F] border border-[#D4AF37]/40 text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>1. Thank You Notice</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
                      Purchase confirmation with order details and atelier care note.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenMessage(activeOrder, 'shipped')}
                    className="p-3 bg-[#241A15] hover:bg-[#34261F] border border-sky-600/40 text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold">
                      <Truck className="w-3.5 h-3.5" />
                      <span>2. Dispatched Notice</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
                      Shipping notification with courier tracking and official invoice.
                    </p>
                  </button>
                </div>

                <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-[#2A1E18] hover:bg-[#3E2B22] border border-[#523B2E] text-neutral-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Print Order Invoice</span>
                  </button>

                  <div className="text-[11px] text-neutral-400 font-mono">
                    Customer: {activeOrder.customer.email} {activeOrder.customer.phone ? `• ${activeOrder.customer.phone}` : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Message & Invoice Modal */}
      {messageOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative bg-[#1A1513] border border-[#D4AF37]/50 text-white w-full max-w-xl my-8 p-6 sm:p-7 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#2D211B] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#2A1F1A] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-white">
                    Send Customer Message &amp; Invoice
                  </h3>
                  <span className="text-[11px] text-[#D4AF37] font-mono">
                    Order #{messageOrder.id} • {messageOrder.customer.name || `${messageOrder.customer.firstName} ${messageOrder.customer.lastName}`}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMessageOrder(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-xs hover:bg-[#2A1F1A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Selector */}
            <div className="mb-4">
              <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block mb-1.5">
                Notice Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenMessage(messageOrder, 'thankyou')}
                  className={`py-2 px-3 text-xs font-semibold text-center border transition-colors cursor-pointer ${
                    messageType === 'thankyou'
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold'
                      : 'bg-[#150F0D] border-[#3E2D24] text-neutral-300 hover:text-white hover:bg-[#201713]'
                  }`}
                >
                  1. Thank You Notice
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenMessage(messageOrder, 'shipped')}
                  className={`py-2 px-3 text-xs font-semibold text-center border transition-colors cursor-pointer ${
                    messageType === 'shipped'
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold'
                      : 'bg-[#150F0D] border-[#3E2D24] text-neutral-300 hover:text-white hover:bg-[#201713]'
                  }`}
                >
                  2. Dispatched Notice
                </button>
              </div>
            </div>

            {/* Message Textarea */}
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Message Content:</span>
                <span className="text-[10px] text-neutral-500 font-mono">Editable text</span>
              </div>
              <textarea
                rows={9}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full bg-[#120E0C] border border-[#3E2D25] focus:border-[#D4AF37] p-3 text-white text-xs leading-relaxed font-sans rounded-none focus:outline-none"
              />
            </div>

            {/* Delivery Details Pill */}
            <div className="p-3 bg-[#120D0B] border border-[#2D1F18] text-xs text-neutral-300 flex flex-wrap items-center justify-between gap-2 mb-5">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="font-mono text-[11px] text-white">{messageOrder.customer.email}</span>
              </div>
              {messageOrder.customer.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="font-mono text-[11px] text-white">{messageOrder.customer.phone}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopyMessage}
                className="py-2.5 px-3 bg-[#261E1A] hover:bg-[#3A2D27] border border-[#D4AF37]/50 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#D4AF37]" />}
                <span>{isCopied ? 'Copied' : 'Copy Text'}</span>
              </button>

              {/* WhatsApp Button */}
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="py-2.5 px-3 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>WhatsApp Message</span>
              </button>

              {/* Email Button */}
              <button
                type="button"
                onClick={handleSendEmail}
                className="py-2.5 px-3 bg-[#D4AF37] hover:bg-[#b8952b] text-black text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <Mail className="w-4 h-4" />
                <span>Send Email</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
