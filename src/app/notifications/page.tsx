'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { markNotificationRead, markAllNotificationsRead } from '@/lib/firebaseService';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const { notifications, setNotifications, user } = useStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = async (notifId: string) => {
    if (!user) return;
    try {
      await markNotificationRead(user.uid, notifId!);
      setNotifications(notifications.map(n => n.id === notifId ? { ...n, read: true } : n));
    } catch {
      // silent fail — UI already updated optimistically
    }
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    try {
      await markAllNotificationsRead(user.uid);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const formatTime = (ts: any) => {
    if (!ts) return '';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 172800) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <main className="min-h-screen app-bg pb-24 md:pb-8">
      <header className="sticky top-0 z-50 header-glass">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="btn-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <h1 className="font-bold text-white flex-1">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-400 text-black text-[10px] font-black rounded-full">{unreadCount}</span>
            )}
          </h1>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="text-xs text-yellow-400 font-semibold hover:text-yellow-300 transition-colors">
              Mark all read
            </button>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-4">
        {!user ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔐</div>
            <h3 className="text-lg font-bold text-white/60">Login to see notifications</h3>
            <Link href="/auth/login" className="btn-primary mt-5 inline-flex">Login →</Link>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-lg font-bold text-white/60">No notifications yet</h3>
            <p className="text-sm text-white/30 mt-1">We&apos;ll notify you about orders, offers &amp; more</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map(n => (
              <button key={n.id} onClick={() => !n.read && handleMarkRead(n.id!)}
                className={`w-full text-left rounded-2xl border p-4 flex items-start gap-3 transition-all hover:border-white/15 ${!n.read ? 'border-yellow-400/15' : 'border-white/[0.06]'}`}
                style={{ background: !n.read ? 'rgba(251,191,36,0.03)' : 'rgba(255,255,255,0.02)' }}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${!n.read ? 'bg-yellow-400/15' : 'bg-white/[0.04]'}`}>
                  {n.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-bold ${!n.read ? 'text-white' : 'text-white/70'}`}>{n.title}</p>
                    <span className="text-[10px] text-white/30 flex-shrink-0">{formatTime(n.createdAt)}</span>
                  </div>
                  <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{n.body}</p>
                  {n.orderId && (
                    <Link href="/orders" onClick={e => e.stopPropagation()}
                      className="text-[10px] text-yellow-400 font-bold mt-1 inline-block hover:text-yellow-300">
                      View Order →
                    </Link>
                  )}
                </div>
                {!n.read && <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0 mt-1" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
