'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile, createUserProfile } from '@/lib/firebaseService';
import { useStore } from '@/store/useStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useStore();
  const [tab, setTab] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Store confirmation result for OTP verification
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // Fetch full profile from Firestore
      const profile = await getUserProfile(cred.user.uid);
      setUser({
        uid: cred.user.uid,
        displayName: profile?.name || cred.user.displayName || 'User',
        phone: profile?.phone || cred.user.phoneNumber || '',
        email: profile?.email || cred.user.email || '',
        photoURL: profile?.photoURL || cred.user.photoURL || '',
        role: profile?.role || 'customer',
      });
      toast.success('Welcome back! 🎉');
      router.push('/');
    } catch (err: any) {
      const msg = err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password'
        ? 'Invalid email or password'
        : err.code === 'auth/user-not-found'
        ? 'No account found with this email'
        : err.code === 'auth/too-many-requests'
        ? 'Too many attempts. Try again later.'
        : err.message?.replace('Firebase: ', '') || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) return toast.error('Enter valid 10-digit phone number');
    setLoading(true);
    try {
      // Clear previous recaptcha if any
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
      const recaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
      });
      recaptchaRef.current = recaptcha;
      const confirmation = await signInWithPhoneNumber(auth, `+91${phone}`, recaptcha);
      confirmationRef.current = confirmation;
      setOtpSent(true);
      toast.success('OTP sent to +91' + phone);
    } catch (err: any) {
      const msg = err.code === 'auth/invalid-phone-number'
        ? 'Invalid phone number format'
        : err.code === 'auth/too-many-requests'
        ? 'Too many OTP requests. Try again later.'
        : 'Failed to send OTP. Try email login.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) return toast.error('Enter 6-digit OTP');
    if (!confirmationRef.current) return toast.error('Please request OTP first');
    setLoading(true);
    try {
      const result = await confirmationRef.current.confirm(otp);
      const firebaseUser = result.user;

      // Check if profile exists, create if new user
      let profile = await getUserProfile(firebaseUser.uid);
      if (!profile) {
        await createUserProfile(firebaseUser.uid, {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          phone: phone,
          email: firebaseUser.email || '',
          role: 'customer',
          walletBalance: 0,
          loyaltyPoints: 0,
        });
        profile = await getUserProfile(firebaseUser.uid);
      }

      setUser({
        uid: firebaseUser.uid,
        displayName: profile?.name || 'User',
        phone: phone,
        email: profile?.email || '',
        photoURL: profile?.photoURL || '',
        role: profile?.role || 'customer',
      });
      toast.success('Welcome to NammaOoru! 🎉');
      router.push('/');
    } catch (err: any) {
      const msg = err.code === 'auth/invalid-verification-code'
        ? 'Wrong OTP. Please check and try again.'
        : err.code === 'auth/code-expired'
        ? 'OTP expired. Please request a new one.'
        : 'OTP verification failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen app-bg flex items-center justify-center px-4 py-8">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl glow-yellow-sm">
            <span className="text-3xl">🛵</span>
          </div>
          <h1 className="text-2xl font-black text-white">Welcome Back!</h1>
          <p className="text-sm text-white/40 mt-1">Sign in to continue ordering</p>
        </div>

        {/* Card */}
        <div className="glass-strong p-6">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl mb-6">
            {(['email', 'phone'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setOtpSent(false); setOtp(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  tab === t ? 'bg-yellow-400 text-black shadow-lg' : 'text-white/50 hover:text-white/70'
                }`}>
                {t === 'email' ? '📧 Email' : '📱 Phone'}
              </button>
            ))}
          </div>

          {tab === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" className="input-glass pl-11" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password" className="input-glass pl-11 pr-11" required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/auth/forgot-password" className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    Signing in...
                  </span>
                ) : 'Sign In →'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Phone Number</label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white/60 flex-shrink-0">
                    🇮🇳 +91
                  </div>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210" className="input-glass flex-1" maxLength={10}
                    disabled={otpSent} />
                </div>
              </div>

              {otpSent && (
                <div className="animate-slide-up">
                  <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Enter OTP</label>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6-digit OTP" className="input-glass text-center text-xl tracking-widest" maxLength={6} autoFocus />
                  <button onClick={() => { setOtpSent(false); setOtp(''); }}
                    className="text-xs text-yellow-400 mt-2 hover:text-yellow-300">
                    ← Change number
                  </button>
                </div>
              )}

              {/* Invisible recaptcha container */}
              <div id="recaptcha-container" />

              {!otpSent ? (
                <button onClick={handleSendOtp} disabled={loading || phone.length < 10}
                  className="btn-primary w-full py-3.5 text-base disabled:opacity-50">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      Sending OTP...
                    </span>
                  ) : 'Send OTP →'}
                </button>
              ) : (
                <button onClick={handleVerifyOtp} disabled={loading || otp.length < 6}
                  className="btn-primary w-full py-3.5 text-base disabled:opacity-50">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      Verifying...
                    </span>
                  ) : 'Verify OTP ✓'}
                </button>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 divider" />
            <span className="text-xs text-white/25 font-medium">OR</span>
            <div className="flex-1 divider" />
          </div>

          {/* Demo login */}
          <button onClick={() => {
            setUser({ uid: 'demo-user', displayName: 'Demo User', phone: '9876543210', email: 'demo@noe.com', role: 'customer' });
            toast.success('Logged in as Demo User!');
            router.push('/');
          }} className="btn-secondary w-full py-3 text-sm">
            🎭 Continue as Demo User
          </button>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-white/40 mt-6">
          New to NammaOoru?{' '}
          <Link href="/auth/register" className="text-yellow-400 font-bold hover:text-yellow-300 transition-colors">
            Create Account →
          </Link>
        </p>

        {/* Partner links */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <Link href="/shop/register" className="text-xs text-white/25 hover:text-white/50 transition-colors">Register Shop</Link>
          <span className="text-white/15">•</span>
          <Link href="/rider/register" className="text-xs text-white/25 hover:text-white/50 transition-colors">Become Rider</Link>
        </div>
      </div>
    </div>
  );
}
