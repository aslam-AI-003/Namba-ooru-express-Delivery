'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function FranchisePage() {
  return (
    <main className="min-h-screen bg-dark-900">
      <Header />
      <div className="pt-24 pb-12 max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">🚀 Franchise <span className="text-primary-500">Opportunity</span></h1>
          <p className="text-gray-400 text-lg">Start your own delivery business with Namma Ooru Express</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: '💰', title: 'Low Investment', desc: 'Start with just ₹2-5 Lakhs' },
            { icon: '📈', title: 'High Returns', desc: 'ROI within 6-12 months' },
            { icon: '🤝', title: 'Full Support', desc: 'Technology + Training + Marketing' },
          ].map((item) => (
            <Card key={item.title} className="text-center">
              <span className="text-4xl block mb-3">{item.icon}</span>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </Card>
          ))}
        </div>

        <Card>
          <h2 className="text-xl font-bold text-white mb-6">📝 Apply for Franchise</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="Your name" />
            <Input label="Phone" placeholder="Phone number" />
            <Input label="City" placeholder="Which city?" />
            <Input label="Investment Budget" placeholder="e.g., 3 Lakhs" />
          </div>
          <Button className="w-full mt-6">Submit Franchise Application</Button>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
