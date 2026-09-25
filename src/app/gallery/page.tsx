import React from 'react';
import { dataStore } from '@/lib/db';
import { isCompetitionActive } from '@/lib/competition-config';
import FeaturedGallery from '@/components/FeaturedGallery';
import { Clock, Image as ImageIcon, ShieldCheck, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function GalleryPage() {
  const active = isCompetitionActive();
  const entries = await dataStore.getAllEntries();

  // If competition has ended, show full public gallery
  if (!active) {
    return (
      <div className="py-8 bg-white min-h-screen">
        <FeaturedGallery initialEntries={entries} />
      </div>
    );
  }

  // During active competition phase: show dignified curation notice & entry CTA
  return (
    <div className="py-20 bg-[#FAF7F2] min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-8 sm:p-12 border border-[#E5D7C0] shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-2xs">
          <ImageIcon className="w-8 h-8" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>भव्य देखावे दालन अनावरण</span>
          </div>

          <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
            गणेश सजावट दालन लवकरच खुले होईल!
          </h1>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            नोंदणी प्रक्रिया आता बंद झाली असून सर्व ३६ जिल्ह्यांतील प्राप्त उत्कृष्ट देखाव्यांचे तज्ज्ञ ज्युरी मंडळाकडून सखोल मूल्यमापन सुरू आहे. अंतिम निकाल व संपूर्ण दालन उद्या (२६ सप्टेंबर) सायंकाळी ६:०० वाजता सर्वांसाठी खुले केले जाईल.
          </p>
        </div>

        {/* Status card */}
        <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E5D7C0] text-left space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700 border-b border-stone-200 pb-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>सध्याची स्थिती:</span>
            </span>
            <span className="text-[#9B1B1E] uppercase tracking-wider font-bold">नोंदणी बंद • ज्युरी परीक्षण सुरू</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-stone-500 block">प्राप्त नोंदी:</span>
              <span className="font-bold text-stone-900 text-base">{entries.length}+ देखावे</span>
            </div>
            <div>
              <span className="text-stone-500 block">दालन व निकाल घोषणा:</span>
              <span className="font-bold text-emerald-800 text-sm">उद्या सायंकाळी ६:०० वा.</span>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#9B1B1E] hover:bg-[#781416] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all"
          >
            <span>मुख्यपृष्ठावर जा</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </Link>

          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-stone-700 bg-stone-100 hover:bg-stone-200 font-semibold text-sm px-6 py-3.5 rounded-xl border border-stone-200 transition-colors"
          >
            <span>आपले तिकीट शोधा</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-400">
          परीक्षक व आयोजक समितीसाठी: सर्व नोंदी पाहण्यासाठी व मूल्यमापनासाठी{' '}
          <Link href="/judging" className="text-[#9B1B1E] font-bold underline">
            परीक्षक कक्षात जा
          </Link>
        </div>
      </div>
    </div>
  );
}
