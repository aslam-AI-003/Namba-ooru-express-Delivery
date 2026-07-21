'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-dark-900">
      <Header />
      <div className="pt-24 pb-12 max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">About <span className="text-primary-500">Namma Ooru Express</span></h1>
          <p className="text-xl text-gray-400">நீங்க சொல்லுங்க... நாங்க Deliver பண்றோம்!</p>
        </div>

        <Card className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">🛵 Our Story</h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Namma Ooru Express was born from a simple idea — to connect local shops with customers in Thanjavur and Kumbakonam through fast, reliable delivery. We believe every local shop deserves the power of digital ordering and home delivery.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Whether it&apos;s groceries at midnight, medicine during an emergency, or a parcel across town — we&apos;re here to deliver anything, anytime, anywhere in your ooru!
          </p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <span className="text-4xl block mb-3">🎯</span>
              <h3 className="text-lg font-bold text-white mb-2">Our Mission</h3>
              <p className="text-sm text-gray-400">Empower local businesses and provide fast doorstep delivery to every household</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <span className="text-4xl block mb-3">👁️</span>
              <h3 className="text-lg font-bold text-white mb-2">Our Vision</h3>
              <p className="text-sm text-gray-400">Become Tamil Nadu&apos;s most trusted hyperlocal delivery platform</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <span className="text-4xl block mb-3">💛</span>
              <h3 className="text-lg font-bold text-white mb-2">Our Values</h3>
              <p className="text-sm text-gray-400">Speed, Safety, Trust, and Community-first approach</p>
            </div>
          </Card>
        </div>

        <Card className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">📍 Service Areas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Thanjavur', 'Kumbakonam', 'Papanasam', 'Thiruvaiyaru'].map((city) => (
              <div key={city} className="p-3 bg-dark-400 rounded-xl text-center">
                <span className="text-sm text-gray-300">{city}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-primary-500 mt-4">🚀 Expanding to more cities soon...</p>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-white mb-4">📞 Contact Us</h2>
          <div className="space-y-3">
            <p className="text-gray-400 flex items-center gap-3"><span>📞</span> 9566700534</p>
            <p className="text-gray-400 flex items-center gap-3"><span>✉️</span> support@nammaooru.express</p>
            <p className="text-gray-400 flex items-center gap-3"><span>📷</span> @namba_ooru_delivery</p>
            <p className="text-gray-400 flex items-center gap-3"><span>📍</span> Thanjavur, Tamil Nadu 613001</p>
          </div>
        </Card>
      </div>
      <Footer />
    </main>
  );
}
