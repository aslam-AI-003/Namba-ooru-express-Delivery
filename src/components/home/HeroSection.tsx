'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(255,193,7,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,193,7,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary-500">Now serving Thanjavur & Kumbakonam</span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black font-display leading-tight">
              <span className="text-white">Namma Ooru</span>
              <br />
              <span className="gradient-text">Express</span>
            </h1>

            {/* Tagline */}
            <p className="text-xl sm:text-2xl text-gray-300 font-medium">
              நீங்க சொல்லுங்க... நாங்க Deliver பண்றோம்!
            </p>

            <p className="text-gray-400 text-lg max-w-xl mx-auto lg:mx-0">
              Order from your favorite local shops and get everything delivered to your doorstep in minutes. Groceries, Food, Medicine, Parcels & more!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link href="/shops">
                <Button size="lg" className="w-full sm:w-auto">
                  🛒 Order Now
                </Button>
              </Link>
              <Link href="/rider/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  🛵 Become a Rider
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 justify-center lg:justify-start pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-500">500+</p>
                <p className="text-xs text-gray-500">Shops</p>
              </div>
              <div className="w-px h-10 bg-dark-50/30" />
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-500">10K+</p>
                <p className="text-xs text-gray-500">Deliveries</p>
              </div>
              <div className="w-px h-10 bg-dark-50/30" />
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-500">30 min</p>
                <p className="text-xs text-gray-500">Avg Delivery</p>
              </div>
            </div>
          </div>

          {/* Right Content - Delivery Illustration */}
          <div className="flex-1 relative">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main card */}
              <div className="glass-card p-8 space-y-6">
                {/* Delivery animation placeholder */}
                <div className="w-full aspect-square bg-dark-400/50 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent" />
                  <div className="text-center space-y-4 relative z-10">
                    <div className="text-8xl animate-bounce-soft">🛵</div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-white">Fast Delivery</p>
                      <p className="text-sm text-gray-400">Door to Door</p>
                    </div>
                  </div>
                </div>

                {/* Service icons */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { icon: '🍔', label: 'Food' },
                    { icon: '📦', label: 'Parcel' },
                    { icon: '💊', label: 'Medicine' },
                    { icon: '📄', label: 'Documents' },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-3 bg-dark-400/50 rounded-xl hover:bg-primary-500/10 transition-colors cursor-pointer">
                      <span className="text-2xl">{item.icon}</span>
                      <p className="text-xs text-gray-400 mt-1">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-accent-green text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg animate-bounce-soft">
                ₹30 only!
              </div>
              <div className="absolute -bottom-4 -left-4 bg-dark-500 border border-dark-50/30 px-4 py-2 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-primary-500">⭐</span>
                  <span className="text-sm font-medium text-white">4.8 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
