'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Trophy, Calendar, MapPin, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] border-b border-[#E5D7C0] pt-12 pb-20">
      {/* Decorative hairline traditional top border */}
      <div className="h-1 bg-gradient-to-r from-amber-600 via-[#9B1B1E] to-amber-700 w-full absolute top-0 left-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top Cultural Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>{t.hero.announcement}</span>
          </div>
        </div>

        {/* Main Headline & Story */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-[#1C1917] tracking-tight leading-[1.18]">
            {t.hero.headline}
          </h1>

          <p className="text-base sm:text-xl text-stone-700 max-w-3xl mx-auto font-normal leading-relaxed">
            {t.hero.subheadline}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#9B1B1E] hover:bg-[#781416] text-white px-8 py-4 rounded-xl text-base font-bold shadow-md hover:shadow-lg transition-all active:scale-98"
            >
              <span>{t.hero.registerCta}</span>
              <ArrowRight className="w-5 h-5 text-amber-300" />
            </Link>

            <Link
              href="/gallery"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-800 border-2 border-[#E5D7C0] px-6 py-4 rounded-xl text-base font-semibold shadow-2xs transition-all hover:border-amber-600/60"
            >
              <span>{t.hero.exploreGallery}</span>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-stone-500 pt-2 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              100% पारदर्शक ज्युरी परीक्षण
            </span>
            <span>•</span>
            <span>अधिकृत डिजिटल सहभाग प्रमाणपत्र</span>
            <span>•</span>
            <span>सर्व 36 जिल्हे पात्र</span>
          </div>
        </div>

        {/* Live Event Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto">
          <div className="bg-white p-5 rounded-xl border border-[#E5D7C0] shadow-xs text-center">
            <p className="text-xs uppercase font-bold tracking-wider text-stone-500 mb-1">
              {t.hero.statPrizePool}
            </p>
            <p className="font-serif text-2xl sm:text-3xl font-black text-[#9B1B1E]">
              ₹1,50,000+
            </p>
            <p className="text-[11px] text-stone-600 mt-1 font-medium">
              रोख रक्कम + मानाच्या ट्रॉफीज
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E5D7C0] shadow-xs text-center">
            <p className="text-xs uppercase font-bold tracking-wider text-stone-500 mb-1">
              {t.brand.entryFee}
            </p>
            <p className="font-serif text-2xl sm:text-3xl font-black text-amber-700">
              ₹199 मात्र
            </p>
            <p className="text-[11px] text-stone-600 mt-1 font-medium">
              सुलभ UPI व कार्ड पेमेंट्स
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E5D7C0] shadow-xs text-center">
            <p className="text-xs uppercase font-bold tracking-wider text-stone-500 mb-1">
              {t.hero.statDistricts}
            </p>
            <p className="font-serif text-2xl sm:text-3xl font-black text-stone-900">
              36 जिल्हे
            </p>
            <p className="text-[11px] text-stone-600 mt-1 font-medium">
              घरगुती व सार्वजनिक मंडळे
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E5D7C0] shadow-xs text-center">
            <p className="text-xs uppercase font-bold tracking-wider text-stone-500 mb-1">
              {t.hero.statWinners}
            </p>
            <p className="font-serif text-2xl sm:text-3xl font-black text-emerald-800">
              10 महाविजेते
            </p>
            <p className="text-[11px] text-stone-600 mt-1 font-medium">
              तज्ज्ञ ज्युरी मंडळाकडून निवड
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
