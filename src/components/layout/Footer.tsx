'use client';

import React from 'react';
import Link from 'next/link';
import { APP_NAME, SUPPORT_PHONE, SUPPORT_EMAIL } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                <span className="text-xl">🛵</span>
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-white">
                  Namma Ooru <span className="text-primary-500">Express</span>
                </h3>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Neenga Sollunga... Naanga Deliver Pannuvom! Your trusted hyperlocal delivery partner.
            </p>
            <div className="flex items-center gap-3">
              <a href={`tel:${SUPPORT_PHONE}`} className="w-9 h-9 bg-dark-400 rounded-lg flex items-center justify-center hover:bg-primary-500/20 transition-colors">
                <span>📞</span>
              </a>
              <a href={`https://wa.me/91${SUPPORT_PHONE}`} className="w-9 h-9 bg-dark-400 rounded-lg flex items-center justify-center hover:bg-green-500/20 transition-colors">
                <span>💬</span>
              </a>
              <a href="https://instagram.com/namba_ooru_delivery" className="w-9 h-9 bg-dark-400 rounded-lg flex items-center justify-center hover:bg-pink-500/20 transition-colors">
                <span>📷</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/shops" className="text-gray-400 hover:text-primary-500 text-sm transition-colors">Browse Shops</Link></li>
              <li><Link href="/track" className="text-gray-400 hover:text-primary-500 text-sm transition-colors">Track Order</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-primary-500 text-sm transition-colors">Categories</Link></li>
              <li><Link href="/offers" className="text-gray-400 hover:text-primary-500 text-sm transition-colors">Offers</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-primary-500 text-sm transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Partner */}
          <div>
            <h4 className="text-white font-semibold mb-4">Partner with Us</h4>
            <ul className="space-y-2">
              <li><Link href="/shop/register" className="text-gray-400 hover:text-primary-500 text-sm transition-colors">Register Your Shop</Link></li>
              <li><Link href="/rider/register" className="text-gray-400 hover:text-primary-500 text-sm transition-colors">Become a Rider</Link></li>
              <li><Link href="/franchise" className="text-gray-400 hover:text-primary-500 text-sm transition-colors">Franchise</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-primary-500 text-sm transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <span>📞</span>
                <a href={`tel:${SUPPORT_PHONE}`} className="hover:text-primary-500 transition-colors">{SUPPORT_PHONE}</a>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <span>✉️</span>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-primary-500 transition-colors">{SUPPORT_EMAIL}</a>
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <span>📍</span>
                <span>Thanjavur & Kumbakonam, Tamil Nadu</span>
              </li>
            </ul>

            {/* Delivery Rates */}
            <div className="mt-4 p-3 bg-dark-400 rounded-xl">
              <p className="text-xs font-semibold text-primary-500 mb-2">Affordable Rates</p>
              <div className="space-y-1 text-xs text-gray-400">
                <p>📍 0-2 KM → ₹30</p>
                <p>📍 2-5 KM → ₹50</p>
                <p>📍 5-8 KM → ₹80</p>
                <p>📍 8+ KM → ₹10/KM extra</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-dark-50/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Terms of Service</Link>
            <Link href="/refund" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
