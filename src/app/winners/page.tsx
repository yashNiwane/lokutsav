import React from 'react';
import { dataStore } from '@/lib/db';
import { Trophy, Award, MapPin, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function WinnersPage() {
  const allEntries = await dataStore.getAllEntries();
  const winners = allEntries
    .filter((e) => e.finalRank && e.finalRank <= 10)
    .sort((a, b) => (a.finalRank || 99) - (b.finalRank || 99));

  // Top 3 Champions
  const top3 = winners.slice(0, 3);
  // Ranks 4 to 10
  const others = winners.slice(3, 10);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return {
        label: 'महाविजेता • प्रथम क्रमांक #१',
        prize: '₹५१,००० रोख + सुवर्ण ट्रॉफी',
        border: 'border-amber-400 bg-gradient-to-br from-amber-500/10 via-amber-100/40 to-amber-50',
        badgeColor: 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black',
      };
    }
    if (rank === 2) {
      return {
        label: 'द्वितीय क्रमांक #२',
        prize: '₹३१,००० रोख + रजत ट्रॉफी',
        border: 'border-slate-300 bg-gradient-to-br from-slate-100 via-stone-50 to-white',
        badgeColor: 'bg-gradient-to-r from-slate-600 to-slate-700 text-white font-black',
      };
    }
    if (rank === 3) {
      return {
        label: 'तृतीय क्रमांक #३',
        prize: '₹२१,००० रोख + कांस्य ट्रॉफी',
        border: 'border-amber-700/30 bg-gradient-to-br from-amber-900/5 via-stone-50 to-white',
        badgeColor: 'bg-gradient-to-r from-amber-700 to-amber-800 text-white font-black',
      };
    }
    return {
      label: `मानाचा क्रमांक #${rank}`,
      prize: '₹५,००० रोख पारितोषिक',
      border: 'border-stone-200 bg-white',
      badgeColor: 'bg-stone-800 text-white font-bold',
    };
  };

  return (
    <div className="py-12 sm:py-20 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-100/90 border border-amber-300 px-4 py-1.5 rounded-full text-amber-950 text-xs sm:text-sm font-bold shadow-2xs">
            <Trophy className="w-4 h-4 text-[#9B1B1E]" />
            <span>लोकोत्सव २०२६ • अधिकृत निकाल व महाविजेते</span>
          </div>

          <h1 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-[#1C1917] tracking-tight">
            १० महाविजेते व सजावट संकल्पना
          </h1>

          <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
            महाराष्ट्र राज्यस्तरीय लोकोत्सव २०२६ ऑनलाइन गणेश सजावट स्पर्धेतील तज्ज्ञ ज्युरी मंडळाने निवडलेले अव्वल १० विजेते स्पर्धक आणि त्यांच्या नाविन्यपूर्ण कलात्मक देखाव्यांची संकल्पना.
          </p>
        </div>

        {/* Top 3 Champions Section (Zero Images) */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-amber-600" />
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
              अव्वल ३ महाविजेते (Top 3 Grand Champions)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {top3.map((entry) => {
              const meta = getRankBadge(entry.finalRank || 1);
              const isFirst = entry.finalRank === 1;

              return (
                <div
                  key={entry.id}
                  className={`rounded-3xl p-6 sm:p-7 border-2 ${meta.border} shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden ${
                    isFirst ? 'md:-translate-y-2 shadow-md border-amber-400' : ''
                  }`}
                >
                  <div className="space-y-4">
                    {/* Rank Badge & Ticket */}
                    <div className="flex items-center justify-between gap-2 border-b border-stone-200/80 pb-3">
                      <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider ${meta.badgeColor}`}>
                        {meta.label}
                      </span>
                      <span className="font-mono text-xs font-bold text-stone-500">
                        {entry.ticketId}
                      </span>
                    </div>

                    {/* Participant Name */}
                    <div>
                      <h3 className="font-serif font-black text-xl sm:text-2xl text-[#1C1917] tracking-wide">
                        {entry.fullName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#9B1B1E]" />
                        <span>{entry.city || entry.district}, महाराष्ट्र</span>
                      </div>
                    </div>

                    {/* Category pill */}
                    <div>
                      <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-800 border border-stone-200">
                        {entry.category === 'HOUSEHOLD' ? 'घरगुती गणेश सजावट' : 'सार्वजनिक गणेशोत्सव मंडळ'}
                      </span>
                    </div>

                    {/* Decoration Idea / Concept Box */}
                    <div className="bg-white/85 backdrop-blur-xs rounded-2xl p-4 border border-amber-200/80 space-y-2">
                      <div className="flex items-center gap-1.5 text-amber-900 text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>सजावट संकल्पना (Decoration Idea)</span>
                      </div>
                      <h4 className="font-serif font-bold text-base sm:text-lg text-stone-900 leading-snug">
                        {entry.themeTitle}
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                        {entry.themeDescription}
                      </p>
                      {entry.materialsUsed && (
                        <p className="text-[11px] text-stone-500 pt-1 border-t border-amber-100">
                          <strong className="text-stone-700">वापरलेले साहित्य:</strong> {entry.materialsUsed}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Prize Footer */}
                  <div className="mt-5 pt-4 border-t border-stone-200/80">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block mb-0.5">
                      प्राप्त पारितोषिक:
                    </span>
                    <p className="font-serif font-black text-lg sm:text-xl text-[#9B1B1E]">
                      {meta.prize}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4th to 10th Place Winners (Zero Images) */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-amber-600" />
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
              गुणवत्ता पुरस्कार (४था ते १०वा क्रमांक)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {others.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs hover:shadow-md transition-shadow space-y-3.5"
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs bg-stone-900 text-white px-2.5 py-1 rounded-lg">
                      #{entry.finalRank}
                    </span>
                    <span className="font-bold text-sm sm:text-base text-stone-900">
                      {entry.fullName}
                    </span>
                  </div>
                  <span className="font-serif font-black text-sm text-[#9B1B1E]">
                    ₹५,००० रोख
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{entry.city || entry.district}</span>
                  </span>
                  <span>•</span>
                  <span className="font-mono font-medium">{entry.ticketId}</span>
                  <span>•</span>
                  <span className="font-medium text-stone-600">
                    {entry.category === 'HOUSEHOLD' ? 'घरगुती' : 'सार्वजनिक मंडळ'}
                  </span>
                </div>

                {/* Decoration Concept */}
                <div className="bg-[#FAF7F2] rounded-xl p-3.5 border border-amber-200/60 space-y-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-900 uppercase">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>सजावट संकल्पना:</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-stone-900">
                    {entry.themeTitle}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {entry.themeDescription}
                  </p>
                  {entry.materialsUsed && (
                    <p className="text-[10.5px] text-stone-500 pt-1">
                      <strong className="text-stone-700">साहित्य:</strong> {entry.materialsUsed}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-8 border-t border-amber-200/80">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#9B1B1E] hover:bg-[#781416] text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-105"
          >
            <span>मुख्यपृष्ठावर परत जा</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
