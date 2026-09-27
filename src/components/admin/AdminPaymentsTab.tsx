import React, { useState } from 'react';
import {
  CreditCard,
  Building2,
  Save,
  Eye,
  EyeOff,
  Zap,
  Check,
  Wallet,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentGatewaysConfig } from '../../types';

export const AdminPaymentsTab: React.FC = () => {
  const { siteSettings, updateSiteSettings, showToast, createOrder } = useApp();

  const [form, setForm] = useState<PaymentGatewaysConfig>(() => {
    return (
      siteSettings.paymentGateways || {
        stripe: {
          enabled: true,
          mode: 'live',
          publishableKey: 'pk_live_51PlaCenterJewelry89214Secured',
          secretKey: 'sk_live_••••••••••••••••••••••••••••',
          payoutCardNumber: '•••• •••• •••• 4242',
          payoutCardHolder: 'L.A Center Jewelry Inc / Management',
          statementDescriptor: 'LA CENTER JEWELRY',
        },
        paypal: {
          enabled: true,
          mode: 'live',
          merchantEmail: 'alanboy515253@gmail.com',
          clientId: 'client_live_paypal_lacenter_8820',
          clientSecret: 'secret_live_paypal_••••••••••••',
        },
        bankWire: {
          enabled: true,
          bankName: 'JPMorgan Chase Bank, N.A.',
          accountHolderName: 'L.A Center Jewelry Inc',
          accountNumber: '982019482710',
          routingNumber: '122000496',
          swiftBic: 'CHASUS33',
          bankAddress:
            '707 Wilshire Blvd, Los Angeles, CA 90017',
          wireInstructions:
            'Please include your Order ID in wire memo line. Domestic Fedwire settles same business day.',
          discountPercent: 3,
        },
      }
    );
  });

  const [activeGatewayTab, setActiveGatewayTab] = useState<'stripe' | 'paypal' | 'bankWire'>('stripe');
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    updateSiteSettings({
      ...siteSettings,
      paymentGateways: form,
    });

    setIsSaved(true);
    showToast('Payment gateway settings saved successfully.', 'success');
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleTestPurchase = (gateway: 'stripe' | 'paypal' | 'bank_wire') => {
    setIsSimulating(true);

    setTimeout(() => {
      let payoutTarget = '';
      let gatewayName = '';

      if (gateway === 'stripe') {
        gatewayName = 'Credit Card (Stripe)';
        payoutTarget = `Card ${form.stripe.payoutCardNumber}`;
      } else if (gateway === 'paypal') {
        gatewayName = 'PayPal Express';
        payoutTarget = `PayPal ${form.paypal.merchantEmail}`;
      } else {
        gatewayName = 'Bank Wire';
        payoutTarget = `${form.bankWire.bankName} (${form.bankWire.accountNumber.slice(-4)})`;
      }

      const simOrder = createOrder({
        customer: {
          firstName: 'Alexander',
          lastName: 'Sinclair',
          name: 'Alexander Sinclair',
          email: 'patron.sinclair@atelier-client.com',
          phone: '+1 310-555-0199',
          address: '9500 Wilshire Blvd',
          city: 'Beverly Hills',
          state: 'CA',
          zip: '90212',
          country: 'United States',
        },
        items: [
          {
            productId: 'prod-diamond-ring-test',
            name: 'Solitaire Oval Diamond Ring',
            sku: 'LAC-TEST-SIM',
            price: 7500,
            quantity: 1,
            image:
              'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
            metalType: '18K Yellow Gold',
            size: '6.5',
          },
        ],
        subtotal: 7500,
        discount: 0,
        tax: 712,
        shipping: 0,
        total: 8212,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: gatewayName,
        paymentGateway: gateway,
        transactionId: `SIM-TXN-${Date.now().toString().slice(-6)}`,
        payoutDestination: payoutTarget,
      });

      setIsSimulating(false);
      showToast(`Test order ${simOrder.orderNumber} ($8,212) routed to ${payoutTarget}`, 'success');
    }, 800);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 text-white">
      {/* Smart Compact Header */}
      <div className="bg-[#181210] border border-[#2D211B] p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-white flex items-center gap-2">
            <span>Payment Gateways</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
            <span className="text-[11px] text-neutral-400 font-sans font-normal hidden sm:inline-block">
              Payout Channels
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure credit card, PayPal, and bank wire settlement accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSave()}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-lg cursor-pointer transition-colors shadow-sm shrink-0"
        >
          {isSaved ? <Check className="w-4 h-4 font-bold" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Saved!' : 'Save Settings'}</span>
        </button>
      </div>

      {/* 3 Summary Cards - Clean & Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
        {/* Credit Card Card */}
        <div
          onClick={() => setActiveGatewayTab('stripe')}
          className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
            activeGatewayTab === 'stripe'
              ? 'bg-[#1E1713] border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]/50'
              : 'bg-[#15100E] border-[#2A1F1A] hover:border-[#3D2C24]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Cards (Stripe)
                </h4>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {form.stripe.mode === 'live' ? 'Live' : 'Test'}
                </span>
              </div>
            </div>
            <span
              className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                form.stripe.enabled
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                  : 'bg-neutral-800 text-neutral-500'
              }`}
            >
              {form.stripe.enabled ? 'Active' : 'Off'}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#261B16] text-[11px] font-mono text-neutral-300 truncate">
            {form.stripe.payoutCardNumber || 'Linked Card'}
          </div>
        </div>

        {/* PayPal Card */}
        <div
          onClick={() => setActiveGatewayTab('paypal')}
          className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
            activeGatewayTab === 'paypal'
              ? 'bg-[#141A24] border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/50'
              : 'bg-[#15100E] border-[#2A1F1A] hover:border-[#3D2C24]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center font-bold text-sm">
                P
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  PayPal
                </h4>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {form.paypal.mode === 'live' ? 'Live' : 'Sandbox'}
                </span>
              </div>
            </div>
            <span
              className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                form.paypal.enabled
                  ? 'bg-blue-950/80 text-blue-400 border border-blue-800'
                  : 'bg-neutral-800 text-neutral-500'
              }`}
            >
              {form.paypal.enabled ? 'Active' : 'Off'}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#261B16] text-[11px] text-neutral-300 truncate font-mono">
            {form.paypal.merchantEmail || 'Not set'}
          </div>
        </div>

        {/* Bank Wire Card */}
        <div
          onClick={() => setActiveGatewayTab('bankWire')}
          className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
            activeGatewayTab === 'bankWire'
              ? 'bg-[#121A16] border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50'
              : 'bg-[#15100E] border-[#2A1F1A] hover:border-[#3D2C24]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Bank Wire
                </h4>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {form.bankWire.discountPercent > 0 ? `${form.bankWire.discountPercent}% off` : 'Fedwire/ACH'}
                </span>
              </div>
            </div>
            <span
              className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                form.bankWire.enabled
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                  : 'bg-neutral-800 text-neutral-500'
              }`}
            >
              {form.bankWire.enabled ? 'Active' : 'Off'}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#261B16] text-[11px] text-neutral-300 truncate font-mono">
            {form.bankWire.bankName || 'JPMorgan Chase'}
          </div>
        </div>
      </div>

      {/* Smart Mobile Tab Navigation Bar */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#140F0D] border border-[#2D211B] rounded-xl">
        <button
          type="button"
          onClick={() => setActiveGatewayTab('stripe')}
          className={`flex-1 py-2 sm:py-2.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeGatewayTab === 'stripe'
              ? 'bg-[#D4AF37] text-black font-bold shadow-xs'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Card (Stripe)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveGatewayTab('paypal')}
          className={`flex-1 py-2 sm:py-2.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeGatewayTab === 'paypal'
              ? 'bg-blue-600 text-white font-bold shadow-xs'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <span className="font-serif font-bold text-xs">P</span>
          <span>PayPal</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveGatewayTab('bankWire')}
          className={`flex-1 py-2 sm:py-2.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeGatewayTab === 'bankWire'
              ? 'bg-emerald-600 text-white font-bold shadow-xs'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Bank Wire</span>
        </button>
      </div>

      {/* Gateway Configuration Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: STRIPE / CARD */}
        {activeGatewayTab === 'stripe' && (
          <div className="bg-[#181210] border border-[#2D211B] p-4 sm:p-6 rounded-xl space-y-5 animate-in fade-in duration-200">
            {/* Header + Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#261B16] gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg text-white font-medium">
                    Credit &amp; Debit Card (Stripe)
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Accept Visa, MasterCard, and American Express with instant deposits.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.stripe.enabled}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        stripe: { ...form.stripe, enabled: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5.5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#D4AF37]" />
                  <span className="ml-2 text-xs font-semibold text-white uppercase tracking-wider">
                    {form.stripe.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => handleTestPurchase('stripe')}
                  disabled={isSimulating || !form.stripe.enabled}
                  className="px-3 py-1.5 bg-[#241A15] hover:bg-[#34241D] border border-[#3E2C22] text-[#D4AF37] text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <Zap className="w-3 h-3" />
                  <span>Test Card</span>
                </button>
              </div>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Environment Mode */}
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-semibold block uppercase text-[11px]">
                  Environment
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        stripe: { ...form.stripe, mode: 'live' },
                      })
                    }
                    className={`py-2 px-3 border rounded-lg text-center font-semibold text-xs transition-colors cursor-pointer ${
                      form.stripe.mode === 'live'
                        ? 'bg-emerald-950/50 border-emerald-500 text-emerald-400 font-bold'
                        : 'bg-[#120E0C] border-[#2E221B] text-neutral-400'
                    }`}
                  >
                    ● Live Mode
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        stripe: { ...form.stripe, mode: 'test' },
                      })
                    }
                    className={`py-2 px-3 border rounded-lg text-center font-semibold text-xs transition-colors cursor-pointer ${
                      form.stripe.mode === 'test'
                        ? 'bg-amber-950/50 border-amber-500 text-amber-400 font-bold'
                        : 'bg-[#120E0C] border-[#2E221B] text-neutral-400'
                    }`}
                  >
                    ○ Test Mode
                  </button>
                </div>
              </div>

              {/* Beneficiary Name */}
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-semibold block uppercase text-[11px]">
                  Account Holder *
                </label>
                <input
                  type="text"
                  value={form.stripe.payoutCardHolder}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stripe: { ...form.stripe, payoutCardHolder: e.target.value },
                    })
                  }
                  placeholder="e.g. L.A Center Jewelry Inc"
                  className="w-full bg-[#120E0C] border border-[#2E221B] focus:border-[#D4AF37] p-2.5 rounded-lg text-white focus:outline-none"
                />
              </div>

              {/* Payout Card */}
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-semibold block uppercase text-[11px]">
                  Payout Card Number *
                </label>
                <input
                  type="text"
                  value={form.stripe.payoutCardNumber}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stripe: { ...form.stripe, payoutCardNumber: e.target.value },
                    })
                  }
                  placeholder="•••• •••• •••• 4242"
                  className="w-full bg-[#120E0C] border border-[#2E221B] focus:border-[#D4AF37] p-2.5 rounded-lg text-white font-mono focus:outline-none"
                />
              </div>

              {/* Statement Descriptor */}
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-semibold block uppercase text-[11px]">
                  Statement Descriptor *
                </label>
                <input
                  type="text"
                  value={form.stripe.statementDescriptor}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stripe: { ...form.stripe, statementDescriptor: e.target.value.toUpperCase() },
                    })
                  }
                  placeholder="e.g. LA CENTER JEWELRY"
                  maxLength={22}
                  className="w-full bg-[#120E0C] border border-[#2E221B] focus:border-[#D4AF37] p-2.5 rounded-lg text-white uppercase font-mono focus:outline-none"
                />
              </div>

              {/* Stripe Publishable Key */}
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-semibold block uppercase text-[11px]">
                  Publishable Key
                </label>
                <input
                  type="text"
                  value={form.stripe.publishableKey}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stripe: { ...form.stripe, publishableKey: e.target.value },
                    })
                  }
                  placeholder="pk_live_..."
                  className="w-full bg-[#120E0C] border border-[#2E221B] focus:border-[#D4AF37] p-2.5 rounded-lg text-white font-mono text-[11px] focus:outline-none"
                />
              </div>

              {/* Stripe Secret Key */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-neutral-300 font-semibold uppercase text-[11px]">
                    Secret Key
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="text-[10px] text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {showSecretKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showSecretKey ? 'Hide' : 'Reveal'}</span>
                  </button>
                </div>
                <input
                  type={showSecretKey ? 'text' : 'password'}
                  value={form.stripe.secretKey}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stripe: { ...form.stripe, secretKey: e.target.value },
                    })
                  }
                  placeholder="sk_live_..."
                  className="w-full bg-[#120E0C] border border-[#2E221B] focus:border-[#D4AF37] p-2.5 rounded-lg text-white font-mono text-[11px] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PAYPAL */}
        {activeGatewayTab === 'paypal' && (
          <div className="bg-[#181210] border border-[#2D211B] p-4 sm:p-6 rounded-xl space-y-5 animate-in fade-in duration-200">
            {/* Header + Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#261B16] gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/40 flex items-center justify-center text-blue-400 font-serif font-bold text-sm">
                  P
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg text-white font-medium">
                    PayPal Express
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Receive customer payments directly to your PayPal account.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.paypal.enabled}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        paypal: { ...form.paypal, enabled: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5.5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-blue-600" />
                  <span className="ml-2 text-xs font-semibold text-white uppercase tracking-wider">
                    {form.paypal.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => handleTestPurchase('paypal')}
                  disabled={isSimulating || !form.paypal.enabled}
                  className="px-3 py-1.5 bg-[#1B2332] hover:bg-[#253247] border border-[#2E3E5C] text-blue-400 text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <Zap className="w-3 h-3" />
                  <span>Test PayPal</span>
                </button>
              </div>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* PayPal Receiving Email */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-neutral-300 font-semibold block uppercase text-[11px] flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-blue-400" />
                  <span>Receiving PayPal Email *</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.paypal.merchantEmail}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      paypal: { ...form.paypal, merchantEmail: e.target.value },
                    })
                  }
                  placeholder="e.g. alanboy515253@gmail.com"
                  className="w-full bg-[#120E0C] border border-[#2E221B] focus:border-blue-400 p-2.5 rounded-lg text-white font-medium focus:outline-none"
                />
              </div>

              {/* PayPal Mode */}
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-semibold block uppercase text-[11px]">
                  Environment
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        paypal: { ...form.paypal, mode: 'live' },
                      })
                    }
                    className={`py-2 px-3 border rounded-lg text-center font-semibold text-xs transition-colors cursor-pointer ${
                      form.paypal.mode === 'live'
                        ? 'bg-blue-950/50 border-blue-500 text-blue-400 font-bold'
                        : 'bg-[#120E0C] border-[#2E221B] text-neutral-400'
                    }`}
                  >
                    ● Live Mode
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        paypal: { ...form.paypal, mode: 'sandbox' },
                      })
                    }
                    className={`py-2 px-3 border rounded-lg text-center font-semibold text-xs transition-colors cursor-pointer ${
                      form.paypal.mode === 'sandbox'
                        ? 'bg-amber-950/50 border-amber-500 text-amber-400 font-bold'
                        : 'bg-[#120E0C] border-[#2E221B] text-neutral-400'
                    }`}
                  >
                    ○ Sandbox
                  </button>
                </div>
              </div>

              {/* Client ID */}
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-semibold block uppercase text-[11px]">
                  Client ID (Optional)
                </label>
                <input
                  type="text"
                  value={form.paypal.clientId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      paypal: { ...form.paypal, clientId: e.target.value },
                    })
                  }
                  placeholder="client_live_..."
                  className="w-full bg-[#120E0C] border border-[#2E221B] focus:border-blue-400 p-2.5 rounded-lg text-white font-mono text-[11px] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BANK WIRE */}
        {activeGatewayTab === 'bankWire' && (
          <div className="bg-[#181210] border border-[#2D211B] p-4 sm:p-6 rounded-xl space-y-5 animate-in fade-in duration-200">
            {/* Header + Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#261B16] gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg text-white font-medium">
                    Bank Wire Transfer
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Direct bank-to-bank settlement via Fedwire or ACH.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.bankWire.enabled}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bankWire: { ...form.bankWire, enabled: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5.5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-emerald-600" />
                  <span className="ml-2 text-xs font-semibold text-white uppercase tracking-wider">
                    {form.bankWire.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => handleTestPurchase('bank_wire')}
                  disabled={isSimulating || !form.bankWire.enabled}
                  className="px-3 py-1.5 bg-[#16231D] hover:bg-[#20332B] border border-[#274537] text-emerald-400 text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <Zap className="w-3 h-3" />
                  <span>Test Wire</span>
                </button>
              </div>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Bank Name */}
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-semibold block uppercase text-[11px]">
                  Bank Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.bankWire.bankName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bankWire: { ...form.bankWire, bankName: e.target.value },
                    })
                  }
                  placeholder="e.g. JPMorgan Chase Bank"
                  className="w-full bg-[#120E0C] border border-[#2E221B] focus:border-emerald-400 p-2.5 rounded-lg text-white focus:outline-none"
                />
              </div>

              {/* Account Holder */}
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-semibold block uppercase text-[11px]">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.bankWire.accountHolderName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bankWire: { ...form.bankWire, accountHolderName: e.target.value },
                    })
                  }
                  placeholder="e.g. L.A Center Jewelry Inc"
                  className="w-full bg-[#120E0C] border border-[#2E221B] focus:border-emerald-400 p-2.5 rounded-lg text-white focus:outline-none"
                />
              </div>

              {/* Account Number */}
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-semibold block uppercase text-[11px]">
                  Account Number *
                </label>
                <input
                  type="text"
                  required
                  value={form.bankWire.accountNumber}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bankWire: { ...form.bankWire, accountNumber: e.target.value },
                    })
                  }
                  placeholder="e.g. 982019482710"
                  className="w-full bg-[#120E0C] border border-[#2E221B] focus:border-emerald-400 p-2.5 rounded-lg text-white font-mono focus:outline-none"
                />
              </div>

              {/* Routing Number */}
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-semibold block uppercase text-[11px]">
                  Routing Number (ABA) *
                </label>
                <input
                  type="text"
                  required
                  value={form.bankWire.routingNumber}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bankWire: { ...form.bankWire, routingNumber: e.target.value },
                    })
                  }
                  placeholder="9-digit routing"
                  maxLength={9}
                  className="w-full bg-[#120E0C] border border-[#2E221B] focus:border-emerald-400 p-2.5 rounded-lg text-white font-mono focus:outline-none"
                />
              </div>

              {/* SWIFT */}
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-semibold block uppercase text-[11px]">
                  SWIFT / BIC Code
                </label>
                <input
                  type="text"
                  value={form.bankWire.swiftBic}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bankWire: { ...form.bankWire, swiftBic: e.target.value.toUpperCase() },
                    })
                  }
                  placeholder="e.g. CHASUS33"
                  className="w-full bg-[#120E0C] border border-[#2E221B] focus:border-emerald-400 p-2.5 rounded-lg text-white font-mono uppercase focus:outline-none"
                />
              </div>

              {/* Discount */}
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-semibold block uppercase text-[11px]">
                  Wire Incentive Discount (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={20}
                    step={0.5}
                    value={form.bankWire.discountPercent}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bankWire: {
                          ...form.bankWire,
                          discountPercent: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full bg-[#120E0C] border border-[#2E221B] focus:border-emerald-400 p-2.5 rounded-lg text-white focus:outline-none pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-neutral-400 font-bold">%</span>
                </div>
              </div>

              {/* Bank Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-neutral-300 font-semibold block uppercase text-[11px]">
                  Branch Address
                </label>
                <input
                  type="text"
                  value={form.bankWire.bankAddress}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bankWire: { ...form.bankWire, bankAddress: e.target.value },
                    })
                  }
                  placeholder="e.g. 707 Wilshire Blvd, Los Angeles, CA 90017"
                  className="w-full bg-[#120E0C] border border-[#2E221B] focus:border-emerald-400 p-2.5 rounded-lg text-white focus:outline-none"
                />
              </div>

              {/* Wire Instructions */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-neutral-300 font-semibold block uppercase text-[11px]">
                  Checkout Wire Instructions
                </label>
                <textarea
                  rows={2}
                  value={form.bankWire.wireInstructions}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bankWire: { ...form.bankWire, wireInstructions: e.target.value },
                    })
                  }
                  placeholder="Instructions for patrons paying via wire..."
                  className="w-full bg-[#120E0C] border border-[#2E221B] focus:border-emerald-400 p-2.5 rounded-lg text-white focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="p-4 bg-[#181210] border border-[#2D211B] rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden sm:inline">Settings save directly to Firestore and local storage.</span>
            <span className="sm:hidden">Auto-synced to cloud.</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#D4AF37] hover:bg-[#b59226] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-lg cursor-pointer transition-colors shadow-sm"
          >
            {isSaved ? <Check className="w-4 h-4 font-bold" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Saved!' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
