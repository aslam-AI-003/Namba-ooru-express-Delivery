'use client';

import React from 'react';
import Card from '@/components/ui/Card';

export default function FeaturesSection() {
  const features = [
    {
      icon: '⚡',
      title: 'Fast Delivery',
      titleTamil: 'வேக டெலிவரி',
      description: 'Get your orders delivered in 30 minutes or less. Our riders are always on the move!',
      color: 'from-yellow-500/20 to-orange-500/20',
    },
    {
      icon: '🛡️',
      title: 'Safe Handling',
      titleTamil: 'பாதுகாப்பான கையாளுதல்',
      description: 'Every item is handled with care. From fragile goods to hot food, we deliver it safely.',
      color: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      icon: '✅',
      title: 'Trusted Service',
      titleTamil: 'நம்பகமான சேவை',
      description: 'All our shops and riders are verified. Real-time tracking for peace of mind.',
      color: 'from-green-500/20 to-emerald-500/20',
    },
    {
      icon: '📍',
      title: 'Your Area Coverage',
      titleTamil: 'உங்கள் பகுதி சேவை',
      description: 'Hyperlocal delivery covering every street in Thanjavur and Kumbakonam.',
      color: 'from-purple-500/20 to-pink-500/20',
    },
    {
      icon: '💰',
      title: 'Affordable Rates',
      titleTamil: 'குறைந்த கட்டணம்',
      description: 'Starting from just ₹30. No hidden charges. Pay only for what you order.',
      color: 'from-primary-500/20 to-yellow-500/20',
    },
    {
      icon: '🔔',
      title: 'Live Tracking',
      titleTamil: 'நேரடி கண்காணிப்பு',
      description: 'Track your order in real-time. Know exactly when your delivery will arrive.',
      color: 'from-red-500/20 to-orange-500/20',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="section-title text-white">
            Why choose <span className="text-primary-500">Namma Ooru Express?</span>
          </h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            We&apos;re not just a delivery service — we&apos;re your neighborhood partner
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} hover className="group relative overflow-hidden">
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="w-14 h-14 flex items-center justify-center text-3xl bg-dark-400/80 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{feature.title}</h3>
                <p className="text-xs text-primary-500 mb-3">{feature.titleTamil}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
