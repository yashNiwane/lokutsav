'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { ParticipantEntry } from '@/lib/types';
import { MAHARASHTRA_DISTRICTS } from '@/lib/translations';
import { MapPin, Image as ImageIcon, Video, X, ExternalLink, Leaf, Award } from 'lucide-react';
import Link from 'next/link';

interface Props {
  initialEntries: ParticipantEntry[];
}

export default function FeaturedGallery({ initialEntries }: Props) {
  const { lang, t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeModalEntry, setActiveModalEntry] = useState<ParticipantEntry | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const filtered = initialEntries.filter((entry) => {
    const matchDist = selectedDistrict === 'ALL' || entry.district.toLowerCase() === selectedDistrict.toLowerCase();
    const matchCat = selectedCategory === 'ALL' || entry.category === selectedCategory;
    return matchDist && matchCat;
  });

  return (
    <section id="gallery" className="py-20 bg-white border-b border-[#E5D7C0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#9B1B1E] bg-red-50 border border-red-200 px-3 py-1 rounded-full">
              {t.gallery.title}
            </span>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 tracking-tight mt-3">
              {t.gallery.subtitle}
            </h2>
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <div className="inline-flex rounded-lg border border-[#E5D7C0] bg-stone-50 p-1 text-xs font-semibold">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  selectedCategory === 'ALL'
                    ? 'bg-[#9B1B1E] text-white shadow-2xs'
                    : 'text-stone-700 hover:text-stone-950'
                }`}
              >
                {t.gallery.filterAllCategories}
              </button>
              <button
                onClick={() => setSelectedCategory('HOUSEHOLD')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  selectedCategory === 'HOUSEHOLD'
                    ? 'bg-[#9B1B1E] text-white shadow-2xs'
                    : 'text-stone-700 hover:text-stone-950'
                }`}
              >
                {t.gallery.filterHousehold}
              </button>
              <button
                onClick={() => setSelectedCategory('SARVAJANIK_MANDAL')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  selectedCategory === 'SARVAJANIK_MANDAL'
                    ? 'bg-[#9B1B1E] text-white shadow-2xs'
                    : 'text-stone-700 hover:text-stone-950'
                }`}
              >
                {t.gallery.filterMandal}
              </button>
            </div>

            {/* District dropdown */}
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs font-semibold border border-[#E5D7C0] rounded-lg px-3 py-2 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]/40"
            >
              <option value="ALL">{t.gallery.filterAllDistricts}</option>
              {MAHARASHTRA_DISTRICTS.map((d) => (
                <option key={d.en} value={d.en}>
                  {lang === 'mr' ? d.mr : d.en}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              onClick={() => {
                setActiveModalEntry(entry);
                setActivePhotoIndex(0);
              }}
              className="group cursor-pointer bg-white rounded-xl border border-[#E5D7C0] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
            >
              {/* Photo preview container */}
              <div className="relative aspect-4/3 bg-stone-200 overflow-hidden">
                <img
                  src={entry.photoUrls[0] || 'https://images.unsplash.com/photo-1567591370504-20a2e7c54ef5?auto=format&fit=crop&w=800&q=80'}
                  alt={entry.themeTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* District badge */}
                <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{entry.district}</span>
                </div>

                {/* Rank / Score badge if awarded */}
                {entry.finalRank && entry.finalRank <= 10 && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-stone-950 text-xs font-black px-2.5 py-1 rounded-md shadow-2xs flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>क्रमांक #{entry.finalRank}</span>
                  </div>
                )}

                {/* Eco-friendly indicator */}
                {entry.idolType === 'SHADU_MATI_CLAY' && (
                  <div className="absolute bottom-3 left-3 bg-emerald-900/85 backdrop-blur-xs text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs">
                    <Leaf className="w-3 h-3 text-emerald-300" />
                    <span>शाडू माती मूर्ती</span>
                  </div>
                )}

                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  <span>{entry.photoUrls.length} फोटो</span>
                </div>
              </div>

              {/* Card info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold mb-1">
                    <span>{entry.ticketId}</span>
                    <span className="capitalize">
                      {entry.category === 'HOUSEHOLD' ? 'घरगुती' : 'सार्वजनिक मंडळ'}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-stone-900 line-clamp-1 group-hover:text-[#9B1B1E] transition-colors">
                    {entry.themeTitle}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                    {entry.themeDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-700">
                  <span className="font-medium truncate max-w-[160px]">
                    {entry.fullName}
                  </span>
                  <span className="text-[#9B1B1E] font-bold text-[11px] group-hover:underline">
                    तपशील पहा →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action button to view all */}
        <div className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 bg-[#FAF7F2] hover:bg-stone-100 text-stone-800 border border-[#E5D7C0] px-6 py-3 rounded-xl text-sm font-bold shadow-2xs transition-colors"
          >
            <span>संपूर्ण दालन व सर्व छायाचित्रे पहा ({initialEntries.length} नोंदी)</span>
          </Link>
        </div>
      </div>

      {/* Photo & Video Modal Lightbox */}
      {activeModalEntry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-stone-300 shadow-2xl relative">
            {/* Close button */}
            <button
              onClick={() => setActiveModalEntry(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Active photo display */}
            <div className="relative bg-stone-900 aspect-16/10 flex items-center justify-center overflow-hidden">
              <img
                src={activeModalEntry.photoUrls[activePhotoIndex] || activeModalEntry.photoUrls[0]}
                alt={activeModalEntry.themeTitle}
                className="max-h-[60vh] max-w-full object-contain"
              />
            </div>

            {/* Thumbnails */}
            {activeModalEntry.photoUrls.length > 1 && (
              <div className="flex gap-2 p-3 bg-stone-100 overflow-x-auto border-b border-stone-200">
                {activeModalEntry.photoUrls.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhotoIndex(i)}
                    className={`w-16 h-16 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                      activePhotoIndex === i ? 'border-[#9B1B1E] scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Entry metadata */}
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-stone-500 block">
                    {activeModalEntry.ticketId} • {activeModalEntry.district}
                  </span>
                  <h3 className="font-serif font-black text-2xl text-stone-900 mt-1">
                    {activeModalEntry.themeTitle}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-stone-900 block">
                    {activeModalEntry.fullName}
                  </span>
                  <span className="text-xs text-stone-500">
                    {activeModalEntry.city}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                  सजावटीची संकल्पना व सविस्तर कथा
                </h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {activeModalEntry.themeDescription}
                </p>
              </div>

              {activeModalEntry.materialsUsed && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                    वापरलेले साहित्य
                  </h4>
                  <p className="text-xs text-stone-700 bg-white p-3 rounded-lg border border-stone-200">
                    {activeModalEntry.materialsUsed}
                  </p>
                </div>
              )}

              {activeModalEntry.videoUrl && (
                <div className="pt-2">
                  <a
                    href={activeModalEntry.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    <span>सजावटीचा संपूर्ण व्हिडिओ पहा (YouTube / Link)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
