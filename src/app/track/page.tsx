'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, ClipboardList, CheckCircle2, ChefHat, Package, Bike, PartyPopper,
  Search, Phone, MessageSquare, Check,
} from 'lucide-react';

const ACTIVE_ORDERS = [
  {
    id: 'ORD-002', shopName: 'Annapoorna Restaurant', shopIcon: '/images/shops/shop-3.jpg',
    items: ['Chicken Biryani × 1', 'Masala Dosa × 2'], total: 220,
    status: 'in_transit', eta: 18, distance: '2.4 km',
    rider: { name: 'Murugan K', phone: '+91 98765 43210', rating: 4.8, deliveries: 234, vehicle: 'TN 45 AB 1234' },
    address: '123, East Main Road, Thanjavur', placedAt: '7:45 PM',
  },
  {
    id: 'ORD-003', shopName: 'Royal Bakery', shopIcon: '/images/shops/shop-5.jpg',
    items: ['Chocolate Cake 500g × 1'], total: 370,
    status: 'preparing', eta: 35, distance: '1.8 km', rider: null,
    address: '123, East Main Road, Thanjavur', placedAt: '6:00 PM',
  },
  {
    id: 'ORD-005', shopName: 'MedPlus Pharmacy', shopIcon: '/images/shops/shop-4.jpg',
    items: ['Paracetamol 500mg × 2', 'Vitamin C × 1'], total: 85,
    status: 'ready', eta: 22, distance: '3.1 km',
    rider: { name: 'Rajan S', phone: '+91 87654 32109', rating: 4.6, deliveries: 189, vehicle: 'TN 45 CD 5678' },
    address: '123, East Main Road, Thanjavur', placedAt: '8:10 PM',
  },
];

const STATUS_ORDER = ['placed', 'confirmed', 'preparing', 'ready', 'in_transit', 'delivered'];
const STEPS = [
  { key: 'placed',     icon: ClipboardList, label: 'Placed' },
  { key: 'confirmed',  icon: CheckCircle2,  label: 'Confirmed' },
  { key: 'preparing',  icon: ChefHat,       label: 'Preparing' },
  { key: 'ready',      icon: Package,       label: 'Ready' },
  { key: 'in_transit', icon: Bike,          label: 'On Way' },
  { key: 'delivered',  icon: PartyPopper,   label: 'Delivered' },
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
  const phaseColor = phase === 'riding' ? '#F97316' : phase === 'assigned' ? '#10B981' : '#F59E0B';
  const phaseBg = phase === 'riding' ? 'rgba(249,115,22,0.08)' : phase === 'assigned' ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.06)';

  return (
    <main className="min-h-screen app-bg pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 header-glass">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/orders" className="btn-icon">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-bold text-body flex-1">Track Order</h1>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-emerald-500/10 border-emerald-500/25">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" style={{ animation: 'pulse-glow 1.2s infinite' }} />
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Live</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-4 space-y-3">

        {/* Order Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {ACTIVE_ORDERS.map((o, i) => {
            const ph = getPhase(o.status, !!o.rider);
            const c = ph === 'riding' ? '#F97316' : ph === 'assigned' ? '#10B981' : '#F59E0B';
            const active = selectedIdx === i;
            return (
              <button key={o.id} onClick={() => setSelectedIdx(i)}
                className="flex-shrink-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border transition-all"
                style={{
                  background: active ? `${c}12` : 'var(--card-bg)',
                  borderColor: active ? `${c}35` : 'var(--card-border)',
                  boxShadow: active ? `0 0 20px ${c}15` : 'none',
                }}>
                <div className="w-8 h-8 rounded-lg overflow-hidden relative flex-shrink-0">
                  <Image src={o.shopIcon} alt={o.shopName} fill sizes="32px" className="object-cover" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-body">{o.id}</div>
                  <div className="text-[10px] text-faint max-w-[72px] truncate">{o.shopName}</div>
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
              style={{ background: `linear-gradient(145deg, ${phaseBg}, transparent)`, borderColor: `${phaseColor}20` }}>
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
                <div className="w-16 h-16 rounded-2xl bg-white/60 dark:bg-black/30 flex items-center justify-center mx-auto mb-3" style={{ animation: 'float 2.5s ease-in-out infinite' }}>
                  <ChefHat size={32} style={{ color: phaseColor }} />
                </div>
                <h2 className="text-2xl font-black text-body mb-1">Preparing Your Order</h2>
                <p className="text-sm mb-4 text-muted">{order.shopName} is crafting your items</p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border"
                  style={{ background: `${phaseColor}12`, borderColor: `${phaseColor}30` }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: phaseColor, animation: 'pulse-glow 1.5s infinite' }} />
                  <span className="text-sm font-bold" style={{ color: phaseColor }}>Ready in ~{order.eta} min</span>
                </div>
              </div>
            </div>

            {/* Finding Rider */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 surface">
                  <Search size={22} className="text-muted" style={{ animation: 'spin 2.5s linear infinite' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-body">Finding a rider{'.'.repeat(dots)}</p>
                  <p className="text-xs mt-0.5 text-faint">Assigned when order is ready</p>
                  <div className="flex gap-1 mt-2.5">
                    {[0,1,2,3,4].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full overflow-hidden bg-[var(--bg3)]">
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
              style={{ background: `linear-gradient(135deg, ${phaseBg}, transparent)`, borderColor: `${phaseColor}25` }}>
              <div className="w-14 h-14 rounded-2xl bg-white/60 dark:bg-black/30 flex items-center justify-center flex-shrink-0" style={{ animation: 'bounce-in 0.6s ease' }}>
                <PartyPopper size={26} style={{ color: phaseColor }} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest mb-0.5" style={{ color: phaseColor }}>Rider Assigned!</p>
                <h2 className="text-lg font-black text-body">{order.rider.name} is heading to pick up</h2>
                <p className="text-xs mt-0.5 text-muted">Order packed & ready • ~{order.eta} min away</p>
              </div>
            </div>

            {/* Rider Card */}
            <div className="glass-card p-4">
              <p className="text-[10px] font-black uppercase tracking-widest mb-3 text-faint">Delivery Partner</p>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black flex-shrink-0 border text-white"
                  style={{ background: `linear-gradient(135deg, ${phaseColor}, ${phaseColor}CC)`, borderColor: `${phaseColor}30` }}>
                  {order.rider.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-body">{order.rider.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs px-2 py-0.5 rounded-md font-bold surface text-secondary">
                      {order.rider.vehicle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-accent">★ {order.rider.rating}</span>
                    <span className="text-faint">•</span>
                    <span className="text-xs text-faint">{order.rider.deliveries} trips</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${order.rider.phone}`} className="w-11 h-11 rounded-xl flex items-center justify-center border transition-all hover:scale-105 bg-emerald-500/12 border-emerald-500/25">
                    <Phone size={16} className="text-emerald-600 dark:text-emerald-400" />
                  </a>
                  <button className="w-11 h-11 rounded-xl flex items-center justify-center border transition-all hover:scale-105 bg-blue-500/12 border-blue-500/25">
                    <MessageSquare size={16} className="text-blue-600 dark:text-blue-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Map - rider at shop */}
            <div className="rounded-2xl overflow-hidden border border-subtle">
              <div className="relative h-44" style={{ background: 'linear-gradient(135deg, #0d1117, #161b22)' }}>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {ROAD_SEGMENTS.map((r, i) => (
                    <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="rgba(255,255,255,0.06)" strokeWidth="1.5"/>
                  ))}
                  <polyline points={ROUTE.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none" stroke={`${phaseColor}20`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 3"/>
                  <circle cx={ROUTE[0].x} cy={ROUTE[0].y} r="4" fill="#F59E0B" opacity="0.9"/>
                  <circle cx={ROUTE[0].x} cy={ROUTE[0].y} r={pulse ? "8" : "5"} fill="none" stroke="#F59E0B" strokeWidth="1" opacity={pulse ? "0.2" : "0.4"} style={{ transition: 'all 1.4s ease' }}/>
                  <circle cx={ROUTE[ROUTE.length-1].x} cy={ROUTE[ROUTE.length-1].y} r="3.5" fill={phaseColor} opacity="0.5"/>
                </svg>
                <div className="absolute text-2xl" style={{ left: `${ROUTE[0].x}%`, top: `${ROUTE[0].y}%`, transform: 'translate(-50%,-50%)', filter: `drop-shadow(0 0 8px ${phaseColor})` }}>
                  <Bike size={22} color={phaseColor} />
                </div>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full border text-[10px] font-bold"
                  style={{ background: `${phaseColor}20`, borderColor: `${phaseColor}35`, color: phaseColor }}>
                  Rider at shop
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-[10px] font-semibold text-white/60">{order.shopName}</span>
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: phaseColor, opacity: 0.5 }} />
                  <span className="text-[10px] font-semibold text-white/45">Your Location</span>
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
              style={{ background: `linear-gradient(145deg, ${phaseBg}, transparent)`, borderColor: `${phaseColor}25` }}>
              {/* Decorative corner glows only — no overflow rings */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${phaseColor}40, transparent)` }} />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${phaseColor}20, transparent)` }} />
              <div className="relative">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-faint">Arriving in</p>
                {/* ETA number with glow ring */}
                <div className="relative inline-flex items-center justify-center mb-3">
                  <div className="absolute w-28 h-28 rounded-full border-2" style={{ borderColor: `${phaseColor}20` }} />
                  <div className="absolute w-36 h-36 rounded-full border" style={{ borderColor: `${phaseColor}10` }} />
                  <div className="flex items-end gap-1 relative z-10 py-4 px-6">
                    <span className="font-black text-body leading-none" style={{ fontSize: '4.5rem', textShadow: `0 0 40px ${phaseColor}30` }}>{eta}</span>
                    <span className="text-xl font-bold mb-2 text-faint">min</span>
                  </div>
                </div>
                <p className="text-xs mb-4 text-faint">{order.id} • {order.shopName}</p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border"
                  style={{ background: `${phaseColor}15`, borderColor: `${phaseColor}35` }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: phaseColor, animation: 'pulse-glow 1s infinite' }} />
                  <span className="text-sm font-bold flex items-center gap-1" style={{ color: phaseColor }}><Bike size={14} /> Rider is on the way</span>
                </div>
              </div>
            </div>

            {/* Live Map */}
            <div className="rounded-2xl overflow-hidden border border-subtle">
              <div className="px-4 pt-3 pb-2 flex items-center justify-between" style={{ background: 'var(--card-bg)' }}>
                <p className="text-[10px] font-black uppercase tracking-widest text-faint">Live Route</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: phaseColor, animation: 'pulse-glow 1s infinite' }} />
                  <span className="text-[10px] font-bold" style={{ color: phaseColor }}>Tracking live</span>
                </div>
              </div>
              <div className="relative h-56" style={{ background: 'linear-gradient(135deg, #0d1117, #161b22)' }}>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Road network */}
                  {ROAD_SEGMENTS.map((r, i) => (
                    <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="rgba(255,255,255,0.07)" strokeWidth="2"/>
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
                  <circle cx={ROUTE[0].x} cy={ROUTE[0].y} r="3" fill="#F59E0B" opacity="0.7"/>
                  {/* Home dot + pulse */}
                  <circle cx={ROUTE[ROUTE.length-1].x} cy={ROUTE[ROUTE.length-1].y} r="3.5" fill="#10B981" opacity="0.95"/>
                  <circle cx={ROUTE[ROUTE.length-1].x} cy={ROUTE[ROUTE.length-1].y}
                    r={pulse ? "8" : "5"} fill="none" stroke="#10B981" strokeWidth="1"
                    opacity={pulse ? "0.15" : "0.45"} style={{ transition: 'all 1.4s ease' }}/>
                </svg>
                {/* Scooter */}
                <div className="absolute" style={{
                  left: `${pos.x}%`, top: `${pos.y}%`,
                  transform: 'translate(-50%,-50%)',
                  transition: 'left 1.8s cubic-bezier(0.4,0,0.2,1), top 1.8s cubic-bezier(0.4,0,0.2,1)',
                  filter: `drop-shadow(0 0 8px ${phaseColor})`,
                }}>
                  <Bike size={26} color={phaseColor} />
                </div>
                {/* Labels */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400 opacity-70" />
                  <span className="text-[10px] font-semibold text-white/55">{order.shopName}</span>
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-semibold text-white/65">Your Location</span>
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full border bg-black/60 backdrop-blur-sm border-white/15">
                  <span className="text-xs font-bold text-white">{order.distance}</span>
                </div>
              </div>
            </div>

            {/* Rider Card */}
            <div className="glass-card p-4">
              <p className="text-[10px] font-black uppercase tracking-widest mb-3 text-faint">Delivery Partner</p>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black flex-shrink-0 border text-white"
                  style={{ background: `linear-gradient(135deg, ${phaseColor}, ${phaseColor}CC)`, borderColor: `${phaseColor}30` }}>
                  {order.rider.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-body">{order.rider.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs px-2 py-0.5 rounded-md font-bold surface text-secondary">
                      {order.rider.vehicle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-accent">★ {order.rider.rating}</span>
                    <span className="text-faint">•</span>
                    <span className="text-xs text-faint">{order.rider.deliveries} trips</span>
                    <span className="text-faint">•</span>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: phaseColor, animation: 'pulse-glow 1s infinite' }} />
                    <span className="text-xs font-semibold" style={{ color: phaseColor }}>On the way</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${order.rider.phone}`} className="w-11 h-11 rounded-xl flex items-center justify-center border transition-all hover:scale-105 bg-emerald-500/12 border-emerald-500/25">
                    <Phone size={16} className="text-emerald-600 dark:text-emerald-400" />
                  </a>
                  <button className="w-11 h-11 rounded-xl flex items-center justify-center border transition-all hover:scale-105 bg-blue-500/12 border-blue-500/25">
                    <MessageSquare size={16} className="text-blue-600 dark:text-blue-400" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── HORIZONTAL PROGRESS STEPS ── */}
        <div className="glass-card p-4">
          <p className="text-[10px] font-black uppercase tracking-widest mb-4 text-faint">Order Progress</p>
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 rounded-full bg-[var(--bg3)]" />
            <div className="absolute top-4 left-4 h-0.5 rounded-full transition-all duration-700"
              style={{ background: phaseColor, width: `${Math.max(0, (stepIdx / (STEPS.length - 1)) * 92)}%`, opacity: 0.5 }} />
            <div className="flex justify-between relative">
              {STEPS.map((step, i) => {
                const done = i < stepIdx;
                const active = i === stepIdx;
                const StepIcon = step.icon;
                return (
                  <div key={step.key} className="flex flex-col items-center gap-1.5" style={{ width: `${100 / STEPS.length}%` }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500 border"
                      style={{
                        background: done ? `${phaseColor}18` : active ? phaseColor : 'var(--bg3)',
                        borderColor: done ? `${phaseColor}30` : active ? phaseColor : 'var(--card-border)',
                        boxShadow: active ? `0 0 18px ${phaseColor}50` : 'none',
                      }}>
                      {done
                        ? <Check size={13} color={phaseColor} strokeWidth={3} />
                        : <StepIcon size={13} color={active ? '#fff' : 'var(--text-faint)'} />
                      }
                    </div>
                    <span className="text-[9px] font-bold text-center leading-tight"
                      style={{ color: active ? phaseColor : done ? 'var(--text-muted)' : 'var(--text-faint)' }}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── ORDER ITEMS ── */}
        <div className="glass-card p-4">
          <p className="text-[10px] font-black uppercase tracking-widest mb-3 text-faint">Order Items</p>
          <div className="space-y-2 mb-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs" style={{ color: phaseColor, opacity: 0.7 }}>▸</span>
                <span className="text-sm text-secondary">{item}</span>
              </div>
            ))}
          </div>
          <div className="divider my-3" />
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider mb-0.5 text-faint">Delivering to</p>
              <p className="text-sm font-semibold text-body">{order.address}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider mb-0.5 text-faint">Total</p>
              <p className="text-2xl font-black" style={{ color: phaseColor }}>₹{order.total}</p>
            </div>
          </div>
        </div>

        {/* ── HELP ── */}
        <div className="glass-card p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-body">Need help?</p>
            <p className="text-xs mt-0.5 text-faint">Support available 24/7</p>
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
