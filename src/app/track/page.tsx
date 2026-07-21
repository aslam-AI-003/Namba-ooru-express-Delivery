'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const ACTIVE_ORDERS = [
  {
    id: 'ORD-002', shopName: 'Annapoorna Restaurant', shopIcon: '🍽️',
    items: ['Chicken Biryani × 1', 'Masala Dosa × 2'], total: 220,
    status: 'in_transit', eta: 18, distance: '2.4 km',
    rider: { name: 'Murugan K', phone: '+91 98765 43210', rating: 4.8, deliveries: 234, avatar: '🧑‍🦱', vehicle: 'TN 45 AB 1234' },
    address: '123, East Main Road, Thanjavur', placedAt: '7:45 PM',
  },
  {
    id: 'ORD-003', shopName: 'Royal Bakery', shopIcon: '🎂',
    items: ['Chocolate Cake 500g × 1'], total: 370,
    status: 'preparing', eta: 35, distance: '1.8 km', rider: null,
    address: '123, East Main Road, Thanjavur', placedAt: '6:00 PM',
  },
  {
    id: 'ORD-005', shopName: 'MedPlus Pharmacy', shopIcon: '💊',
    items: ['Paracetamol 500mg × 2', 'Vitamin C × 1'], total: 85,
    status: 'ready', eta: 22, distance: '3.1 km',
    rider: { name: 'Rajan S', phone: '+91 87654 32109', rating: 4.6, deliveries: 189, avatar: '🧔', vehicle: 'TN 45 CD 5678' },
    address: '123, East Main Road, Thanjavur', placedAt: '8:10 PM',
  },
];

const STATUS_ORDER = ['placed', 'confirmed', 'preparing', 'ready', 'in_transit', 'delivered'];
const STEPS = [
  { key: 'placed',     icon: '📋', label: 'Placed' },
  { key: 'confirmed',  icon: '✅', label: 'Confirmed' },
  { key: 'preparing',  icon: '👨‍🍳', label: 'Preparing' },
  { key: 'ready',      icon: '📦', label: 'Ready' },
  { key: 'in_transit', icon: '🛵', label: 'On Way' },
  { key: 'delivered',  icon: '🎉', label: 'Delivered' },
];

const ROUTE = [
  { x: 10, y: 75 }, { x: 20, y: 62 }, { x: 32, y: 55 },
  { x: 45, y: 50 }, { x: 58, y: 43 }, { x: 70, y: 35 }, { x: 83, y: 27 },
];

function getPhase(status: string, hasRider: boolean) {
  if (status === 'in_transit') return 'riding';
  if (status === 'ready' && hasRider) return 'assigned';
  return 'preparing';
}

// Glowing road segments for map background
const ROAD_SEGMENTS = [
  { x1: 5, y1: 50, x2: 95, y2: 50 }, { x1: 30, y1: 5, x2: 30, y2: 95 },
  { x1: 60, y1: 5, x2: 60, y2: 95 }, { x1: 5, y1: 25, x2: 95, y2: 25 },
  { x1: 5, y1: 75, x2: 95, y2: 75 }, { x1: 15, y1: 5, x2: 85, y2: 95 },
];

export default function TrackPage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [scooterPos, setScooterPos] = useState(3);
  const [pulse, setPulse] = useState(false);
  const [dots, setDots] = useState(0);
  const [eta, setEta] = useState(ACTIVE_ORDERS[0].eta);
  const [ripple, setRipple] = useState(0);

  const order = ACTIVE_ORDERS[selectedIdx];
  const stepIdx = STATUS_ORDER.indexOf(order.status);
  const phase = getPhase(order.status, !!order.rider);

  useEffect(() => { setEta(order.eta); }, [selectedIdx, order.eta]);
  useEffect(() => {
    if (phase !== 'riding') return;
    const t = setInterval(() => setScooterPos(p => p < ROUTE.length - 1 ? p + 1 : 0), 2000);
    return () => clearInterval(t);
  }, [phase]);
  useEffect(() => { const t = setInterval(() => setPulse(p => !p), 1400); return () => clearInterval(t); }, []);
  useEffect(() => { const t = setInterval(() => setDots(d => (d + 1) % 4), 500); return () => clearInterval(t); }, []);
  useEffect(() => { const t = setInterval(() => setRipple(r => (r + 1) % 3), 800); return () => clearInterval(t); }, []);

  const pos = ROUTE[scooterPos];
  const phaseColor = phase === 'riding' ? '#F97316' : phase === 'assigned' ? '#10B981' : '#FBBF24';
  const phaseBg = phase === 'riding' ? 'rgba(249,115,22,0.08)' : phase === 'assigned' ? 'rgba(16,185,129,0.08)' : 'rgba(251,191,36,0.06)';

  return (
    <main className="min-h-screen app-bg pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 header-glass">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/orders" className="btn-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <h1 className="font-bold text-white flex-1">Track Order</h1>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
            style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.25)' }}>
            <span className="w-2 h-2 bg-emerald-400 rounded-full" style={{ animation: 'pulse-glow 1.2s infinite' }} />
            <span className="text-xs font-bold text-emerald-400">Live</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-4 space-y-3">

        {/* Order Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {ACTIVE_ORDERS.map((o, i) => {
            const ph = getPhase(o.status, !!o.rider);
            const c = ph === 'riding' ? '#F97316' : ph === 'assigned' ? '#10B981' : '#FBBF24';
            const active = selectedIdx === i;
            return (
              <button key={o.id} onClick={() => setSelectedIdx(i)}
                className="flex-shrink-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border transition-all"
                style={{
                  background: active ? `${c}12` : 'rgba(255,255,255,0.02)',
                  borderColor: active ? `${c}35` : 'rgba(255,255,255,0.07)',
                  boxShadow: active ? `0 0 20px ${c}15` : 'none',
                }}>
                <span className="text-lg">{o.shopIcon}</span>
                <div className="text-left">
                  <div className="text-xs font-black text-white">{o.id}</div>
                  <div className="text-[10px] text-white/40 max-w-[72px] truncate">{o.shopName}</div>
                </div>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
              </button>
            );
          })}
        </div>

        {/* ── PHASE: PREPARING ── */}
        {phase === 'preparing' && (
          <>
            {/* Hero */}
            <div className="relative overflow-hidden rounded-3xl p-6 text-center border"
              style={{ background: `linear-gradient(145deg, ${phaseBg}, rgba(0,0,0,0))`, borderColor: `${phaseColor}20` }}>
              {/* Concentric pulse rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[80,120,160].map((size, i) => (
                  <div key={i} className="absolute rounded-full border"
                    style={{
                      width: size, height: size,
                      borderColor: `${phaseColor}${ripple === i ? '30' : '10'}`,
                      transform: `scale(${ripple === i ? 1.1 : 1})`,
                      transition: 'all 0.8s ease',
                    }} />
                ))}
              </div>
              <div className="relative">
                <div className="text-6xl mb-3 inline-block" style={{ animation: 'float 2.5s ease-in-out infinite' }}>👨‍🍳</div>
                <h2 className="text-2xl font-black text-white mb-1">Preparing Your Order</h2>
                <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>{order.shopName} is crafting your items</p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border"
                  style={{ background: `${phaseColor}12`, borderColor: `${phaseColor}30` }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: phaseColor, animation: 'pulse-glow 1.5s infinite' }} />
                  <span className="text-sm font-bold" style={{ color: phaseColor }}>Ready in ~{order.eta} min</span>
                </div>
              </div>
            </div>

            {/* Finding Rider */}
            <div className="rounded-2xl border p-4" style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <span className="text-2xl" style={{ animation: 'spin 2.5s linear infinite' }}>🔍</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-white">Finding a rider{'.'.repeat(dots)}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Assigned when order is ready</p>
                  <div className="flex gap-1 mt-2.5">
                    {[0,1,2,3,4].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: i <= dots ? '100%' : '0%', background: phaseColor, opacity: 0.5 }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── PHASE: ASSIGNED ── */}
        {phase === 'assigned' && order.rider && (
          <>
            {/* Hero Banner */}
            <div className="rounded-3xl border p-5 flex items-center gap-4"
              style={{ background: `linear-gradient(135deg, ${phaseBg}, rgba(0,0,0,0))`, borderColor: `${phaseColor}25` }}>
              <div className="text-4xl flex-shrink-0" style={{ animation: 'bounce-in 0.6s ease' }}>🎉</div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest mb-0.5" style={{ color: phaseColor }}>Rider Assigned!</p>
                <h2 className="text-lg font-black text-white">{order.rider.name} is heading to pick up</h2>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Order packed & ready • ~{order.eta} min away</p>
              </div>
            </div>

            {/* Rider Card */}
            <div className="rounded-2xl border p-4" style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.07)' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>Delivery Partner</p>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 border"
                  style={{ background: `linear-gradient(135deg, ${phaseColor}20, ${phaseColor}08)`, borderColor: `${phaseColor}20` }}>
                  {order.rider.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-white">{order.rider.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs px-2 py-0.5 rounded-md font-bold" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                      {order.rider.vehicle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-yellow-400">⭐ {order.rider.rating}</span>
                    <span style={{ color: 'rgba(255,255,255,0.15)' }}>•</span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{order.rider.deliveries} trips</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${order.rider.phone}`} className="w-11 h-11 rounded-xl flex items-center justify-center border transition-all hover:scale-105"
                    style={{ background: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.25)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </a>
                  <button className="w-11 h-11 rounded-xl flex items-center justify-center border transition-all hover:scale-105"
                    style={{ background: 'rgba(59,130,246,0.12)', borderColor: 'rgba(59,130,246,0.25)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Map - rider at shop */}
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="relative h-44" style={{ background: 'linear-gradient(135deg, #0d1117, #161b22)' }}>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {ROAD_SEGMENTS.map((r, i) => (
                    <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="rgba(255,255,255,0.04)" strokeWidth="1.5"/>
                  ))}
                  <polyline points={ROUTE.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none" stroke={`${phaseColor}20`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 3"/>
                  <circle cx={ROUTE[0].x} cy={ROUTE[0].y} r="4" fill="#FBBF24" opacity="0.9"/>
                  <circle cx={ROUTE[0].x} cy={ROUTE[0].y} r={pulse ? "8" : "5"} fill="none" stroke="#FBBF24" strokeWidth="1" opacity={pulse ? "0.2" : "0.4"} style={{ transition: 'all 1.4s ease' }}/>
                  <circle cx={ROUTE[ROUTE.length-1].x} cy={ROUTE[ROUTE.length-1].y} r="3.5" fill={phaseColor} opacity="0.5"/>
                </svg>
                <div className="absolute text-xl" style={{ left: `${ROUTE[0].x}%`, top: `${ROUTE[0].y}%`, transform: 'translate(-50%,-50%)', filter: `drop-shadow(0 0 8px ${phaseColor})` }}>🛵</div>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full border text-[10px] font-bold"
                  style={{ background: `${phaseColor}20`, borderColor: `${phaseColor}35`, color: phaseColor }}>
                  Rider at shop
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>{order.shopName}</span>
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: phaseColor, opacity: 0.5 }} />
                  <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.3)' }}>Your Location</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── PHASE: RIDING ── */}
        {phase === 'riding' && order.rider && (
          <>
            {/* ETA Hero */}
            <div className="relative rounded-3xl p-6 text-center border"
              style={{ background: `linear-gradient(145deg, ${phaseBg}, rgba(0,0,0,0))`, borderColor: `${phaseColor}25` }}>
              {/* Decorative corner glows only — no overflow rings */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${phaseColor}40, transparent)` }} />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${phaseColor}20, transparent)` }} />
              <div className="relative">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>Arriving in</p>
                {/* ETA number with glow ring */}
                <div className="relative inline-flex items-center justify-center mb-3">
                  <div className="absolute w-28 h-28 rounded-full border-2" style={{ borderColor: `${phaseColor}20` }} />
                  <div className="absolute w-36 h-36 rounded-full border" style={{ borderColor: `${phaseColor}10` }} />
                  <div className="flex items-end gap-1 relative z-10 py-4 px-6">
                    <span className="font-black text-white leading-none" style={{ fontSize: '4.5rem', textShadow: `0 0 40px ${phaseColor}60` }}>{eta}</span>
                    <span className="text-xl font-bold mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>min</span>
                  </div>
                </div>
                <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>{order.id} • {order.shopName}</p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border"
                  style={{ background: `${phaseColor}15`, borderColor: `${phaseColor}35` }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: phaseColor, animation: 'pulse-glow 1s infinite' }} />
                  <span className="text-sm font-bold" style={{ color: phaseColor }}>🛵 Rider is on the way</span>
                </div>
              </div>
            </div>

            {/* Live Map */}
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Live Route</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: phaseColor, animation: 'pulse-glow 1s infinite' }} />
                  <span className="text-[10px] font-bold" style={{ color: phaseColor }}>Tracking live</span>
                </div>
              </div>
              <div className="relative h-56" style={{ background: 'linear-gradient(135deg, #0d1117, #161b22)' }}>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Road network */}
                  {ROAD_SEGMENTS.map((r, i) => (
                    <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="rgba(255,255,255,0.05)" strokeWidth="2"/>
                  ))}
                  {/* Route shadow */}
                  <polyline points={ROUTE.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none" stroke={`${phaseColor}15`} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                  {/* Route base */}
                  <polyline points={ROUTE.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none" stroke={`${phaseColor}25`} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                  {/* Completed path */}
                  <polyline points={ROUTE.slice(0, scooterPos + 1).map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none" stroke={phaseColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 2" opacity="0.8"/>
                  {/* Shop dot */}
                  <circle cx={ROUTE[0].x} cy={ROUTE[0].y} r="3" fill="#FBBF24" opacity="0.7"/>
                  {/* Home dot + pulse */}
                  <circle cx={ROUTE[ROUTE.length-1].x} cy={ROUTE[ROUTE.length-1].y} r="3.5" fill="#10B981" opacity="0.95"/>
                  <circle cx={ROUTE[ROUTE.length-1].x} cy={ROUTE[ROUTE.length-1].y}
                    r={pulse ? "8" : "5"} fill="none" stroke="#10B981" strokeWidth="1"
                    opacity={pulse ? "0.15" : "0.45"} style={{ transition: 'all 1.4s ease' }}/>
                </svg>
                {/* Scooter */}
                <div className="absolute text-2xl" style={{
                  left: `${pos.x}%`, top: `${pos.y}%`,
                  transform: 'translate(-50%,-50%)',
                  transition: 'left 1.8s cubic-bezier(0.4,0,0.2,1), top 1.8s cubic-bezier(0.4,0,0.2,1)',
                  filter: `drop-shadow(0 0 12px ${phaseColor}) drop-shadow(0 0 4px ${phaseColor})`,
                }}>🛵</div>
                {/* Labels */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 opacity-70" />
                  <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>{order.shopName}</span>
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Your Location</span>
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full border"
                  style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.1)' }}>
                  <span className="text-xs font-bold text-white">{order.distance}</span>
                </div>
              </div>
            </div>

            {/* Rider Card */}
            <div className="rounded-2xl border p-4" style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.07)' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>Delivery Partner</p>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 border"
                  style={{ background: `linear-gradient(135deg, ${phaseColor}20, ${phaseColor}08)`, borderColor: `${phaseColor}20` }}>
                  {order.rider.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-white">{order.rider.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs px-2 py-0.5 rounded-md font-bold" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                      {order.rider.vehicle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-yellow-400">⭐ {order.rider.rating}</span>
                    <span style={{ color: 'rgba(255,255,255,0.15)' }}>•</span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{order.rider.deliveries} trips</span>
                    <span style={{ color: 'rgba(255,255,255,0.15)' }}>•</span>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: phaseColor, animation: 'pulse-glow 1s infinite' }} />
                    <span className="text-xs font-semibold" style={{ color: phaseColor }}>On the way</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${order.rider.phone}`} className="w-11 h-11 rounded-xl flex items-center justify-center border transition-all hover:scale-105"
                    style={{ background: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.25)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </a>
                  <button className="w-11 h-11 rounded-xl flex items-center justify-center border transition-all hover:scale-105"
                    style={{ background: 'rgba(59,130,246,0.12)', borderColor: 'rgba(59,130,246,0.25)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── HORIZONTAL PROGRESS STEPS ── */}
        <div className="rounded-2xl border p-4" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>Order Progress</p>
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="absolute top-4 left-4 h-0.5 rounded-full transition-all duration-700"
              style={{ background: phaseColor, width: `${Math.max(0, (stepIdx / (STEPS.length - 1)) * 92)}%`, opacity: 0.5 }} />
            <div className="flex justify-between relative">
              {STEPS.map((step, i) => {
                const done = i < stepIdx;
                const active = i === stepIdx;
                return (
                  <div key={step.key} className="flex flex-col items-center gap-1.5" style={{ width: `${100 / STEPS.length}%` }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all duration-500 border"
                      style={{
                        background: done ? `${phaseColor}18` : active ? phaseColor : 'rgba(255,255,255,0.04)',
                        borderColor: done ? `${phaseColor}30` : active ? phaseColor : 'rgba(255,255,255,0.08)',
                        boxShadow: active ? `0 0 18px ${phaseColor}50` : 'none',
                      }}>
                      {done
                        ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={phaseColor} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        : <span style={{ opacity: i > stepIdx ? 0.25 : 1, fontSize: '0.85rem' }}>{step.icon}</span>
                      }
                    </div>
                    <span className="text-[9px] font-bold text-center leading-tight"
                      style={{ color: active ? phaseColor : done ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.2)' }}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── ORDER ITEMS ── */}
        <div className="rounded-2xl border p-4" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>Order Items</p>
          <div className="space-y-2 mb-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs" style={{ color: phaseColor, opacity: 0.6 }}>▸</span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{item}</span>
              </div>
            ))}
          </div>
          <div className="h-px my-3" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>Delivering to</p>
              <p className="text-sm font-semibold text-white">{order.address}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>Total</p>
              <p className="text-2xl font-black" style={{ color: phaseColor }}>₹{order.total}</p>
            </div>
          </div>
        </div>

        {/* ── HELP ── */}
        <div className="rounded-2xl border p-4 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }}>
          <div>
            <p className="text-sm font-bold text-white">Need help?</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Support available 24/7</p>
          </div>
          <Link href="/support" className="px-4 py-2 rounded-xl border text-xs font-black transition-all hover:scale-105"
            style={{ background: `${phaseColor}10`, borderColor: `${phaseColor}25`, color: phaseColor }}>
            Get Help
          </Link>
        </div>

      </div>
    </main>
  );
}
