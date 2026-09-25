'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/language-context';
import { Trophy, Calendar, MapPin, Sparkles, ArrowRight, ShieldCheck, Award, Flame, Clock, Ticket } from 'lucide-react';
import TicketLookupModal from '@/components/TicketLookupModal';

export default function Hero() {
  const { lang, t } = useLanguage();
  const [lookupModalOpen, setLookupModalOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/50 via-[#FAF7F2] to-[#FAF7F2] border-b border-[#E5D7C0] pt-10 pb-20">
      {/* Decorative hairline traditional top border */}
      <div className="h-1.5 bg-gradient-to-r from-amber-600 via-[#9B1B1E] to-amber-700 w-full absolute top-0 left-0 shadow-xs" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Auspicious Invocation & Top Announcement Badge */}
        <div className="flex flex-col items-center justify-center gap-2.5 mb-6 text-center">
          <p className="text-amber-800/90 font-serif font-bold text-xs sm:text-sm tracking-widest uppercase">
            ॥ श्री गणेशाय नमः ॥
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-950 text-xs sm:text-sm font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#9B1B1E] animate-pulse" />
            <span>{t.hero.announcement}</span>
          </div>
        </div>

        {/* Main Headline & Story */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <h1 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-[#1C1917] tracking-tight leading-[1.18]">
            {t.hero.headline}
          </h1>

          <p className="text-base sm:text-xl text-stone-700 max-w-3xl mx-auto font-normal leading-relaxed">
            {t.hero.subheadline}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/certificate"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 px-6 py-4 rounded-xl text-base font-black shadow-md transition-all hover:scale-105 border border-amber-300 cursor-pointer"
            >
              <Award className="w-5 h-5 text-stone-950" />
              <span>{lang === 'mr' ? 'सहभाग प्रमाणपत्र डाउनलोड करा' : 'Download Certificate'}</span>
            </Link>

            <div className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#9B1B1E] text-white px-6 py-4 rounded-xl text-base font-bold shadow-md cursor-default border border-amber-400/50">
              <Clock className="w-5 h-5 text-amber-300 animate-pulse" />
              <span>{lang === 'mr' ? 'निकाल उद्या सायंकाळी ६ वा.' : 'Results Tomorrow 6 PM'}</span>
            </div>

            <button
              onClick={() => setLookupModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-800 border-2 border-stone-300 px-5 py-4 rounded-xl text-base font-bold shadow-2xs transition-all hover:border-[#9B1B1E] cursor-pointer"
            >
              <Ticket className="w-5 h-5 text-[#9B1B1E]" />
              <span>{lang === 'mr' ? 'तिकीट शोधा' : 'Find Ticket'}</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-stone-600 pt-2 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              {lang === 'mr' ? '100% पारदर्शक ज्युरी परीक्षण' : '100% Impartial Jury Evaluation'}
            </span>
            <span className="hidden sm:inline text-stone-400">•</span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-700" />
              {lang === 'mr' ? 'अधिकृत डिजिटल सहभाग प्रमाणपत्र' : 'Official Digital Certificate'}
            </span>
            <span className="hidden sm:inline text-stone-400">•</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#9B1B1E]" />
              {lang === 'mr' ? 'सर्व 36 जिल्हे पात्र' : 'Open Across All 36 Districts'}
            </span>
          </div>
        </div>

        {/* ================= DIVINE GANPATI FESTIVAL BANNER ================= */}
        <div className="mt-10 sm:mt-12 relative max-w-5xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-amber-300/80 shadow-xl sm:shadow-2xl bg-stone-950 group">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src="/ganpati-hero-banner.jpg"
              alt={lang === 'mr' ? 'लोकोत्सव २०२६ गणपती सजावट महास्पर्धा' : 'Lokutsav 2026 Ganpati Decoration Competition'}
              fill
              priority
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
            />
            {/* Elegant Cultural Lighting Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/30 to-stone-950/40 pointer-events-none" />

            {/* Top Badge Overlay */}
            <div className="absolute top-3 sm:top-5 left-3 sm:left-5 right-3 sm:right-5 flex items-center justify-between gap-2 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-950/75 backdrop-blur-md border border-amber-400/50 text-amber-300 text-[11px] sm:text-xs font-bold shadow-lg">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                {lang === 'mr' ? '॥ गणपती बाप्पा मोरया ॥' : '॥ Shree Ganeshaya Namah ॥'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#9B1B1E]/90 backdrop-blur-md border border-amber-300/40 text-white text-[11px] sm:text-xs font-bold shadow-lg">
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>{lang === 'mr' ? '₹२,००,०००+ रोख बक्षिसे' : '₹2,00,000+ Cash Rewards'}</span>
              </span>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
              <div className="space-y-1">
                <p className="text-amber-300 text-xs sm:text-sm font-semibold tracking-wider uppercase drop-shadow-sm flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'mr' ? 'महाराष्ट्र राज्यस्तरीय महामहोत्सव २०२६' : 'Maharashtra State-Level Mahamanch 2026'}</span>
                </p>
                <h3 className="font-serif font-black text-lg sm:text-2xl text-white drop-shadow-md">
                  {lang === 'mr' ? 'घरोघरी गणपती, परंपरेची भव्य कलाकृती' : "Celebrating Maharashtra's Devotion & Artistry"}
                </h3>
                <p className="text-xs sm:text-sm text-stone-200/90 max-w-xl hidden sm:block drop-shadow-sm">
                  {lang === 'mr'
                    ? '३६ जिल्ह्यांमधील घरगुती आणि सार्वजनिक गणेशोत्सवासाठी महाराष्ट्राचे सर्वात मोठे ऑनलाइन सांस्कृतिक व्यासपीठ.'
                    : "Showcase your family and mandal decoration to millions of devotees across Maharashtra's 36 districts."}
                </p>
              </div>
              <button
                onClick={() => setLookupModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg border border-amber-300 transition-all hover:scale-105 active:scale-95 whitespace-nowrap self-start sm:self-auto cursor-pointer"
              >
                <Ticket className="w-4 h-4" />
                <span>{lang === 'mr' ? 'निकाल उद्या ६ वा. • तिकीट शोधा' : 'Results Tomorrow 6 PM • Find Ticket'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Event Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 sm:mt-12 max-w-5xl mx-auto">
          <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md transition-shadow text-center group">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-red-50 text-[#9B1B1E] flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <p className="text-[11px] sm:text-xs uppercase font-bold tracking-wider text-stone-500 mb-1">
              {t.hero.statPrizePool}
            </p>
            <p className="font-serif text-2xl sm:text-3xl font-black text-[#9B1B1E]">
              ₹2,00,000+
            </p>
            <p className="text-[11px] text-stone-600 mt-1 font-medium">
              {lang === 'mr' ? 'रोख रक्कम + मानाच्या ट्रॉफीज' : 'Cash Rewards + Trophies'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md transition-shadow text-center group">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-[11px] sm:text-xs uppercase font-bold tracking-wider text-stone-500 mb-1">
              {t.brand.entryFee}
            </p>
            <p className="font-serif text-2xl sm:text-3xl font-black text-amber-700">
              {lang === 'mr' ? '₹99 मात्र' : '₹99 Only'}
            </p>
            <p className="text-[11px] text-stone-600 mt-1 font-medium">
              {lang === 'mr' ? 'सुलभ UPI व कार्ड पेमेंट्स' : 'Instant UPI & Cards'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md transition-shadow text-center group">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <p className="text-[11px] sm:text-xs uppercase font-bold tracking-wider text-stone-500 mb-1">
              {t.hero.statDistricts}
            </p>
            <p className="font-serif text-2xl sm:text-3xl font-black text-stone-900">
              {lang === 'mr' ? '36 जिल्हे' : '36 Districts'}
            </p>
            <p className="text-[11px] text-stone-600 mt-1 font-medium">
              {lang === 'mr' ? 'घरगुती व सार्वजनिक मंडळे' : 'Household & Mandals'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md transition-shadow text-center group">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <p className="text-[11px] sm:text-xs uppercase font-bold tracking-wider text-stone-500 mb-1">
              {t.hero.statWinners}
            </p>
            <p className="font-serif text-2xl sm:text-3xl font-black text-emerald-800">
              {lang === 'mr' ? '10 महाविजेते' : '10 Champions'}
            </p>
            <p className="text-[11px] text-stone-600 mt-1 font-medium">
              {lang === 'mr' ? 'तज्ज्ञ ज्युरी मंडळाकडून निवड' : 'Judged by Official Jury'}
            </p>
          </div>
        </div>
      </div>

      <TicketLookupModal
        isOpen={lookupModalOpen}
        onClose={() => setLookupModalOpen(false)}
      />
    </section>
  );
}
