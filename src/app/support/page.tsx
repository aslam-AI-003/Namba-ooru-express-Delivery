'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const FAQS = [
  { q: 'How long does delivery take?', a: 'Most orders are delivered within 20–45 minutes depending on the shop and your location.' },
  { q: 'Can I cancel my order?', a: 'You can cancel your order within 2 minutes of placing it. After that, cancellation depends on the shop\'s policy.' },
  { q: 'How do I get a refund?', a: 'Refunds are processed within 3–5 business days to your original payment method or wallet.' },
  { q: 'What if my order is wrong or missing items?', a: 'Please contact us within 24 hours of delivery. We\'ll resolve it with a refund or replacement.' },
  { q: 'How does the wallet work?', a: 'Add money to your NammaOoru wallet and use it for faster checkout. Cashback is also credited to your wallet.' },
  { q: 'Is there a minimum order amount?', a: 'Minimum order varies by shop. Most shops have no minimum or a small minimum of ₹50–₹100.' },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject || !form.message) return toast.error('Please fill all fields');
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Message sent! We\'ll reply within 24 hours.');
    setForm({ subject: '', message: '' });
    setSending(false);
  };

  return (
    <main className="min-h-screen app-bg pb-24 md:pb-8">
      <header className="sticky top-0 z-50 header-glass">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/profile" className="btn-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></Link>
          <h1 className="font-bold text-white flex-1">Help & Support</h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-4 space-y-5">
        {/* Quick Contact */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '📞', label: 'Call Us', sub: '1800-XXX-XXXX', href: 'tel:1800XXXXXXX', color: 'from-emerald-500/15' },
            { icon: '💬', label: 'WhatsApp', sub: 'Chat now', href: 'https://wa.me/919876543210', color: 'from-green-500/15' },
            { icon: '📧', label: 'Email', sub: 'support@noe.in', href: 'mailto:support@noe.in', color: 'from-blue-500/15' },
          ].map(c => (
            <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
              className={`glass-card p-3 text-center bg-gradient-to-br ${c.color} to-transparent hover:scale-105 transition-transform`}>
              <div className="text-2xl mb-1">{c.icon}</div>
              <p className="text-xs font-bold text-white">{c.label}</p>
              <p className="text-[10px] text-white/35 mt-0.5">{c.sub}</p>
            </a>
          ))}
        </div>

        {/* FAQs */}
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/[0.06]">
            <h2 className="text-sm font-bold text-white">❓ Frequently Asked Questions</h2>
          </div>
          {FAQS.map((faq, i) => (
            <React.Fragment key={i}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left p-4 flex items-start gap-3 hover:bg-white/[0.02] transition-colors">
                <div className="flex-1">
                  <p className={`text-sm font-semibold transition-colors ${openFaq === i ? 'text-yellow-400' : 'text-white'}`}>{faq.q}</p>
                  {openFaq === i && (
                    <p className="text-xs text-white/50 mt-2 leading-relaxed animate-slide-up">{faq.a}</p>
                  )}
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"
                  className={`flex-shrink-0 mt-0.5 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {i < FAQS.length - 1 && <div className="divider mx-4" />}
            </React.Fragment>
          ))}
        </div>

        {/* Contact Form */}
        <div className="glass-card p-4">
          <h2 className="text-sm font-bold text-white mb-4">📝 Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Subject</label>
              <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="input-glass text-sm">
                <option value="">Select a topic</option>
                <option value="order">Order Issue</option>
                <option value="payment">Payment Problem</option>
                <option value="delivery">Delivery Issue</option>
                <option value="refund">Refund Request</option>
                <option value="account">Account Help</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Message</label>
              <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                placeholder="Describe your issue in detail..." className="input-glass text-sm resize-none" rows={4} />
            </div>
            <button type="submit" disabled={sending} className="btn-primary w-full py-3 disabled:opacity-60">
              {sending ? 'Sending...' : 'Send Message 📤'}
            </button>
          </form>
        </div>

        {/* Links */}
        <div className="glass-sm overflow-hidden">
          {[
            { icon: '📋', label: 'Terms of Service', href: '/terms' },
            { icon: '🔒', label: 'Privacy Policy', href: '/privacy' },
            { icon: '💰', label: 'Refund Policy', href: '/refund' },
            { icon: '🏢', label: 'About NammaOoru', href: '/about' },
          ].map((item, i) => (
            <React.Fragment key={item.href}>
              <Link href={item.href} className="flex items-center gap-3 p-4 hover:bg-white/[0.03] transition-colors">
                <span className="text-base">{item.icon}</span>
                <span className="text-sm text-white/70 flex-1">{item.label}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </Link>
              {i < 3 && <div className="divider mx-4" />}
            </React.Fragment>
          ))}
        </div>

        <p className="text-center text-xs text-white/20 pb-2">
          NammaOoru Express • Thanjavur, Tamil Nadu<br />
          Available 8 AM – 10 PM daily
        </p>
      </div>
    </main>
  );
}
