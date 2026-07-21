'use client';

import React from 'react';
import Link from 'next/link';
import { SHOP_CATEGORIES } from '@/lib/constants';

export default function CategoriesSection() {
  return (
    <section className="py-16 md:py-24 bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="section-title text-white">
            What do you need <span className="text-primary-500">today?</span>
          </h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            From groceries to medicine, food to documents — we deliver everything from your nearby shops
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {SHOP_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/shops?category=${category.id}`}
              className="group"
            >
              <div className="flex flex-col items-center gap-3 p-4 bg-dark-500/60 backdrop-blur-sm border border-dark-50/20 rounded-2xl hover:border-primary-500/50 hover:bg-primary-500/5 transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 flex items-center justify-center text-3xl bg-dark-400/80 rounded-xl group-hover:bg-primary-500/10 transition-colors">
                  {category.icon}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    {category.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{category.nameTamil}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
