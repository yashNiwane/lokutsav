'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/language-context';
import { Phone, Mail, MapPin, Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

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
                <Link href="/sponsors" className="hover:text-white transition-colors">
                  {t.nav.sponsors}
                </Link>
              </li>
              <li>
                <Link href="/#rules" className="hover:text-white transition-colors">
                  {t.nav.rules}
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
                <span>{t.footer.helpline}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                <span>{t.footer.email}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                <span>{t.footer.address}</span>
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
                नोंदणी करा (₹199)
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom divider & copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>{t.footer.copyright}</p>
          <p className="flex items-center gap-1">
            महाराष्ट्राच्या समृद्ध संस्कृतीला सादर समर्पित
          </p>
        </div>
      </div>
    </footer>
  );
}
