'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { addMoneyToWallet } from '@/lib/firebaseService';
import toast from 'react-hot-toast';

const ADD_AMOUNTS = [50, 100, 200, 500, 1000];
const FILTER_TABS = ['All', 'Credit', 'Debit'];

export default function WalletPage() {
  const { walletBalance, walletTransactions, user } = useStore();
  const [addAmount, setAddAmount] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('All');
  const [adding, setAdding] = useState(false);

  const filtered = walletTransactions.filter(t => {
    if (filter === 'Credit') return t.type === 'credit';
    if (filter === 'Debit') return t.type === 'debit';
    return true;
  });

  const totalAdded = walletTransactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const totalSpent = walletTransactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
  const totalCashback = walletTransactions.filter(t => t.type === 'credit' && t.icon === '💰').reduce((s, t) => s + t.amount, 0);

  // Build chart data from real transactions (last 7 days)
  const chartData = (() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const now = new Date();
    return days.map((day, i) => {
      const dayDate = new Date(now);
      dayDate.setDate(now.getDate() - (6 - i));
      const spend = walletTransactions
        .filter(t => {
          if (t.type !== 'debit' || !t.createdAt) return false;
          const txDate = (t.createdAt as any).toDate ? (t.createdAt as any).toDate() : new Date(t.createdAt as any);
          return txDate.toDateString() === dayDate.toDateString();
        })
        .reduce((s, t) => s + t.amount, 0);
      return { day, spend };
    });
  })();
  const maxSpend = Math.max(...chartData.map(d => d.spend), 1);

  const handleAddMoney = async () => {
    const amount = parseInt(addAmount);
    if (!amount || amount < 10) return toast.error('Min. ₹10');
    if (!user) return toast.error('Please login first');
    setAdding(true);
    try {
      await addMoneyToWallet(user.uid, amount, 'Wallet Top-up');
      toast.success(`₹${amount} added to wallet! 🎉`);
      setShowAdd(false);
      setAddAmount('');
    } catch {
      toast.error('Failed to add money. Try again.');
    } finally {
      setAdding(false);
    }
  };

  const formatDate = (ts: any) => {
    if (!ts) return '';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ' • ' +
      date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="min-h-screen app-bg pb-24 md:pb-8">
      <header className="sticky top-0 z-50 header-glass">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/profile" className="btn-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <h1 className="font-bold text-white flex-1">My Wallet</h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-4 space-y-4">

        {/* Balance Card */}
        <div className="relative overflow-hidden rounded-3xl border p-6 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(249,115,22,0.05))', borderColor: 'rgba(251,191,36,0.15)' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.5), transparent)' }} />
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Available Balance</p>
          <div className="text-6xl font-black text-white mb-1" style={{ textShadow: '0 0 40px rgba(251,191,36,0.3)' }}>₹{walletBalance}</div>
          <p className="text-xs mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>NammaOoru Wallet</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setShowAdd(true)} className="btn-primary px-6">+ Add Money</button>
            <Link href="/shops" className="btn-secondary px-6">Use Now</Link>
          </div>
        </div>

        {/* Quick Add */}
        {showAdd && (
          <div className="rounded-2xl border p-4" style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.07)', animation: 'slideUp 0.3s ease' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Add Money to Wallet</h3>
              <button onClick={() => { setShowAdd(false); setAddAmount(''); }} className="text-white/30 hover:text-white/60 text-lg">✕</button>
            </div>
            <div className="flex gap-2 flex-wrap mb-3">
              {ADD_AMOUNTS.map(a => (
                <button key={a} onClick={() => setAddAmount(a.toString())}
                  className="px-4 py-2 rounded-xl text-sm font-bold border transition-all"
                  style={{
                    background: addAmount === a.toString() ? '#FBBF24' : 'rgba(255,255,255,0.04)',
                    color: addAmount === a.toString() ? '#000' : 'rgba(255,255,255,0.6)',
                    borderColor: addAmount === a.toString() ? '#FBBF24' : 'rgba(255,255,255,0.08)',
                  }}>
                  ₹{a}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={addAmount} onChange={e => setAddAmount(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter amount" className="input-glass flex-1 text-sm" />
              <button onClick={handleAddMoney} disabled={adding}
                className="btn-primary px-5 disabled:opacity-60">
                {adding ? (
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                ) : 'Pay'}
              </button>
            </div>
            <p className="text-xs text-center mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>🔒 Secure payment via UPI / Card</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Added', value: `₹${totalAdded}`, icon: '📥', color: '#10B981' },
            { label: 'Total Spent', value: `₹${totalSpent}`, icon: '📤', color: '#EF4444' },
            { label: 'Cashback', value: `₹${totalCashback}`, icon: '🎁', color: '#FBBF24' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border p-3 text-center" style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="text-xl">{s.icon}</div>
              <div className="text-sm font-black mt-0.5" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Spending Chart */}
        <div className="rounded-2xl border p-4" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">📊 Spending This Week</h3>
            {totalSpent > 0 && <span className="text-xs font-bold text-red-400">₹{totalSpent} spent</span>}
          </div>
          <div className="flex items-end gap-2 h-20">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-lg transition-all duration-700 relative group"
                  style={{
                    height: `${Math.max((d.spend / maxSpend) * 64, d.spend > 0 ? 8 : 2)}px`,
                    background: d.spend > 0 ? 'linear-gradient(180deg, #EF4444, rgba(239,68,68,0.4))' : 'rgba(255,255,255,0.06)',
                    minHeight: '2px',
                  }}>
                  {d.spend > 0 && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-red-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{d.spend}
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions */}
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <h3 className="text-sm font-bold text-white">Transaction History</h3>
            <div className="flex gap-1">
              {FILTER_TABS.map(tab => (
                <button key={tab} onClick={() => setFilter(tab)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all"
                  style={{
                    background: filter === tab ? '#FBBF24' : 'rgba(255,255,255,0.05)',
                    color: filter === tab ? '#000' : 'rgba(255,255,255,0.4)',
                  }}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-white/30 text-sm">
              {walletTransactions.length === 0 ? 'No transactions yet' : 'No transactions in this category'}
            </div>
          ) : (
            filtered.map((t, i) => (
              <React.Fragment key={t.id || i}>
                <div className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: t.type === 'credit' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}>
                    {t.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{t.desc}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{formatDate(t.createdAt)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-black" style={{ color: t.type === 'credit' ? '#10B981' : '#EF4444' }}>
                      {t.type === 'credit' ? '+' : '-'}₹{t.amount}
                    </p>
                    {t.status === 'refunded' && <span className="text-[10px] text-blue-400">Refunded</span>}
                    {t.status === 'completed' && <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>Completed</span>}
                  </div>
                </div>
                {i < filtered.length - 1 && <div className="h-px mx-4" style={{ background: 'rgba(255,255,255,0.05)' }} />}
              </React.Fragment>
            ))
          )}
        </div>

      </div>
    </main>
  );
}
