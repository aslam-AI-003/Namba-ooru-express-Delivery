'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-dark-900">
      <Header />
      <div className="pt-24 pb-12 max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
        <Card>
          <div className="prose prose-invert prose-sm max-w-none space-y-4">
            <p className="text-gray-400">Last updated: January 2024</p>
            <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
            <p className="text-gray-400">We collect information you provide including name, phone number, email, delivery address, and payment information to process orders and provide our services.</p>
            <h2 className="text-lg font-bold text-white">2. How We Use Your Information</h2>
            <p className="text-gray-400">Your information is used to process orders, provide delivery services, send notifications, improve our platform, and for customer support.</p>
            <h2 className="text-lg font-bold text-white">3. Data Security</h2>
            <p className="text-gray-400">We implement industry-standard security measures to protect your personal information including encryption, secure servers, and access controls.</p>
            <h2 className="text-lg font-bold text-white">4. Contact</h2>
            <p className="text-gray-400">For privacy concerns, contact us at support@nammaooru.express or call 9566700534.</p>
          </div>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
