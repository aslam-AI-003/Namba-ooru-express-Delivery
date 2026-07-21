'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { SEED_SHOPS, SEED_PRODUCTS, SEED_CATEGORIES } from '@/lib/seed-data';
import toast from 'react-hot-toast';

const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  groceries: { icon: '🛒', color: '#FBBF24' }, vegetables: { icon: '🥬', color: '#10B981' },
  meat: { icon: '🍗', color: '#EF4444' }, medicines: { icon: '💊', color: '#3B82F6' },
  bakery: { icon: '🎂', color: '#EC4899' }, restaurants: { icon: '🍽️', color: '#F97316' },
  'tea-shops': { icon: '☕', color: '#92400E' }, stationery: { icon: '✏️', color: '#8B5CF6' },
  'pet-shop': { icon: '🐾', color: '#14B8A6' }, 'flower-shop': { icon: '🌸', color: '#F43F5E' },
  electronics: { icon: '📱', color: '#06B6D4' }, courier: { icon: '📦', color: '#6366F1' },
  'water-can': { icon: '💧', color: '#0EA5E9' }, 'gas-cylinder': { icon: '🔥', color: '#F97316' },
  milk: { icon: '🥛', color: '#94A3B8' },
};

const POPULAR_SEARCHES = ['Rice', 'Chicken', 'Medicine', 'Cake', 'Coffee', 'Vegetables', 'Biryani', 'Milk'];

export default function SearchPage() {
  const router = useRouter();
  const { addToCart, updateQuantity, removeFromCart, cart, getCartTotal, getCartItemCount } = useStore();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'shops' | 'products'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>(['Ponni Rice', 'Filter Coffee', 'Chicken Biryani']);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const shopResults = query.length > 1
    ? SEED_SHOPS.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase()) ||
        s.tags.some(t => t.includes(query.toLowerCase())))
    : [];

  const productResults = query.length > 1
    ? SEED_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.nameTamil.includes(query))
    : [];

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.length > 2 && !recentSearches.includes(q)) {
      setRecentSearches(prev => [q, ...prev].slice(0, 5));
    }
  };

  const handleAddToCart = (product: typeof SEED_PRODUCTS[0]) => {
    addToCart({
      productId: product.id,
      shopId: product.shopId,
      name: product.name,
      nameTamil: product.nameTamil,
      price: product.price,
      discountPrice: product.discountPrice,
      quantity: 1,
      unit: product.unit,
      isVeg: product.isVeg,
    });
    toast.success(`${product.name} added to cart! 🛒`, {
      duration: 2000,
      style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '14px', fontSize: '13px', fontWeight: '600' },
      icon: '✅',
    });
  };

  const handleIncrease = (product: typeof SEED_PRODUCTS[0], currentQty: number) => {
    updateQuantity(product.id, currentQty + 1);
  };

  const handleDecrease = (product: typeof SEED_PRODUCTS[0], currentQty: number) => {
    if (currentQty <= 1) {
      removeFromCart(product.id);
      toast(`${product.name} removed from cart`, { icon: '🗑️', duration: 1500 });
    } else {
      updateQuantity(product.id, currentQty - 1);
    }
  };

  const totalResults = shopResults.length + productResults.length;
  const cartItemCount = getCartItemCount();
  const cartTotal = getCartTotal();

  return (
    <main className="min-h-screen app-bg pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 header-glass">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="btn-icon flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <div className="search-bar flex-1">
            <span className="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input ref={inputRef} value={query} onChange={e => handleSearch(e.target.value)}
              placeholder="Search shops, products, medicines..." autoFocus />
          </div>
          {query && (
            <button onClick={() => setQuery('')} className="btn-icon flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-4">
        {!query ? (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">Recent</h3>
                  <button onClick={() => setRecentSearches([])} className="text-xs text-white/30 hover:text-white/50">Clear</button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map(s => (
                    <button key={s} onClick={() => handleSearch(s)}
                      className="w-full flex items-center gap-3 p-3 glass-sm hover:bg-white/[0.05] transition-colors text-left">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <span className="text-sm text-white/70 flex-1">{s}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div className="mb-5">
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">🔥 Popular</h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map(s => (
                  <button key={s} onClick={() => handleSearch(s)}
                    className="cat-pill hover:bg-yellow-400/10 hover:border-yellow-400/20 hover:text-yellow-400">
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Browse Categories */}
            <div>
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">📂 Browse Categories</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {SEED_CATEGORIES.slice(0, 12).map(cat => {
                  const meta = CATEGORY_META[cat.id] || { icon: '🏪', color: '#FBBF24' };
                  return (
                    <Link key={cat.id} href={`/shops?category=${cat.id}`}
                      className="glass-card-hover p-3 flex items-center gap-2 group">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 group-hover:scale-110 transition-transform"
                        style={{ background: `${meta.color}15` }}>
                        {meta.icon}
                      </div>
                      <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors truncate">{cat.name.split('/')[0]}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Results header */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-white/50">
                {totalResults > 0
                  ? <><span className="text-white font-bold">{totalResults}</span> results for &ldquo;<span className="text-yellow-400">{query}</span>&rdquo;</>
                  : 'No results found'}
              </p>
            </div>

            {/* Tabs */}
            {totalResults > 0 && (
              <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl mb-4">
                {([['all', `All (${totalResults})`], ['shops', `Shops (${shopResults.length})`], ['products', `Products (${productResults.length})`]] as const).map(([tab, label]) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-yellow-400 text-black' : 'text-white/50 hover:text-white/70'}`}>
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Shop Results */}
            {(activeTab === 'all' || activeTab === 'shops') && shopResults.length > 0 && (
              <div className="mb-4">
                {activeTab === 'all' && <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">🏪 Shops</h3>}
                <div className="space-y-2">
                  {shopResults.map(shop => {
                    const meta = CATEGORY_META[shop.categoryId] || { icon: '🏪', color: '#FBBF24' };
                    return (
                      <Link key={shop.id} href={`/shops/${shop.id}`}
                        className="glass-card-hover flex items-center gap-3 p-3 group">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                          style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}20` }}>
                          {meta.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors truncate">{shop.name}</h4>
                          <p className="text-xs text-white/35 truncate">{shop.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-yellow-400">⭐ {shop.rating}</span>
                            <span className="text-[10px] text-white/35">⚡ {shop.avgPrepTime}m</span>
                            <div className={`badge ${shop.isOpen ? 'badge-success' : 'badge-error'} text-[9px]`}>
                              {shop.isOpen ? 'Open' : 'Closed'}
                            </div>
                          </div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Product Results */}
            {(activeTab === 'all' || activeTab === 'products') && productResults.length > 0 && (
              <div className="mb-4">
                {activeTab === 'all' && <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">📦 Products</h3>}
                <div className="space-y-2">
                  {productResults.map(product => {
                    const cartItem = cart.find(i => i.productId === product.id);
                    const meta = CATEGORY_META[product.categoryId] || { icon: '📦', color: '#FBBF24' };
                    return (
                      <div key={product.id} className="glass-sm p-3 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                          style={{ background: `${meta.color}15` }}>
                          {meta.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-white truncate">{product.name}</h4>
                          <p className="text-xs text-white/35">{product.nameTamil} • {product.unit}</p>
                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-sm font-black text-white">₹{product.discountPrice || product.price}</span>
                            {product.discountPrice && <span className="text-[10px] text-white/30 line-through">₹{product.price}</span>}
                          </div>
                        </div>
                        {cartItem ? (
                          <div className="qty-control flex-shrink-0">
                            <button
                              className="qty-btn"
                              onClick={() => handleDecrease(product, cartItem.quantity)}>
                              −
                            </button>
                            <span className="qty-value">{cartItem.quantity}</span>
                            <button
                              className="qty-btn"
                              onClick={() => handleIncrease(product, cartItem.quantity)}>
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="flex-shrink-0 px-4 py-1.5 bg-yellow-400/10 border border-yellow-400/25 text-yellow-400 text-xs font-black rounded-lg hover:bg-yellow-400/20 active:scale-95 transition-all">
                            ADD
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No results */}
            {totalResults === 0 && (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-bold text-white/60">No results for &ldquo;{query}&rdquo;</h3>
                <p className="text-sm text-white/30 mt-1">Try a different search term</p>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {POPULAR_SEARCHES.slice(0, 4).map(s => (
                    <button key={s} onClick={() => handleSearch(s)} className="cat-pill">{s}</button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Floating Cart Bar ─────────────────────────────────── */}
      {cartItemCount > 0 && (
        <div
          className="fixed bottom-20 md:bottom-6 left-4 right-4 z-50 max-w-lg mx-auto"
          style={{ animation: 'slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}>
          <button
            onClick={() => router.push('/cart')}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #FBBF24, #F97316)',
              boxShadow: '0 8px 32px rgba(251,191,36,0.4)',
            }}>
            {/* Left: item count badge */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black/20 rounded-xl flex items-center justify-center">
                <span className="text-sm font-black text-white">{cartItemCount}</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-black leading-tight">
                  {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in cart
                </p>
                <p className="text-[11px] text-black/60 font-semibold">Tap to review & checkout</p>
              </div>
            </div>

            {/* Right: total + arrow */}
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-black">₹{cartTotal}</span>
              <div className="w-7 h-7 bg-black/15 rounded-lg flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            </div>
          </button>
        </div>
      )}
    </main>
  );
}
