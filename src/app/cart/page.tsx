'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { SEED_SHOPS, SEED_COUPONS, SEED_PRODUCTS } from '@/lib/seed-data';
import toast from 'react-hot-toast';

const CATEGORY_ICONS: Record<string, string> = {
  groceries: '🛒', vegetables: '🥬', meat: '🍗', medicines: '💊',
  bakery: '🎂', restaurants: '🍽️', 'tea-shops': '☕',
};

export default function CartPage() {
  const router = useRouter();
  const { cart, cartShopId, updateQuantity, removeFromCart, clearCart, getCartTotal, addToCart } = useStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<typeof SEED_COUPONS[0] | null>(null);
  const [couponError, setCouponError] = useState('');

  const shop = SEED_SHOPS.find(s => s.id === cartShopId);
  const subtotal = getCartTotal();
  const deliveryCharge = subtotal >= 500 ? 0 : 50;
  const discount = appliedCoupon
    ? appliedCoupon.type === 'percentage'
      ? Math.min(Math.round(subtotal * appliedCoupon.value / 100), appliedCoupon.maxDiscount)
      : appliedCoupon.value
    : 0;
  const total = subtotal + deliveryCharge - discount;

  // Upsell: products from same shop not already in cart
  const upsellProducts = SEED_PRODUCTS
    .filter(p => p.shopId === cartShopId && !cart.find(c => c.productId === p.id))
    .slice(0, 6);

  const applyCoupon = () => {
    const coupon = SEED_COUPONS.find(c => c.code === couponCode.toUpperCase() && c.isActive);
    if (!coupon) { setCouponError('Invalid coupon code'); return; }
    if (subtotal < coupon.minOrderAmount) { setCouponError(`Min. order ₹${coupon.minOrderAmount} required`); return; }
    setAppliedCoupon(coupon);
    setCouponError('');
    toast.success(`Coupon applied! You save ₹${coupon.type === 'percentage' ? Math.min(Math.round(subtotal * coupon.value / 100), coupon.maxDiscount) : coupon.value}`);
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen app-bg pb-24 md:pb-8">
        <header className="sticky top-0 z-50 header-glass">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
            <Link href="/" className="btn-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></Link>
            <h1 className="font-bold text-white">My Cart</h1>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
          <div className="text-7xl mb-6" style={{ animation: 'float 3s ease-in-out infinite' }}>🛒</div>
          <h2 className="text-2xl font-black text-white">Your cart is empty</h2>
          <p className="text-white/40 mt-2 text-sm">Add items from nearby shops to get started</p>
          <Link href="/shops" className="btn-primary mt-6">Browse Shops →</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen app-bg pb-36 md:pb-8">
      <header className="sticky top-0 z-50 header-glass">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href={shop ? `/shops/${shop.id}` : '/shops'} className="btn-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <div className="flex-1">
            <h1 className="font-bold text-white">My Cart</h1>
            {shop && <p className="text-xs text-white/40">{shop.name}</p>}
          </div>
          <button onClick={() => { clearCart(); toast.success('Cart cleared'); }}
            className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors">
            Clear All
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-4 space-y-4">
        {/* Shop info */}
        {shop && (
          <div className="rounded-2xl border p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.07)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(251,191,36,0.1)' }}>
              {CATEGORY_ICONS[shop.categoryId] || '🏪'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{shop.name}</p>
              <p className="text-xs text-white/40 truncate">{shop.address.full}</p>
            </div>
            <Link href={`/shops/${shop.id}`} className="text-xs text-yellow-400 font-semibold hover:text-yellow-300 flex-shrink-0">
              Add More +
            </Link>
          </div>
        )}

        {/* Free delivery progress */}
        {subtotal < 500 && (
          <div className="rounded-2xl border p-3" style={{ background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.15)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400">🚀 Free delivery at ₹500</span>
              <span className="text-xs text-white/40">₹{500 - subtotal} more</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(subtotal / 500) * 100}%`, background: 'linear-gradient(90deg, #10B981, #34D399)' }} />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="space-y-2">
          {cart.map(item => (
            <div key={item.productId} className="rounded-2xl border p-4 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.04)' }}>
                📦
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                <p className="text-[11px] text-white/35">{item.unit}</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-sm font-black text-white">₹{item.discountPrice || item.price}</span>
                  {item.discountPrice && item.discountPrice < item.price && (
                    <span className="text-[10px] text-white/30 line-through">₹{item.price}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => item.quantity === 1 ? removeFromCart(item.productId) : updateQuantity(item.productId, item.quantity - 1)}>−</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                </div>
                <button onClick={() => removeFromCart(item.productId)} className="w-7 h-7 flex items-center justify-center text-white/25 hover:text-red-400 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── UPSELL: Add More Items ── */}
        {upsellProducts.length > 0 && (
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">✨ Add More Items</h3>
              <Link href={`/shops/${cartShopId}`} className="text-xs text-yellow-400 font-semibold">View All →</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto px-4 pb-4 scrollbar-hide">
              {upsellProducts.map(product => {
                const inCart = cart.find(c => c.productId === product.id);
                return (
                  <div key={product.id} className="flex-shrink-0 w-36 rounded-xl border p-3" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-2" style={{ background: 'rgba(251,191,36,0.08)' }}>
                      {CATEGORY_ICONS[product.categoryId] || '📦'}
                    </div>
                    <p className="text-xs font-bold text-white truncate mb-0.5">{product.name}</p>
                    <p className="text-[10px] text-white/35 mb-2">{product.unit}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">₹{product.discountPrice || product.price}</span>
                      {inCart ? (
                        <div className="flex items-center gap-1">
                          <button className="w-5 h-5 rounded-md bg-yellow-400/15 text-yellow-400 text-xs font-black flex items-center justify-center">−</button>
                          <span className="text-xs font-bold text-white w-4 text-center">{inCart.quantity}</span>
                          <button className="w-5 h-5 rounded-md bg-yellow-400/15 text-yellow-400 text-xs font-black flex items-center justify-center">+</button>
                        </div>
                      ) : (
                        <button onClick={() => {
                          addToCart({ productId: product.id, shopId: product.shopId, name: product.name, nameTamil: product.nameTamil, price: product.price, discountPrice: product.discountPrice, quantity: 1, unit: product.unit, isVeg: product.isVeg });
                          toast.success(`${product.name} added!`);
                        }} className="w-6 h-6 rounded-md flex items-center justify-center text-sm font-black transition-all hover:scale-110"
                          style={{ background: 'rgba(251,191,36,0.15)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.25)' }}>
                          +
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Coupon */}
        <div className="rounded-2xl border p-4" style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.07)' }}>
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <span>🎟️</span> Apply Coupon
          </h3>
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-3 rounded-xl border" style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' }}>
              <div>
                <p className="text-sm font-bold text-emerald-400">{appliedCoupon.code}</p>
                <p className="text-xs text-white/40">{appliedCoupon.description}</p>
              </div>
              <button onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} className="text-xs text-red-400 hover:text-red-300 font-semibold">Remove</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input value={couponCode} onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                placeholder="Enter coupon code" className="input-glass flex-1 py-2.5 text-sm" />
              <button onClick={applyCoupon} className="btn-primary px-4 py-2.5 text-sm">Apply</button>
            </div>
          )}
          {couponError && <p className="text-xs text-red-400 mt-2">{couponError}</p>}
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
            {SEED_COUPONS.filter(c => c.isActive).map(c => (
              <button key={c.id} onClick={() => { setCouponCode(c.code); setCouponError(''); }}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', color: '#FBBF24' }}>
                {c.code}
              </button>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="rounded-2xl border p-4" style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><span>📍</span> Delivery Address</h3>
            <Link href="/profile" className="text-xs text-yellow-400 font-semibold">Change</Link>
          </div>
          <div className="p-3 rounded-xl border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <p className="text-xs font-bold text-white">🏠 Home</p>
            <p className="text-xs text-white/40 mt-0.5">123, East Main Road, Thanjavur - 613001</p>
          </div>
        </div>

        {/* Bill Summary */}
        <div className="rounded-2xl border p-4" style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.07)' }}>
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><span>🧾</span> Bill Summary</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Subtotal', value: `₹${subtotal}` },
              { label: `Delivery${subtotal >= 500 ? ' (Free!)' : ''}`, value: deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`, color: deliveryCharge === 0 ? 'text-emerald-400' : '' },
              ...(discount > 0 ? [{ label: `Discount (${appliedCoupon?.code})`, value: `-₹${discount}`, color: 'text-emerald-400' }] : []),
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-sm text-white/50">{row.label}</span>
                <span className={`text-sm font-semibold ${row.color || 'text-white'}`}>{row.value}</span>
              </div>
            ))}
            <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="flex items-center justify-between">
              <span className="text-base font-black text-white">Total</span>
              <span className="text-base font-black text-yellow-400">₹{total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Bar */}
      <div className="sticky-bottom">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => router.push('/checkout')} className="btn-primary w-full py-4 text-base justify-between">
            <span>Proceed to Checkout</span>
            <span className="font-black">₹{total} →</span>
          </button>
        </div>
      </div>
    </main>
  );
}
