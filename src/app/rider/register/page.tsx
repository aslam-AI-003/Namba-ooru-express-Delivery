'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bike, Check, Wallet, Clock, Smartphone, Gift, Upload, Car, PersonStanding } from 'lucide-react';

const VEHICLE_TYPES = [
  { label: 'Bike', icon: Bike },
  { label: 'Cycle', icon: Bike },
  { label: 'Auto', icon: Car },
  { label: 'Walking', icon: PersonStanding },
];

export default function RiderRegisterPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen app-bg py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Bike size={26} className="text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-body">Become a <span className="text-accent">Delivery Partner</span></h1>
          <p className="text-muted mt-2">Earn ₹15,000 - ₹30,000 per month</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-20 h-1.5 rounded-full ${s <= step ? 'bg-orange-500' : 'bg-[var(--bg3)]'}`} />
          ))}
        </div>

        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-body mb-6">Personal Details</h2>
            <div className="space-y-4">
              <input placeholder="Enter your full name" className="input-glass" />
              <input type="tel" placeholder="Enter phone number" className="input-glass" />
              <input type="email" placeholder="Enter email (optional)" className="input-glass" />
              <input placeholder="e.g., Thanjavur" className="input-glass" />
              <input placeholder="Enter 12-digit Aadhaar" className="input-glass" />
              <button onClick={() => setStep(2)} className="btn-primary w-full py-3">Next →</button>
            </div>
          </div>
        )}

        {/* Step 2: Vehicle Details */}
        {step === 2 && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-body mb-6">Vehicle Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-secondary mb-3">Vehicle Type</p>
                <div className="grid grid-cols-2 gap-3">
                  {VEHICLE_TYPES.map((v) => (
                    <button key={v.label} className="p-4 surface rounded-xl text-center hover:border-orange-400/40 border border-transparent transition-all">
                      <v.icon size={20} className="text-accent mx-auto mb-1" />
                      <span className="text-xs text-secondary">{v.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <input placeholder="e.g., TN-12-AB-1234" className="input-glass" />
              <input placeholder="Enter DL number" className="input-glass" />
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
            <h2 className="text-lg font-semibold text-body mb-6">Upload Documents</h2>
            <div className="space-y-4">
              {['Aadhaar Front', 'Aadhaar Back', 'Driving License', 'Vehicle RC', 'Photo'].map((doc) => (
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
            <p className="text-xs text-faint mt-4 text-center">Your application will be reviewed within 24 hours</p>
          </div>
        )}

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          {[
            { icon: Wallet, text: 'Earn ₹500-1000/day' },
            { icon: Clock, text: 'Flexible timings' },
            { icon: Smartphone, text: 'Weekly payouts' },
            { icon: Gift, text: 'Incentives & Bonus' },
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
