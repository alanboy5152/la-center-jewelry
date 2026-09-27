import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Building2,
  CheckCircle2,
  ArrowRight,
  Truck,
  Sparkles,
  Copy,
  Check,
  Wallet,
  Printer,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartTax,
    cartShipping,
    cartTotal,
    clearCart,
    navigateTo,
    createOrder,
    siteSettings,
    showToast,
    currentUser,
  } = useApp();

  const stripeConfig = siteSettings?.paymentGateways?.stripe;
  const paypalConfig = siteSettings?.paymentGateways?.paypal;
  const bankWireConfig = siteSettings?.paymentGateways?.bankWire;

  // Form State - prefilled from currentUser if logged in
  const [firstName, setFirstName] = useState(() => {
    if (currentUser?.name) {
      return currentUser.name.split(' ')[0] || '';
    }
    return '';
  });
  const [lastName, setLastName] = useState(() => {
    if (currentUser?.name) {
      const parts = currentUser.name.split(' ');
      return parts.length > 1 ? parts.slice(1).join(' ') : '';
    }
    return '';
  });
  const [email, setEmail] = useState(() => currentUser?.email || '');
  const [phone, setPhone] = useState(() => currentUser?.phone || '');
  const [street, setStreet] = useState(() => currentUser?.address?.street || '');
  const [suite, setSuite] = useState(() => currentUser?.address?.apartment || '');
  const [city, setCity] = useState(() => currentUser?.address?.city || '');
  const [state, setState] = useState(() => currentUser?.address?.state || 'CA');
  const [zip, setZip] = useState(() => currentUser?.address?.zip || '');
  const [country, setCountry] = useState('United States');

  // Shipping & Payment Options
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'wire'>('card');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  // Copy tracking
  const [copiedBankInfo, setCopiedBankInfo] = useState<string | null>(null);

  // Completed Order State
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMessageCopied, setIsMessageCopied] = useState(false);

  const handleCopyThankYouMessage = (order: Order) => {
    const custName = order.customer.name || `${order.customer.firstName} ${order.customer.lastName}`;
    const text = `Dear ${custName},\n\nThank you sincerely for your purchase from L.A Center Jewelry Inc!\n\nYour Order #${order.id} has been successfully confirmed. Your fine jewelry item will be carefully inspected and dispatched shortly. Your official invoice is prepared.\n\nTotal Amount: $${order.total.toLocaleString()}\nShipping Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.state || 'CA'}\n\nWith warm regards,\nL.A Center Jewelry Inc\n720 S Broadway, Los Angeles, CA\nPhone: +1 213-612-0106`;
    navigator.clipboard.writeText(text);
    setIsMessageCopied(true);
    showToast('Thank you & invoice notice copied to clipboard!', 'success');
    setTimeout(() => setIsMessageCopied(false), 2500);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBankInfo(label);
    showToast(`Copied ${label} to clipboard`, 'info');
    setTimeout(() => setCopiedBankInfo(null), 2000);
  };

  // Wire discount calculation (e.g. 3% for wire)
  const wireDiscount =
    paymentMethod === 'wire' && bankWireConfig?.enabled !== false && bankWireConfig?.discountPercent
      ? Math.round((cartSubtotal * bankWireConfig.discountPercent) / 100)
      : 0;

  const totalDiscount = cartDiscount + wireDiscount;
  const shippingCost = shippingMethod === 'express' ? 75 : cartShipping;
  const finalTotal = Math.max(0, cartSubtotal - totalDiscount + cartTax + shippingCost);

  // If cart is empty and no completed order, redirect
  if (cart.length === 0 && !completedOrder) {
    return (
      <div className="py-24 text-center bg-[#FAF9F5] min-h-[60vh] flex flex-col items-center justify-center">
        <p className="font-serif text-2xl text-neutral-800">Your bag is empty.</p>
        <p className="text-xs text-neutral-500 mt-2">Add creations before proceeding to checkout.</p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-6 px-8 py-3 bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !street.trim() || !city.trim() || !zip.trim()) {
      showToast('Please fill out all required shipping and contact details.', 'error');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber.trim() || !cardExpiry.trim() || !cardCvc.trim()) {
        showToast('Please provide valid payment card details.', 'error');
        return;
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      let gatewayKey: 'stripe' | 'paypal' | 'bank_wire' = 'stripe';
      let methodLabel = 'Credit / Debit Card';
      let txnId = `TXN-CC-${Date.now().toString().slice(-7)}`;
      let payoutDest = `Settled to linked merchant card: ${stripeConfig?.payoutCardNumber || '•••• 4242'} (${stripeConfig?.payoutCardHolder || 'L.A Center Jewelry Inc'})`;
      let payStatus: 'paid' | 'pending' = 'paid';

      if (paymentMethod === 'paypal') {
        gatewayKey = 'paypal';
        methodLabel = 'PayPal Express';
        txnId = `PAYPAL-${Date.now().toString().slice(-8)}`;
        payoutDest = `Direct dollar deposit to PayPal account: ${paypalConfig?.merchantEmail || 'alanboy515253@gmail.com'}`;
        payStatus = 'paid';
      } else if (paymentMethod === 'wire') {
        gatewayKey = 'bank_wire';
        methodLabel = 'Bank Wire Transfer';
        txnId = `WIRE-REF-${Date.now().toString().slice(-7)}`;
        payoutDest = `Direct wire designated for ${bankWireConfig?.bankName || 'JPMorgan Chase Bank'} (Account: ••••${(bankWireConfig?.accountNumber || '8942').slice(-4)})`;
        payStatus = 'pending';
      }

      const order = createOrder({
        customer: {
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          email,
          phone,
          address: suite ? `${street}, ${suite}` : street,
          apartment: suite || undefined,
          city,
          state,
          zip,
          country,
        },
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          sku: item.product.sku,
          price: item.product.salePrice || item.product.price,
          quantity: item.quantity,
          image: item.product.thumbnail,
          metalType: item.selectedMetal,
          size: item.selectedSize,
        })),
        subtotal: cartSubtotal,
        discount: totalDiscount,
        tax: cartTax,
        shipping: shippingCost,
        total: finalTotal,
        status: 'confirmed',
        paymentStatus: payStatus,
        paymentMethod: methodLabel,
        paymentGateway: gatewayKey,
        transactionId: txnId,
        payoutDestination: payoutDest,
      });

      setCompletedOrder(order);
      clearCart();
      setIsSubmitting(false);
      showToast('Order confirmed successfully. Welcome to L.A Center Jewelry Inc.', 'success');
    }, 800);
  };

  // Order Confirmation View
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-neutral-200 p-8 sm:p-12 shadow-md space-y-8">
            <div className="text-center space-y-3 border-b border-neutral-200 pb-8">
              <div className="w-16 h-16 rounded-full bg-[#FAF9F5] text-[#997C24] mx-auto flex items-center justify-center border border-[#D4AF37]/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="text-[11px] uppercase tracking-[0.28em] font-semibold text-[#997C24] block">
                Acquisition Confirmed
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-neutral-900">
                Thank You for Entrusting Us
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 font-light max-w-md mx-auto leading-relaxed">
                Your order has been registered in our atelier system. An insured courier booking confirmation and appraisal tracking number have been sent to {completedOrder.customer.email}.
              </p>
            </div>

            {/* Official Customer Dispatch & Gratitude Notice */}
            <div className="bg-[#181210] border-2 border-[#D4AF37] p-6 text-white space-y-3.5 shadow-xl">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#241A16] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-bold block">
                    Official Dispatch &amp; Gratitude Notice
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl text-white font-medium">
                    Thank You Sincerely For Your Purchase!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#E5D8BE] leading-relaxed font-light">
                    Dear <strong>{completedOrder.customer.name || `${completedOrder.customer.firstName} ${completedOrder.customer.lastName}`}</strong>,
                    thank you for choosing L.A Center Jewelry Inc. Your Order ID <strong className="font-mono text-[#D4AF37]">{completedOrder.id}</strong> has been successfully confirmed. Handcrafted and inspected at our Downtown Los Angeles salon, <strong>your jewelry will be securely dispatched via insured armored courier to your address.</strong>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#3A2A20] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-neutral-300">
                  <Truck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="text-[11px]">Delivery tracking and status updates will be sent to your email ({completedOrder.customer.email}) and phone.</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyThankYouMessage(completedOrder)}
                    className="px-3.5 py-1.5 bg-[#2A1E18] hover:bg-[#3D2C22] border border-[#D4AF37]/50 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Copy thank you and invoice message to clipboard"
                  >
                    {isMessageCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                    )}
                    <span>{isMessageCopied ? 'Message Copied!' : 'Copy Message'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 bg-[#261E1A] hover:bg-[#3E2D25] border border-[#D4AF37]/50 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Print Tax Invoice</span>
                  </button>

                  {completedOrder.customer.phone && (
                    <a
                      href={`https://wa.me/${completedOrder.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Dear ${completedOrder.customer.name || 'Valued Customer'}, thank you for your purchase from L.A Center Jewelry Inc! Your order #${completedOrder.id} has been confirmed. Your jewelry will be dispatched to your address shortly. Order tracking link: ${window.location.origin}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Invoice</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Receipt Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#FAF9F5] border border-neutral-200/80 text-xs">
              <div>
                <span className="text-neutral-500 block">Order Number</span>
                <span className="font-mono font-semibold text-neutral-900">{completedOrder.id}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Date</span>
                <span className="font-medium text-neutral-900">{completedOrder.createdAt}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Payment Tender</span>
                <span className="font-medium text-neutral-900">{completedOrder.paymentMethod}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Payment Status</span>
                <span className="font-semibold text-[#997C24] uppercase tracking-wider">
                  {completedOrder.paymentStatus}
                </span>
              </div>
            </div>

            {/* Gateway Settlement Receipt */}
            <div className="p-4 bg-[#FAF9F5] border border-[#D4AF37]/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="uppercase tracking-wider font-semibold text-[#997C24] text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Settlement Telemetry &amp; Gateway Reference</span>
                </span>
                {completedOrder.transactionId && (
                  <span className="font-mono text-neutral-600 text-[11px]">
                    Ref: {completedOrder.transactionId}
                  </span>
                )}
              </div>
              {completedOrder.payoutDestination && (
                <p className="text-neutral-700 text-xs">
                  <strong className="text-neutral-900">Settlement Route:</strong>{' '}
                  <span className="font-mono text-[11px] text-[#997C24]">{completedOrder.payoutDestination}</span>
                </p>
              )}

              {/* If bank wire, display wire remittance details */}
              {completedOrder.paymentGateway === 'bank_wire' && bankWireConfig && (
                <div className="mt-3 pt-3 border-t border-neutral-200 space-y-2 text-neutral-700 bg-white p-3 border">
                  <p className="font-serif font-semibold text-neutral-900">
                    Bank Wire Remittance Instructions:
                  </p>
                  <p className="text-[11px] text-neutral-600">
                    Please transmit funds referencing Order ID <strong className="font-mono text-neutral-900">{completedOrder.id}</strong> in the wire memo line.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                    <div>Bank: <strong>{bankWireConfig.bankName}</strong></div>
                    <div>Beneficiary: <strong>{bankWireConfig.accountHolderName}</strong></div>
                    <div>Account: <strong>{bankWireConfig.accountNumber}</strong></div>
                    <div>ABA Routing: <strong>{bankWireConfig.routingNumber}</strong></div>
                    {bankWireConfig.swiftBic && <div>SWIFT / BIC: <strong>{bankWireConfig.swiftBic}</strong></div>}
                  </div>
                </div>
              )}
            </div>

            {/* Items */}
            <div>
              <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-800 mb-3">
                Acquired Pieces
              </h4>
              <div className="divide-y divide-neutral-100 border-t border-b border-neutral-100">
                {completedOrder.items.map((item, i) => (
                  <div key={i} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover border border-neutral-200"
                      />
                      <div>
                        <p className="text-xs font-serif font-medium text-neutral-900">{item.name}</p>
                        <p className="text-[10px] text-neutral-500">
                          Qty: {item.quantity} • SKU: {item.sku}
                        </p>
                      </div>
                    </div>
                    <span className="font-serif text-sm font-semibold text-neutral-900">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="space-y-1.5 text-xs text-neutral-600 border-b border-neutral-200 pb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${completedOrder.subtotal.toLocaleString()}</span>
              </div>
              {completedOrder.discount > 0 && (
                <div className="flex justify-between text-[#997C24]">
                  <span>Privilege Discount</span>
                  <span>-${completedOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Armored Courier Delivery</span>
                <span>{completedOrder.shipping === 0 ? 'Complimentary' : `$${completedOrder.shipping}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax</span>
                <span>${completedOrder.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-serif font-bold text-neutral-900 pt-3 border-t border-neutral-200">
                <span>Total Amount Charged</span>
                <span>${completedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="text-xs text-neutral-600 space-y-1">
              <h4 className="uppercase font-bold tracking-wider text-neutral-800 mb-1">
                Insured Destination Address
              </h4>
              <p className="font-medium text-neutral-900">
                {completedOrder.customer.name || `${completedOrder.customer.firstName} ${completedOrder.customer.lastName}`}
              </p>
              <p>{completedOrder.customer.address}</p>
              <p>
                {completedOrder.customer.city}, {completedOrder.customer.state} {completedOrder.customer.zip}
              </p>
              <p>{completedOrder.customer.country}</p>
              <p className="pt-1 text-neutral-500">Phone: {completedOrder.customer.phone}</p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => navigateTo('shop')}
                className="flex-1 py-3.5 bg-neutral-900 hover:bg-[#D4AF37] hover:text-black text-white text-xs font-bold uppercase tracking-[0.2em] transition-colors text-center"
              >
                Return to Atelier Catalog
              </button>
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="py-3.5 px-6 border border-neutral-300 hover:border-black text-neutral-800 text-xs font-semibold uppercase tracking-wider text-center"
              >
                Atelier Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C827A] mb-1">
            <Lock className="w-3.5 h-3.5 text-[#997C24]" />
            <span>Secure 256-Bit SSL Encrypted Checkout</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-neutral-900">
            Finalize Your Jewelry Acquisition
          </h1>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Fields (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* 1. Contact Info */}
              <div className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-4 shadow-xs">
                <h3 className="font-serif text-xl font-normal text-neutral-900 border-b border-neutral-200 pb-3">
                  1. Patron Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase font-semibold text-neutral-700 block mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Alexander"
                      className="w-full bg-[#FAF9F5] border border-neutral-300 p-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase font-semibold text-neutral-700 block mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Sinclair"
                      className="w-full bg-[#FAF9F5] border border-neutral-300 p-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase font-semibold text-neutral-700 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alexander@domain.com"
                      className="w-full bg-[#FAF9F5] border border-neutral-300 p-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase font-semibold text-neutral-700 block mb-1">
                      Telephone (For Armored Delivery Verification) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (213) 555-0182"
                      className="w-full bg-[#FAF9F5] border border-neutral-300 p-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Shipping Address */}
              <div className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-4 shadow-xs">
                <h3 className="font-serif text-xl font-normal text-neutral-900 border-b border-neutral-200 pb-3">
                  2. Armored Courier Delivery Destination
                </h3>

                <div>
                  <label className="text-xs uppercase font-semibold text-neutral-700 block mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="9405 Wilshire Blvd"
                    className="w-full bg-[#FAF9F5] border border-neutral-300 p-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-semibold text-neutral-700 block mb-1">
                    Apartment / Suite / Building (Optional)
                  </label>
                  <input
                    type="text"
                    value={suite}
                    onChange={(e) => setSuite(e.target.value)}
                    placeholder="Penthouse A"
                    className="w-full bg-[#FAF9F5] border border-neutral-300 p-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs uppercase font-semibold text-neutral-700 block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Beverly Hills"
                      className="w-full bg-[#FAF9F5] border border-neutral-300 p-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase font-semibold text-neutral-700 block mb-1">
                      State / Province *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="CA"
                      className="w-full bg-[#FAF9F5] border border-neutral-300 p-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase font-semibold text-neutral-700 block mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="90212"
                      className="w-full bg-[#FAF9F5] border border-neutral-300 p-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase font-semibold text-neutral-700 block mb-1">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-neutral-300 p-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>
              </div>

              {/* 3. Shipping Options */}
              <div className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-4 shadow-xs">
                <h3 className="font-serif text-xl font-normal text-neutral-900 border-b border-neutral-200 pb-3">
                  3. Armored Transport Preference
                </h3>

                <div className="space-y-3">
                  <label
                    className={`flex items-start justify-between p-4 border cursor-pointer transition-colors ${
                      shippingMethod === 'standard' ? 'border-[#D4AF37] bg-[#FAF9F5]' : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="mt-0.5 accent-[#D4AF37]"
                      />
                      <div>
                        <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider block">
                          Complimentary Armored Courier (2-3 Business Days)
                        </span>
                        <span className="text-xs text-neutral-500 font-light mt-0.5 block">
                          Fully insured with adult identity verification &amp; direct signature required.
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-neutral-900">
                      {cartShipping === 0 ? 'Complimentary' : `$${cartShipping}`}
                    </span>
                  </label>

                  <label
                    className={`flex items-start justify-between p-4 border cursor-pointer transition-colors ${
                      shippingMethod === 'express' ? 'border-[#D4AF37] bg-[#FAF9F5]' : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="mt-0.5 accent-[#D4AF37]"
                      />
                      <div>
                        <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider block">
                          Priority Overnight Armored Courier
                        </span>
                        <span className="text-xs text-neutral-500 font-light mt-0.5 block">
                          Expedited morning dispatch with dedicated jewelry vault handling.
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-neutral-900">$75</span>
                  </label>
                </div>
              </div>

              {/* 4. Payment Method */}
              <div className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <h3 className="font-serif text-xl font-normal text-neutral-900">
                    4. Payment Tender
                  </h3>
                  <span className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#D4AF37]" />
                    256-Bit Encrypted
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Card Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 border flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#D4AF37] bg-[#FAF9F5] shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-400 bg-white'
                    }`}
                  >
                    <CreditCard
                      className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-[#997C24]' : 'text-neutral-500'}`}
                    />
                    <span className="text-xs font-semibold text-neutral-900 tracking-wide">
                      Credit / Debit Card
                    </span>
                    <span className="text-[10px] text-neutral-500">Visa, MC, Amex</span>
                  </button>

                  {/* PayPal Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-3.5 border flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                      paymentMethod === 'paypal'
                        ? 'border-[#0070BA] bg-[#F5F9FD] shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[#003087] font-bold text-xs italic tracking-tighter">
                      <Wallet className="w-4 h-4 text-[#0070BA]" />
                      <span>Pay<span className="text-[#0070BA]">Pal</span></span>
                    </div>
                    <span className="text-xs font-semibold text-neutral-900 tracking-wide">
                      PayPal Express
                    </span>
                    <span className="text-[10px] text-neutral-500">Direct Account Payout</span>
                  </button>

                  {/* Bank Wire Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wire')}
                    className={`p-3.5 border flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                      paymentMethod === 'wire'
                        ? 'border-[#D4AF37] bg-[#FAF9F5] shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-400 bg-white'
                    }`}
                  >
                    <Building2
                      className={`w-5 h-5 ${paymentMethod === 'wire' ? 'text-[#997C24]' : 'text-neutral-500'}`}
                    />
                    <span className="text-xs font-semibold text-neutral-900 tracking-wide">
                      Bank Wire Transfer
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium">3% Wire Incentive</span>
                  </button>
                </div>

                {/* Tender Form Render */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 pt-3 border-t border-neutral-100">
                    <div className="flex items-center justify-between text-xs text-neutral-500 bg-[#FAF9F5] p-3 border border-neutral-200/70">
                      <span>Statement Descriptor:</span>
                      <span className="font-mono font-medium text-neutral-900">
                        {stripeConfig?.statementDescriptor || 'LA CENTER JEWELRY'}
                      </span>
                    </div>

                    <div>
                      <label className="text-xs uppercase font-semibold text-neutral-700 block mb-1">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Alexander Sinclair"
                        className="w-full bg-[#FAF9F5] border border-neutral-300 p-2.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="text-xs uppercase font-semibold text-neutral-700 block mb-1">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                          const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                          setCardNumber(formatted);
                        }}
                        placeholder="4532 •••• •••• 8892"
                        maxLength={19}
                        className="w-full bg-[#FAF9F5] border border-neutral-300 p-2.5 text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs uppercase font-semibold text-neutral-700 block mb-1">
                          Expiry (MM/YY) *
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                            if (val.length >= 3) {
                              val = `${val.slice(0, 2)}/${val.slice(2)}`;
                            }
                            setCardExpiry(val);
                          }}
                          placeholder="09/28"
                          maxLength={5}
                          className="w-full bg-[#FAF9F5] border border-neutral-300 p-2.5 text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase font-semibold text-neutral-700 block mb-1">
                          CVV / Security Code *
                        </label>
                        <input
                          type="password"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full bg-[#FAF9F5] border border-neutral-300 p-2.5 text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>

                    <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#997C24]" />
                        Funds direct to merchant deposit account
                      </span>
                      <span className="font-mono text-neutral-400">PCI-DSS Tier 1 Vault</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="space-y-4 pt-3 border-t border-[#0070BA]/20">
                    <div className="p-4 bg-[#F5F9FD] border border-[#BDE0FE] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase text-[#003087] tracking-wider flex items-center gap-1.5">
                          <Wallet className="w-4 h-4 text-[#0070BA]" />
                          PayPal Official Settlement Gateway
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 border border-emerald-300">
                          Active Recipient
                        </span>
                      </div>

                      <p className="text-xs text-neutral-700 leading-relaxed">
                        Dollars collected from this acquisition will be transmitted immediately and securely to the atelier administrator&apos;s verified PayPal account:
                      </p>

                      <div className="p-2.5 bg-white border border-[#0070BA]/30 font-mono text-xs text-[#003087] font-semibold flex items-center justify-between">
                        <span>{paypalConfig?.merchantEmail || 'alanboy515253@gmail.com'}</span>
                        <span className="text-[10px] text-neutral-500 font-sans font-normal uppercase">
                          USD Primary
                        </span>
                      </div>

                      <div className="pt-2">
                        <div className="w-full py-3 bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] text-xs font-bold flex items-center justify-center gap-2 border border-[#E0A820] shadow-xs">
                          <span>Pay with</span>
                          <span className="font-serif italic font-extrabold text-sm text-[#003087]">
                            Pay<span className="text-[#0070BA]">Pal</span>
                          </span>
                          <span className="text-[11px] font-normal text-neutral-800">
                            (${finalTotal.toLocaleString()} USD)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                        <span>Zero patron transaction fees</span>
                        <span>PayPal Purchase Protection Guarantee</span>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'wire' && (
                  <div className="space-y-3.5 pt-3 border-t border-neutral-100">
                    {wireDiscount > 0 && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                        <span className="font-semibold">
                          3% Bank Wire Privilege Discount Applied!
                        </span>
                        <span className="font-serif font-bold">
                          -${wireDiscount.toLocaleString()} Saved
                        </span>
                      </div>
                    )}

                    <div className="p-4 bg-[#FAF9F5] border border-neutral-300 space-y-3 text-xs text-neutral-700">
                      <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                        <span className="font-serif font-bold text-sm text-neutral-900">
                          {bankWireConfig?.bankName || 'JPMorgan Chase Bank, N.A.'}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-[#997C24] bg-white px-2 py-0.5 border border-[#D4AF37]/40">
                          Official Settlement Account
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-white p-2.5 border border-neutral-200">
                          <span className="text-neutral-500 block text-[10px] uppercase">
                            Account Holder / Beneficiary:
                          </span>
                          <span className="font-medium text-neutral-900 block mt-0.5">
                            {bankWireConfig?.accountHolderName || 'L.A Center Jewelry Inc'}
                          </span>
                        </div>

                        <div className="bg-white p-2.5 border border-neutral-200 flex items-center justify-between">
                          <div>
                            <span className="text-neutral-500 block text-[10px] uppercase">
                              Account Number:
                            </span>
                            <span className="font-mono font-bold text-neutral-900 block mt-0.5">
                              {bankWireConfig?.accountNumber || '88392019482'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                bankWireConfig?.accountNumber || '88392019482',
                                'Account Number'
                              )
                            }
                            className="p-1.5 hover:bg-neutral-100 text-neutral-600 border border-neutral-200"
                            title="Copy Account Number"
                          >
                            {copiedBankInfo === 'Account Number' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        <div className="bg-white p-2.5 border border-neutral-200 flex items-center justify-between">
                          <div>
                            <span className="text-neutral-500 block text-[10px] uppercase">
                              ABA / Routing Number:
                            </span>
                            <span className="font-mono font-bold text-neutral-900 block mt-0.5">
                              {bankWireConfig?.routingNumber || '122000496'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                bankWireConfig?.routingNumber || '122000496',
                                'Routing Number'
                              )
                            }
                            className="p-1.5 hover:bg-neutral-100 text-neutral-600 border border-neutral-200"
                            title="Copy Routing Number"
                          >
                            {copiedBankInfo === 'Routing Number' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        <div className="bg-white p-2.5 border border-neutral-200 flex items-center justify-between">
                          <div>
                            <span className="text-neutral-500 block text-[10px] uppercase">
                              SWIFT / BIC (International):
                            </span>
                            <span className="font-mono font-bold text-neutral-900 block mt-0.5">
                              {bankWireConfig?.swiftBic || 'CHASUS33'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                bankWireConfig?.swiftBic || 'CHASUS33',
                                'SWIFT Code'
                              )
                            }
                            className="p-1.5 hover:bg-neutral-100 text-neutral-600 border border-neutral-200"
                            title="Copy SWIFT Code"
                          >
                            {copiedBankInfo === 'SWIFT Code' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {bankWireConfig?.bankAddress && (
                        <p className="text-[11px] text-neutral-500">
                          Branch Address: {bankWireConfig.bankAddress}
                        </p>
                      )}

                      <p className="text-[11px] text-neutral-500 leading-relaxed border-t border-neutral-200 pt-2">
                        {bankWireConfig?.wireInstructions ||
                          'Please quote your Order Reference ID in the remittance memo. Vault release will proceed upon funds clearance.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Order Review (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-xs sticky top-28">
                <h3 className="font-serif text-xl font-normal text-neutral-900 border-b border-neutral-200 pb-3">
                  Summary of Selected Pieces
                </h3>

                {/* Items preview */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {cart.map((item, i) => {
                    const price = item.product.salePrice || item.product.price;
                    return (
                      <div key={i} className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.product.thumbnail}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover border border-neutral-200 flex-shrink-0"
                          />
                          <div>
                            <p className="font-serif font-medium text-neutral-900 line-clamp-1">
                              {item.product.name}
                            </p>
                            <p className="text-[11px] text-neutral-500">
                              Qty: {item.quantity} • {item.selectedMetal || item.product.metalType}
                            </p>
                          </div>
                        </div>
                        <span className="font-serif font-semibold text-neutral-900 whitespace-nowrap">
                          ${(price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotals */}
                <div className="space-y-2 text-xs text-neutral-600 border-t border-neutral-100 pt-4">
                  <div className="flex justify-between">
                    <span>Merchandise Value</span>
                    <span className="font-medium text-neutral-900">${cartSubtotal.toLocaleString()}</span>
                  </div>
                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-[#997C24]">
                      <span>Privilege Discount</span>
                      <span>-${cartDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  {wireDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Bank Wire Incentive (3%)</span>
                      <span>-${wireDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Armored Courier</span>
                    <span>{shippingCost === 0 ? 'Complimentary' : `$${shippingCost}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>California Sales Tax ({siteSettings.taxRatePercent}%)</span>
                    <span>${cartTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xl font-serif font-bold text-neutral-900 pt-3 border-t border-neutral-200">
                    <span>Total Valuation</span>
                    <span>${finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-[0.22em] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Authorizing High-Value Transaction...</span>
                  ) : paymentMethod === 'paypal' ? (
                    <>
                      <Wallet className="w-4 h-4" />
                      <span>Proceed with PayPal (${finalTotal.toLocaleString()})</span>
                    </>
                  ) : paymentMethod === 'wire' ? (
                    <>
                      <Building2 className="w-4 h-4" />
                      <span>Confirm &amp; Generate Wire Remittance (${finalTotal.toLocaleString()})</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Confirm &amp; Place Acquisition (${finalTotal.toLocaleString()})</span>
                    </>
                  )}
                </button>

                <div className="text-center text-[11px] text-neutral-400 space-y-1">
                  <p className="flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Insured Underwriter Coverage by Lloyd&apos;s of London Syndicate
                  </p>
                  <p>Inquiries? Call our Broadway Salon: {siteSettings.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
