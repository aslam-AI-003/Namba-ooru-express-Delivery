'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Bike,
  IndianRupee, Download, ChevronRight, Zap, Gift, CloudRain,
} from 'lucide-react';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RIDER EARNINGS — Premium Module
// Inspired by Swiggy/Zomato Delivery Partner Apps
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const TABS = ['Today', 'This Week', 'This Month'] as const;

// Simulated earnings data
function generateEarningsData(riderId: string, deliveredCount: number) {
  const perOrder = 45;
  const today = deliveredCount * perOrder;
  const week = today * 5.5;
  const month = today * 22;

  return {
    today: { earnings: today, orders: deliveredCount, hours: Math.max(1, Math.round(deliveredCount * 0.4)), bonus: deliveredCount >= 5 ? 100 : 0, tips: Math.round(deliveredCount * 8) },
    week: { earnings: Math.round(week), orders: Math.round(deliveredCount * 5.5), hours: Math.round(deliveredCount * 2.2), bonus: 350, tips: Math.round(deliveredCount * 44) },
    month: { earnings: Math.round(month), orders: Math.round(deliveredCount * 22), hours: Math.round(deliveredCount * 8.8), bonus: 1500, tips: Math.round(deliveredCount * 176) },
  };
}

// Mini bar chart component
function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
          <div
            className="w-full rounded-t-md transition-all duration-300"
            style={{ height: `${(val / max) * 100}%`, minHeight: '4px', background: color, opacity: i === data.length - 1 ? 1 : 0.5 }}
          />
          <span className="text-[8px] text-gray-500">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
        </div>
      ))}
    </div>
  );
}

// Circular progress ring
function ProgressRing({ value, max, color, label, icon: Icon }: { value: number; max: number; color: string; label: string; icon: React.ElementType }) {
  const pct = Math.min((value / max) * 100, 100);
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
          <circle cx="32" cy="32" r={radius} fill="none" stroke={color} strokeWidth="5"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-700" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-black text-body">{value}/{max}</p>
        <p className="text-[9px] text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function RiderEarningsPage() {
  const { demoOrders, user } = useStore();
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('Today');

  const riderId = user?.uid || 'rider-001';
  const deliveredOrders = demoOrders.filter(o => o.status === 'delivered' && o.riderId === riderId);
  const data = generateEarningsData(riderId, deliveredOrders.length);

  const current = activeTab === 'Today' ? data.today : activeTab === 'This Week' ? data.week : data.month;
  const weeklyData = [180, 225, 270, 135, 315, 360, data.today.earnings || 90];

  // Settlement history
  const settlements = [
    { id: 1, amount: 2450, date: 'Jul 28, 2026', status: 'completed', method: 'UPI' },
    { id: 2, amount: 3200, date: 'Jul 21, 2026', status: 'completed', method: 'Bank' },
    { id: 3, amount: 1890, date: 'Jul 14, 2026', status: 'completed', method: 'UPI' },
  ];

  return (
    <div className="pb-28">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ background: 'rgba(18,18,18,0.85)', borderColor: 'rgba(255,193,7,0.1)' }}>
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-black text-white flex items-center gap-2">
                <Wallet size={20} className="text-[#ffc107]" /> Earnings
              </h1>
              <p className="text-[11px] text-gray-400 mt-0.5">Track your income & payouts</p>
            </div>
            <button className="px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5"
              style={{ background: 'rgba(255,193,7,0.08)', borderColor: 'rgba(255,193,7,0.25)', color: '#ffc107' }}>
              <Download size={12} /> Statement
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-5 space-y-5">

        {/* Period Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
              style={activeTab === tab ? { background: '#ffc107' } : {}}>
              {tab}
            </button>
          ))}
        </div>

        {/* Main Earnings Card */}
        <div className="rounded-3xl p-5 border" style={{ background: 'linear-gradient(135deg, rgba(255,193,7,0.08), rgba(255,193,7,0.02))', borderColor: 'rgba(255,193,7,0.15)' }}>
          <div className="text-center mb-4">
            <p className="text-xs text-gray-400 mb-1">{activeTab}&apos;s Earnings</p>
            <div className="flex items-center justify-center gap-1">
              <IndianRupee size={24} className="text-[#ffc107]" />
              <span className="text-4xl font-black text-white">{current.earnings}</span>
            </div>
            {current.bonus > 0 && (
              <p className="text-[11px] mt-1 text-emerald-400 font-bold flex items-center justify-center gap-1">
                <ArrowUpRight size={12} /> +₹{current.bonus} bonus included
              </p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Orders', value: current.orders.toString(), icon: Bike, color: '#ffc107' },
              { label: 'Hours', value: `${current.hours}h`, icon: Clock, color: '#60a5fa' },
              { label: 'Bonus', value: `₹${current.bonus}`, icon: Zap, color: '#34d399' },
              { label: 'Tips', value: `₹${current.tips}`, icon: Gift, color: '#f472b6' },
            ].map(stat => (
              <div key={stat.label} className="text-center p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <stat.icon size={14} className="mx-auto mb-1" style={{ color: stat.color }} />
                <p className="text-sm font-black text-white">{stat.value}</p>
                <p className="text-[9px] text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp size={14} className="text-[#ffc107]" /> Weekly Trend
            </h3>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-0.5">
              <ArrowUpRight size={11} /> +12%
            </span>
          </div>
          <MiniBarChart data={weeklyData} color="#ffc107" />
        </div>

        {/* Performance Rings */}
        <div className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
          <h3 className="text-sm font-bold text-white mb-4">Performance</h3>
          <div className="flex justify-around">
            <ProgressRing value={Math.min(current.orders, 10)} max={10} color="#ffc107" label="Orders" icon={Bike} />
            <ProgressRing value={Math.min(current.hours, 8)} max={8} color="#60a5fa" label="Hours" icon={Clock} />
            <ProgressRing value={95} max={100} color="#34d399" label="On-Time %" icon={Zap} />
          </div>
        </div>

        {/* Earnings Breakdown */}
        <div className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
          <h3 className="text-sm font-bold text-white mb-3">Breakdown</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Delivery Fee', amount: current.orders * 35, color: '#ffc107', icon: Bike },
              { label: 'Distance Bonus', amount: current.orders * 10, color: '#60a5fa', icon: TrendingUp },
              { label: 'Peak Hour Bonus', amount: Math.round(current.bonus * 0.6), color: '#f59e0b', icon: Zap },
              { label: 'Rain Incentive', amount: Math.round(current.bonus * 0.2), color: '#06b6d4', icon: CloudRain },
              { label: 'Tips', amount: current.tips, color: '#f472b6', icon: Gift },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${item.color}15` }}>
                  <item.icon size={14} style={{ color: item.color }} />
                </div>
                <span className="flex-1 text-xs text-gray-300">{item.label}</span>
                <span className="text-xs font-bold text-white">₹{item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Settlement History */}
        <div className="rounded-2xl p-4 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">Settlements</h3>
            <button className="text-[11px] text-[#ffc107] font-bold">View All</button>
          </div>
          <div className="space-y-2">
            {settlements.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.1)' }}>
                  <ArrowDownRight size={16} className="text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-white">₹{s.amount}</p>
                  <p className="text-[10px] text-gray-500">{s.date} • {s.method}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-emerald-400">Paid</span>
                  <ChevronRight size={12} className="text-gray-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Withdraw Button */}
        <button className="w-full py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #ffc107, #ff9800)', color: '#121212' }}>
          <Wallet size={16} /> Withdraw to Bank
        </button>

      </div>
    </div>
  );
}
