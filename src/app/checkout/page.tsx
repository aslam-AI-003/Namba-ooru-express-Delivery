'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { SEED_SHOPS } from '@/lib/seed-data';
import {
  placeOrder,
  deductFromWallet,
  addNotification,
} from '@/lib/firebaseService';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'upi', icon: '📱', label: 'UPI', desc: 'GPay, PhonePe, Paytm' },
  { id: 'card', icon: '💳', label: 'Card', desc: 'Credit / Debit Card' },
  { id: 'wallet', icon: '👛', label: 'Wallet', desc: 'NammaOoru Wallet' },
  { id: 'cod', icon: '💵', label: 'Cash on Delivery', desc: 'Pay when delivered' },
];

const CATEGORY_ICONS: Record<string, string> = {
  groceries: '🛒', vegetables: '🥬', meat: '🍗', medicines: '💊',
  bakery: '🎂', restaurants: '🍽️', 'tea-shops': '☕', stationery: '✏️',
  'pet-shop': '🐾', 'flower-shop': '🌸', electronics: '📱', courier: '📦',
  'water-can': '💧', 'gas-cylinder': '🔥', milk: '🥛',
};

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart, cartShopId, getCartTotal, clearCart,
    walletBalance, addresses, selectedAddressId, user,
    addDemoOrder,
  } = useStore();

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [upiId, setUpiId] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const shop = SEED_SHOPS.find(s => s.id === cartShopId);
  const subtotal = getCartTotal();
  const deliveryCharge = subtotal >= 500 ? 0 : 50;
  const total = subtotal + deliveryCharge;
  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  if (cart.length === 0) {
    if (typeof window !== 'undefined') router.push('/cart');
    return (
      <div className="min-h-screen app-bg flex items-center justify-center">
        <div className="text-white/40 text-sm">Redirecting...</div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please add a delivery address');
      return;
    }
    if (paymentMethod === 'upi' && !upiId) {
      toast.error('Enter your UPI ID');
      return;
    }
    if (paymentMethod === 'wallet' && walletBalance < total) {
      toast.error(`Insufficient wallet balance. You have ₹${walletBalance}`);
      return;
    }
    if (!user) {
      toast.error('Please login to place an order');
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    try {
      const shopIcon = shop ? (CATEGORY_ICONS[shop.categoryId] || '🏪') : '🏪';
      const now = new Date().toISOString();
      const orderId = 'NOE-' + Date.now().toString(36).toUpperCase().slice(-6);

      // 1. Save to local demo store (always works)
      addDemoOrder({
        id: orderId,
        userId: user.uid,
        shopId: cartShopId || '',
        shopName: shop?.name || 'Unknown Shop',
        shopIcon,
        items: [...cart],
        subtotal,
        deliveryCharge,
        total,
        status: 'placed',
        paymentMethod,
        address: selectedAddress,
        notes: notes || '',
        customerName: user.displayName || 'Customer',
        customerPhone: user.phone || '9876543210',
        createdAt: now,
        updatedAt: now,
      });

      // 2. Also try Firestore (non-blocking)
      placeOrder({
        userId: user.uid,
        shopId: cartShopId || '',
        shopName: shop?.name || 'Unknown Shop',
        shopIcon,
        items: cart,
        subtotal,
        deliveryCharge,
        total,
        status: 'placed',
        paymentMethod,
        address: selectedAddress,
        notes: notes || '',
      }).catch(() => {});

      // 3. If wallet payment, deduct locally
      if (paymentMethod === 'wallet') {
        useStore.getState().setWalletBalance(walletBalance - total);
        deductFromWallet(user.uid, total, `Order ${orderId} Payment`, orderId).catch(() => {});
      }

      // 4. Clear cart
      clearCart();

      toast.success('🎉 Order placed successfully!');
      router.push('/orders');
    } catch (err: any) {
      console.error('Place order error:', err);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen app-bg pb-36 md:pb-8">
      <header className="sticky top-0 z-50 header-glass">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/cart" className="btn-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <h1 className="font-bold text-white">Checkout</h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-4 space-y-4">

        {/* Order Summary */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-bold text-white mb-3">🧾 Order Summary</h3>
          {shop && (
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/[0.06]">
              <span className="text-xl">{CATEGORY_ICONS[shop.categoryId] || '🏪'}</span>
              <span className="text-sm font-bold text-white">{shop.name}</span>
            </div>
          )}
          <div className="space-y-2 mb-3">
            {cart.map(item => (
              <div key={item.productId} className="flex items-center justify-between">
                <span className="text-sm text-white/70">{item.name} × {item.quantity}</span>
                <span className="text-sm font-semibold text-white">₹{(item.discountPrice || item.price) * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="divider mb-3" />
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Subtotal</span>
              <span className="text-white">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Delivery</span>
              <span className={deliveryCharge === 0 ? 'text-emerald-400 font-bold' : 'text-white'}>
                {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
              </span>
            </div>
            {deliveryCharge > 0 && (
              <p className="text-[10px] text-white/30">Add ₹{500 - subtotal} more for free delivery</p>
            )}
            <div className="divider my-1" />
            <div className="flex justify-between">
              <span className="font-black text-white">Total</span>
              <span className="font-black text-yellow-400 text-lg">₹{total}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">📍 Delivery Address</h3>
            <Link href="/profile" className="text-xs text-yellow-400 font-semibold">Change</Link>
          </div>
          {selectedAddress ? (
            <div className="p-3 bg-yellow-400/5 border border-yellow-400/15 rounded-xl">
              <p className="text-xs font-bold text-yellow-400">{selectedAddress.label}</p>
              <p className="text-sm text-white mt-0.5">{selectedAddress.fullAddress}</p>
              <p className="text-xs text-white/40 mt-0.5">{selectedAddress.city} - {selectedAddress.pincode}</p>
            </div>
          ) : (
            <Link href="/profile" className="block p-3 border border-dashed border-white/20 rounded-xl text-center text-sm text-white/40 hover:border-yellow-400/30 hover:text-yellow-400 transition-colors">
              + Add Delivery Address
            </Link>
          )}
        </div>

        {/* Delivery Time */}
        <div className="glass-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center text-xl">⚡</div>
          <div>
            <p className="text-sm font-bold text-white">Estimated Delivery</p>
            <p className="text-xs text-white/40">{(shop?.avgPrepTime || 20) + 15}–{(shop?.avgPrepTime || 20) + 25} minutes</p>
          </div>
          <div className="ml-auto badge badge-success">On Time</div>
        </div>

        {/* Payment Method */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-bold text-white mb-3">💳 Payment Method</h3>
          <div className="space-y-2">
            {PAYMENT_METHODS.map(pm => (
              <button key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${paymentMethod === pm.id ? 'bg-yellow-400/8 border-yellow-400/30' : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'}`}>
                <span className="text-xl">{pm.icon}</span>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-white">{pm.label}</p>
                  <p className="text-xs text-white/35">
                    {pm.id === 'wallet'
                      ? `Balance: ₹${walletBalance}${walletBalance < total ? ' (Insufficient)' : ''}`
                      : pm.desc}
                  </p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === pm.id ? 'border-yellow-400' : 'border-white/20'}`}>
                  {paymentMethod === pm.id && <div className="w-2 h-2 bg-yellow-400 rounded-full" />}
                </div>
              </button>
            ))}
          </div>
          {paymentMethod === 'upi' && (
            <div className="mt-3">
              <input value={upiId} onChange={e => setUpiId(e.target.value)}
                placeholder="Enter UPI ID (e.g. name@upi)" className="input-glass text-sm" />
            </div>
          )}
        </div>

        {/* Special Instructions */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-bold text-white mb-3">📝 Special Instructions</h3>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Any special requests for the shop or delivery partner..."
            className="input-glass text-sm resize-none" rows={3} />
        </div>

      </div>

      {/* Place Order Button */}
      <div className="sticky-bottom">
        <div className="max-w-5xl mx-auto">
          <button onClick={handlePlaceOrder} disabled={loading}
            className="btn-primary w-full py-4 text-base justify-between disabled:opacity-60">
            <span className="flex items-center gap-2">
              {loading && (
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              )}
              {loading ? 'Placing Order...' : '🎉 Place Order'}
            </span>
            <span className="font-black">₹{total}</span>
          </button>
        </div>
      </div>
    </main>
  );
}
