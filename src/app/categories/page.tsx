'use client';

import React from 'react';
import Link from 'next/link';
import { SEED_CATEGORIES } from '@/lib/seed-data';

const CATEGORY_META: Record<string, { icon: string; color: string; desc: string }> = {
  groceries:      { icon: '🛒', color: 'from-yellow-400/20 to-yellow-500/5',   desc: 'Rice, Dal, Oil & more' },
  vegetables:     { icon: '🥬', color: 'from-emerald-400/20 to-emerald-500/5', desc: 'Fresh farm produce' },
  meat:           { icon: '🍗', color: 'from-red-400/20 to-red-500/5',         desc: 'Chicken, Fish & more' },
  medicines:      { icon: '💊', color: 'from-blue-400/20 to-blue-500/5',       desc: 'Medicines & healthcare' },
  bakery:         { icon: '🎂', color: 'from-pink-400/20 to-pink-500/5',       desc: 'Cakes, Bread & sweets' },
  restaurants:    { icon: '🍽️', color: 'from-orange-400/20 to-orange-500/5',  desc: 'Hot meals delivered' },
  'tea-shops':    { icon: '☕', color: 'from-amber-400/20 to-amber-500/5',     desc: 'Tea, Coffee & snacks' },
  stationery:     { icon: '✏️', color: 'from-purple-400/20 to-purple-500/5',   desc: 'Books, pens & more' },
  'pet-shop':     { icon: '🐾', color: 'from-teal-400/20 to-teal-500/5',      desc: 'Pet food & accessories' },
  'flower-shop':  { icon: '🌸', color: 'from-rose-400/20 to-rose-500/5',      desc: 'Fresh flowers & bouquets' },
  electronics:    { icon: '📱', color: 'from-cyan-400/20 to-cyan-500/5',      desc: 'Gadgets & accessories' },
  courier:        { icon: '📦', color: 'from-indigo-400/20 to-indigo-500/5',  desc: 'Send & receive parcels' },
  'water-can':    { icon: '💧', color: 'from-sky-400/20 to-sky-500/5',        desc: '20L water cans' },
  'gas-cylinder': { icon: '🔥', color: 'from-orange-500/20 to-red-500/5',     desc: 'LPG cylinder booking' },
  milk:           { icon: '🥛', color: 'from-slate-400/20 to-slate-500/5',    desc: 'Fresh milk & dairy' },
};

export default function CategoriesPage() {
  return (
    <main className="min-h-screen app-bg pb-24 md:pb-8">
      <header className="sticky top-0 z-50 header-glass">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="btn-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></Link>
          <h1 className="font-bold text-white flex-1">All Categories</h1>
          <span className="text-xs text-white/40">{SEED_CATEGORIES.length} categories</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-4">
        <p className="text-sm text-white/40 mb-4">What are you looking for today?</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {SEED_CATEGORIES.map(cat => {
            const meta = CATEGORY_META[cat.id] || { icon: '🏪', color: 'from-white/10 to-transparent', desc: 'Various items' };
            return (
              <Link key={cat.id} href={`/shops?category=${cat.id}`}
                className={`glass-card-hover p-4 bg-gradient-to-br ${meta.color} group`}>
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{meta.icon}</div>
                <h3 className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors">{cat.name}</h3>
                <p className="text-[10px] text-white/35 mt-0.5">{meta.desc}</p>
                <p className="text-[10px] text-white/25 mt-1">{cat.nameTamil}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
