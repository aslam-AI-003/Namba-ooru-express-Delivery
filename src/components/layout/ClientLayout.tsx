'use client';

import React, { useEffect, useRef } from 'react';
import BottomNav from '@/components/ui/BottomNav';
import { usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useStore } from '@/store/useStore';
import {
  getUserProfile,
  getUserAddresses,
  subscribeToUserOrders,
  subscribeToWallet,
  subscribeToNotifications,
  getFavoriteShops,
} from '@/lib/firebaseService';

// Pages that should NOT show bottom nav
const NO_BOTTOM_NAV = ['/auth/login', '/auth/register'];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showBottomNav = !NO_BOTTOM_NAV.some(p => pathname.startsWith(p));

  const {
    setUser,
    logout,
    setWalletBalance,
    setWalletTransactions,
    setOrders,
    setNotifications,
    setAddresses,
    setFavoriteShopIds,
    setSelectedAddress,
  } = useStore();

  // Keep refs to unsubscribe Firestore listeners on logout
  const unsubOrdersRef = useRef<(() => void) | null>(null);
  const unsubWalletRef = useRef<(() => void) | null>(null);
  const unsubNotifsRef = useRef<(() => void) | null>(null);

  const cleanupListeners = () => {
    unsubOrdersRef.current?.();
    unsubWalletRef.current?.();
    unsubNotifsRef.current?.();
    unsubOrdersRef.current = null;
    unsubWalletRef.current = null;
    unsubNotifsRef.current = null;
  };

  useEffect(() => {
    // Listen to Firebase Auth state changes — this is the single source of truth
    if (!auth) return;
    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // ── User is logged in ──────────────────────────────────
        // 1. Fetch user profile from Firestore
        const profile = await getUserProfile(firebaseUser.uid);

        setUser({
          uid: firebaseUser.uid,
          displayName: profile?.name || firebaseUser.displayName || 'User',
          phone: profile?.phone || firebaseUser.phoneNumber || '',
          email: profile?.email || firebaseUser.email || '',
          photoURL: profile?.photoURL || firebaseUser.photoURL || '',
          role: profile?.role || 'customer',
        });

        // 2. Set wallet balance from profile
        if (profile) {
          setWalletBalance(profile.walletBalance ?? 0);
        }

        // 3. Load addresses
        const addresses = await getUserAddresses(firebaseUser.uid);
        if (addresses.length > 0) {
          setAddresses(addresses);
          const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
          setSelectedAddress(defaultAddr.id);
        }

        // 4. Load favorite shops
        const favIds = await getFavoriteShops(firebaseUser.uid);
        setFavoriteShopIds(favIds);

        // 5. Subscribe to real-time orders
        unsubOrdersRef.current = subscribeToUserOrders(firebaseUser.uid, (orders) => {
          setOrders(orders);
        });

        // 6. Subscribe to real-time wallet
        unsubWalletRef.current = subscribeToWallet(firebaseUser.uid, (balance, txs) => {
          setWalletBalance(balance);
          setWalletTransactions(txs);
        });

        // 7. Subscribe to real-time notifications
        unsubNotifsRef.current = subscribeToNotifications(firebaseUser.uid, (notifs) => {
          setNotifications(notifs);
        });

      } else {
        // ── User is logged out ─────────────────────────────────
        cleanupListeners();
        logout();
      }
    });

    return () => {
      unsubAuth();
      cleanupListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {children}
      {showBottomNav && <BottomNav />}
    </>
  );
}
