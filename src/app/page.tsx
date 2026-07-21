'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { SEED_SHOPS, SEED_CATEGORIES, SEED_BANNERS } from '@/lib/seed-data';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  groceries:      { icon: '🛒', color: '#FBBF24' },
  vegetables:     { icon: '🥬', color: '#10B981' },
  meat:           { icon: '🍗', color: '#EF4444' },
  medicines:      { icon: '💊', color: '#3B82F6' },
  bakery:         { icon: '🎂', color: '#EC4899' },
  restaurants:    { icon: '🍽️', color: '#F97316' },
  'tea-shops':    { icon: '☕', color: '#92400E' },
  stationery:     { icon: '✏️', color: '#8B5CF6' },
  'pet-shop':     { icon: '🐾', color: '#14B8A6' },
  'flower-shop':  { icon: '🌸', color: '#F43F5E' },
  electronics:    { icon: '📱', color: '#06B6D4' },
  courier:        { icon: '📦', color: '#6366F1' },
  'water-can':    { icon: '💧', color: '#0EA5E9' },
  'gas-cylinder': { icon: '🔥', color: '#F97316' },
  milk:           { icon: '🥛', color: '#94A3B8' },
  cakes:          { icon: '🍰', color: '#F472B6' },
  'custom-parcel':{ icon: '📫', color: '#A78BFA' },
};

const HERO_STATS = [
  { value: '500+', label: 'Shops', icon: '🏪' },
  { value: '10K+', label: 'Deliveries', icon: '🛵' },
  { value: '30 min', label: 'Avg Delivery', icon: '⚡' },
  { value: '4.8★', label: 'Rating', icon: '⭐' },
];

const PROMO_BANNERS = [
  { id: 1, emoji: '🎉', title: '50% OFF', sub: 'First Order', desc: 'New users only', code: 'FIRST50', color: 'from-yellow-500/20 via-orange-500/10 to-transparent', border: 'border-yellow-500/20' },
  { id: 2, emoji: '🛵', title: 'FREE Delivery', sub: 'Orders ₹500+', desc: 'No code needed', code: null, color: 'from-emerald-500/20 via-teal-500/10 to-transparent', border: 'border-emerald-500/20' },
  { id: 3, emoji: '💰', title: '₹100 Cashback', sub: 'Wallet Payment', desc: 'Use code below', code: 'WALLET100', color: 'from-blue-500/20 via-purple-500/10 to-transparent', border: 'border-blue-500/20' },
];

export default function HomePage() {
  const { cart, getCartItemCount, getCartTotal, currentLocation, setLocation } = useStore();
  const [activeBanner, setActiveBanner] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [openShopsCount] = useState(SEED_SHOPS.filter(s => s.isOpen).length);
  const bannerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    bannerRef.current = setInterval(() => setActiveBanner(p => (p + 1) % PROMO_BANNERS.length), 4000);
    return () => { if (bannerRef.current) clearInterval(bannerRef.current); };
  }, []);

  const cartCount = mounted ? getCartItemCount() : 0;
  const cartTotal = mounted ? getCartTotal() : 0;
  const featuredShops = SEED_SHOPS.filter(s => s.isFeatured).slice(0, 6);
  const openShops = SEED_SHOPS.filter(s => s.isOpen).slice(0, 6);

  return (
    <main className="min-h-screen app-bg pb-24 md:pb-8">

      {/* ── TOP NAV ── */}
      <header className="sticky top-0 z-50 header-glass">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-base shadow-lg">🛵</div>
            <div className="hidden sm:block">
              <span className="text-sm font-black text-white">NammaOoru</span>
              <span className="text-sm font-black text-yellow-400"> Express</span>
            </div>
          </Link>

          {/* Location */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-xl flex-1 max-w-[180px] hover:bg-white/[0.07] transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span className="text-xs font-semibold text-white truncate">{currentLocation?.address || 'Thanjavur'}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <Link href="/search" className="btn-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </Link>
            <ThemeToggle variant="icon" />
            <Link href="/notifications" className="btn-icon relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-black text-[9px] font-black rounded-full flex items-center justify-center">3</span>
            </Link>
            <Link href="/cart" className="btn-icon relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-black text-[9px] font-black rounded-full flex items-center justify-center">{cartCount}</span>}
            </Link>
            <Link href="/profile" className="w-9 h-9 bg-gradient-to-br from-yellow-400/20 to-orange-500/10 border border-yellow-400/20 rounded-xl flex items-center justify-center text-sm font-black text-yellow-400">U</Link>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden">
        {/* Background orbs */}
        <div className="orb orb-yellow w-96 h-96 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60" />
        <div className="orb orb-orange w-64 h-64 top-20 right-0 opacity-40" />
        <div className="orb orb-purple w-48 h-48 bottom-0 left-0 opacity-30" />

        <div className="max-w-5xl mx-auto px-4 pt-8 pb-6 relative z-10">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-5 animate-fade-in">
            <div className="live-dot" />
            <span className="text-xs font-bold text-emerald-400">{openShopsCount} shops open near you</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              {/* Main heading */}
              <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-3 animate-slide-down">
                <span className="text-white">நம்ம ஊரு</span><br />
                <span className="gradient-text">Express</span>
                <span className="text-white"> 🛵</span>
              </h1>
              <p className="text-base text-white/50 leading-relaxed mb-6 animate-fade-in delay-200">
                உங்கள் கதவுக்கே கொண்டு வருகிறோம்!<br />
                <span className="text-white/70">Groceries, Food, Medicine & more — delivered in 30 mins</span>
              </p>

              {/* CTA Buttons */}
              <div className="flex gap-3 flex-wrap animate-fade-in delay-300">
                <Link href="/shops" className="btn-primary text-sm px-6 py-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  Order Now
                </Link>
                <Link href="/track" className="btn-secondary text-sm px-6 py-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Track Order
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2 mt-6 animate-fade-in delay-400">
                {HERO_STATS.map((s, i) => (
                  <div key={i} className="glass-sm p-2.5 text-center">
                    <div className="text-base">{s.icon}</div>
                    <div className="text-sm font-black text-white mt-0.5">{s.value}</div>
                    <div className="text-[9px] text-white/35">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="hidden md:flex items-center justify-center relative">
              <div className="relative w-64 h-64">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border border-yellow-400/10 animate-spin" style={{ animationDuration: '20s' }} />
                <div className="absolute inset-4 rounded-full border border-yellow-400/8 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                {/* Center */}
                <div className="absolute inset-8 bg-gradient-to-br from-yellow-400/15 to-orange-500/10 rounded-full border border-yellow-400/20 flex items-center justify-center animate-pulse-glow">
                  <span className="text-6xl animate-float">🛵</span>
                </div>
                {/* Floating icons */}
                {[
                  { icon: '🛒', pos: 'top-0 left-8', delay: '0s' },
                  { icon: '🍽️', pos: 'top-4 right-4', delay: '0.5s' },
                  { icon: '💊', pos: 'bottom-4 left-4', delay: '1s' },
                  { icon: '🎂', pos: 'bottom-0 right-8', delay: '1.5s' },
                ].map((item, i) => (
                  <div key={i} className={`absolute ${item.pos} w-10 h-10 glass-sm flex items-center justify-center text-xl animate-float`} style={{ animationDelay: item.delay }}>
                    {item.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEARCH BAR ── */}
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <Link href="/search" className="block">
          <div className="search-bar">
            <span className="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <div className="w-full py-3 pl-10 pr-4 bg-white/[0.05] border border-white/[0.08] rounded-2xl text-sm text-white/30 cursor-pointer hover:bg-white/[0.07] transition-colors">
              Search shops, products, medicines...
            </div>
          </div>
        </Link>
      </div>

      {/* ── PROMO BANNERS ── */}
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <div className="relative overflow-hidden rounded-2xl">
          {PROMO_BANNERS.map((banner, i) => (
            <div key={banner.id}
              className={`transition-all duration-500 ${i === activeBanner ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}>
              <div className={`glass-card p-4 bg-gradient-to-r ${banner.color} border ${banner.border} flex items-center gap-4`}>
                <div className="text-4xl flex-shrink-0 animate-float">{banner.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-white">{banner.title}</span>
                    <span className="text-sm text-white/60">{banner.sub}</span>
                  </div>
                  <p className="text-xs text-white/40 mt-0.5">{banner.desc}</p>
                  {banner.code && (
                    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-white/[0.06] border border-dashed border-white/20 rounded-lg">
                      <span className="text-xs font-black text-yellow-400 tracking-widest">{banner.code}</span>
                    </div>
                  )}
                </div>
                <Link href="/offers" className="btn-primary text-xs px-4 py-2 flex-shrink-0">Grab →</Link>
              </div>
            </div>
          ))}
          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-3">
            {PROMO_BANNERS.map((_, i) => (
              <button key={i} onClick={() => setActiveBanner(i)}
                className={`h-1.5 rounded-full transition-all ${i === activeBanner ? 'w-6 bg-yellow-400' : 'w-1.5 bg-white/20'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="section-title">What do you need?</h2>
            <p className="section-subtitle">Browse by category</p>
          </div>
          <Link href="/categories" className="text-xs text-yellow-400 font-bold hover:text-yellow-300 transition-colors">See all →</Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {SEED_CATEGORIES.slice(0, 16).map((cat, i) => {
            const meta = CATEGORY_META[cat.id] || { icon: '🏪', color: '#FBBF24' };
            return (
              <Link key={cat.id} href={`/shops?category=${cat.id}`}
                className="glass-card-hover p-2.5 flex flex-col items-center gap-1.5 text-center group animate-fade-in"
                style={{ animationDelay: `${i * 0.03}s` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300"
                  style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}20` }}>
                  {meta.icon}
                </div>
                <span className="text-[10px] font-semibold text-white/60 group-hover:text-white transition-colors leading-tight">{cat.name.split('/')[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── FEATURED SHOPS ── */}
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="section-title">⭐ Popular Shops</h2>
            <p className="section-subtitle">Top-rated near you</p>
          </div>
          <Link href="/shops" className="text-xs text-yellow-400 font-bold hover:text-yellow-300 transition-colors">View all →</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {featuredShops.map((shop, i) => {
            const meta = CATEGORY_META[shop.categoryId] || { icon: '🏪', color: '#FBBF24' };
            return (
              <Link key={shop.id} href={`/shops/${shop.id}`}
                className="flex-shrink-0 w-44 glass-card-hover overflow-hidden group animate-fade-in"
                style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="h-28 flex items-center justify-center relative"
                  style={{ background: `linear-gradient(135deg, ${meta.color}15, transparent)` }}>
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{meta.icon}</span>
                  <div className={`absolute bottom-2 right-2 badge ${shop.isOpen ? 'badge-success' : 'badge-error'} text-[9px]`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${shop.isOpen ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    {shop.isOpen ? 'Open' : 'Closed'}
                  </div>
                  {shop.isFeatured && <span className="floating-badge text-[9px]">⭐ Popular</span>}
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-bold text-white truncate group-hover:text-yellow-400 transition-colors">{shop.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-bold text-yellow-400">⭐ {shop.rating}</span>
                    <span className="text-[10px] text-white/35">⚡ {shop.avgPrepTime}m</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── OPEN NOW ── */}
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="section-title flex items-center gap-2">
              <div className="live-dot" />
              Open Now
            </h2>
            <p className="section-subtitle">{openShopsCount} shops ready to deliver</p>
          </div>
          <Link href="/shops" className="text-xs text-yellow-400 font-bold hover:text-yellow-300 transition-colors">View all →</Link>
        </div>
        <div className="space-y-2">
          {openShops.map((shop, i) => {
            const meta = CATEGORY_META[shop.categoryId] || { icon: '🏪', color: '#FBBF24' };
            return (
              <Link key={shop.id} href={`/shops/${shop.id}`}
                className="glass-card-hover flex items-center gap-3 p-3 group animate-fade-in"
                style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform"
                  style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}20` }}>
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate group-hover:text-yellow-400 transition-colors">{shop.name}</h3>
                  <p className="text-xs text-white/35 truncate mt-0.5">{shop.description}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-bold text-yellow-400">⭐ {shop.rating}</span>
                    <span className="text-[10px] text-white/35">⚡ {shop.avgPrepTime} min</span>
                    <span className="text-[10px] text-white/35">📍 {shop.deliveryRadius} km</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-400/10 border border-yellow-400/20 rounded-xl flex items-center justify-center group-hover:bg-yellow-400/20 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <div className="glass-card p-5 bg-gradient-to-br from-yellow-400/5 to-transparent">
          <h2 className="section-title text-center mb-1">How it works?</h2>
          <p className="section-subtitle text-center mb-5">Order in 4 simple steps</p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { step: '1', icon: '📍', title: 'Set Location', desc: 'Allow GPS or enter address' },
              { step: '2', icon: '🏪', title: 'Choose Shop', desc: 'Browse nearby shops' },
              { step: '3', icon: '🛒', title: 'Add Items', desc: 'Pick what you need' },
              { step: '4', icon: '🎉', title: 'Get Delivered', desc: 'Track in real-time' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center justify-center text-xl mx-auto mb-2 hover:scale-110 transition-transform">
                  {s.icon}
                </div>
                <p className="text-xs font-black text-white">{s.title}</p>
                <p className="text-[10px] text-white/35 mt-0.5 leading-tight">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── QUICK LINKS ── */}
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Link href="/offers" className="glass-card p-4 flex items-center gap-3 bg-gradient-to-br from-yellow-400/10 to-transparent border-yellow-400/15 hover:border-yellow-400/30 transition-all group">
            <div className="text-3xl group-hover:scale-110 transition-transform">🎟️</div>
            <div>
              <p className="text-sm font-black text-white">Offers & Deals</p>
              <p className="text-xs text-white/40">Save up to 50%</p>
            </div>
          </Link>
          <Link href="/track" className="glass-card p-4 flex items-center gap-3 bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/15 hover:border-orange-500/30 transition-all group">
            <div className="text-3xl group-hover:scale-110 transition-transform animate-float">🛵</div>
            <div>
              <p className="text-sm font-black text-white">Track Order</p>
              <p className="text-xs text-white/40">Live tracking</p>
            </div>
          </Link>
          <Link href="/wallet" className="glass-card p-4 flex items-center gap-3 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/15 hover:border-emerald-500/30 transition-all group">
            <div className="text-3xl group-hover:scale-110 transition-transform">👛</div>
            <div>
              <p className="text-sm font-black text-white">My Wallet</p>
              <p className="text-xs text-white/40">Add money & cashback</p>
            </div>
          </Link>
          <Link href="/support" className="glass-card p-4 flex items-center gap-3 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/15 hover:border-blue-500/30 transition-all group">
            <div className="text-3xl group-hover:scale-110 transition-transform">🆘</div>
            <div>
              <p className="text-sm font-black text-white">Help & Support</p>
              <p className="text-xs text-white/40">24/7 assistance</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="max-w-5xl mx-auto px-4 pb-4">
        <div className="glass-sm p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-sm">🛵</div>
            <span className="text-sm font-black text-white">NammaOoru <span className="text-yellow-400">Express</span></span>
          </div>
          <p className="text-xs text-white/30">Thanjavur & Kumbakonam • Made with ❤️ in Tamil Nadu</p>
          <div className="flex justify-center gap-4 mt-3">
            {[['About', '/about'], ['Terms', '/terms'], ['Privacy', '/privacy'], ['Support', '/support']].map(([l, h]) => (
              <Link key={l} href={h} className="text-[11px] text-white/30 hover:text-white/60 transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM NAV ── */}
      <nav className="bottom-nav md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {[
            { href: '/', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>, label: 'Home', active: true },
            { href: '/search', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>, label: 'Search', active: false },
            { href: '/orders', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, label: 'Orders', active: false },
            { href: '/cart', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>, label: 'Cart', active: false, badge: cartCount },
            { href: '/profile', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label: 'Profile', active: false },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all relative ${item.active ? 'text-yellow-400' : 'text-white/35 hover:text-white/60'}`}>
              {item.icon}
              <span className="text-[9px] font-semibold">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-0.5 right-1 w-4 h-4 bg-yellow-400 text-black text-[9px] font-black rounded-full flex items-center justify-center">{item.badge}</span>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* ── FLOATING CART BAR ── */}
      {cartCount > 0 && (
        <div className="sticky-bottom md:hidden">
          <Link href="/cart" className="btn-primary w-full py-3.5 justify-between text-sm">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 bg-black/20 rounded-lg flex items-center justify-center text-xs font-black">{cartCount}</span>
              View Cart
            </span>
            <span className="font-black">₹{cartTotal} →</span>
          </Link>
        </div>
      )}
    </main>
  );
}
