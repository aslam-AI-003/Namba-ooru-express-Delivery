'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { SEED_SHOPS, SEED_CATEGORIES } from '@/lib/seed-data';

const SHOP_ICONS: Record<string, string> = {
  groceries: '🛒', vegetables: '🥬', meat: '🍗', medicines: '💊',
  bakery: '🎂', restaurants: '🍽️', 'tea-shops': '☕', stationery: '✏️',
  'pet-shop': '🐾', 'flower-shop': '🌸', electronics: '📱', courier: '📦',
  'water-can': '💧', 'gas-cylinder': '🔥', milk: '🥛',
};

function ShopsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const { favoriteShopIds, toggleFavorite } = useStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<'rating' | 'time' | 'orders'>('rating');
  const [onlyOpen, setOnlyOpen] = useState(false);

  const filtered = SEED_SHOPS
    .filter(s => category === 'all' || s.categoryId === category)
    .filter(s => !onlyOpen || s.isOpen)
    .filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'time') return a.avgPrepTime - b.avgPrepTime;
      return b.totalOrders - a.totalOrders;
    });

  return (
    <main className="min-h-screen app-bg pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 header-glass">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="btn-icon flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <div className="flex-1 search-bar">
            <span className="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search shops..." />
          </div>
          <button onClick={() => setOnlyOpen(!onlyOpen)}
            className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${onlyOpen ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/[0.04] border-white/[0.08] text-white/50'}`}>
            Open
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-4">
        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
          {[{ id: 'all', name: 'All Shops' }, ...SEED_CATEGORIES].map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                category === cat.id ? 'bg-yellow-400 text-black' : 'bg-white/[0.05] text-white/50 border border-white/[0.08] hover:bg-white/[0.08]'
              }`}>
              {SHOP_ICONS[cat.id] && <span className="mr-1">{SHOP_ICONS[cat.id]}</span>}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort + count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-white/50">
            <span className="text-white font-bold">{filtered.length}</span> shops found
          </p>
          <div className="flex gap-1">
            {([['rating', '⭐ Rating'], ['time', '⚡ Fastest'], ['orders', '🔥 Popular']] as const).map(([val, label]) => (
              <button key={val} onClick={() => setSortBy(val)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  sortBy === val ? 'bg-yellow-400/15 text-yellow-400 border border-yellow-400/30' : 'text-white/40 hover:text-white/60'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Shop grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏪</div>
            <h3 className="text-lg font-bold text-white/60">No shops found</h3>
            <p className="text-sm text-white/30 mt-1">Try a different category or search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(shop => (
              <div key={shop.id} className="glass-card-hover group overflow-hidden">
                <div className="relative h-40 bg-gradient-to-br from-white/[0.04] to-transparent flex items-center justify-center">
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                    {SHOP_ICONS[shop.categoryId] || '🏪'}
                  </span>
                  {shop.isFeatured && <span className="floating-badge">⭐ Popular</span>}
                  <div className={`absolute bottom-2 right-2 badge ${shop.isOpen ? 'badge-success' : 'badge-error'} text-[10px]`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${shop.isOpen ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    {shop.isOpen ? 'Open' : 'Closed'}
                  </div>
                  <button onClick={() => toggleFavorite(shop.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center hover:scale-110 transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={favoriteShopIds.includes(shop.id) ? '#fbbf24' : 'none'} stroke={favoriteShopIds.includes(shop.id) ? '#fbbf24' : 'rgba(255,255,255,0.5)'} strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white group-hover:text-yellow-400 transition-colors">{shop.name}</h3>
                  <p className="text-xs text-white/35 mt-0.5 line-clamp-1">{shop.description}</p>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <div className="flex items-center gap-1">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="#fbbf24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      <span className="text-xs font-bold text-yellow-400">{shop.rating}</span>
                      <span className="text-[10px] text-white/30">({shop.totalRatings})</span>
                    </div>
                    <span className="text-xs text-white/40">⚡ {shop.avgPrepTime} min</span>
                    <span className="text-xs text-white/40">📍 {shop.deliveryRadius} km</span>
                  </div>
                  {shop.minOrderAmount > 0 && (
                    <p className="text-[10px] text-white/25 mt-1.5">Min. order ₹{shop.minOrderAmount}</p>
                  )}
                  <Link href={`/shops/${shop.id}`}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 bg-yellow-400/10 border border-yellow-400/25 text-yellow-400 text-xs font-bold rounded-xl hover:bg-yellow-400/20 transition-colors">
                    View Menu →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function ShopsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen app-bg flex items-center justify-center"><div className="text-white/40">Loading...</div></div>}>
      <ShopsContent />
    </Suspense>
  );
}
