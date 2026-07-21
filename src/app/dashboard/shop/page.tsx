'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore, DemoOrder } from '@/store/useStore';
import toast from 'react-hot-toast';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SHOP DASHBOARD — Vendor can see orders, accept, prepare, mark ready
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const STATUS_FLOW: Record<string, { next: DemoOrder['status']; label: string; color: string }> = {
  placed:    { next: 'confirmed', label: 'Accept Order', color: 'bg-emerald-500' },
  confirmed: { next: 'preparing', label: 'Start Preparing', color: 'bg-blue-500' },
  preparing: { next: 'ready', label: 'Mark Ready', color: 'bg-orange-500' },
};

const STATUS_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  placed:     { label: 'New Order', color: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30', icon: '🔔' },
  confirmed:  { label: 'Confirmed', color: 'bg-blue-400/10 text-blue-400 border-blue-400/30', icon: '✅' },
  preparing:  { label: 'Preparing', color: 'bg-orange-400/10 text-orange-400 border-orange-400/30', icon: '👨‍🍳' },
  ready:      { label: 'Ready', color: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30', icon: '📦' },
  picked_up:  { label: 'Picked Up', color: 'bg-purple-400/10 text-purple-400 border-purple-400/30', icon: '🛵' },
  on_the_way: { label: 'On the Way', color: 'bg-indigo-400/10 text-indigo-400 border-indigo-400/30', icon: '🛵' },
  delivered:  { label: 'Delivered', color: 'bg-green-400/10 text-green-400 border-green-400/30', icon: '✅' },
  cancelled:  { label: 'Cancelled', color: 'bg-red-400/10 text-red-400 border-red-400/30', icon: '❌' },
};

export default function ShopDashboard() {
  const { demoOrders, updateDemoOrderStatus } = useStore();
  const [shopStatus, setShopStatus] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'active' | 'all'>('active');

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="min-h-screen app-bg" />;

  // Show ALL orders for this demo (in production, filter by shopId)
  const allOrders = demoOrders;
  const activeOrders = allOrders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const displayOrders = filter === 'active' ? activeOrders : allOrders;

  const stats = {
    total: allOrders.length,
    active: activeOrders.length,
    revenue: allOrders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0),
    newOrders: allOrders.filter(o => o.status === 'placed').length,
  };

  const handleStatusChange = (orderId: string, newStatus: DemoOrder['status']) => {
    // When vendor marks ready, auto-assign a rider
    if (newStatus === 'ready') {
      updateDemoOrderStatus(orderId, newStatus, {
        riderId: 'rider-001',
        riderName: 'Murugan K',
      });
      toast.success('Order ready! Rider assigned: Murugan K 🛵');
    } else {
      updateDemoOrderStatus(orderId, newStatus);
      toast.success(`Order updated: ${STATUS_LABELS[newStatus]?.label || newStatus}`);
    }
  };

  const handleCancel = (orderId: string) => {
    updateDemoOrderStatus(orderId, 'cancelled');
    toast.error('Order cancelled');
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  return (
    <div className="min-h-screen app-bg pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 header-glass">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="btn-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </Link>
            <div>
              <h1 className="text-sm font-black text-white">🏪 Shop Dashboard</h1>
              <p className="text-[10px] text-white/40">Vendor Panel — Demo Mode</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShopStatus(!shopStatus)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                shopStatus ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
              {shopStatus ? '🟢 Open' : '🔴 Closed'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-4 space-y-4">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Total Orders', value: stats.total, icon: '📦', color: 'text-white' },
            { label: 'Active', value: stats.active, icon: '⏳', color: 'text-yellow-400' },
            { label: 'New', value: stats.newOrders, icon: '🔔', color: 'text-orange-400' },
            { label: 'Revenue', value: `₹${stats.revenue}`, icon: '💰', color: 'text-emerald-400' },
          ].map((s, i) => (
            <div key={i} className="glass-sm p-3 text-center">
              <div className="text-lg">{s.icon}</div>
              <div className={`text-lg font-black ${s.color}`}>{s.value}</div>
              <div className="text-[9px] text-white/35">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {(['active', 'all'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === f ? 'bg-yellow-400 text-black' : 'glass-sm text-white/50'
              }`}>
              {f === 'active' ? `Active (${activeOrders.length})` : `All (${allOrders.length})`}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {displayOrders.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-sm font-bold text-white/50">No orders yet</p>
            <p className="text-xs text-white/30 mt-1">When customers place orders, they'll appear here</p>
            <Link href="/shops" className="btn-primary text-xs px-4 py-2 mt-4 inline-flex">
              ← Go place a test order
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {displayOrders.map((order) => {
              const statusInfo = STATUS_LABELS[order.status] || STATUS_LABELS.placed;
              const flow = STATUS_FLOW[order.status];

              return (
                <div key={order.id} className="glass-card p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{statusInfo.icon}</span>
                      <div>
                        <p className="text-sm font-black text-white">#{order.id}</p>
                        <p className="text-[10px] text-white/40">{timeAgo(order.createdAt)}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Customer info */}
                  <div className="flex items-center gap-2 p-2 bg-white/[0.03] rounded-lg">
                    <div className="w-8 h-8 bg-yellow-400/10 rounded-full flex items-center justify-center text-sm">👤</div>
                    <div>
                      <p className="text-xs font-bold text-white">{order.customerName}</p>
                      <p className="text-[10px] text-white/40">{order.customerPhone}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-sm font-black text-yellow-400">₹{order.total}</p>
                      <p className="text-[10px] text-white/35">{order.paymentMethod.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-white/60">{item.name} × {item.quantity}</span>
                        <span className="text-white/40">₹{(item.discountPrice || item.price) * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="p-2 bg-yellow-400/5 border border-yellow-400/10 rounded-lg">
                      <p className="text-[10px] text-yellow-400/80">📝 {order.notes}</p>
                    </div>
                  )}

                  {/* Rider info */}
                  {order.riderName && (
                    <div className="flex items-center gap-2 p-2 bg-purple-500/5 border border-purple-500/10 rounded-lg">
                      <span className="text-sm">🛵</span>
                      <p className="text-xs text-purple-400 font-semibold">Rider: {order.riderName}</p>
                    </div>
                  )}

                  {/* Action buttons */}
                  {flow && (
                    <div className="flex gap-2">
                      <button onClick={() => handleStatusChange(order.id, flow.next)}
                        className={`flex-1 ${flow.color} text-white text-xs font-bold py-2.5 rounded-xl transition-all hover:opacity-90`}>
                        {flow.label} →
                      </button>
                      {order.status === 'placed' && (
                        <button onClick={() => handleCancel(order.id)}
                          className="px-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold py-2.5 rounded-xl">
                          Reject
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Help text */}
        <div className="glass-sm p-4 text-center">
          <p className="text-xs text-white/30">
            💡 <strong className="text-white/50">Demo Flow:</strong> Customer places order → appears here as "New" → 
            Accept → Prepare → Ready → Rider gets assigned automatically
          </p>
          <div className="flex justify-center gap-3 mt-3">
            <Link href="/dashboard/rider" className="text-xs text-yellow-400 font-bold hover:text-yellow-300">
              🛵 Open Rider Dashboard →
            </Link>
            <Link href="/orders" className="text-xs text-blue-400 font-bold hover:text-blue-300">
              📋 View as Customer →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
