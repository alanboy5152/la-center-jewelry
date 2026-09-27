import React from 'react';
import { ShieldCheck, Truck, RotateCcw, FileText, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PolicyPageProps {
  type: 'privacy' | 'terms' | 'shipping' | 'returns';
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ type }) => {
  const { siteSettings, navigateTo } = useApp();

  const titles = {
    privacy: 'Privacy & Client Data Discretion Policy',
    terms: 'Terms of Service & Atelier Conditions',
    shipping: 'High-Value Armored Courier Shipping Policy',
    returns: '30-Day Inspection, Returns & Appraisal Guarantee',
  };

  const icons = {
    privacy: ShieldCheck,
    terms: FileText,
    shipping: Truck,
    returns: RotateCcw,
  };

  const IconComponent = icons[type];

  return (
    <div className="min-h-screen bg-[#FAF9F5] py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#8C827A] hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Salon Home
        </button>

        <div className="bg-white border border-neutral-200 p-8 sm:p-12 shadow-xs space-y-8">
          <div className="border-b border-neutral-200 pb-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-neutral-200 flex items-center justify-center text-[#997C24] flex-shrink-0">
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-[0.28em] font-semibold text-[#997C24] block mb-1">
                L.A Center Jewelry Inc
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-normal text-neutral-900">
                {titles[type]}
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Last revised: January 2026 • 720 S Broadway, Los Angeles, CA 90014
              </p>
            </div>
          </div>

          <div className="prose prose-neutral max-w-none text-xs sm:text-sm text-neutral-700 leading-relaxed font-light space-y-6">
            {type === 'privacy' && (
              <>
                <h3 className="font-serif text-lg font-medium text-neutral-900">
                  1. High Jewelry Client Confidentiality
                </h3>
                <p>
                  At L.A Center Jewelry Inc (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;), protecting the privacy and transaction security of our patrons is paramount. We do not sell, rent, monetize, or publicly distribute any personal, financial, or shipping data collected during salon visits or web orders.
                </p>

                <h3 className="font-serif text-lg font-medium text-neutral-900">
                  2. Collection &amp; Purpose of Information
                </h3>
                <p>
                  We collect information necessary to fulfill bespoke orders, gemological insurance appraisals, and armored logistics. This includes your name, verified shipping destination, contact telephone, and payment confirmation. All digital payment transmissions utilize PCI-DSS Level 1 compliant tokenization.
                </p>

                <h3 className="font-serif text-lg font-medium text-neutral-900">
                  3. Inquiries
                </h3>
                <p>
                  For privacy inquiries or deletion requests, contact our Downtown Los Angeles atelier directly at {siteSettings.phone} or {siteSettings.email}.
                </p>
              </>
            )}

            {type === 'terms' && (
              <>
                <h3 className="font-serif text-lg font-medium text-neutral-900">
                  1. Atelier Purchase Agreement
                </h3>
                <p>
                  By placing an order with L.A Center Jewelry Inc, you confirm that you are at least 18 years of age and authorized to execute high-value transactions. All jewelry pieces remain property of L.A Center Jewelry Inc until full settlement has verified.
                </p>

                <h3 className="font-serif text-lg font-medium text-neutral-900">
                  2. Gemstone &amp; Metal Authenticity
                </h3>
                <p>
                  All diamond and gold descriptions, carat weights, and color grades are certified according to GIA, IGI, or our accredited in-house gemological standards. Weight tolerances conform to standard FTC jewelry guidelines (+/- 0.05 ct for multi-stone mountings).
                </p>

                <h3 className="font-serif text-lg font-medium text-neutral-900">
                  3. Governing Jurisdiction
                </h3>
                <p>
                  Any dispute related to jewelry acquisitions shall be governed under the laws of the State of California, with venue situated in the County of Los Angeles.
                </p>
              </>
            )}

            {type === 'shipping' && (
              <>
                <h3 className="font-serif text-lg font-medium text-neutral-900">
                  1. Armored Courier Transit
                </h3>
                <p>
                  Due to the high-value nature of fine jewelry, all domestic shipments are dispatched via insured armored freight services (FedEx Priority Alert / Malca-Amit) in unmarked, tamper-evident packaging.
                </p>

                <h3 className="font-serif text-lg font-medium text-neutral-900">
                  2. Adult Signature &amp; Identity Verification
                </h3>
                <p>
                  For security, an adult (21+) with government photo identification matching the billing address must be physically present to sign upon delivery. Packages cannot be redirected or left unattended.
                </p>

                <h3 className="font-serif text-lg font-medium text-neutral-900">
                  3. Showroom Pickup
                </h3>
                <p>
                  Patrons may elect complimentary in-person salon pickup at our Downtown Los Angeles showroom: 720 S Broadway, Los Angeles, CA 90014.
                </p>
              </>
            )}

            {type === 'returns' && (
              <>
                <h3 className="font-serif text-lg font-medium text-neutral-900">
                  1. 30-Day Inspection Period
                </h3>
                <p>
                  We extend a 30-day inspection privilege for all catalog jewelry pieces. Items must be returned in their original unworn condition with all safety seals, jewelry presentation boxes, and laboratory grading certificates intact.
                </p>

                <h3 className="font-serif text-lg font-medium text-neutral-900">
                  2. Custom &amp; Bespoke Commissions
                </h3>
                <p>
                  Custom-cast rings, personalized engravings, and special-order diamond layouts are final sale but covered by our lifetime craftsmanship guarantee and one complimentary resizing within 12 months.
                </p>

                <h3 className="font-serif text-lg font-medium text-neutral-900">
                  3. Return Process
                </h3>
                <p>
                  Contact concierge at {siteSettings.phone} to receive an insured return shipping label and authorized appraisal intake number.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
