'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-dark-900">
      <Header />
      <div className="pt-24 pb-12 max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>
        <Card>
          <div className="prose prose-invert prose-sm max-w-none space-y-4">
            <p className="text-gray-400">Last updated: January 2024</p>
            <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
            <p className="text-gray-400">By using Namma Ooru Express, you agree to these terms and conditions. Our platform connects customers with local shops through delivery partners.</p>
            <h2 className="text-lg font-bold text-white">2. Orders & Delivery</h2>
            <p className="text-gray-400">Orders are subject to shop availability and delivery partner assignment. Delivery times are estimates and may vary based on distance, traffic, and weather conditions.</p>
            <h2 className="text-lg font-bold text-white">3. Payments</h2>
            <p className="text-gray-400">We accept UPI, debit/credit cards, wallets, and cash on delivery. All transactions are processed securely through Razorpay payment gateway.</p>
            <h2 className="text-lg font-bold text-white">4. Cancellation</h2>
            <p className="text-gray-400">Orders can be cancelled before shop acceptance for full refund. After preparation begins, cancellation charges may apply.</p>
          </div>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
