'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useStore } from '@/store/useStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    city: 'Thanjavur', referralCode: '',
  });

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || form.phone.length < 10) return toast.error('Enter valid name and phone');
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Fill all fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(cred.user, { displayName: form.name });
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid, name: form.name, email: form.email,
        phone: form.phone, city: form.city, role: 'customer',
        walletBalance: 0, loyaltyPoints: 0,
        referralCode: form.referralCode || null,
        createdAt: serverTimestamp(),
      });
      setUser({ uid: cred.user.uid, displayName: form.name, phone: form.phone, email: form.email, role: 'customer' });
      toast.success('Account created! Welcome to NammaOoru 🎉');
      router.push('/');
    } catch (err: any) {
      toast.error(err.message?.replace('Firebase: ', '') || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen app-bg flex items-center justify-center px-4 py-8">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl glow-yellow-sm">
            <span className="text-3xl">🛵</span>
          </div>
          <h1 className="text-2xl font-black text-white">Create Account</h1>
          <p className="text-sm text-white/40 mt-1">Join NammaOoru Express today</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2].map(s => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${s <= step ? 'text-yellow-400' : 'text-white/25'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${
                  s < step ? 'bg-yellow-400 border-yellow-400 text-black' :
                  s === step ? 'border-yellow-400 text-yellow-400' :
                  'border-white/20 text-white/25'
                }`}>
                  {s < step ? '✓' : s}
                </div>
                <span className="text-xs font-semibold hidden sm:block">
                  {s === 1 ? 'Personal Info' : 'Account Setup'}
                </span>
              </div>
              {s < 2 && <div className={`flex-1 h-px ${step > s ? 'bg-yellow-400' : 'bg-white/10'} transition-all`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="glass-strong p-6">
          {step === 1 ? (
            <form onSubmit={handleStep1} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Full Name</label>
                <input value={form.name} onChange={e => update('name', e.target.value)}
                  placeholder="Your full name" className="input-glass" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Phone Number</label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white/60 flex-shrink-0">
                    🇮🇳 +91
                  </div>
                  <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210" className="input-glass flex-1" maxLength={10} required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">City</label>
                <select value={form.city} onChange={e => update('city', e.target.value)} className="input-glass">
                  <option value="Thanjavur">Thanjavur</option>
                  <option value="Kumbakonam">Kumbakonam</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Referral Code (Optional)</label>
                <input value={form.referralCode} onChange={e => update('referralCode', e.target.value.toUpperCase())}
                  placeholder="Enter referral code" className="input-glass" />
              </div>
              <button type="submit" className="btn-primary w-full py-3.5 text-base">
                Continue →
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Email Address</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                  placeholder="you@example.com" className="input-glass" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)}
                    placeholder="Min. 6 characters" className="input-glass pr-11" required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Confirm Password</label>
                <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                  placeholder="Re-enter password" className="input-glass" required />
              </div>

              <p className="text-[11px] text-white/30 leading-relaxed">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-yellow-400 hover:underline">Terms of Service</Link> and{' '}
                <Link href="/privacy" className="text-yellow-400 hover:underline">Privacy Policy</Link>
              </p>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">
                  ← Back
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 disabled:opacity-50">
                  {loading ? 'Creating...' : 'Create Account 🎉'}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-white/40 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-yellow-400 font-bold hover:text-yellow-300 transition-colors">
            Sign In →
          </Link>
        </p>
      </div>
    </div>
  );
}
