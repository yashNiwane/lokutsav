'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { ChevronDown } from 'lucide-react';

export default function FaqSection() {
  const { lang } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      qEn: 'What is the registration fee and how do I pay?',
      qMr: 'नोंदणी शुल्क किती आहे आणि ते कसे भरायचे?',
      aEn: 'The entry fee is a nominal ₹199 per decoration entry. You can pay online securely using UPI (Google Pay, PhonePe, Paytm), Netbanking, or Debit/Credit Cards via our Razorpay integration.',
      aMr: 'नोंदणी शुल्क प्रति सजावट केवळ ₹199 आहे. तुम्ही थेट UPI (Google Pay, PhonePe, Paytm), नेटबँकिंग किंवा डेबिट/क्रेडिट कार्डद्वारे सुरक्षितपणे ऑनलाइन भरणा करू शकता.',
    },
    {
      qEn: 'How many photos and videos can I submit?',
      qMr: 'किती छायाचित्रे व व्हिडिओ सादर करता येतील?',
      aEn: 'You can upload 3 to 5 high-resolution photos showing full view, close-up detailing, and lighting setup. A video walkthrough tour is optional but highly recommended to help the jury evaluate spatial depth and lighting.',
      aMr: 'तुम्ही सजावटीचे 3 ते 5 उच्च दर्जाचे फोटो जोडू शकता, ज्यामध्ये पूर्ण देखावा, सुबक कारागिरी आणि प्रकाशयोजना दिसावी. सजावटीचा 1 ते 2 मिनिटांचा व्हिडिओ ऐच्छिक परंतु परीक्षकांसाठी अत्यंत उपयुक्त आहे.',
    },
    {
      qEn: 'Who is eligible to participate?',
      qMr: 'स्पर्धेत कोण कोण सहभागी होऊ शकते?',
      aEn: 'The competition is open to all residents and families across all 36 districts of Maharashtra for Household Ganpati decorations, as well as registered Sarvajanik Ganesh Mandals.',
      aMr: 'महाराष्ट्रातील सर्व 36 जिल्ह्यांतील घरगुती गणपती बसवणारे सर्व नागरिक, कुटुंबे तसेच सार्वजनिक गणेशोत्सव मंडळे या स्पर्धेत सहभागी होण्यास पात्र आहेत.',
    },
    {
      qEn: 'How will the Top 10 winners be selected?',
      qMr: '10 महाविजेते कसे निवडले जातील?',
      aEn: 'Our esteemed jury panel evaluates every entry based on 5 weighted criteria: Concept & Creativity (25%), Craftsmanship & Detailing (25%), Eco-friendliness & Sustainable materials (20%), Lighting & Presentation (15%), and Innovation (15%).',
      aMr: 'आमचे तज्ज्ञ परीक्षक 5 मुख्य निकषांवर गुणदान करतात: संकल्पना व कल्पकता (25%), हस्तकला व फिनिशिंग (25%), पर्यावरणपूरकता (20%), प्रकाशयोजना व सादरीकरण (15%) आणि नाविन्यता (15%). यातून सर्वोच्च गुणांचे 10 स्पर्धक महाविजेते ठरतील.',
    },
    {
      qEn: 'When do I receive my participation certificate?',
      qMr: 'सहभाग प्रमाणपत्र कधी आणि कसे मिळेल?',
      aEn: 'Immediately upon successful registration and payment of ₹199, your official Lokutsav Ticket ID is generated. The verified digital Certificate of Participation will be available for instant download and sent to your registered email.',
      aMr: 'नोंदणी व ₹199 शुल्क भरणा यशस्वी होताच तुम्हाला अधिकृत तिकीट क्रमांक मिळतो. पडताळणी पूर्ण झाल्यानंतर डिजिटल सहभाग प्रमाणपत्र थेट तुमच्या ईमेलवर व संकेतस्थळावरून डाऊनलोड करता येईल.',
    },
  ];

  return (
    <section className="py-20 bg-[#FAF7F2] border-b border-[#E5D7C0]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9B1B1E]">
            वारंवार विचारले जाणारे प्रश्न
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900">
            {lang === 'mr' ? 'नेहमी विचारले जाणारे प्रश्न (FAQ)' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#E5D7C0] overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-serif font-bold text-base sm:text-lg text-stone-900 hover:text-[#9B1B1E] transition-colors"
                >
                  <span>{lang === 'mr' ? faq.qMr : faq.qEn}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-[#9B1B1E]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                    {lang === 'mr' ? faq.aMr : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
