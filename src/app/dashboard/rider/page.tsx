'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore, DemoOrder } from '@/store/useStore';
import toast from 'react-hot-toast';
import { ArrowLeft, Bike, UserRound, MapPin, Phone, Store, CheckCircle2 } from 'lucide-react';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RIDER DASHBOARD — Rider can pick up, mark on the way, deliver
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const STATUS_FLOW: Record<string, { next: DemoOrder['status']; label: string; color: string }> = {
  ready:      { next: 'picked_up', label: 'Pick Up Order', color: 'bg-purple-500' },
  picked_up:  { next: 'on_the_way', label: 'Start Delivery', color: 'bg-blue-500' },
  on_the_way: { next: 'delivered', label: 'Mark Delivered', color: 'bg-emerald-500' },
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  ready:      { label: 'Ready for Pickup', color: 'text-orange-600 dark:text-orange-400' },
  picked_up:  { label: 'Picked Up', color: 'text-purple-600 dark:text-purple-400' },
  on_the_way: { label: 'On the Way', color: 'text-blue-600 dark:text-blue-400' },
  delivered:  { label: 'Delivered', color: 'text-emerald-600 dark:text-emerald-400' },
};

export default function RiderDashboard() {
  const { demoOrders, updateDemoOrderStatus } = useStore();
  const [isOnline, setIsOnline] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="min-h-screen app-bg" />;

  // Rider sees orders that are 'ready', 'picked_up', or 'on_the_way' (assigned to them)
  const riderOrders = demoOrders.filter(o =>
    ['ready', 'picked_up', 'on_the_way'].includes(o.status) && o.riderId
  );
  const deliveredOrders = demoOrders.filter(o => o.status === 'delivered' && o.riderId);
  const activeOrder = riderOrders[0]; // Current active delivery

  const earnings = {
    today: deliveredOrders.length * 45,
    deliveries: deliveredOrders.length,
    trips: riderOrders.length + deliveredOrders.length,
  };

  const handleStatusChange = (orderId: string, newStatus: DemoOrder['status']) => {
    updateDemoOrderStatus(orderId, newStatus);
    if (newStatus === 'delivered') {
      toast.success('Delivery completed! ₹45 earned');
    } else if (newStatus === 'picked_up') {
      toast.success('Order picked up! Head to customer');
    } else if (newStatus === 'on_the_way') {
      toast.success('On the way to customer!');
    }
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
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="btn-icon">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-sm font-black text-body flex items-center gap-1.5"><Bike size={14} className="text-accent" /> Rider Dashboard</h1>
              <p className="text-[10px] text-faint">Delivery Partner — Demo Mode</p>
            </div>
          </div>
          <button onClick={() => setIsOnline(!isOnline)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
              isOnline ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {isOnline ? 'Online' : 'Offline'}
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">

        {/* Earnings card */}
        <div className="glass-card p-4 bg-gradient-to-br from-amber-400/6 to-orange-500/6">
          <div className="text-center mb-3">
            <p className="text-xs text-muted">Today&apos;s Earnings</p>
            <p className="text-3xl font-black text-accent">₹{earnings.today}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-subtle">
            <div className="text-center">
              <p className="text-lg font-black text-body">{earnings.deliveries}</p>
              <p className="text-[10px] text-faint">Delivered</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-black text-body">{earnings.trips}</p>
              <p className="text-[10px] text-faint">Total Trips</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-black text-body">₹45</p>
              <p className="text-[10px] text-faint">Per Delivery</p>
            </div>
          </div>
        </div>

        {/* Active delivery */}
        {activeOrder ? (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-body flex items-center gap-2">
              <div className="live-dot" />
              Active Delivery
            </h2>

            <div className="glass-card p-4 border-l-4 border-orange-500 space-y-3">
              {/* Order header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-body">#{activeOrder.id}</p>
                  <p className="text-[10px] text-faint">{timeAgo(activeOrder.createdAt)}</p>
                </div>
                <span className={`text-xs font-bold ${STATUS_LABELS[activeOrder.status]?.color || 'text-body'}`}>
                  {STATUS_LABELS[activeOrder.status]?.label || activeOrder.status}
                </span>
              </div>

              {/* Shop info */}
              <div className="p-3 surface rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Store size={16} className="text-secondary" />
                  <div>
                    <p className="text-xs font-bold text-body">Pickup: {activeOrder.shopName}</p>
                    <p className="text-[10px] text-faint flex items-center gap-1"><MapPin size={9} /> 0.5 km from you</p>
                  </div>
                </div>
                <div className="divider my-2" />
                <div className="flex items-center gap-2">
                  <UserRound size={16} className="text-secondary" />
                  <div>
                    <p className="text-xs font-bold text-body">Deliver to: {activeOrder.customerName}</p>
                    <p className="text-[10px] text-faint flex items-center gap-1"><MapPin size={9} /> {activeOrder.address.fullAddress}</p>
                    <p className="text-[10px] text-faint flex items-center gap-1"><Phone size={9} /> {activeOrder.customerPhone}</p>
                  </div>
                </div>
              </div>

              {/* Items summary */}
              <div className="flex items-center justify-between p-2 bg-orange-500/6 rounded-lg">
                <span className="text-xs text-secondary">{activeOrder.items.length} items • {activeOrder.paymentMethod.toUpperCase()}</span>
                <span className="text-sm font-black text-accent">₹{activeOrder.total}</span>
              </div>

              {/* Action button */}
              {STATUS_FLOW[activeOrder.status] && (
                <button onClick={() => handleStatusChange(activeOrder.id, STATUS_FLOW[activeOrder.status].next)}
                  className={`w-full ${STATUS_FLOW[activeOrder.status].color} text-white text-sm font-bold py-3 rounded-xl transition-all hover:opacity-90`}>
                  {STATUS_FLOW[activeOrder.status].label}
                </button>
              )}
            </div>

            {/* Other pending deliveries */}
            {riderOrders.length > 1 && (
              <div className="space-y-2">
                <p className="text-xs text-faint font-semibold">Next in queue ({riderOrders.length - 1})</p>
                {riderOrders.slice(1).map(order => (
                  <div key={order.id} className="glass-sm p-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-body">#{order.id} • {order.shopName}</p>
                      <p className="text-[10px] text-faint">{order.customerName} • ₹{order.total}</p>
                    </div>
                    <span className={`text-[10px] font-bold ${STATUS_LABELS[order.status]?.color || ''}`}>
                      {STATUS_LABELS[order.status]?.label || order.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card p-8 text-center">
            <Bike size={44} className="text-faint mx-auto mb-3" />
            <p className="text-sm font-bold text-muted">
              {isOnline ? 'Waiting for deliveries...' : 'You are offline'}
            </p>
            <p className="text-xs text-faint mt-1">
              {isOnline
                ? 'Orders will appear here when shops mark them ready'
                : 'Go online to receive delivery requests'}
            </p>
            <Link href="/dashboard/shop" className="btn-primary text-xs px-4 py-2 mt-4 inline-flex">
              Open Shop Dashboard →
            </Link>
          </div>
        )}

        {/* Completed deliveries */}
        {deliveredOrders.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-faint mb-2 flex items-center gap-1"><CheckCircle2 size={12} /> Completed Today ({deliveredOrders.length})</h3>
            <div className="space-y-2">
              {deliveredOrders.slice(0, 5).map(order => (
                <div key={order.id} className="glass-sm p-3 flex items-center justify-between opacity-60">
                  <div>
                    <p className="text-xs font-bold text-body">#{order.id}</p>
                    <p className="text-[10px] text-faint">{order.shopName} → {order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+₹45</p>
                    <p className="text-[10px] text-faint">{timeAgo(order.updatedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation help */}
        <div className="glass-sm p-4 text-center">
          <p className="text-xs text-faint">
            <strong className="text-secondary">Demo Flow:</strong> Shop marks order &quot;Ready&quot; →
            Appears here → Pick Up → On the Way → Delivered
          </p>
          <div className="flex justify-center gap-3 mt-3">
            <Link href="/dashboard/shop" className="text-xs text-accent font-bold hover:opacity-80">
              Open Shop Dashboard →
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
