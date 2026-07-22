'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore, DemoOrder } from '@/store/useStore';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Store, Bell, CheckCircle2, ChefHat, Package, Bike, XCircle,
  UserRound, StickyNote, Inbox,
} from 'lucide-react';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SHOP DASHBOARD — Vendor can see orders, accept, prepare, mark ready
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const STATUS_FLOW: Record<string, { next: DemoOrder['status']; label: string; color: string }> = {
  placed:    { next: 'confirmed', label: 'Accept Order', color: 'bg-emerald-500' },
  confirmed: { next: 'preparing', label: 'Start Preparing', color: 'bg-blue-500' },
  preparing: { next: 'ready', label: 'Mark Ready', color: 'bg-orange-500' },
};

const STATUS_LABELS: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  placed:     { label: 'New Order', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25', icon: Bell },
  confirmed:  { label: 'Confirmed', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25', icon: CheckCircle2 },
  preparing:  { label: 'Preparing', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/25', icon: ChefHat },
  ready:      { label: 'Ready', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25', icon: Package },
  picked_up:  { label: 'Picked Up', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25', icon: Bike },
  on_the_way: { label: 'On the Way', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25', icon: Bike },
  delivered:  { label: 'Delivered', color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/25', icon: CheckCircle2 },
  cancelled:  { label: 'Cancelled', color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25', icon: XCircle },
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
      toast.success('Order ready! Rider assigned: Murugan K');
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
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-sm font-black text-body flex items-center gap-1.5"><Store size={14} className="text-accent" /> Shop Dashboard</h1>
              <p className="text-[10px] text-faint">Vendor Panel — Demo Mode</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShopStatus(!shopStatus)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
                shopStatus ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
              }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${shopStatus ? 'bg-emerald-500' : 'bg-red-500'}`} />
              {shopStatus ? 'Open' : 'Closed'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-4 space-y-4">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Total Orders', value: stats.total, icon: Package, color: 'text-body' },
            { label: 'Active', value: stats.active, icon: Bell, color: 'text-accent' },
            { label: 'New', value: stats.newOrders, icon: Inbox, color: 'text-orange-600 dark:text-orange-400' },
            { label: 'Revenue', value: `₹${stats.revenue}`, icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400' },
          ].map((s, i) => (
            <div key={i} className="glass-sm p-3 text-center">
              <s.icon size={16} className={`mx-auto mb-0.5 ${s.color}`} />
              <div className={`text-lg font-black ${s.color}`}>{s.value}</div>
              <div className="text-[9px] text-faint">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {(['active', 'all'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === f ? 'bg-orange-500 text-white' : 'glass-sm text-muted'
              }`}>
              {f === 'active' ? `Active (${activeOrders.length})` : `All (${allOrders.length})`}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {displayOrders.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Inbox size={40} className="text-faint mx-auto mb-3" />
            <p className="text-sm font-bold text-muted">No orders yet</p>
            <p className="text-xs text-faint mt-1">When customers place orders, they&apos;ll appear here</p>
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
                      <statusInfo.icon size={16} className="text-secondary" />
                      <div>
                        <p className="text-sm font-black text-body">#{order.id}</p>
                        <p className="text-[10px] text-faint">{timeAgo(order.createdAt)}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Customer info */}
                  <div className="flex items-center gap-2 p-2 surface rounded-lg">
                    <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center">
                      <UserRound size={15} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-body">{order.customerName}</p>
                      <p className="text-[10px] text-faint">{order.customerPhone}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-sm font-black text-accent">₹{order.total}</p>
                      <p className="text-[10px] text-faint">{order.paymentMethod.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-secondary">{item.name} × {item.quantity}</span>
                        <span className="text-faint">₹{(item.discountPrice || item.price) * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="p-2 bg-orange-500/6 border border-orange-500/15 rounded-lg flex items-start gap-1.5">
                      <StickyNote size={12} className="text-accent mt-0.5 flex-shrink-0" />
                      <p className="text-[10px] text-accent">{order.notes}</p>
                    </div>
                  )}

                  {/* Rider info */}
                  {order.riderName && (
                    <div className="flex items-center gap-2 p-2 bg-purple-500/6 border border-purple-500/15 rounded-lg">
                      <Bike size={15} className="text-purple-600 dark:text-purple-400" />
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Rider: {order.riderName}</p>
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
                          className="px-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold py-2.5 rounded-xl">
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
          <p className="text-xs text-faint">
            <strong className="text-secondary">Demo Flow:</strong> Customer places order → appears here as &quot;New&quot; →
            Accept → Prepare → Ready → Rider gets assigned automatically
          </p>
          <div className="flex justify-center gap-3 mt-3">
            <Link href="/dashboard/rider" className="text-xs text-accent font-bold hover:opacity-80">
              Open Rider Dashboard →
            </Link>
            <Link href="/orders" className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:opacity-80">
              View as Customer →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
