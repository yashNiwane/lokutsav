import React from 'react';
import { dataStore } from '@/lib/db';
import { isCompetitionActive, competitionConfig } from '@/lib/competition-config';
import { OFFICIAL_PRIZES } from '@/lib/seed-data';
import { Trophy, Award, Medal, MapPin, CheckCircle2, Clock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function WinnersPage() {
  const active = isCompetitionActive();
  const allEntries = await dataStore.getAllEntries();
  const winners = allEntries
    .filter((e) => e.finalRank && e.finalRank <= 10)
    .sort((a, b) => (a.finalRank || 99) - (b.finalRank || 99));

  const top3 = winners.slice(0, 3);
  const others = winners.slice(3, 10);

  // During active competition phase: show results awaiting announcement page
  if (active) {
    return (
      <div className="py-20 bg-[#FAF7F2] min-h-[85vh] flex items-center justify-center px-4">
        <div className="max-w-3xl w-full bg-white rounded-3xl p-8 sm:p-12 border border-[#E5D7C0] shadow-sm text-center space-y-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-2xs">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>स्पर्धा कालावधी सक्रिय</span>
            </div>

            <h1 className="font-serif font-black text-3xl sm:text-5xl text-stone-900 tracking-tight">
              निकाल लवकरच जाहीर केले जातील!
            </h1>

            <p className="text-stone-600 text-base max-w-xl mx-auto leading-relaxed">
              सध्या स्पर्धा सुरू असून तज्ज्ञ ज्युरी मंडळाकडून सर्व ३६ जिल्ह्यांतील देखाव्यांचे ५ निकषांवर अत्यंत काटेकोर व निष्पक्ष मूल्यमापन सुरू आहे.
            </p>
          </div>

          {/* Timeline & Announcement Card */}
          <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#E5D7C0] text-left space-y-4 max-w-xl mx-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                निकाल घोषणा तारीख:
              </span>
              <span className="font-serif font-black text-stone-900 text-base">
                {competitionConfig.announcementDateMr}
              </span>
            </div>

            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>१० महाविजेत्यांची निवड पूर्णपणे कला, कारागिरी व पर्यावरणपूरकतेवर आधारित असेल.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>सर्व सहभागी स्पर्धकांना पडताळणीनंतर अधिकृत डिजिटल सहभाग प्रमाणपत्र ईमेलवर प्राप्त होईल.</span>
              </div>
            </div>
          </div>

          {/* Rewards at Stake */}
          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto text-center text-xs font-bold">
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900">
              <span className="block text-stone-500 text-[10px]">१st Rank</span>
              <span className="font-serif text-lg text-[#9B1B1E]">₹1,11,111</span>
            </div>
            <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl text-stone-800">
              <span className="block text-stone-500 text-[10px]">२nd Rank</span>
              <span className="font-serif text-lg text-[#9B1B1E]">₹31,000</span>
            </div>
            <div className="bg-amber-50/50 border border-amber-200 p-3 rounded-xl text-amber-900">
              <span className="block text-stone-500 text-[10px]">३rd Rank</span>
              <span className="font-serif text-lg text-[#9B1B1E]">₹21,000</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#9B1B1E] hover:bg-[#781416] text-white px-8 py-4 rounded-xl font-bold text-sm shadow-sm transition-all"
            >
              <span>अजूनही वेळ आहे - आताच नोंदणी करा (₹299)</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-stone-600 hover:text-stone-900 text-sm font-semibold px-4 py-3"
            >
              <span>मुख्यपृष्ठावर जा</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Once competition is COMPLETED: Render full podium and results
  return (
    <div className="py-16 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 px-4 py-1.5 rounded-full text-amber-900 text-xs font-bold shadow-2xs">
            <Trophy className="w-4 h-4 text-amber-700" />
            <span>अधिकृत निकाल व महाविजेते 2026</span>
          </div>
          <h1 className="font-serif font-black text-3xl sm:text-5xl text-stone-900 tracking-tight">
            महाराष्ट्र राज्य महाविजेते व गुणवंत देखावे
          </h1>
          <p className="text-stone-600 text-base">
            तज्ज्ञ ज्युरी मंडळाने निवडलेले महाराष्ट्रातील अव्वल 10 सर्वोत्कृष्ट गणपती देखावे.
          </p>
        </div>

        {/* Podium for Top 3 Winners */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-stretch">
          {top3.map((entry) => {
            const isFirst = entry.finalRank === 1;
            return (
              <div
                key={entry.id}
                className={`rounded-2xl overflow-hidden border transition-all flex flex-col justify-between ${
                  isFirst
                    ? 'bg-white border-2 border-amber-500 shadow-lg lg:-translate-y-3'
                    : 'bg-white border-[#E5D7C0] shadow-xs'
                }`}
              >
                <div>
                  <div className="relative aspect-16/10 bg-stone-200 overflow-hidden">
                    <img
                      src={entry.photoUrls[0]}
                      alt={entry.themeTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-stone-950/80 text-white text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{entry.district}</span>
                    </div>

                    <div className="absolute top-3 right-3 bg-amber-500 text-stone-950 font-black text-sm px-3 py-1 rounded-md shadow-sm">
                      मानाचा क्रमांक #{entry.finalRank}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
                      <span>{entry.ticketId}</span>
                      <span className="text-emerald-700 font-bold">
                        ज्युरी गुण: {entry.finalScore}/10
                      </span>
                    </div>

                    <h2 className="font-serif font-black text-xl text-stone-900 leading-snug">
                      {entry.themeTitle}
                    </h2>

                    <p className="text-sm font-bold text-[#9B1B1E]">
                      {entry.fullName}
                    </p>

                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {entry.themeDescription}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200">
                    <span className="text-[10px] uppercase font-bold text-amber-900 block mb-0.5">
                      प्राप्त पारितोषिक:
                    </span>
                    <p className="font-serif font-black text-xl text-[#9B1B1E]">
                      {entry.finalRank === 1
                        ? '₹1,11,111 रोख + सुवर्ण ट्रॉफी'
                        : entry.finalRank === 2
                        ? '₹31,000 रोख + रजत ट्रॉफी'
                        : '₹21,000 रोख + कांस्य ट्रॉफी'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4th to 10th Place Table */}
        {others.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E5D7C0] p-6 sm:p-8 shadow-xs">
            <h3 className="font-serif font-black text-2xl text-stone-900 mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-600" />
              <span>४था ते १०वा मानाचा क्रमांक (प्रत्येकी ₹5,000 रोख)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 text-xs uppercase font-bold">
                    <th className="pb-3 px-2">क्रमांक</th>
                    <th className="pb-3 px-2">स्पर्धक</th>
                    <th className="pb-3 px-2">जिल्हा</th>
                    <th className="pb-3 px-2">सजावटीची संकल्पना</th>
                    <th className="pb-3 px-2 text-right">ज्युरी गुण</th>
                    <th className="pb-3 px-2 text-right">पारितोषिक</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {others.map((entry) => (
                    <tr key={entry.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-4 px-2 font-bold font-mono text-stone-800">
                        #{entry.finalRank}
                      </td>
                      <td className="py-4 px-2 font-semibold text-stone-900">
                        {entry.fullName}
                      </td>
                      <td className="py-4 px-2 text-stone-600">
                        {entry.district}
                      </td>
                      <td className="py-4 px-2 text-stone-700 max-w-xs truncate">
                        {entry.themeTitle}
                      </td>
                      <td className="py-4 px-2 text-right font-mono font-bold text-emerald-700">
                        {entry.finalScore}/10
                      </td>
                      <td className="py-4 px-2 text-right font-serif font-black text-[#9B1B1E]">
                        ₹5,000
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
