'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-dark-900">
      <Header />
      <div className="pt-24 pb-12 max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Refund Policy</h1>
        <Card>
          <div className="prose prose-invert prose-sm max-w-none space-y-4">
            <p className="text-gray-400">Last updated: January 2024</p>
            <h2 className="text-lg font-bold text-white">1. Refund Eligibility</h2>
            <p className="text-gray-400">Refunds are applicable for cancelled orders, wrong items delivered, damaged products, or non-delivery within promised time.</p>
            <h2 className="text-lg font-bold text-white">2. Refund Timeline</h2>
            <p className="text-gray-400">Refunds are processed within 3-5 business days to the original payment method. Wallet refunds are instant.</p>
            <h2 className="text-lg font-bold text-white">3. Non-Refundable Items</h2>
            <p className="text-gray-400">Perishable items that have been opened or consumed, custom-made items, and services already rendered are non-refundable.</p>
            <h2 className="text-lg font-bold text-white">4. How to Request a Refund</h2>
            <p className="text-gray-400">Contact our support team through the app chat, call 9566700534, or email support@nammaooru.express with your order ID.</p>
          </div>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
