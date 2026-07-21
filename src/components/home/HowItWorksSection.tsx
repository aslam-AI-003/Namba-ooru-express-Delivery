'use client';

import React from 'react';

export default function HowItWorksSection() {
  const steps = [
    { step: 1, icon: '📍', title: 'Set Location', titleTamil: 'இடத்தை தேர்வு செய்', description: 'Allow GPS or enter your delivery address' },
    { step: 2, icon: '🏪', title: 'Choose Shop', titleTamil: 'கடையை தேர்வு செய்', description: 'Browse nearby shops and pick your items' },
    { step: 3, icon: '🛒', title: 'Place Order', titleTamil: 'ஆர்டர் செய்', description: 'Add to cart and checkout with your preferred payment' },
    { step: 4, icon: '🛵', title: 'Get Delivered', titleTamil: 'டெலிவரி பெறு', description: 'Track in real-time and receive at your door' },
  ];

  return (
    <section className="py-16 md:py-24 bg-dark-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="section-title text-white">
            How it <span className="text-primary-500">works?</span>
          </h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            Getting your delivery is as easy as 1-2-3-4
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary-500/50 to-primary-500/10" />
              )}

              <div className="text-center space-y-4">
                {/* Step number */}
                <div className="relative inline-flex">
                  <div className="w-24 h-24 bg-dark-500 border-2 border-primary-500/30 rounded-full flex items-center justify-center text-4xl hover:border-primary-500 hover:scale-110 transition-all duration-300">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 text-dark-900 rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-primary-500 mb-2">{item.titleTamil}</p>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
