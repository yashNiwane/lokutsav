'use client';

import React from 'react';
import { useLanguage } from '@/lib/language-context';
import { ShieldCheck, Award, Users, Trophy, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function StateGrandeurSection() {
  const { lang } = useLanguage();

  const regions = [
    {
      nameMr: 'कोकण व मुंबई',
      nameEn: 'Kokan & Mumbai',
      districtsMr: 'मुंबई शहर, उपनगर, ठाणे, पालघर, रायगड, रत्नागिरी, सिंधुदुर्ग',
      districtsEn: 'Mumbai, Thane, Palghar, Raigad, Ratnagiri, Sindhudurg',
      tag: 'समुद्रकिनारी भक्तीपरंपरा',
    },
    {
      nameMr: 'पश्चिम महाराष्ट्र',
      nameEn: 'Western Maharashtra',
      districtsMr: 'पुणे, सातारा, सांगली, कोल्हापूर, सोलापूर, अहिल्यानगर',
      districtsEn: 'Pune, Satara, Sangli, Kolhapur, Solapur, Ahilyanagar',
      tag: 'ऐतिहासिक गणेशोत्सव राजधानी',
    },
    {
      nameMr: 'मराठवाडा',
      nameEn: 'Marathwada',
      districtsMr: 'छ. संभाजीनगर, जालना, बीड, धाराशिव, लातूर, नांदेड, परभणी, हिंगोली',
      districtsEn: 'Chh. Sambhajinagar, Jalna, Beed, Dharashiv, Latur, Nanded, Parbhani, Hingoli',
      tag: 'संतांची भूमी व संस्कृती',
    },
    {
      nameMr: 'विदर्भ',
      nameEn: 'Vidarbha',
      districtsMr: 'नागपूर, वर्धा, अमरावती, अकोला, यवतमाळ, चंद्रपूर, गडचिरोली, भंडारा, गोंदिया, बुलढाणा, वाशिम',
      districtsEn: 'Nagpur, Wardha, Amravati, Akola, Yavatmal, Chandrapur, Gadchiroli, Bhandara, Gondia, Buldhana, Washim',
      tag: 'निसर्ग व अष्टविनायक परंपरा',
    },
    {
      nameMr: 'उत्तर महाराष्ट्र / खान्देश',
      nameEn: 'North Maharashtra / Khandesh',
      districtsMr: 'नाशिक, धुळे, जळगाव, नंदुरबार',
      districtsEn: 'Nashik, Dhule, Jalgaon, Nandurbar',
      tag: 'गोदावरी काठ व आदिवासी कला',
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-[#E5D7C0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>महाराष्ट्राचा सर्वात मोठा सांस्कृतिक महामंच</span>
          </div>

          <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
            {lang === 'mr'
              ? 'महाराष्ट्रातील सर्वात मोठी राज्यस्तरीय ऑनलाइन गणेश सजावट स्पर्धा का?'
              : "Why is this Maharashtra's Biggest Online Decoration Competition?"}
          </h2>

          <p className="text-stone-600 text-base">
            {lang === 'mr'
              ? 'केवळ स्पर्धा नाही, तर महाराष्ट्राच्या कानाकोपऱ्यातील कला, भक्ती आणि पर्यावरणपूरक परंपरेचा महामहोत्सव!'
              : 'Not just a competition, but a state-wide celebration of devotion, craftsmanship, and eco-friendly heritage.'}
          </p>
        </div>

        {/* 4 Pillars of Scale & Trust */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E5D7C0] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-[#9B1B1E] flex items-center justify-center font-bold text-xl">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-black text-xl text-stone-900">
              ₹2,00,000+ भव्य पारितोषिके
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              प्रथम क्रमांकास मानाची सुवर्ण ट्रॉफी व ₹1,11,111 रोख, तर अव्वल 10 विजेत्यांना रोख रकमा व मानाची सन्मानचिन्हे.
            </p>
          </div>

          <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E5D7C0] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-800 flex items-center justify-center font-bold text-xl">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-black text-xl text-stone-900">
              36 जिल्ह्यांचे अखंड प्रतिनिधित्व
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              कोकण, पश्चिम महाराष्ट्र, मराठवाडा, विदर्भ आणि खान्देश मधील प्रत्येक तालुका व गावातील भाविकांसाठी खुला महामंच.
            </p>
          </div>

          <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E5D7C0] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-emerald-800 flex items-center justify-center font-bold text-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-black text-xl text-stone-900">
              100% निष्पक्ष ज्युरी परीक्षण
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              कला दिग्दर्शक, शिल्पकार व पर्यावरण तज्ज्ञांच्या पॅनेलद्वारे संकल्पना, फिनिशिंग व शाडू मातीला थेट गुणदान.
            </p>
          </div>

          <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E5D7C0] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-indigo-800 flex items-center justify-center font-bold text-xl">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-black text-xl text-stone-900">
              अधिकृत राज्य सहभाग प्रमाणपत्र
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              प्रत्येक सहभागी स्पर्धकाला डिजिटल पडताळणीकृत 'Certificate of Excellence' ईमेल व व्हॉट्सॲपवर प्रदान.
            </p>
          </div>
        </div>

        {/* 5 Regions Grid */}
        <div className="bg-[#FAF7F2] rounded-3xl p-8 border border-[#E5D7C0]">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9B1B1E]">
              संपूर्ण महाराष्ट्र एकाच व्यासपीठावर
            </span>
            <h3 className="font-serif font-black text-2xl text-stone-900">
              महाराष्ट्राच्या ५ विभागांतील भव्य सहभाग
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {regions.map((reg, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs space-y-2 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#9B1B1E] uppercase tracking-wider block">
                    {reg.tag}
                  </span>
                  <h4 className="font-serif font-bold text-base text-stone-900 mt-1">
                    {lang === 'mr' ? reg.nameMr : reg.nameEn}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
                    {lang === 'mr' ? reg.districtsMr : reg.districtsEn}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>नोंदणी खुली आहे</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#9B1B1E] hover:bg-[#781416] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all"
            >
              <span>आपल्या विभागाचे प्रतिनिधित्व करा — नोंदणी करा (₹299)</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
