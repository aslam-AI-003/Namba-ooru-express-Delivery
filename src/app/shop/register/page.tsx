'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Store, Check, Users, TrendingUp, Wallet, BarChart3, Upload } from 'lucide-react';
import { SEED_CATEGORIES } from '@/lib/seed-data';

export default function ShopRegisterPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen app-bg py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Store size={26} className="text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-body">Register Your <span className="text-accent">Shop</span></h1>
          <p className="text-muted mt-2">Reach thousands of customers in your area</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-20 h-1.5 rounded-full ${s <= step ? 'bg-orange-500' : 'bg-[var(--bg3)]'}`} />
          ))}
        </div>

        {/* Step 1: Shop Details */}
        {step === 1 && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-body mb-6">Shop Details</h2>
            <div className="space-y-4">
              <input placeholder="Enter your shop name" className="input-glass" />
              <input placeholder="Enter owner name" className="input-glass" />
              <input type="tel" placeholder="Enter phone number" className="input-glass" />
              <input type="email" placeholder="Enter email" className="input-glass" />
              <div>
                <p className="text-sm text-secondary mb-3">Shop Category</p>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {SEED_CATEGORIES.slice(0, 12).map((cat) => (
                    <button key={cat.id} type="button" className="p-3 surface rounded-xl text-center hover:border-orange-400/40 border border-transparent transition-all">
                      <span className="text-[10px] text-secondary">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep(2)} className="btn-primary w-full py-3">Next →</button>
            </div>
          </div>
        )}

        {/* Step 2: Address & Timing */}
        {step === 2 && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-body mb-6">Address & Timing</h2>
            <div className="space-y-4">
              <input placeholder="Enter complete address" className="input-glass" />
              <input placeholder="e.g., Thanjavur" className="input-glass" />
              <input placeholder="Enter pincode" className="input-glass" />
              <div className="grid grid-cols-2 gap-3">
                <input type="time" className="input-glass" />
                <input type="time" className="input-glass" />
              </div>
              <input type="number" placeholder="Minimum Order Value (₹)" className="input-glass" />
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">← Back</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1 py-3">Next →</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {step === 3 && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-body mb-6">Documents & Verification</h2>
            <div className="space-y-4">
              {['Shop Photo', 'Owner Aadhaar', 'PAN Card (Optional)', 'GST Certificate (Optional)', 'FSSAI License (Food shops)'].map((doc) => (
                <div key={doc} className="flex items-center justify-between p-4 surface rounded-xl">
                  <span className="text-sm text-secondary">{doc}</span>
                  <button className="px-3 py-1 bg-orange-500/12 text-accent text-xs rounded-lg font-semibold flex items-center gap-1"><Upload size={12} /> Upload</button>
                </div>
              ))}
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1 py-3">← Back</button>
                <button className="btn-primary flex-1 py-3 flex items-center justify-center gap-1.5"><Check size={15} /> Submit Application</button>
              </div>
            </div>
            <p className="text-xs text-faint mt-4 text-center">Your shop will be verified and approved within 24-48 hours</p>
          </div>
        )}

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          {[
            { icon: Users, text: '5000+ Customers reach' },
            { icon: TrendingUp, text: 'Grow your sales 3x' },
            { icon: Wallet, text: 'Low commission' },
            { icon: BarChart3, text: 'Free analytics' },
          ].map((b) => (
            <div key={b.text} className="glass-card p-4 text-center">
              <b.icon size={22} className="text-accent mx-auto mb-2" />
              <span className="text-xs text-secondary">{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
