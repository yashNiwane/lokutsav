'use client';

import React from 'react';
import { useLanguage } from '@/lib/language-context';
import { SPONSORS_LIST } from '@/lib/seed-data';
import Link from 'next/link';
import { Award, Sparkles, ExternalLink, Handshake } from 'lucide-react';

export default function SponsorsSection() {
  const { lang, t } = useLanguage();

  return (
    <section id="sponsors" className="py-20 bg-[#FAF7F2] border-b border-[#E5D7C0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
            {t.sponsorsSection.badge}
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
            {t.sponsorsSection.title}
          </h2>
          <p className="text-stone-600 text-base">
            {t.sponsorsSection.subtitle}
          </p>
        </div>

        {/* Sponsor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {SPONSORS_LIST.map((sponsor) => (
            <div
              key={sponsor.id}
              className="bg-white rounded-xl p-6 border border-[#E5D7C0] shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                    {sponsor.tier}
                  </span>
                  {sponsor.websiteUrl && (
                    <a
                      href={sponsor.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-400 hover:text-stone-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="h-14 flex items-center justify-center bg-stone-50 rounded-lg p-2 mb-4 border border-stone-100">
                  <span className="font-serif font-black text-lg text-[#9B1B1E] text-center">
                    {sponsor.name}
                  </span>
                </div>

                <div className="mb-3">
                  <span className="text-xs font-bold text-amber-800 block">
                    {lang === 'mr' ? sponsor.sponsoredCategoryMr : sponsor.sponsoredCategory}
                  </span>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {lang === 'mr' ? sponsor.descriptionMr : sponsor.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>अधिकृत सन्मानित भागीदार</span>
              </div>
            </div>
          ))}
        </div>

        {/* Call for Sponsorships Banner */}
        <div className="bg-[#1C1917] text-white rounded-2xl p-8 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400">
              <Handshake className="w-4 h-4" />
              <span>ब्रँड प्रायोजकत्व संधी 2026</span>
            </div>
            <h3 className="font-serif font-black text-2xl">
              आपल्या ब्रँडला महाराष्ट्रातील लाखो भाविक व घराघरांपर्यंत पोहोचवा
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 max-w-2xl">
              बक्षीस प्रवर्ग प्रायोजकत्व, प्रॉडक्ट गिफ्टिंग आणि डिजिटल प्रसिद्धीसाठी आमच्या आयोजक समितीशी संपर्क साधा.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/sponsors"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-3 rounded-xl text-sm transition-all"
            >
              <span>{t.sponsorsSection.becomeSponsor}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
