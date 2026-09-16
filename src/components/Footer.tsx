'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/language-context';
import { Phone, Mail, MapPin, Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-[#1C1917] text-stone-300 pt-16 pb-12 border-t-4 border-[#9B1B1E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/95 p-1 flex items-center justify-center border border-amber-500/40 shadow-xs shrink-0 overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Lokutsav Logo"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-serif text-2xl font-black text-white tracking-tight">
                {t.brand.name}
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              {t.footer.about}
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold bg-amber-950/40 px-3 py-2 rounded border border-amber-800/40">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>महाराष्ट्र शासन सांस्कृतिक सहकार्य संकल्पना</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-4 uppercase tracking-wider text-amber-400">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#prizes" className="hover:text-white transition-colors">
                  {t.nav.prizes}
                </Link>
              </li>
              <li>
                <Link href="/#criteria" className="hover:text-white transition-colors">
                  {t.nav.criteria}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  {t.nav.gallery}
                </Link>
              </li>
              <li>
                <Link href="/winners" className="hover:text-white transition-colors">
                  {t.nav.winners}
                </Link>
              </li>
              <li>
                <Link href="/#rules" className="hover:text-white transition-colors">
                  {t.nav.rules}
                </Link>
              </li>
              <li>
                <Link href="/referral" className="text-amber-400 hover:text-white transition-colors font-bold">
                  🎁 {lang === 'mr' ? 'रेफरल रिवॉर्ड्स (Refer & Earn)' : 'Refer & Earn'}
                </Link>
              </li>
              <li className="pt-2 border-t border-stone-800">
                <Link href="/admin" className="text-stone-400 hover:text-amber-400 transition-colors text-xs flex items-center gap-1">
                  <span>🛡️ प्रशासक कक्ष (Admin Panel)</span>
                </Link>
              </li>
              <li>
                <Link href="/judging" className="text-stone-400 hover:text-amber-400 transition-colors text-xs flex items-center gap-1">
                  <span>⚖️ ज्युरी कक्ष (Jury Portal)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Participant Support */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-4 uppercase tracking-wider text-amber-400">
              {t.footer.contact}
            </h4>
            <ul className="space-y-3 text-sm text-stone-300">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                <a href="tel:+919075740510" className="hover:text-amber-400 transition-colors">
                  {t.footer.helpline}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                <a href="mailto:contact@lokutsav.com" className="hover:text-amber-400 transition-colors">
                  {t.footer.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                <span>{t.footer.address}</span>
              </li>
              <li className="pt-2">
                <a
                  href="https://www.instagram.com/lok_utsav/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-stone-300 hover:text-white transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-[1.5px] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <div className="w-full h-full bg-[#1C1917] rounded-[6px] flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-pink-400">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[11px] text-stone-400">अधिकृत इन्स्टाग्राम</span>
                    <span className="font-bold text-xs text-amber-400 group-hover:underline">@lok_utsav</span>
                  </div>
                </a>
              </li>
              <li className="pt-1.5">
                <a
                  href="https://whatsapp.com/channel/0029VbDSNyQJENxurPmDye1C"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-stone-300 hover:text-white transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#25D366] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs p-1">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-[11px] text-stone-400">WhatsApp चॅनेल</span>
                    <span className="font-bold text-xs text-emerald-400 group-hover:underline">Join Channel</span>
                  </div>
                </a>
              </li>
              <li className="pt-1.5">
                <a
                  href="https://www.facebook.com/profile.php?id=61594462049628"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-stone-300 hover:text-white transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#1877F2] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs p-1">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-white">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="block text-[11px] text-stone-400">फेसबुक पेज</span>
                    <span className="font-bold text-xs text-blue-400 group-hover:underline">Facebook</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: District Coverage Badge */}
          <div className="bg-stone-900/80 p-5 rounded-lg border border-stone-800 space-y-3">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              राज्यव्यापी सहभाग
            </span>
            <p className="text-xs text-stone-400 leading-relaxed">
              कोकण, पश्चिम महाराष्ट्र, मराठवाडा, विदर्भ आणि खान्देश मधील सर्व 36 जिल्ह्यांतील भाविकांसाठी खुली स्पर्धा.
            </p>
            <div className="pt-2">
              <Link
                href="/register"
                className="block text-center bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs py-2.5 px-4 rounded transition-colors"
              >
                नोंदणी करा (₹99)
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom divider & copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>{t.footer.copyright}</p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/lok_utsav/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-stone-400 hover:text-pink-400 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span>@lok_utsav</span>
            </a>
            <span className="text-stone-700">•</span>
            <a
              href="https://whatsapp.com/channel/0029VbDSNyQJENxurPmDye1C"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-stone-400 hover:text-emerald-400 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#25D366]">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>WhatsApp Channel</span>
            </a>
            <span className="text-stone-700">•</span>
            <a
              href="https://www.facebook.com/profile.php?id=61594462049628"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-stone-400 hover:text-blue-400 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#1877F2]">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </a>
            <span className="text-stone-700">•</span>
            <p className="flex items-center gap-1">
              महाराष्ट्राच्या समृद्ध संस्कृतीला सादर समर्पित
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
