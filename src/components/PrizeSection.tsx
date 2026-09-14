'use client';

import React from 'react';
import { useLanguage } from '@/lib/language-context';
import { OFFICIAL_PRIZES } from '@/lib/seed-data';
import { Trophy, Gift, Award, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PrizeSection() {
  const { lang, t } = useLanguage();

  return (
    <section id="prizes" className="py-20 bg-white border-b border-[#E5D7C0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9B1B1E] bg-red-50 border border-red-200 px-3 py-1 rounded-full">
            {t.prizesSection.badge}
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
            {t.prizesSection.title}
          </h2>
          <p className="text-stone-600 text-base">
            {t.prizesSection.subtitle}
          </p>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {OFFICIAL_PRIZES.slice(0, 3).map((prize) => {
            const isFirst = prize.rank === 1;
            return (
              <div
                key={prize.rank}
                className={`relative rounded-2xl p-6 sm:p-8 transition-all ${
                  isFirst
                    ? 'bg-[#FAF7F2] border-2 border-amber-500 shadow-md md:-translate-y-2'
                    : 'bg-white border border-[#E5D7C0] shadow-xs hover:border-amber-400/60'
                }`}
              >
                {isFirst && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-600 text-white font-bold text-xs px-4 py-1 rounded-full uppercase tracking-wider shadow-xs">
                    ★ राज्य महाविजेता ★
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${prize.badgeColor}`}>
                    #{prize.rank}
                  </span>
                  <Trophy
                    className={`w-8 h-8 ${
                      prize.rank === 1
                        ? 'text-amber-500'
                        : prize.rank === 2
                        ? 'text-slate-400'
                        : 'text-amber-700'
                    }`}
                  />
                </div>

                <h3 className="font-serif font-bold text-xl text-stone-900 mb-2">
                  {lang === 'mr' ? prize.titleMr : prize.title}
                </h3>

                <div className="my-5 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
                  <span className="text-xs uppercase font-bold text-amber-900 block mb-0.5">
                    रोख बक्षीस / Cash Prize
                  </span>
                  <p className="font-serif text-3xl font-black text-[#9B1B1E]">
                    {lang === 'mr' ? prize.cashTextMr : prize.cashText}
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs text-stone-700 font-medium">
                  {(lang === 'mr' ? prize.perksMr : prize.perks).map((perk, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* 4th to 10th Prize Banner Card */}
        <div className="bg-[#FAF7F2] rounded-2xl p-6 sm:p-8 border border-[#E5D7C0] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-200/60 px-2.5 py-1 rounded">
              <Award className="w-4 h-4 text-amber-800" />
              <span>4था ते 10वा मानाचा क्रमांक (7 विजेते)</span>
            </div>
            <h3 className="font-serif font-black text-2xl text-stone-900">
              प्रत्येकी ₹5,000 रोख + महा लोकोत्सव सन्मानचिन्ह
            </h3>
            <p className="text-sm text-stone-600 max-w-2xl">
              4थ्या ते 10व्या क्रमांकाच्या प्रत्येक स्पर्धकाला ₹5,000 रोख, महा लोकोत्सव सन्मानचिन्ह आणि अधिकृत गुणवत्ता सन्मानपत्र प्रदान केले जाईल.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#9B1B1E] hover:bg-[#781416] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all"
            >
              <span>नोंदणी करा (₹99)</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
