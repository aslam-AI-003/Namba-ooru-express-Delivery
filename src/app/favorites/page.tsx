'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { SEED_SHOPS } from '@/lib/seed-data';

const SHOP_ICONS: Record<string, string> = {
  groceries: '🛒', vegetables: '🥬', meat: '🍗', medicines: '💊',
  bakery: '🎂', restaurants: '🍽️', 'tea-shops': '☕',
};

export default function FavoritesPage() {
  const { favoriteShopIds, toggleFavorite } = useStore();
  const favShops = SEED_SHOPS.filter(s => favoriteShopIds.includes(s.id));

  return (
    <main className="min-h-screen app-bg pb-24 md:pb-8">
      <header className="sticky top-0 z-50 header-glass">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="btn-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></Link>
          <h1 className="font-bold text-white flex-1">Favourites</h1>
          <span className="text-xs text-white/40">{favShops.length} saved</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-4">
        {favShops.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-float">❤️</div>
            <h3 className="text-lg font-bold text-white/60">No favourites yet</h3>
            <p className="text-sm text-white/30 mt-1">Tap the heart icon on any shop to save it</p>
            <Link href="/shops" className="btn-primary mt-5 inline-flex">Browse Shops →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favShops.map(shop => (
              <div key={shop.id} className="glass-card-hover group overflow-hidden">
                <div className="relative h-36 bg-gradient-to-br from-yellow-400/8 to-transparent flex items-center justify-center">
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{SHOP_ICONS[shop.categoryId] || '🏪'}</span>
                  <div className={`absolute bottom-2 right-2 badge ${shop.isOpen ? 'badge-success' : 'badge-error'} text-[10px]`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${shop.isOpen ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    {shop.isOpen ? 'Open' : 'Closed'}
                  </div>
                  <button onClick={() => toggleFavorite(shop.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-red-500/30 transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#f87171" stroke="#f87171" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white group-hover:text-yellow-400 transition-colors">{shop.name}</h3>
                  <p className="text-xs text-white/35 mt-0.5 line-clamp-1">{shop.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs font-bold text-yellow-400">⭐ {shop.rating}</span>
                    <span className="text-xs text-white/40">⚡ {shop.avgPrepTime} min</span>
                  </div>
                  <Link href={`/shops/${shop.id}`}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-bold rounded-xl hover:bg-yellow-400/20 transition-colors">
                    Order Now →
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
