'use client';

import React from 'react';
import Button from '@/components/ui/Button';

export default function DownloadSection() {
  return (
    <section className="py-16 md:py-24 bg-dark-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-card p-8 md:p-12 lg:p-16 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl" />

          <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full">
                <span className="text-sm font-medium text-primary-500">📱 PWA Available</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold font-display text-white">
                Install <span className="text-primary-500">Namma Ooru Express</span> on your phone
              </h2>

              <p className="text-gray-400 text-lg">
                No app store needed! Install directly from browser. Works offline, sends notifications, and feels like a native app.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg">
                  📲 Install App
                </Button>
                <Button variant="secondary" size="lg">
                  💬 WhatsApp Order
                </Button>
              </div>

              {/* Feature badges */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <span className="px-3 py-1.5 bg-dark-400 rounded-full text-xs font-medium text-gray-300">✅ Offline Support</span>
                <span className="px-3 py-1.5 bg-dark-400 rounded-full text-xs font-medium text-gray-300">🔔 Push Notifications</span>
                <span className="px-3 py-1.5 bg-dark-400 rounded-full text-xs font-medium text-gray-300">⚡ Fast & Light</span>
              </div>
            </div>

            {/* Right - Phone mockup */}
            <div className="flex-shrink-0">
              <div className="w-64 h-[500px] bg-dark-600 rounded-[3rem] border-4 border-dark-300 p-3 shadow-2xl">
                <div className="w-full h-full bg-dark-800 rounded-[2.5rem] overflow-hidden flex flex-col">
                  {/* Status bar */}
                  <div className="h-8 bg-dark-700 flex items-center justify-center">
                    <div className="w-20 h-4 bg-dark-500 rounded-full" />
                  </div>
                  {/* Content */}
                  <div className="flex-1 p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-sm">🛵</div>
                      <div>
                        <div className="w-24 h-3 bg-dark-400 rounded" />
                        <div className="w-16 h-2 bg-dark-500 rounded mt-1" />
                      </div>
                    </div>
                    <div className="w-full h-24 bg-gradient-to-br from-primary-500/20 to-primary-500/5 rounded-xl flex items-center justify-center">
                      <span className="text-3xl">🛵💨</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {['🛒', '🍔', '💊'].map((emoji, i) => (
                        <div key={i} className="aspect-square bg-dark-400 rounded-xl flex items-center justify-center text-lg">
                          {emoji}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-12 bg-dark-400 rounded-xl" />
                      <div className="w-full h-12 bg-dark-400 rounded-xl" />
                    </div>
                  </div>
                  {/* Bottom nav */}
                  <div className="h-14 bg-dark-700 flex items-center justify-around px-4">
                    {['🏠', '🔍', '📦', '👤'].map((icon, i) => (
                      <div key={i} className="text-lg opacity-60">{icon}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
