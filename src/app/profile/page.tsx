'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { updateUserProfile, addUserAddress, getUserAddresses } from '@/lib/firebaseService';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';

const MENU_ITEMS = [
  { icon: '📦', label: 'My Orders', href: '/orders', badge: '' },
  { icon: '❤️', label: 'Favourites', href: '/favorites', badge: '' },
  { icon: '👛', label: 'My Wallet', href: '/wallet', badge: '' },
  { icon: '🔔', label: 'Notifications', href: '/notifications', badge: '' },
  { icon: '🎟️', label: 'Offers & Coupons', href: '/offers', badge: '' },
  { icon: '🤝', label: 'Refer & Earn', href: '/offers', badge: '₹50' },
  { icon: '🛟', label: 'Help & Support', href: '/support', badge: '' },
  { icon: '📄', label: 'Terms & Privacy', href: '/terms', badge: '' },
];

export default function ProfilePage() {
  const router = useRouter();
  const {
    user, walletBalance, orders, favoriteShopIds,
    addresses, selectedAddressId, setAddresses, setSelectedAddress,
    unreadNotificationCount, logout,
  } = useStore();

  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState({ name: user?.displayName || '', phone: user?.phone || '', email: user?.email || '' });
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'menu' | 'addresses'>('menu');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: 'Home', fullAddress: '', city: 'Thanjavur', pincode: '' });
  const [addingAddress, setAddingAddress] = useState(false);

  const menuWithBadges = MENU_ITEMS.map(item => {
    if (item.href === '/wallet') return { ...item, badge: `₹${walletBalance}` };
    if (item.href === '/notifications' && unreadNotificationCount > 0) return { ...item, badge: String(unreadNotificationCount) };
    return item;
  });

  const saveProfile = async () => {
    if (!draft.name.trim()) { toast.error('Name cannot be empty'); return; }
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        name: draft.name.trim(),
        phone: draft.phone.trim(),
        email: draft.email.trim(),
      });
      setEditMode(false);
      toast.success('Profile updated! ✓');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.fullAddress.trim() || !newAddress.pincode.trim()) {
      toast.error('Please fill address and pincode');
      return;
    }
    if (!user) return;
    setAddingAddress(true);
    try {
      const id = await addUserAddress(user.uid, {
        label: newAddress.label,
        fullAddress: newAddress.fullAddress.trim(),
        city: newAddress.city,
        pincode: newAddress.pincode.trim(),
        lat: 10.787,
        lng: 79.1378,
        isDefault: addresses.length === 0,
      });
      const updated = await getUserAddresses(user.uid);
      setAddresses(updated);
      if (addresses.length === 0) setSelectedAddress(id);
      setShowAddAddress(false);
      setNewAddress({ label: 'Home', fullAddress: '', city: 'Thanjavur', pincode: '' });
      toast.success('Address added!');
    } catch {
      toast.error('Failed to add address');
    } finally {
      setAddingAddress(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch {
      toast.error('Failed to logout');
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen app-bg flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-xl font-black text-white mb-2">Not logged in</h2>
          <p className="text-sm text-white/40 mb-6">Login to view your profile</p>
          <Link href="/auth/login" className="btn-primary">Login / Register →</Link>
        </div>
      </main>
    );
  }

  const initials = user.displayName?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <main className="min-h-screen app-bg pb-24 md:pb-8">
      <header className="sticky top-0 z-50 header-glass">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="btn-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <h1 className="font-bold text-white flex-1">My Profile</h1>
          <button onClick={() => { setEditMode(!editMode); setDraft({ name: user.displayName || '', phone: user.phone || '', email: user.email || '' }); }}
            className="text-xs font-bold transition-colors px-3 py-1.5 rounded-lg border"
            style={{ background: editMode ? 'rgba(239,68,68,0.1)' : 'rgba(251,191,36,0.1)', borderColor: editMode ? 'rgba(239,68,68,0.25)' : 'rgba(251,191,36,0.25)', color: editMode ? '#EF4444' : '#FBBF24' }}>
            {editMode ? 'Cancel' : '✏️ Edit'}
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-4 space-y-4">

        {/* Profile Card */}
        <div className="relative overflow-hidden rounded-3xl border p-5"
          style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(249,115,22,0.04))', borderColor: 'rgba(251,191,36,0.15)' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.4), transparent)' }} />

          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center text-2xl font-black border"
                style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.3), rgba(249,115,22,0.15))', borderColor: 'rgba(251,191,36,0.25)', color: '#FBBF24' }}>
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.photoURL} alt="avatar" className="w-full h-full rounded-2xl object-cover" />
                ) : initials}
              </div>
              {editMode && (
                <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ background: '#FBBF24', color: '#000' }}>
                  📷
                </button>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {editMode ? (
                <div className="space-y-2">
                  <input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                    className="input-glass text-sm py-2 w-full font-bold" placeholder="Full name" />
                  <input value={draft.phone} onChange={e => setDraft(d => ({ ...d, phone: e.target.value }))}
                    className="input-glass text-sm py-2 w-full" placeholder="Phone number" />
                  <input value={draft.email} onChange={e => setDraft(d => ({ ...d, email: e.target.value }))}
                    className="input-glass text-sm py-2 w-full" placeholder="Email address" />
                </div>
              ) : (
                <>
                  <h2 className="font-black text-white text-lg">{user.displayName}</h2>
                  <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{user.phone || 'No phone added'}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{user.email || 'No email added'}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400">Verified Account</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {editMode && (
            <button onClick={saveProfile} disabled={saving} className="btn-primary w-full mt-4 py-3 disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Changes ✓'}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Orders', value: String(orders.length), icon: '📦', href: '/orders' },
            { label: 'Wallet', value: `₹${walletBalance}`, icon: '👛', href: '/wallet' },
            { label: 'Saved', value: String(favoriteShopIds.length), icon: '❤️', href: '/favorites' },
          ].map(s => (
            <Link key={s.label} href={s.href}
              className="rounded-2xl border p-3 text-center transition-all hover:border-white/15"
              style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="text-xl">{s.icon}</div>
              <div className="text-sm font-black text-white mt-0.5">{s.value}</div>
              <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</div>
            </Link>
          ))}
        </div>

        {/* Section Tabs */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {(['menu', 'addresses'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveSection(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${activeSection === tab ? 'bg-yellow-400 text-black' : 'text-white/50'}`}>
              {tab === 'menu' ? '⚙️ Account' : '📍 Addresses'}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        {activeSection === 'menu' && (
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            {menuWithBadges.map((item, i) => (
              <React.Fragment key={item.label}>
                <Link href={item.href} className="flex items-center gap-3 p-4 transition-colors hover:bg-white/[0.03]">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.05)' }}>
                    {item.icon}
                  </div>
                  <span className="flex-1 text-sm font-semibold text-white">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(251,191,36,0.12)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.2)' }}>
                      {item.badge}
                    </span>
                  )}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </Link>
                {i < menuWithBadges.length - 1 && <div className="h-px mx-4" style={{ background: 'rgba(255,255,255,0.04)' }} />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Addresses */}
        {activeSection === 'addresses' && (
          <div className="space-y-3">
            {addresses.length === 0 && !showAddAddress && (
              <div className="text-center py-8 text-white/30 text-sm">No addresses saved yet</div>
            )}
            {addresses.map(addr => (
              <div key={addr.id} className="rounded-2xl border p-4"
                style={{ background: 'rgba(255,255,255,0.025)', borderColor: addr.id === selectedAddressId ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.07)' }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: addr.id === selectedAddressId ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.05)' }}>
                    {addr.label === 'Home' ? '🏠' : addr.label === 'Work' ? '🏢' : '📍'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold text-white">{addr.label}</span>
                      {addr.id === selectedAddressId && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(251,191,36,0.12)', color: '#FBBF24' }}>Default</span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{addr.fullAddress}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{addr.city} - {addr.pincode}</p>
                  </div>
                  <button onClick={() => setSelectedAddress(addr.id)}
                    className="text-xs font-bold flex-shrink-0"
                    style={{ color: addr.id === selectedAddressId ? '#10B981' : '#FBBF24' }}>
                    {addr.id === selectedAddressId ? '✓ Selected' : 'Select'}
                  </button>
                </div>
              </div>
            ))}

            {/* Add Address Form */}
            {showAddAddress && (
              <div className="rounded-2xl border p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(251,191,36,0.15)' }}>
                <h3 className="text-sm font-bold text-white">Add New Address</h3>
                <div className="flex gap-2">
                  {['Home', 'Work', 'Other'].map(l => (
                    <button key={l} onClick={() => setNewAddress(a => ({ ...a, label: l }))}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
                      style={{
                        background: newAddress.label === l ? '#FBBF24' : 'rgba(255,255,255,0.04)',
                        color: newAddress.label === l ? '#000' : 'rgba(255,255,255,0.5)',
                        borderColor: newAddress.label === l ? '#FBBF24' : 'rgba(255,255,255,0.08)',
                      }}>
                      {l}
                    </button>
                  ))}
                </div>
                <input value={newAddress.fullAddress} onChange={e => setNewAddress(a => ({ ...a, fullAddress: e.target.value }))}
                  placeholder="Full address (street, area)" className="input-glass text-sm" />
                <div className="flex gap-2">
                  <select value={newAddress.city} onChange={e => setNewAddress(a => ({ ...a, city: e.target.value }))}
                    className="input-glass text-sm flex-1">
                    <option value="Thanjavur">Thanjavur</option>
                    <option value="Kumbakonam">Kumbakonam</option>
                  </select>
                  <input value={newAddress.pincode} onChange={e => setNewAddress(a => ({ ...a, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                    placeholder="Pincode" className="input-glass text-sm flex-1" maxLength={6} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowAddAddress(false)} className="btn-secondary flex-1 py-2.5 text-sm">Cancel</button>
                  <button onClick={handleAddAddress} disabled={addingAddress} className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-60">
                    {addingAddress ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </div>
            )}

            {!showAddAddress && (
              <button onClick={() => setShowAddAddress(true)}
                className="w-full rounded-2xl border p-4 flex items-center justify-center gap-2 transition-all hover:border-white/15"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)', borderStyle: 'dashed' }}>
                <span className="text-yellow-400 text-lg">+</span>
                <span className="text-sm font-bold text-yellow-400">Add New Address</span>
              </button>
            )}
          </div>
        )}

        {/* Logout */}
        <button onClick={handleLogout}
          className="w-full rounded-2xl border p-4 flex items-center justify-center gap-2 transition-all hover:border-red-500/20"
          style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.15)' }}>
          <span className="text-sm font-bold text-red-400">🚪 Logout</span>
        </button>

      </div>
    </main>
  );
}
