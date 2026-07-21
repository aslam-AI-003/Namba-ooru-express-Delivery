'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { SEED_SHOPS, SEED_PRODUCTS } from '@/lib/seed-data';
import toast from 'react-hot-toast';

const CATEGORY_ICONS: Record<string, string> = {
  groceries: '🛒', vegetables: '🥬', meat: '🍗', medicines: '💊',
  bakery: '🎂', restaurants: '🍽️', 'tea-shops': '☕', stationery: '✏️',
  'pet-shop': '🐾', 'flower-shop': '🌸', electronics: '📱', courier: '📦',
  'water-can': '💧', 'gas-cylinder': '🔥', milk: '🥛',
};

export default function ShopDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { cart, addToCart, updateQuantity, removeFromCart, favoriteShopIds, toggleFavorite } = useStore();
  const [activeTab, setActiveTab] = useState('menu');
  const [vegOnly, setVegOnly] = useState(false);

  const shop = SEED_SHOPS.find(s => s.id === id);
  const products = SEED_PRODUCTS.filter(p => p.shopId === id && (!vegOnly || p.isVeg));
  const cartItems = cart.filter(i => i.shopId === id);
  const cartTotal = cartItems.reduce((sum, i) => sum + (i.discountPrice || i.price) * i.quantity, 0);
  const isFav = favoriteShopIds.includes(id);

  if (!shop) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🏪</div>
          <h2 className="text-xl font-bold text-white">Shop not found</h2>
          <Link href="/shops" className="btn-primary mt-4 inline-flex">Browse Shops</Link>
        </div>
      </div>
    );
  }

  const shopIcon = CATEGORY_ICONS[shop.categoryId] || '🏪';

  return (
    <main className="min-h-screen app-bg pb-32 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 header-glass">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/shops" className="btn-icon flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-white truncate">{shop.name}</h1>
            <p className="text-xs text-white/40 truncate">{shop.address.full}</p>
          </div>
          <button onClick={() => toggleFavorite(id)}
            className={`btn-icon flex-shrink-0 ${isFav ? 'bg-yellow-400/15 border-yellow-400/30' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? '#fbbf24' : 'none'} stroke={isFav ? '#fbbf24' : 'currentColor'} strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <Link href="/cart" className="relative btn-icon flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {cartItems.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-black text-[9px] font-black rounded-full flex items-center justify-center">{cartItems.reduce((s, i) => s + i.quantity, 0)}</span>}
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4">
        {/* Shop Banner */}
        <div className="mt-4 glass-card overflow-hidden">
          <div className="h-44 bg-gradient-to-br from-yellow-400/10 via-white/[0.02] to-transparent flex items-center justify-center relative">
            <span className="text-7xl animate-float">{shopIcon}</span>
            <div className={`absolute bottom-3 left-3 badge ${shop.isOpen ? 'badge-success' : 'badge-error'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${shop.isOpen ? 'bg-emerald-400' : 'bg-red-400'}`} />
              {shop.isOpen ? 'Open Now' : 'Closed'}
            </div>
            {shop.isFeatured && <span className="floating-badge">⭐ Popular</span>}
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-white">{shop.name}</h2>
                <p className="text-sm text-white/40 mt-0.5">{shop.nameTamil}</p>
                <p className="text-xs text-white/35 mt-1">{shop.description}</p>
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              {[
                { label: 'Rating', value: shop.rating.toString(), icon: '⭐' },
                { label: 'Reviews', value: shop.totalRatings.toString(), icon: '💬' },
                { label: 'Prep Time', value: `${shop.avgPrepTime}m`, icon: '⚡' },
                { label: 'Radius', value: `${shop.deliveryRadius}km`, icon: '📍' },
              ].map(stat => (
                <div key={stat.label} className="glass-sm p-2.5 text-center">
                  <div className="text-base">{stat.icon}</div>
                  <div className="text-sm font-black text-white mt-0.5">{stat.value}</div>
                  <div className="text-[10px] text-white/35">{stat.label}</div>
                </div>
              ))}
            </div>
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {shop.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-white/[0.04] border border-white/[0.08] rounded-full text-[10px] text-white/40">#{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl mt-4 mb-4">
          {[['menu', '🍽️ Menu'], ['info', 'ℹ️ Info'], ['reviews', '⭐ Reviews']].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-yellow-400 text-black' : 'text-white/50 hover:text-white/70'}`}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'menu' && (
          <>
            {/* Veg filter */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-white/50">{products.length} items</p>
              <button onClick={() => setVegOnly(!vegOnly)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${vegOnly ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-white/[0.04] border-white/[0.08] text-white/50'}`}>
                <span className={`w-3 h-3 border-2 rounded-sm flex items-center justify-center ${vegOnly ? 'border-emerald-500' : 'border-white/30'}`}>
                  {vegOnly && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                </span>
                Veg Only
              </button>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🥗</div>
                <p className="text-white/40">No veg items available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map(product => {
                  const cartItem = cart.find(i => i.productId === product.id);
                  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
                  const discountPct = hasDiscount ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) : 0;

                  return (
                    <div key={product.id} className="glass-sm p-4 flex items-center gap-4">
                      {/* Veg indicator */}
                      <div className="flex-shrink-0">
                        <span className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center ${product.isVeg ? 'border-emerald-500' : 'border-red-500'}`}>
                          <span className={`w-2 h-2 rounded-full ${product.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        </span>
                      </div>

                      {/* Product icon */}
                      <div className="w-16 h-16 bg-white/[0.04] rounded-xl flex items-center justify-center text-2xl flex-shrink-0 relative">
                        {CATEGORY_ICONS[product.categoryId] || '📦'}
                        {hasDiscount && (
                          <span className="absolute -top-1 -right-1 px-1 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-black rounded border border-emerald-500/20">
                            -{discountPct}%
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white">{product.name}</h4>
                        <p className="text-[11px] text-white/35 mt-0.5">{product.nameTamil} • {product.unit}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="#fbbf24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          <span className="text-[10px] text-yellow-400 font-bold">{product.rating}</span>
                        </div>
                      </div>

                      {/* Price + Add */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="text-right">
                          <span className="text-sm font-black text-white">₹{product.discountPrice || product.price}</span>
                          {hasDiscount && <span className="block text-[10px] text-white/30 line-through">₹{product.price}</span>}
                        </div>
                        {cartItem ? (
                          <div className="qty-control">
                            <button className="qty-btn" onClick={() => cartItem.quantity === 1 ? removeFromCart(product.id) : updateQuantity(product.id, cartItem.quantity - 1)}>−</button>
                            <span className="qty-value">{cartItem.quantity}</span>
                            <button className="qty-btn" onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}>+</button>
                          </div>
                        ) : (
                          <button onClick={() => {
                            addToCart({ productId: product.id, shopId: product.shopId, name: product.name, nameTamil: product.nameTamil, price: product.price, discountPrice: product.discountPrice, quantity: 1, unit: product.unit, isVeg: product.isVeg });
                            toast.success('Added to cart!', { icon: '🛒' });
                          }} className="px-4 py-1.5 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-black rounded-lg hover:bg-yellow-400/20 active:scale-95 transition-all">
                            ADD
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'info' && (
          <div className="space-y-3">
            {[
              { icon: '📍', label: 'Address', value: shop.address.full },
              { icon: '📞', label: 'Phone', value: shop.phone },
              { icon: '🕐', label: 'Timing', value: `${shop.timing.openTime} – ${shop.timing.closeTime}` },
              { icon: '🛵', label: 'Delivery Radius', value: `${shop.deliveryRadius} km` },
              { icon: '💰', label: 'Min. Order', value: shop.minOrderAmount > 0 ? `₹${shop.minOrderAmount}` : 'No minimum' },
              { icon: '⚡', label: 'Avg Prep Time', value: `${shop.avgPrepTime} minutes` },
            ].map(item => (
              <div key={item.label} className="glass-sm p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/[0.04] rounded-xl flex items-center justify-center text-lg flex-shrink-0">{item.icon}</div>
                <div>
                  <p className="text-xs text-white/40">{item.label}</p>
                  <p className="text-sm font-semibold text-white mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-3">
            <div className="glass-card p-5 text-center">
              <div className="text-5xl font-black text-white">{shop.rating}</div>
              <div className="flex justify-center gap-1 mt-2">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill={s <= Math.round(shop.rating) ? '#fbbf24' : 'rgba(255,255,255,0.1)'}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ))}
              </div>
              <p className="text-sm text-white/40 mt-1">Based on {shop.totalRatings} reviews</p>
            </div>
            {[
              { name: 'Ravi Kumar', rating: 5, comment: 'Excellent quality and fast delivery! Highly recommended.', time: '2 days ago' },
              { name: 'Priya S', rating: 4, comment: 'Good products, fresh and well-packed. Will order again.', time: '1 week ago' },
              { name: 'Murugan T', rating: 5, comment: 'Best shop in Thanjavur! Always on time.', time: '2 weeks ago' },
            ].map((r, i) => (
              <div key={i} className="glass-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-yellow-400/20 rounded-full flex items-center justify-center text-sm font-bold text-yellow-400">{r.name[0]}</div>
                    <span className="text-sm font-semibold text-white">{r.name}</span>
                  </div>
                  <span className="text-xs text-white/30">{r.time}</span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[1,2,3,4,5].map(s => <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= r.rating ? '#fbbf24' : 'rgba(255,255,255,0.1)'}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                </div>
                <p className="text-xs text-white/50 leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Bar */}
      {cartItems.length > 0 && (
        <div className="sticky-bottom">
          <div className="max-w-5xl mx-auto">
            <Link href="/cart" className="btn-primary w-full py-4 text-base justify-between">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 bg-black/20 rounded-lg flex items-center justify-center text-xs font-black">
                  {cartItems.reduce((s, i) => s + i.quantity, 0)}
                </span>
                View Cart
              </span>
              <span className="font-black">₹{cartTotal} →</span>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
