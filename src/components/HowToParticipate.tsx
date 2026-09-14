'use client';

import React from 'react';
import { useLanguage } from '@/lib/language-context';
import { UserCheck, Camera, CreditCard, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function HowToParticipate() {
  const { lang } = useLanguage();

  const steps = [
    {
      num: '01',
      titleMr: 'ऑनलाइन नोंदणी करा',
      titleEn: 'Fill Online Registration',
      descMr: 'स्पर्धकाचे नाव, व्हॉट्सॲप नंबर आणि महाराष्ट्रातील ३६ जिल्ह्यांपैकी आपला जिल्हा निवडा.',
      descEn: 'Enter participant name, WhatsApp number, and select your district from Maharashtra.',
      icon: <UserCheck className="w-6 h-6 text-[#9B1B1E]" />,
    },
    {
      num: '02',
      titleMr: 'सजावटीचे फोटो किंवा व्हिडिओ जोडा',
      titleEn: 'Upload Photos or Video',
      descMr: 'घरगुती किंवा मंडळाच्या देखाव्याचे स्पष्ट फोटो किंवा कमाल ३ मिनिटांचा व्हिडिओ थेट जोडा.',
      descEn: 'Upload clear photos or a direct video tour (max 3 minutes) of your decoration.',
      icon: <Camera className="w-6 h-6 text-amber-700" />,
    },
    {
      num: '03',
      titleMr: '₹99 शुल्क भरा व तिकीट मिळवा',
      titleEn: 'Pay ₹99 & Get Entry Ticket',
      descMr: 'UPI (GPay/PhonePe/Paytm) किंवा कार्डद्वारे ₹99 भरणा करून अधिकृत प्रवेश तिकीट तात्काळ डाऊनलोड करा.',
      descEn: 'Pay ₹99 via UPI Intent or Card and instantly download your verified digital entry pass.',
      icon: <CreditCard className="w-6 h-6 text-emerald-700" />,
    },
  ];

  return (
    <section id="how-to-enter" className="py-20 bg-[#FAF7F2] border-b border-[#E5D7C0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
            सुलभ ३ पायऱ्यांत सहभाग
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 tracking-tight">
            {lang === 'mr' ? 'स्पर्धेत भाग कसा घ्यावा?' : 'How to Enter the Competition?'}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            {lang === 'mr'
              ? 'घरबसल्या अवघ्या ५ मिनिटांत आपल्या गणरायाच्या देखाव्याची अधिकृत नोंदणी पूर्ण करा.'
              : 'Complete your Ganpati decoration registration in just 5 minutes from your home.'}
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-8 border border-[#E5D7C0] shadow-xs relative flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="font-serif font-black text-2xl text-stone-300">
                    {step.num}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-xl text-stone-900">
                  {lang === 'mr' ? step.titleMr : step.titleEn}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {lang === 'mr' ? step.descMr : step.descEn}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>१००% सुरक्षित व पडताळणीकृत</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Strip */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5D7C0] shadow-xs text-center max-w-2xl mx-auto space-y-4">
          <p className="text-xs text-stone-600">
            🔒 <strong>गोपनीयता व ज्युरी परीक्षण:</strong> स्पर्धा कालावधीत सर्व देखावे परीक्षकांकडे सुरक्षित मूल्यमापनासाठी राहतील. स्पर्धा संपल्यानंतर भव्य राज्य दालन व महाविजेत्यांची घोषणा केली जाईल.
          </p>
          <div>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#9B1B1E] hover:bg-[#781416] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all"
            >
              <span>आताच नोंदणी करा (₹99)</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
