'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { rateOrder, cancelOrder, addNotification } from '@/lib/firebaseService';
import type { Order } from '@/lib/firebaseService';
import toast from 'react-hot-toast';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
  placed:     { label: 'Order Placed',   color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    icon: '📋' },
  confirmed:  { label: 'Confirmed',      color: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20',  icon: '✅' },
  preparing:  { label: 'Preparing',      color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/20',  icon: '👨‍🍳' },
  ready:      { label: 'Ready',          color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: '📦' },
  in_transit: { label: 'On the Way',     color: 'text-orange-400',  bg: 'bg-orange-500/10',  border: 'border-orange-500/20',  icon: '🛵' },
  delivered:  { label: 'Delivered',      color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: '🎉' },
  cancelled:  { label: 'Cancelled',      color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/20',     icon: '❌' },
};

const TABS = ['All', 'Active', 'Delivered', 'Cancelled'];
const STEPS = ['placed', 'confirmed', 'preparing', 'in_transit', 'delivered'];
const STEP_ICONS = ['📋', '✅', '👨‍🍳', '🛵', '🎉'];

function SuccessBanner({ onClose }: { onClose: () => void }) {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (searchParams.get('new')) {
      setShow(true);
      const t = setTimeout(() => { setShow(false); onClose(); }, 4000);
      return () => clearTimeout(t);
    }
  }, [searchParams, onClose]);
  if (!show) return null;
  return (
    <div className="fixed top-4 left-4 right-4 z-[100]" style={{ animation: 'slideUp 0.4s ease' }}>
      <div className="max-w-md mx-auto p-4 rounded-2xl border backdrop-blur-xl flex items-center gap-3"
        style={{ background: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.3)' }}>
        <div className="text-3xl">🎉</div>
        <div><p className="font-black text-emerald-400">Order Placed!</p><p className="text-xs text-white/60">Your order is being prepared</p></div>
        <button onClick={() => { setShow(false); onClose(); }} className="ml-auto text-white/30 hover:text-white/60 text-lg">✕</button>
      </div>
    </div>
  );
}

function RatingModal({ order, onClose, onSubmit }: { order: Order; onClose: () => void; onSubmit: (rating: number, review: string) => void }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const QUICK_TAGS = ['Fast Delivery', 'Fresh Items', 'Good Packaging', 'Friendly Rider', 'Value for Money', 'Will Order Again'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: 'rgba(255,255,255,0.15)' }} />
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">{order.shopIcon}</div>
          <h2 className="font-black text-white text-lg">Rate Your Order</h2>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{order.shopName} • {order.id?.slice(-8).toUpperCase()}</p>
        </div>
        <div className="flex justify-center gap-3 mb-4">
          {[1,2,3,4,5].map(star => (
            <button key={star}
              onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
              className="text-4xl transition-all duration-150"
              style={{ transform: (hovered || rating) >= star ? 'scale(1.2)' : 'scale(1)', filter: (hovered || rating) >= star ? 'none' : 'grayscale(1) opacity(0.3)' }}>
              ⭐
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-center text-sm font-bold mb-4" style={{ color: '#FBBF24' }}>
            {['', 'Poor 😞', 'Fair 😐', 'Good 🙂', 'Great 😊', 'Excellent! 🤩'][rating]}
          </p>
        )}
        {rating >= 4 && (
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {QUICK_TAGS.map(tag => (
              <button key={tag} onClick={() => setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{
                  background: tags.includes(tag) ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${tags.includes(tag) ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  color: tags.includes(tag) ? '#FBBF24' : 'rgba(255,255,255,0.5)',
                }}>
                {tag}
              </button>
            ))}
          </div>
        )}
        <textarea value={review} onChange={e => setReview(e.target.value)}
          placeholder="Share your experience (optional)..."
          className="input-glass text-sm resize-none mb-4 w-full" rows={3} />
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 py-3">Skip</button>
          <button onClick={() => { if (rating === 0) { toast.error('Please select a rating'); return; } onSubmit(rating, review); }}
            className="btn-primary flex-1 py-3">Submit Review</button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { orders, user, demoOrders } = useStore();
  const [activeTab, setActiveTab] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [ratingOrder, setRatingOrder] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Merge demo orders into the orders list (convert DemoOrder → Order format)
  const allOrders: Order[] = [
    ...demoOrders.map(d => ({
      id: d.id,
      userId: d.userId,
      shopId: d.shopId,
      shopName: d.shopName,
      shopIcon: d.shopIcon,
      items: d.items,
      subtotal: d.subtotal,
      deliveryCharge: d.deliveryCharge,
      total: d.total,
      status: (d.status === 'picked_up' || d.status === 'on_the_way' ? 'in_transit' : d.status) as Order['status'],
      paymentMethod: d.paymentMethod,
      address: d.address as any,
      notes: d.notes,
      riderId: d.riderId,
      riderName: d.riderName,
    } as Order)),
    ...orders,
  ];

  const filtered = allOrders.filter(o => {
    if (activeTab === 'Active') return STEPS.slice(0, 4).includes(o.status);
    if (activeTab === 'Delivered') return o.status === 'delivered';
    if (activeTab === 'Cancelled') return o.status === 'cancelled';
    return true;
  });

  const handleRatingSubmit = async (order: Order, rating: number, review: string) => {
    try {
      await rateOrder(order.id!, rating, review);
      setRatingOrder(null);
      toast.success(`Thanks for your ${rating}⭐ review!`);
    } catch {
      toast.error('Failed to submit review');
    }
  };

  const handleCancel = async (order: Order) => {
    if (!user) return;
    setCancelling(order.id!);
    try {
      await cancelOrder(order.id!);
      await addNotification(user.uid, {
        type: 'order',
        icon: '❌',
        title: 'Order Cancelled',
        body: `Your order from ${order.shopName} has been cancelled.`,
        read: false,
        orderId: order.id,
      });
      toast.success('Order cancelled');
    } catch {
      toast.error('Failed to cancel order');
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (ts: any) => {
    if (!ts) return '';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ' ' +
      date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="min-h-screen app-bg pb-24 md:pb-8">
      <Suspense fallback={null}>
        <SuccessBanner onClose={() => {}} />
      </Suspense>

      <header className="sticky top-0 z-50 header-glass">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="btn-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <h1 className="font-bold text-white flex-1">My Orders</h1>
          <Link href="/track" className="text-xs text-yellow-400 font-semibold">Track →</Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-4">
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-yellow-400 text-black' : 'text-white/50 hover:text-white/70'}`}>
              {tab}
            </button>
          ))}
        </div>

        {!user ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔐</div>
            <h3 className="text-lg font-bold text-white/60">Login to see your orders</h3>
            <Link href="/auth/login" className="btn-primary mt-5 inline-flex">Login →</Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-bold text-white/60">No orders yet</h3>
            <p className="text-sm text-white/30 mt-1">Start ordering from nearby shops</p>
            <Link href="/shops" className="btn-primary mt-5 inline-flex">Browse Shops →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(order => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.placed;
              const currentIdx = STEPS.indexOf(order.status);
              const isActive = STEPS.slice(0, 4).includes(order.status);

              return (
                <div key={order.id} className="rounded-2xl border p-4 cursor-pointer transition-all hover:border-white/15"
                  style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.07)' }}
                  onClick={() => setSelectedOrder(order)}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.05)' }}>
                        {order.shopIcon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-black" style={{ color: 'rgba(255,255,255,0.35)' }}>#{order.id?.slice(-8).toUpperCase()}</span>
                          <span style={{ color: 'rgba(255,255,255,0.15)' }}>•</span>
                          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{formatDate(order.createdAt)}</span>
                        </div>
                        <h3 className="font-bold text-white">{order.shopName}</h3>
                        <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                          {order.items.map(i => i.name).join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className={`badge ${cfg.bg} ${cfg.color} ${cfg.border} flex-shrink-0 text-[10px]`}>
                      {cfg.icon} {cfg.label}
                    </div>
                  </div>

                  {/* Progress for active orders */}
                  {isActive && (
                    <div className="mb-3">
                      <div className="flex justify-between mb-1.5">
                        {STEPS.map((s, i) => (
                          <div key={s} className={`flex flex-col items-center gap-1 ${i <= currentIdx ? 'opacity-100' : 'opacity-20'}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${i <= currentIdx ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white/40'}`}>
                              {STEP_ICONS[i]}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full bg-yellow-400 transition-all" style={{ width: `${(currentIdx + 1) * 20}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Rating stars if delivered */}
                  {order.status === 'delivered' && order.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className="text-sm" style={{ filter: s <= (order.rating || 0) ? 'none' : 'grayscale(1) opacity(0.3)' }}>⭐</span>
                      ))}
                      <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Your rating</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-white">₹{order.total}</span>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{order.paymentMethod}</span>
                    </div>
                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                      {order.status === 'delivered' && !order.rating && (
                        <button onClick={() => setRatingOrder(order)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                          style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', color: '#FBBF24' }}>
                          Rate ⭐
                        </button>
                      )}
                      {order.status === 'in_transit' && (
                        <Link href="/track" className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                          style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', color: '#F97316' }}>
                          Track 🛵
                        </Link>
                      )}
                      {['placed', 'confirmed', 'preparing'].includes(order.status) && (
                        <button
                          disabled={cancelling === order.id}
                          onClick={() => handleCancel(order)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444' }}>
                          {cancelling === order.id ? '...' : 'Cancel'}
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <Link href="/shops" className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
                          Reorder
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-white">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="btn-icon w-8 h-8">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Order ID', value: '#' + selectedOrder.id?.slice(-8).toUpperCase() },
                { label: 'Shop', value: selectedOrder.shopName },
                { label: 'Date & Time', value: formatDate(selectedOrder.createdAt) },
                { label: 'Payment', value: selectedOrder.paymentMethod },
                { label: 'Address', value: selectedOrder.address?.fullAddress || '' },
              ].map(row => (
                <div key={row.label} className="flex justify-between gap-4">
                  <span className="text-sm flex-shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>{row.label}</span>
                  <span className="text-sm font-bold text-white text-right">{row.value}</span>
                </div>
              ))}
              <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.name} × {item.quantity}</span>
                  <span className="text-sm font-semibold text-white">₹{(item.discountPrice || item.price) * item.quantity}</span>
                </div>
              ))}
              <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="flex justify-between text-sm">
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Delivery</span>
                <span className={selectedOrder.deliveryCharge === 0 ? 'text-emerald-400 font-bold' : 'text-white'}>
                  {selectedOrder.deliveryCharge === 0 ? 'FREE' : `₹${selectedOrder.deliveryCharge}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-black text-white">Total</span>
                <span className="font-black text-yellow-400">₹{selectedOrder.total}</span>
              </div>
              {selectedOrder.status === 'delivered' && !selectedOrder.rating && (
                <button onClick={() => { setSelectedOrder(null); setRatingOrder(selectedOrder); }}
                  className="btn-primary w-full mt-2">Rate this order ⭐</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {ratingOrder && (
        <RatingModal
          order={ratingOrder}
          onClose={() => setRatingOrder(null)}
          onSubmit={(rating, review) => handleRatingSubmit(ratingOrder, rating, review)}
        />
      )}
    </main>
  );
}
