'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart, language, setLanguage, isAuthenticated } = useStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-dark-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-xl md:text-2xl">🛵</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold font-display text-white">
                Namma Ooru <span className="text-primary-500">Express</span>
              </h1>
              <p className="text-xs text-gray-500 -mt-0.5">Fast • Safe • Trusted</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/shops" className="nav-link">Shops</Link>
            <Link href="/track" className="nav-link">Track Order</Link>
            <Link href="/about" className="nav-link">About</Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'ta' ? 'en' : 'ta')}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-dark-400 rounded-lg text-sm font-medium text-gray-300 hover:text-primary-500 transition-colors"
            >
              {language === 'ta' ? 'EN' : 'தமிழ்'}
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-xl hover:bg-dark-400 transition-colors">
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-dark-900 text-xs font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Auth Button */}
            {isAuthenticated ? (
              <Link href="/profile" className="w-9 h-9 bg-primary-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            ) : (
              <Link href="/auth/login" className="btn-primary text-sm px-4 py-2">
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-dark-400 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-50/20 animate-slide-down">
            <nav className="flex flex-col gap-3">
              <Link href="/" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>🏠 Home</Link>
              <Link href="/shops" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>🏪 Shops</Link>
              <Link href="/track" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>📍 Track Order</Link>
              <Link href="/about" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>ℹ️ About</Link>
              <Link href="/partner" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>🛵 Become a Partner</Link>
              <Link href="/shop/register" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>🏪 Register Shop</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
