import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { 
  ArrowLeft, 
  RotateCcw, 
  Clock, 
  Package, 
  ShieldAlert, 
  CreditCard, 
  Coins, 
  AlertOctagon, 
  Star, 
  ShieldCheck, 
  MessageSquare, 
  AlertTriangle, 
  FileText, 
  Scale, 
  UserCheck, 
  HelpCircle,
  TrendingUp,
  Truck
} from 'lucide-react';
import { motion } from 'motion/react';

type PolicyTab = 'all' | 'returns' | 'refunds' | 'reviews' | 'terms';

export const LegalPoliciesScreen: React.FC = () => {
  const { navigateTo } = useAppState();
  const [activeTab, setActiveTab] = useState<PolicyTab>('all');

  const tabs: { id: PolicyTab; label: string }[] = [
    { id: 'all', label: 'All Policies' },
    { id: 'returns', label: 'Return Policy' },
    { id: 'refunds', label: 'Refund Policy' },
    { id: 'reviews', label: 'Reviews Policy' },
    { id: 'terms', label: 'Terms & Conditions' }
  ];

  const handleBack = () => {
    // Navigate back to settings or profile
    navigateTo('settings');
  };

  return (
    <div id="legal-policies-screen-container" className="pb-24 pt-4 bg-slate-50 min-h-screen">
      {/* 1. Top Header Area */}
      <div className="px-4 flex items-center gap-3">
        <button
          onClick={handleBack}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-100 shadow-xs hover:bg-slate-50 active:scale-90 transition"
          aria-label="Go Back"
        >
          <ArrowLeft className="h-4 w-4 text-slate-800" />
        </button>
        <div>
          <h2 className="text-lg font-black tracking-tight text-slate-900">Legal & Policy Center</h2>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">VELRIVA Customer Care</p>
        </div>
      </div>

      {/* 2. Customer Trust Banner */}
      <div className="mx-4 mt-4 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
            Indian Buyer Trust
          </span>
          <h3 className="text-sm font-black mt-1">100% Secure Purchasing Protections</h3>
          <p className="text-[10px] text-slate-300 leading-relaxed mt-1">
            Our consumer safety protocols adhere to Indian digital marketplace regulations to ensure fair orders & reliable resolutions.
          </p>
        </div>
        <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
          <ShieldCheck className="w-24 h-24" />
        </div>
      </div>

      {/* 3. Horizontal Scrollable Tab Bar */}
      <div className="mt-4 px-4 overflow-x-auto scrollbar-none flex gap-1.5 py-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-black transition active:scale-95 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Policies List Container */}
      <div className="mt-5 px-4 space-y-5">
        
        {/* ==================== 1. RETURN POLICY ==================== */}
        {(activeTab === 'all' || activeTab === 'returns') && (
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <RotateCcw className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-black text-slate-900">1. Return Policy</h3>
              <span className="ml-auto text-[9.5px] bg-rose-50 text-rose-600 font-extrabold px-2 py-0.5 rounded-full border border-rose-100">
                4-Day Limit
              </span>
            </div>
            
            <p className="text-[11.5px] text-slate-500 leading-relaxed mb-4">
              Our clear guidelines safeguard purchases to establish trust. Please examine requirements for successful return validation:
            </p>

            <div className="space-y-3.5">
              {/* Bullet 1 */}
              <div className="flex gap-3">
                <div className="bg-slate-50 p-1 rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="h-3 w-3 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">4-Day Request Window</h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    Customers can request a return within <span className="text-indigo-650 font-black">4 days</span> of receiving the product.
                  </p>
                </div>
              </div>

              {/* Bullet 2 */}
              <div className="flex gap-3">
                <div className="bg-slate-50 p-1 rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                  <Package className="h-3 w-3 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Original Packaging Preserved</h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    Products must be unused, undamaged, and returned in original packaging with tag codes intact.
                  </p>
                </div>
              </div>

              {/* Bullet 3 */}
              <div className="flex gap-3">
                <div className="bg-slate-50 p-1 rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldAlert className="h-3 w-3 text-rose-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Post-Limit Boundaries</h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    Returns requested after the 4-day period may not be accepted or processed under any circumstances.
                  </p>
                </div>
              </div>

              {/* Bullet 4 */}
              <div className="flex gap-3">
                <div className="bg-slate-50 p-1 rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                  <Coins className="h-3 w-3 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Quality Check Pre-requisite</h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    Refunds will be processed only after the returned product has been physical quality-verified at our central hub.
                  </p>
                </div>
              </div>

              {/* Bullet 5 */}
              <div className="flex gap-3">
                <div className="bg-slate-50 p-1 rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertOctagon className="h-3 w-3 text-rose-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Customer Misuse Liability</h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    Products damaged due to customer misuse, accidental liquid spills, or altered states are not eligible for return.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. REFUND POLICY ==================== */}
        {(activeTab === 'all' || activeTab === 'refunds') && (
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CreditCard className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-black text-slate-900">2. Refund Policy</h3>
              <span className="ml-auto text-[9.5px] bg-emerald-50 text-emerald-600 font-extrabold px-2 py-0.5 rounded-full border border-emerald-100">
                Direct Back
              </span>
            </div>

            <p className="text-[11.5px] text-slate-500 leading-relaxed mb-4">
              All approved refunds are settled with absolute compliance. Find core payment reversal details below:
            </p>

            <div className="space-y-3.5">
              {/* Bullet 1 */}
              <div className="flex gap-3">
                <div className="bg-slate-50 p-1 rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                  <Coins className="h-3 w-3 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Original Source Reversal</h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    Approved refunds will be issued directly to the original payment method (UPI, net banking, or wallet cards).
                  </p>
                </div>
              </div>

              {/* Bullet 2 */}
              <div className="flex gap-3">
                <div className="bg-slate-50 p-1 rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="h-3 w-3 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Processing Turn-Around-Time (TAT)</h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    Refund processing may take several business days depending on the policies of your respective payment provider or bank.
                  </p>
                </div>
              </div>

              {/* Bullet 3 */}
              <div className="flex gap-3">
                <div className="bg-slate-50 p-1 rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Rejection Bounds</h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    If a manual physical return shipment fails inspection, the return stands rejected & no refund will be issued.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. REVIEWS & RATINGS POLICY ==================== */}
        {(activeTab === 'all' || activeTab === 'reviews') && (
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
              </div>
              <h3 className="text-sm font-black text-slate-900">3. Reviews & Ratings Policy</h3>
              <span className="ml-auto text-[9.5px] bg-amber-50 text-amber-700 font-extrabold px-2 py-0.5 rounded-full border border-amber-100">
                100% Genuine
              </span>
            </div>

            <p className="text-[11.5px] text-slate-500 leading-relaxed mb-4">
              Feedback transparency establishes dropshipping success. We promote verified human-driven insights with our rules:
            </p>

            <div className="space-y-3.5">
              {/* Bullet 1 */}
              <div className="flex gap-3">
                <div className="bg-slate-50 p-1 rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="h-3 w-3 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">1 to 5 Stars System</h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    Registered customers can submit ratings from 1 (poor) to 5 stars (outstanding) indicating item satisfaction.
                  </p>
                </div>
              </div>

              {/* Bullet 2 */}
              <div className="flex gap-3">
                <div className="bg-slate-50 p-1 rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="h-3 w-3 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Genuine Buying Experience</h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    Customers can write text reviews detailing their genuine purchase experience, shipment condition, and quality.
                  </p>
                </div>
              </div>

              {/* Bullet 3 */}
              <div className="flex gap-3">
                <div className="bg-slate-50 p-1 rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="h-3 w-3 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Content Moderation</h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    Fake, abusive, misleading, promotional, spam, or offensive reviews with toxic wording may be immediately removed.
                  </p>
                </div>
              </div>

              {/* Bullet 4 */}
              <div className="flex gap-3">
                <div className="bg-slate-50 p-1 rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Strict Product Relevance</h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    All reviews should be strictly relevant to the specific product purchased, preventing unrelated grievances.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 4. TERMS & CONDITIONS ==================== */}
        {(activeTab === 'all' || activeTab === 'terms') && (
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                <FileText className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-black text-slate-900">4. Terms & Conditions</h3>
              <span className="ml-auto text-[9.5px] bg-orange-50 text-orange-700 font-extrabold px-2 py-0.5 rounded-full border border-orange-100">
                Official
              </span>
            </div>

            <p className="text-[11.5px] text-slate-500 leading-relaxed mb-4">
              By accessing the VELRIVA e-commerce platform, you consent to compile with the following terms of services:
            </p>

            <div className="space-y-3.5">
              {/* Bullet 1 */}
              <div className="flex gap-3">
                <div className="bg-slate-50 p-1 rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                  <Scale className="h-3 w-3 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Dynamic Product Pricing</h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    Product catalog prices and stock availability may change dynamically without any prior notice.
                  </p>
                </div>
              </div>

              {/* Bullet 2 */}
              <div className="flex gap-3">
                <div className="bg-slate-50 p-1 rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="h-3 w-3 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Order Cancellations</h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    Our admin panel reserves the right to cancel suspicious bulk transactions or fraudulent reseller accounts.
                  </p>
                </div>
              </div>

              {/* Bullet 3 */}
              <div className="flex gap-3">
                <div className="bg-slate-50 p-1 rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                  <Truck className="h-3 w-3 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Accurate Delivery Info</h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    Users are solely responsible for providing complete shipping coordinates, active mobile contacts, and valid pin codes.
                  </p>
                </div>
              </div>

              {/* Bullet 4 */}
              <div className="flex gap-3">
                <div className="bg-slate-50 p-1 rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">
                  <UserCheck className="h-3 w-3 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">User Consent Agreement</h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    By accessing or buying on this website, buyers fully declare and agree to all terms and conditions stated above.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 5. Support Helpline Footer Card */}
      <div className="mx-4 mt-6 p-5 rounded-3xl border border-slate-100 bg-white shadow-xs text-center space-y-3">
        <div className="mx-auto h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
          <HelpCircle className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-slate-900">Have specific inquiries regarding policies?</h4>
          <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
            Connect directly with the VELRIVA support helpline. We are available 24/7 to resolve client claims catalog-wide.
          </p>
        </div>
        <button
          onClick={handleBack}
          className="w-full rounded-2xl bg-slate-950 text-white py-3 text-xs font-black hover:bg-slate-900 transition active:scale-98 cursor-pointer"
        >
          Return to Settings
        </button>
      </div>
    </div>
  );
};
