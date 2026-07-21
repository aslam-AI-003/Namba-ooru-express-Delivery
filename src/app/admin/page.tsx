'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore, DemoOrder } from '@/store/useStore';
import toast from 'react-hot-toast';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADMIN DASHBOARD — Shows real orders, can manage everything
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const STATUS_COLORS: Record<string, string> = {
  placed: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
  confirmed: 'bg-purple-400/10 text-purple-400 border-purple-400/30',
  preparing: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
  ready: 'bg-orange-400/10 text-orange-400 border-orange-400/30',
  picked_up: 'bg-indigo-400/10 text-indigo-400 border-indigo-400/30',
  on_the_way: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/30',
  delivered: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
  cancelled: 'bg-red-400/10 text-red-400 border-red-400/30',
};

type Tab = 'overview' | 'orders' | 'shops' | 'riders';

export default function AdminDashboard() {
  const { demoOrders, updateDemoOrderStatus } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="min-h-screen app-bg" />;

  const stats = {
    totalOrders: demoOrders.length,
    activeOrders: demoOrders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length,
    delivered: demoOrders.filter(o => o.status === 'delivered').length,
    cancelled: demoOrders.filter(o => o.status === 'cancelled').length,
    revenue: demoOrders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0),
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  const navItems = [
    { id: 'overview' as Tab, label: 'Overview', icon: '📊' },
    { id: 'orders' as Tab, label: 'Orders', icon: '📦', badge: stats.activeOrders },
    { id: 'shops' as Tab, label: 'Shops', icon: '🏪' },
    { id: 'riders' as Tab, label: 'Riders', icon: '🛵' },
  ];

  const quickLinks = [
    { label: 'Customer App', href: '/', icon: '📱' },
    { label: 'Shop Dashboard', href: '/dashboard/shop', icon: '🏪' },
    { label: 'Rider Dashboard', href: '/dashboard/rider', icon: '🛵' },
    { label: 'Orders Page', href: '/orders', icon: '📋' },
  ];

  return (
    <div className="min-h-screen app-bg flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-56 border-r border-white/[0.06] flex-col fixed h-screen bg-black/40">
        <div className="p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-base">🛵</div>
            <div>
              <h1 className="text-xs font-black text-white">NammaOoru</h1>
              <p className="text-[10px] text-yellow-400 font-bold">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === item.id
                  ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                  : 'text-white/40 hover:bg-white/[0.04] hover:text-white/70'
              }`}>
              <span>{item.icon}</span>
              {item.label}
              {item.badge && item.badge > 0 && (
                <span className="ml-auto w-5 h-5 bg-yellow-400 text-black text-[9px] font-black rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-white/[0.06]">
            <p className="text-[10px] text-white/20 font-bold px-3 mb-2">QUICK LINKS</p>
            {quickLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all">
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400/10 rounded-full flex items-center justify-center text-sm">👤</div>
            <div>
              <p className="text-xs font-bold text-white">Admin</p>
              <p className="text-[10px] text-white/30">admin@noe.in</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-56 min-h-screen pb-20">
        {/* Mobile header */}
        <header className="sticky top-0 z-50 header-glass lg:hidden">
          <div className="px-4 py-3 flex items-center justify-between">
            <h1 className="text-sm font-black text-white">🛵 Admin Panel</h1>
            <div className="flex gap-2">
              {navItems.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${
                    activeTab === item.id ? 'bg-yellow-400 text-black' : 'text-white/40'
                  }`}>
                  {item.icon}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-4 lg:p-6 space-y-6">

          {/* ═══ OVERVIEW TAB ═══ */}
          {activeTab === 'overview' && (
            <>
              <div>
                <h2 className="text-xl font-black text-white">Dashboard</h2>
                <p className="text-sm text-white/40">Real-time demo data from your test orders</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: 'text-white' },
                  { label: 'Active', value: stats.activeOrders, icon: '⏳', color: 'text-yellow-400' },
                  { label: 'Delivered', value: stats.delivered, icon: '✅', color: 'text-emerald-400' },
                  { label: 'Cancelled', value: stats.cancelled, icon: '❌', color: 'text-red-400' },
                  { label: 'Revenue', value: `₹${stats.revenue}`, icon: '💰', color: 'text-green-400' },
                ].map((s, i) => (
                  <div key={i} className="glass-card p-4 text-center">
                    <div className="text-xl mb-1">{s.icon}</div>
                    <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                    <div className="text-[10px] text-white/35 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Orders + Quick Actions */}
              <div className="grid lg:grid-cols-3 gap-4">
                {/* Recent Orders */}
                <div className="lg:col-span-2 glass-card p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-white">📦 Recent Orders</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-yellow-400 font-bold">
                      View All →
                    </button>
                  </div>

                  {demoOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-3xl mb-2">📭</p>
                      <p className="text-xs text-white/40">No orders yet. Place a test order!</p>
                      <Link href="/shops" className="text-xs text-yellow-400 font-bold mt-2 inline-block">
                        Go to Customer App →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {demoOrders.slice(0, 8).map(order => (
                        <div key={order.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors">
                          <span className="text-lg">{order.shopIcon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white">#{order.id}</p>
                            <p className="text-[10px] text-white/35 truncate">{order.customerName} → {order.shopName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-white">₹{order.total}</p>
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold border ${STATUS_COLORS[order.status] || ''}`}>
                              {order.status}
                            </span>
                          </div>
                          <span className="text-[10px] text-white/20">{timeAgo(order.createdAt)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="glass-card p-4">
                  <h3 className="text-sm font-black text-white mb-4">⚡ Quick Actions</h3>
                  <div className="space-y-2">
                    <Link href="/shops" className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                      <span className="text-lg">🛒</span>
                      <div>
                        <p className="text-xs font-bold text-white">Place Test Order</p>
                        <p className="text-[10px] text-white/30">As customer</p>
                      </div>
                    </Link>
                    <Link href="/dashboard/shop" className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                      <span className="text-lg">🏪</span>
                      <div>
                        <p className="text-xs font-bold text-white">Shop Dashboard</p>
                        <p className="text-[10px] text-white/30">Accept/Prepare orders</p>
                      </div>
                    </Link>
                    <Link href="/dashboard/rider" className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                      <span className="text-lg">🛵</span>
                      <div>
                        <p className="text-xs font-bold text-white">Rider Dashboard</p>
                        <p className="text-[10px] text-white/30">Deliver orders</p>
                      </div>
                    </Link>
                    <Link href="/orders" className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                      <span className="text-lg">📋</span>
                      <div>
                        <p className="text-xs font-bold text-white">Customer Orders</p>
                        <p className="text-[10px] text-white/30">Track status</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Flow guide */}
              <div className="glass-sm p-4">
                <h3 className="text-xs font-black text-white mb-3">🔄 Demo Order Flow</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { step: '1', label: 'Customer Orders', page: '/shops' },
                    { step: '2', label: 'Vendor Accepts', page: '/dashboard/shop' },
                    { step: '3', label: 'Vendor Prepares', page: '/dashboard/shop' },
                    { step: '4', label: 'Marked Ready', page: '/dashboard/shop' },
                    { step: '5', label: 'Rider Picks Up', page: '/dashboard/rider' },
                    { step: '6', label: 'Delivered', page: '/dashboard/rider' },
                  ].map((s, i) => (
                    <React.Fragment key={i}>
                      <Link href={s.page} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-yellow-400/10 transition-colors group">
                        <span className="w-5 h-5 bg-yellow-400/20 rounded-full flex items-center justify-center text-[9px] font-black text-yellow-400">{s.step}</span>
                        <span className="text-[10px] text-white/50 group-hover:text-yellow-400 font-semibold">{s.label}</span>
                      </Link>
                      {i < 5 && <span className="text-white/15">→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ═══ ORDERS TAB ═══ */}
          {activeTab === 'orders' && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">All Orders</h2>
                  <p className="text-sm text-white/40">{demoOrders.length} total orders</p>
                </div>
                <Link href="/shops" className="btn-primary text-xs px-4 py-2">+ New Test Order</Link>
              </div>

              {demoOrders.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <div className="text-5xl mb-3">📭</div>
                  <p className="text-sm font-bold text-white/50">No orders yet</p>
                  <p className="text-xs text-white/30 mt-1">Place a test order from the customer app</p>
                  <Link href="/shops" className="btn-primary text-xs px-4 py-2 mt-4 inline-flex">
                    Browse Shops →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {demoOrders.map(order => (
                    <div key={order.id} className="glass-card p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{order.shopIcon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-black text-white">#{order.id}</p>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${STATUS_COLORS[order.status] || ''}`}>
                              {order.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-white/50">{order.customerName} ({order.customerPhone}) → {order.shopName}</p>
                          <p className="text-[10px] text-white/25 mt-0.5">
                            {order.items.map(i => `${i.name}×${i.quantity}`).join(', ')} • {order.paymentMethod.toUpperCase()}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-black text-yellow-400">₹{order.total}</p>
                          <p className="text-[10px] text-white/25">{timeAgo(order.createdAt)}</p>
                        </div>
                      </div>
                      {order.riderName && (
                        <p className="text-[10px] text-purple-400 mt-2">🛵 Rider: {order.riderName}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ═══ SHOPS TAB ═══ */}
          {activeTab === 'shops' && (
            <>
              <div>
                <h2 className="text-xl font-black text-white">Shop Management</h2>
                <p className="text-sm text-white/40">Manage vendor dashboards</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Link href="/dashboard/shop" className="glass-card p-5 hover:border-yellow-400/20 transition-all group">
                  <div className="text-3xl mb-2">🏪</div>
                  <p className="text-sm font-bold text-white group-hover:text-yellow-400">Open Shop Dashboard</p>
                  <p className="text-xs text-white/30 mt-1">Accept orders, prepare items, mark ready</p>
                </Link>
                <Link href="/shop/register" className="glass-card p-5 hover:border-yellow-400/20 transition-all group">
                  <div className="text-3xl mb-2">➕</div>
                  <p className="text-sm font-bold text-white group-hover:text-yellow-400">Register New Shop</p>
                  <p className="text-xs text-white/30 mt-1">Add a new vendor to the platform</p>
                </Link>
              </div>
            </>
          )}

          {/* ═══ RIDERS TAB ═══ */}
          {activeTab === 'riders' && (
            <>
              <div>
                <h2 className="text-xl font-black text-white">Rider Management</h2>
                <p className="text-sm text-white/40">Manage delivery partners</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Link href="/dashboard/rider" className="glass-card p-5 hover:border-yellow-400/20 transition-all group">
                  <div className="text-3xl mb-2">🛵</div>
                  <p className="text-sm font-bold text-white group-hover:text-yellow-400">Open Rider Dashboard</p>
                  <p className="text-xs text-white/30 mt-1">Pick up and deliver orders</p>
                </Link>
                <Link href="/rider/register" className="glass-card p-5 hover:border-yellow-400/20 transition-all group">
                  <div className="text-3xl mb-2">➕</div>
                  <p className="text-sm font-bold text-white group-hover:text-yellow-400">Register New Rider</p>
                  <p className="text-xs text-white/30 mt-1">Add a new delivery partner</p>
                </Link>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
