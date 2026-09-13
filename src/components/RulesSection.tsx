'use client';

import React from 'react';
import { useLanguage } from '@/lib/language-context';
import { CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import Link from 'next/link';

export default function RulesSection() {
  const { t } = useLanguage();

  const rulesList = [
    t.rules.r1,
    t.rules.r2,
    t.rules.r3,
    t.rules.r4,
    t.rules.r5,
    t.rules.r6,
  ];

  return (
    <section id="rules" className="py-20 bg-white border-b border-[#E5D7C0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9B1B1E] bg-red-50 border border-red-200 px-3 py-1 rounded-full">
            पारदर्शक नियमावली
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
            {t.rules.title}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            {t.rules.subtitle}
          </p>
        </div>

        <div className="bg-[#FAF7F2] rounded-2xl p-6 sm:p-8 border border-[#E5D7C0] space-y-4 shadow-xs">
          {rulesList.map((rule, idx) => (
            <div key={idx} className="flex items-start gap-3.5 pb-4 border-b border-stone-200/80 last:border-b-0 last:pb-0">
              <span className="w-6 h-6 rounded-full bg-[#9B1B1E] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-sm text-stone-800 leading-relaxed font-medium">
                {rule}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-[#9B1B1E] hover:bg-[#781416] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all"
          >
            <span>सर्व नियम मान्य आहेत - आताच नोंदणी करा (₹१९९)</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
