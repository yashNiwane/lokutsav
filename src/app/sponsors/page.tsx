'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { SPONSORS_LIST } from '@/lib/seed-data';
import { Handshake, CheckCircle2, Award, Sparkles, Send, ShieldCheck, Mail, Phone } from 'lucide-react';

export default function SponsorsPage() {
  const { lang, t } = useLanguage();
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    tierInterested: 'GOLD',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
  };

  return (
    <div className="py-16 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 px-4 py-1.5 rounded-full text-amber-900 text-xs font-bold shadow-2xs">
            <Handshake className="w-4 h-4 text-amber-700" />
            <span>ब्रँड पार्टनरशिप व प्रायोजकत्व २०२६</span>
          </div>
          <h1 className="font-serif font-black text-3xl sm:text-5xl text-stone-900 tracking-tight">
            महाराष्ट्रातील लाखो कुटुंबांपर्यंत आपला ब्रँड पोहोचवा
          </h1>
          <p className="text-stone-600 text-base">
            लोकोत्सव २०२६ च्या माध्यमातून राज्यभरातील ३६ जिल्ह्यांमध्ये गणेशोत्सवाच्या पवित्र पर्वावर आपल्या उत्पादनांची व सेवेची प्रतिष्ठा वाढवा.
          </p>
        </div>

        {/* Why Sponsor Lokutsav Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl border border-[#E5D7C0] shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">व्यापक पोहोच</span>
            <h3 className="font-serif font-black text-2xl text-stone-900">३६ जिल्हे • १०,०००+ कुटुंबे</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              मुंबई, पुणे, नाशिक, नागपूर, कोल्हापूर, छत्रपती संभाजीनगरसह संपूर्ण महाराष्ट्रातील मध्यमवर्गीय व उच्च मध्यमवर्गीय कुटुंबांशी थेट जोडणी.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5D7C0] shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">उच्च ब्रँड व्हॅल्यू</span>
            <h3 className="font-serif font-black text-2xl text-stone-900">संस्कृती व विश्वासाची जोड</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              गणेशोत्सवासारख्या आस्थेच्या उत्सवात ब्रँडचे नाव जोडल्याने लोकांच्या मनात दीर्घकालीन सकारात्मक विश्वास निर्माण होतो.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5D7C0] shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">कस्टमाईज्ड कॅटेगरी</span>
            <h3 className="font-serif font-black text-2xl text-stone-900">बक्षीस प्रवर्ग प्रायोजकत्व</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              उदा. "सर्वोत्कृष्ट पर्यावरणपूरक सजावट पुरस्कार", "मानाचा प्रथम क्रमांक" आपल्या ब्रँडच्या नावे प्रस्तुत करण्याची सुवर्णसंधी.
            </p>
          </div>
        </div>

        {/* Current Sponsors Spotlight */}
        <div className="mb-16">
          <h2 className="font-serif font-black text-2xl text-stone-900 text-center mb-8">
            आमचे सन्मानित ब्रँड भागीदार
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPONSORS_LIST.map((sp) => (
              <div key={sp.id} className="bg-white p-6 rounded-xl border border-[#E5D7C0] text-center shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {sp.tier}
                </span>
                <p className="font-serif font-black text-xl text-[#9B1B1E] my-3">
                  {sp.name}
                </p>
                <p className="text-xs font-bold text-stone-700">
                  {sp.sponsoredCategoryMr}
                </p>
                <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
                  {sp.descriptionMr}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sponsorship Inquiry Form */}
        <div className="bg-white rounded-2xl border border-[#E5D7C0] p-8 max-w-2xl mx-auto shadow-sm">
          <h2 className="font-serif font-black text-2xl text-stone-900 text-center mb-2">
            प्रायोजकत्व चौकशी अर्ज
          </h2>
          <p className="text-center text-xs text-stone-500 mb-6">
            आमची प्रायोजकत्व समन्वय समिती २४ तासांच्या आत आपल्याशी संपर्क साधेल.
          </p>

          {inquirySubmitted ? (
            <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-300 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
              <h3 className="font-serif font-bold text-xl text-emerald-900">
                चौकशी अर्ज यशस्वीरित्या प्राप्त झाला!
              </h3>
              <p className="text-xs text-emerald-800">
                धन्यवाद! लोकोत्सव संयोजन समितीचे प्रतिनिधी आपल्या दिलेल्या नंबरवर लवकरच संपर्क साधतील.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    कंपनी / ब्रँडचे नाव *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="उदा. ABC Foods / XYZ Retail"
                    className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    संपर्क व्यक्तीचे नाव *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="उदा. राहुल कुलकर्णी (Marketing Head)"
                    className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    मोबाइल / व्हॉट्सॲप नंबर *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="१० अंकी मोबाइल नंबर"
                    className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    अधिकृत ईमेल *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="marketing@brand.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  प्रायोजकत्व प्रवर्ग (Tier)
                </label>
                <select
                  value={formData.tierInterested}
                  onChange={(e) => setFormData({ ...formData, tierInterested: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-white"
                >
                  <option value="TITLE">Title Sponsor (मुख्य प्रायोजक)</option>
                  <option value="POWERED_BY">Powered By Sponsor (सह-प्रायोजक)</option>
                  <option value="GOLD">Gold Sponsor (प्रवर्ग प्रायोजक)</option>
                  <option value="GIFTING">Product Gifting / Hamper Partner</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  काही विशेष अपेक्षा किंवा संदेश
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="आपल्या ब्रँडच्या प्रचारासंदर्भात थोडक्यात माहिती द्या..."
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#9B1B1E] hover:bg-[#781416] text-white font-bold py-3.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>चौकशी पाठवा (Send Inquiry)</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
