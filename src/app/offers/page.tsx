'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SEED_COUPONS } from '@/lib/seed-data';
import toast from 'react-hot-toast';

const BANNER_OFFERS = [
  { id: 'b1', title: '50% OFF', subtitle: 'On first order', desc: 'New users get flat 50% off up to ₹100', code: 'WELCOME50', color: '#FBBF24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', icon: '🎉', expiry: 'Today only', savings: '₹100' },
  { id: 'b2', title: 'FREE Delivery', subtitle: 'All week long', desc: 'Free delivery on all orders above ₹199', code: 'FREEDEL', color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', icon: '🛵', expiry: 'Ends Sunday', savings: '₹50' },
  { id: 'b3', title: '₹100 Cashback', subtitle: 'On wallet payment', desc: 'Pay via wallet and get ₹100 cashback', code: 'WALLET100', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', icon: '💰', expiry: 'Limited time', savings: '₹100' },
];

export default function OffersPage() {
  const router = useRouter();
  const [copiedCode, setCopiedCode] = useState('');
  const [appliedCode, setAppliedCode] = useState('');

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopiedCode(code);
    toast.success(`Code "${code}" copied!`);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  const applyAndGo = (code: string) => {
    setAppliedCode(code);
    toast.success(`"${code}" will be applied at checkout!`, { icon: '🎟️' });
    setTimeout(() => router.push('/shops'), 1200);
  };

  return (
    <main className="min-h-screen app-bg pb-24 md:pb-8">
      <header className="sticky top-0 z-50 header-glass">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="btn-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></Link>
          <h1 className="font-bold text-white flex-1">Offers & Coupons</h1>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: 'rgba(251,191,36,0.08)', borderColor: 'rgba(251,191,36,0.2)' }}>
            <span className="text-xs font-bold text-yellow-400">{BANNER_OFFERS.length + SEED_COUPONS.filter(c => c.isActive).length} active</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-4 space-y-5">

        {/* Applied banner */}
        {appliedCode && (
          <div className="rounded-2xl border p-3 flex items-center gap-3" style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' }}>
            <span className="text-xl">✅</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-emerald-400">&quot;{appliedCode}&quot; will be applied at checkout</p>
              <p className="text-xs text-white/40">Redirecting to shops...</p>
            </div>
            <button onClick={() => setAppliedCode('')} className="text-white/30 hover:text-white/60">✕</button>
          </div>
        )}

        {/* Hot Deals */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>🔥 Hot Deals</h2>
          <div className="space-y-3">
            {BANNER_OFFERS.map(offer => (
              <div key={offer.id} className="rounded-2xl border overflow-hidden" style={{ background: offer.bg, borderColor: offer.border }}>
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border"
                      style={{ background: `${offer.color}15`, borderColor: `${offer.color}25` }}>
                      {offer.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-black text-white text-base">{offer.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: `${offer.color}20`, color: offer.color }}>
                          Save {offer.savings}
                        </span>
                      </div>
                      <p className="text-xs font-bold mb-0.5" style={{ color: offer.color }}>{offer.subtitle}</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{offer.desc}</p>
                    </div>
                  </div>

                  {/* Dashed coupon strip */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed"
                      style={{ borderColor: `${offer.color}30`, background: `${offer.color}08` }}>
                      <span className="text-xs font-black tracking-widest" style={{ color: offer.color }}>{offer.code}</span>
                      <span className="text-[10px] ml-auto" style={{ color: 'rgba(255,255,255,0.3)' }}>⏰ {offer.expiry}</span>
                    </div>
                    <button onClick={() => copyCode(offer.code)}
                      className="px-3 py-2 rounded-xl text-xs font-black transition-all hover:scale-105 flex-shrink-0"
                      style={{ background: copiedCode === offer.code ? '#10B981' : `${offer.color}20`, color: copiedCode === offer.code ? '#fff' : offer.color, border: `1px solid ${offer.color}30` }}>
                      {copiedCode === offer.code ? '✓ Copied' : 'Copy'}
                    </button>
                    <button onClick={() => applyAndGo(offer.code)}
                      className="px-3 py-2 rounded-xl text-xs font-black transition-all hover:scale-105 flex-shrink-0"
                      style={{ background: offer.color, color: '#000' }}>
                      Use Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coupon Codes */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>🎟️ Coupon Codes</h2>
          <div className="space-y-2">
            {SEED_COUPONS.filter(c => c.isActive).map(coupon => (
              <div key={coupon.id} className="rounded-2xl border p-4" style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-yellow-400 tracking-wider">{coupon.code}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(251,191,36,0.1)', color: '#FBBF24' }}>
                        {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{coupon.description}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>Min. order ₹{coupon.minOrderAmount} • Max discount ₹{coupon.maxDiscount}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <button onClick={() => copyCode(coupon.code)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{ background: copiedCode === coupon.code ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)', color: copiedCode === coupon.code ? '#10B981' : 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {copiedCode === coupon.code ? '✓ Copied' : 'Copy'}
                    </button>
                    <button onClick={() => applyAndGo(coupon.code)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{ background: 'rgba(251,191,36,0.12)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.2)' }}>
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Referral */}
        <div className="rounded-2xl border p-4" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.05))', borderColor: 'rgba(139,92,246,0.2)' }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🤝</span>
            <div>
              <h3 className="font-black text-white">Refer & Earn</h3>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Earn ₹50 for every friend you refer</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed mb-3" style={{ borderColor: 'rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.08)' }}>
            <span className="text-xs font-black tracking-widest text-purple-400">REFER-NAMMAOORU</span>
            <button onClick={() => copyCode('REFER-NAMMAOORU')} className="ml-auto text-xs font-bold text-purple-400 hover:text-purple-300">
              {copiedCode === 'REFER-NAMMAOORU' ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <button className="btn-primary w-full" style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}>
            Share with Friends 📤
          </button>
        </div>

      </div>
    </main>
  );
}
