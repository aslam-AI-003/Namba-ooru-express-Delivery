'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { SHOP_CATEGORIES } from '@/lib/constants';

export default function ShopRegisterPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-dark-900 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🏪</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white">Register Your <span className="text-primary-500">Shop</span></h1>
          <p className="text-gray-400 mt-2">Reach thousands of customers in your area</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-20 h-1.5 rounded-full ${s <= step ? 'bg-primary-500' : 'bg-dark-400'}`} />
          ))}
        </div>

        {/* Step 1: Shop Details */}
        {step === 1 && (
          <Card>
            <h2 className="text-lg font-semibold text-white mb-6">🏪 Shop Details</h2>
            <div className="space-y-4">
              <Input label="Shop Name" placeholder="Enter your shop name" />
              <Input label="Owner Name" placeholder="Enter owner name" />
              <Input label="Phone Number" type="tel" placeholder="Enter phone number" />
              <Input label="Email" type="email" placeholder="Enter email" />
              <div>
                <p className="text-sm text-gray-300 mb-3">Shop Category</p>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {SHOP_CATEGORIES.slice(0, 12).map((cat) => (
                    <button key={cat.id} className="p-3 bg-dark-400 rounded-xl text-center hover:border-primary-500 border border-transparent transition-all">
                      <span className="text-lg block">{cat.icon}</span>
                      <span className="text-[10px] text-gray-300">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <Button className="w-full" onClick={() => setStep(2)}>Next →</Button>
            </div>
          </Card>
        )}

        {/* Step 2: Address & Timing */}
        {step === 2 && (
          <Card>
            <h2 className="text-lg font-semibold text-white mb-6">📍 Address & Timing</h2>
            <div className="space-y-4">
              <Input label="Shop Address" placeholder="Enter complete address" />
              <Input label="City" placeholder="e.g., Thanjavur" />
              <Input label="Pincode" placeholder="Enter pincode" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Opening Time" type="time" />
                <Input label="Closing Time" type="time" />
              </div>
              <Input label="Minimum Order Value (₹)" type="number" placeholder="e.g., 100" />
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setStep(1)}>← Back</Button>
                <Button className="flex-1" onClick={() => setStep(3)}>Next →</Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Documents */}
        {step === 3 && (
          <Card>
            <h2 className="text-lg font-semibold text-white mb-6">📄 Documents & Verification</h2>
            <div className="space-y-4">
              {['Shop Photo', 'Owner Aadhaar', 'PAN Card (Optional)', 'GST Certificate (Optional)', 'FSSAI License (Food shops)'].map((doc) => (
                <div key={doc} className="flex items-center justify-between p-4 bg-dark-400 rounded-xl">
                  <span className="text-sm text-gray-300">{doc}</span>
                  <button className="px-3 py-1 bg-primary-500/20 text-primary-500 text-xs rounded-lg font-semibold">Upload</button>
                </div>
              ))}
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setStep(2)}>← Back</Button>
                <Button className="flex-1">Submit Application ✓</Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">Your shop will be verified and approved within 24-48 hours</p>
          </Card>
        )}

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          {[
            { icon: '👥', text: '5000+ Customers reach' },
            { icon: '📈', text: 'Grow your sales 3x' },
            { icon: '💰', text: 'Low commission' },
            { icon: '📊', text: 'Free analytics' },
          ].map((b) => (
            <div key={b.text} className="p-4 bg-dark-500/60 rounded-xl text-center">
              <span className="text-2xl block mb-2">{b.icon}</span>
              <span className="text-xs text-gray-300">{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
