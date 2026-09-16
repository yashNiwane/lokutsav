'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/language-context';
import { Sparkles, Menu, X, Award, Image as ImageIcon, Scale, FileText, CheckCircle2 } from 'lucide-react';

export default function Header() {
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative md:sticky md:top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E5D7C0] transition-colors">
      {/* Top micro-banner */}
      <div className="bg-[#9B1B1E] text-[#FFF9F0] text-xs font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>{t.brand.badgeLive} • {t.brand.dates}</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Instagram link */}
            <a
              href="https://www.instagram.com/lok_utsav/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-amber-200 hover:text-white transition-colors text-xs font-semibold group"
              title="Follow @lok_utsav on Instagram"
            >
              <div className="w-4 h-4 rounded-xs bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-[1px] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </div>
              <span className="hidden sm:inline">@lok_utsav</span>
            </a>

            {/* Facebook link */}
            <a
              href="https://www.facebook.com/profile.php?id=61594462049628"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-amber-200 hover:text-white transition-colors text-xs font-semibold group"
              title="Follow Lok Utsav on Facebook"
            >
              <div className="w-4 h-4 rounded-xs bg-[#1877F2] p-[1px] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <span className="hidden md:inline">Facebook</span>
            </a>

            <span className="hidden lg:inline font-medium text-amber-200">
              {t.brand.entryFee}
            </span>
            {/* Language Switcher */}
            <div className="inline-flex items-center bg-black/20 rounded border border-amber-300/30 p-0.5 text-xs">
              <button
                onClick={() => setLang('mr')}
                className={`px-2 py-0.5 rounded font-semibold transition-all ${
                  lang === 'mr'
                    ? 'bg-amber-400 text-stone-900 shadow-xs'
                    : 'text-amber-100 hover:text-white'
                }`}
                aria-label="मराठी मध्ये पहा"
              >
                मराठी
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded font-semibold transition-all ${
                  lang === 'en'
                    ? 'bg-amber-400 text-stone-900 shadow-xs'
                    : 'text-amber-100 hover:text-white'
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-xs border border-[#E5D7C0] bg-white group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center p-1">
            <Image
              src="/logo.png"
              alt="Lokutsav Logo"
              width={48}
              height={48}
              priority
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-black text-2xl text-[#9B1B1E] tracking-tight">
                {t.brand.name}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                2026
              </span>
            </div>
            <p className="text-[11px] text-stone-600 font-medium line-clamp-1">
              {t.brand.subtitle}
            </p>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-stone-700">
          <Link href="/#prizes" className="hover:text-[#9B1B1E] transition-colors">
            {t.nav.prizes}
          </Link>
          <Link href="/#criteria" className="hover:text-[#9B1B1E] transition-colors">
            {t.nav.criteria}
          </Link>
          <Link href="/#how-to-enter" className="hover:text-[#9B1B1E] transition-colors text-amber-800">
            {t.nav.howToEnter}
          </Link>
          <Link href="/#rules" className="hover:text-[#9B1B1E] transition-colors">
            {t.nav.rules}
          </Link>
          <Link href="/referral" className="hover:text-[#9B1B1E] transition-colors flex items-center gap-1 text-amber-800 font-bold">
            <span>🎁</span>
            <span>{lang === 'mr' ? 'रेफरल' : 'Referral'}</span>
          </Link>
        </nav>

        {/* Action button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/analytics"
            className="text-xs font-semibold px-2.5 py-2 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors border border-[#E5D7C0]"
          >
            📊 {lang === 'mr' ? 'ॲनालिटिक्स' : 'Analytics'}
          </Link>
          <Link
            href="/judging"
            className="text-xs font-semibold px-3 py-2 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors border border-[#E5D7C0]"
          >
            {t.nav.judgingPortal}
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-[#9B1B1E] hover:bg-[#781416] text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all hover:shadow-md active:scale-98"
          >
            <span>{t.nav.registerNow}</span>
            <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded font-mono">₹99</span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/register"
            className="hidden sm:inline-flex bg-[#9B1B1E] text-white text-xs font-bold px-3 py-1.5 rounded-md whitespace-nowrap shrink-0"
          >
            {t.nav.registerNow} (₹99)
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-700 hover:text-stone-900 rounded-md"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5D7C0] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
            <Link
              href="/#prizes"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800"
            >
              {t.nav.prizes}
            </Link>
            <Link
              href="/#criteria"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800"
            >
              {t.nav.criteria}
            </Link>
            <Link
              href="/#how-to-enter"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800"
            >
              {t.nav.howToEnter}
            </Link>
            <Link
              href="/#rules"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800"
            >
              {t.nav.rules}
            </Link>
            <Link
              href="/referral"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-md bg-amber-100/70 hover:bg-amber-100 text-amber-950 font-bold flex items-center justify-between"
            >
              <span>{lang === 'mr' ? '🎁 रेफरल रिवॉर्ड्स (Refer & Win)' : '🎁 Refer & Win Rewards'}</span>
              <span className="text-[10px] bg-amber-300 text-stone-900 px-2 py-0.5 rounded font-bold">New</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-stone-200 flex flex-col gap-2">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-[#9B1B1E] text-white font-bold py-3 rounded-lg text-sm shadow-xs"
            >
              {t.nav.registerNow} (₹99)
            </Link>
            <Link
              href="/analytics"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-xs font-semibold py-2 text-stone-600 bg-stone-100 rounded-md"
            >
              📊 {lang === 'mr' ? 'वेबसाईट ॲनालिटिक्स' : 'Website Analytics'}
            </Link>
            <Link
              href="/judging"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-xs font-semibold py-2 text-stone-600 bg-stone-100 rounded-md"
            >
              {t.nav.judgingPortal}
            </Link>
            <a
              href="https://www.instagram.com/lok_utsav/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-stone-700 hover:text-pink-600 bg-stone-50 border border-stone-200 rounded-md transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-pink-600">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span>Follow @lok_utsav on Instagram</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
