'use client';

import React from 'react';
import { useLanguage } from '@/lib/language-context';
import { JUDGING_CRITERIA_LIST } from '@/lib/seed-data';
import { Sparkles, Palette, Leaf, Sun, Award } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-6 h-6 text-amber-600" />,
  Palette: <Palette className="w-6 h-6 text-[#9B1B1E]" />,
  Leaf: <Leaf className="w-6 h-6 text-emerald-700" />,
  Sun: <Sun className="w-6 h-6 text-amber-700" />,
  Award: <Award className="w-6 h-6 text-indigo-700" />,
};

export default function CriteriaSection() {
  const { lang, t } = useLanguage();

  return (
    <section id="criteria" className="py-20 bg-[#FAF7F2] border-b border-[#E5D7C0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
            {t.criteriaSection.badge}
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
            {t.criteriaSection.title}
          </h2>
          <p className="text-stone-600 text-base">
            {t.criteriaSection.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {JUDGING_CRITERIA_LIST.map((crit, idx) => (
            <div
              key={crit.id}
              className="bg-white rounded-xl p-6 border border-[#E5D7C0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center mb-4">
                  {iconMap[crit.iconName] || <Sparkles className="w-6 h-6 text-amber-600" />}
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-400">#0{idx + 1}</span>
                  <span className="text-xs font-extrabold text-[#9B1B1E] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    {Math.round(crit.weight * 100)}% भारांक
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-stone-900 mb-2 leading-snug">
                  {lang === 'mr' ? crit.nameMr : crit.name}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {lang === 'mr' ? crit.descriptionMr : crit.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-stone-500">
                <span>कमाल गुण: {crit.maxScore}/10</span>
                <span className="text-emerald-700">पारदर्शक</span>
              </div>
            </div>
          ))}
        </div>

        {/* Eco-friendly announcement banner */}
        <div className="mt-10 p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center gap-3 text-emerald-900 text-xs sm:text-sm font-medium">
          <Leaf className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>
            <strong>पर्यावरणपूरक संदेश:</strong> शाडू मातीची मूर्ती, नैसर्गिक फुले व कागदी लगद्याच्या सजावटींना गुणदानात विशेष प्राधान्य (20% थेट गुण) दिले जाईल.
          </span>
        </div>
      </div>
    </section>
  );
}
