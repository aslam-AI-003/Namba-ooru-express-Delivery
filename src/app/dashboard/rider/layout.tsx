'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Wallet, CalendarClock, Trophy, User,
} from 'lucide-react';

const RIDER_NAV = [
  { href: '/dashboard/rider', icon: LayoutDashboard, label: 'Home' },
  { href: '/dashboard/rider/earnings', icon: Wallet, label: 'Earnings' },
  { href: '/dashboard/rider/schedule', icon: CalendarClock, label: 'Schedule' },
  { href: '/dashboard/rider/incentives', icon: Trophy, label: 'Quests' },
  { href: '/dashboard/rider/profile', icon: User, label: 'Profile' },
];

export default function RiderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen" style={{ background: 'var(--app-bg)' }}>
      {children}

      {/* ━━━ RIDER BOTTOM NAVIGATION ━━━ */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-3 mb-3 rounded-2xl border shadow-2xl backdrop-blur-xl"
          style={{ background: 'rgba(18, 18, 18, 0.92)', borderColor: 'rgba(255, 193, 7, 0.15)' }}>
          <div className="flex items-center justify-around py-2">
            {RIDER_NAV.map(item => {
              const isActive = pathname === item.href || (item.href !== '/dashboard/rider' && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                    isActive ? 'text-[#ffc107] scale-105' : 'text-gray-400 hover:text-gray-200'
                  }`}>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className={`text-[9px] font-bold ${isActive ? 'text-[#ffc107]' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-0.5 w-5 h-0.5 rounded-full bg-[#ffc107]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
