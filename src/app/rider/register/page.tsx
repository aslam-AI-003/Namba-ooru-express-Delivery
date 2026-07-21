'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function RiderRegisterPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-dark-900 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🛵</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white">Become a <span className="text-primary-500">Delivery Partner</span></h1>
          <p className="text-gray-400 mt-2">Earn ₹15,000 - ₹30,000 per month</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-20 h-1.5 rounded-full ${s <= step ? 'bg-primary-500' : 'bg-dark-400'}`} />
          ))}
        </div>

        {/* Step 1: Personal Details */}
        {step === 1 && (
          <Card>
            <h2 className="text-lg font-semibold text-white mb-6">👤 Personal Details</h2>
            <div className="space-y-4">
              <Input label="Full Name" placeholder="Enter your full name" />
              <Input label="Phone Number" type="tel" placeholder="Enter phone number" />
              <Input label="Email (Optional)" type="email" placeholder="Enter email" />
              <Input label="City" placeholder="e.g., Thanjavur" />
              <Input label="Aadhaar Number" placeholder="Enter 12-digit Aadhaar" />
              <Button className="w-full" onClick={() => setStep(2)}>Next →</Button>
            </div>
          </Card>
        )}

        {/* Step 2: Vehicle Details */}
        {step === 2 && (
          <Card>
            <h2 className="text-lg font-semibold text-white mb-6">🛵 Vehicle Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-300 mb-3">Vehicle Type</p>
                <div className="grid grid-cols-2 gap-3">
                  {['🏍️ Bike', '🚲 Cycle', '🛺 Auto', '🚶 Walking'].map((v) => (
                    <button key={v} className="p-4 bg-dark-400 rounded-xl text-center hover:border-primary-500 border border-transparent transition-all">
                      <span className="text-lg block mb-1">{v.split(' ')[0]}</span>
                      <span className="text-xs text-gray-300">{v.split(' ')[1]}</span>
                    </button>
                  ))}
                </div>
              </div>
              <Input label="Vehicle Number" placeholder="e.g., TN-12-AB-1234" />
              <Input label="Driving License Number" placeholder="Enter DL number" />
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
            <h2 className="text-lg font-semibold text-white mb-6">📄 Upload Documents</h2>
            <div className="space-y-4">
              {['Aadhaar Front', 'Aadhaar Back', 'Driving License', 'Vehicle RC', 'Photo'].map((doc) => (
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
            <p className="text-xs text-gray-500 mt-4 text-center">Your application will be reviewed within 24 hours</p>
          </Card>
        )}

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          {[
            { icon: '💰', text: 'Earn ₹500-1000/day' },
            { icon: '⏰', text: 'Flexible timings' },
            { icon: '📱', text: 'Weekly payouts' },
            { icon: '🎁', text: 'Incentives & Bonus' },
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
