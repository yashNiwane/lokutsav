'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import {
  Gift,
  Share2,
  Users,
  Award,
  CheckCircle2,
  Search,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';

export default function ReferralPage() {
  const { lang } = useLanguage();
  const [queryCode, setQueryCode] = useState('');
  const [searching, setSearching] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [searchError, setSearchError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSearchStats = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryCode.trim()) return;

    setSearching(true);
    setSearchError('');
    setStats(null);

    try {
      const res = await fetch(`/api/referral?code=${encodeURIComponent(queryCode.trim())}`);
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      } else {
        setSearchError(
          data.error ||
            (lang === 'mr'
              ? 'हा तिकीट किंवा रेफरल कोड सापडला नाही. कृपया वैध कोड टाका.'
              : 'Ticket or referral code not found. Please enter a valid code.')
        );
      }
    } catch {
      setSearchError(
        lang === 'mr' ? 'माहिती शोधताना त्रुटी आली.' : 'Error fetching referral statistics.'
      );
    } finally {
      setSearching(false);
    }
  };

  const referralUrl =
    typeof window !== 'undefined' && stats?.ticketId
      ? `${window.location.origin}/register?ref=${stats.ticketId}`
      : '';

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9B1B1E] bg-red-50 border border-red-200 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
            <Gift className="w-3.5 h-3.5 text-[#9B1B1E]" />
            <span>{lang === 'mr' ? 'लोकोत्सव सांस्कृतिक राजदूत अभियान' : 'Cultural Ambassador Program'}</span>
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-stone-900 tracking-tight">
            {lang === 'mr' ? 'रेफर करा आणि रोख बक्षिसे जिंका!' : 'Refer Friends & Win Special Rewards!'}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {lang === 'mr'
              ? 'महाराष्ट्राच्या या भव्य गणेशोत्सवात आपल्या आप्तेष्टांना, मित्रांना आणि मंडळांना सहभागी करा. सर्वाधिक सहभाग नोंदवणाऱ्यांना विशेष सन्मान व पारितोषिके!'
              : 'Invite friends, families, and Ganesh mandals across Maharashtra to celebrate Lokutsav. Top ambassadors earn grand cash prizes, trophies, and state-wide honor!'}
          </p>
        </div>

        {/* 3 Steps Process */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E5D7C0] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#9B1B1E] flex items-center justify-center font-bold text-lg font-serif">
              1
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              {lang === 'mr' ? 'आपला तिकीट कोड मिळवा' : 'Get Your Ticket Code'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {lang === 'mr'
                ? 'स्पर्धेत नोंदणी केल्यावर प्राप्त होणारा तुमचा युनिक तिकीट क्रमांक (उदा. LOK-2026-8941) हाच तुमचा अधिकृत रेफरल कोड आहे.'
                : 'Your unique registration Ticket ID (e.g. LOK-2026-8941) acts as your permanent referral ambassador code.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5D7C0] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#9B1B1E] flex items-center justify-center font-bold text-lg font-serif">
              2
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              {lang === 'mr' ? 'मित्रांसोबत शेअर करा' : 'Share with Friends'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {lang === 'mr'
                ? 'तुमची रेफरल लिंक थेट व्हॉट्सॲप, फेसबुक किंवा सोशल मीडियावर शेअर करा. मित्रांनी लिंकवरून फॉर्म भरताना कोड आपोआप लागू होईल.'
                : 'Share your personal referral link on WhatsApp or social media. When invited friends register, your referral points increase automatically.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5D7C0] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#9B1B1E] flex items-center justify-center font-bold text-lg font-serif">
              3
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              {lang === 'mr' ? 'विशेष पारितोषिके मिळवा' : 'Earn Grand Prizes'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {lang === 'mr'
                ? '५ पेक्षा जास्त रेफरल्सवर "सांस्कृतिक राजदूत" प्रमाणपत्र, तर राज्यस्तरीय टॉप ३ रेफरर्सना रोख पारितोषिके व स्मृतिचिन्ह!'
                : 'Earn official Cultural Ambassador certificates with 5+ referrals, and top state referrers receive special trophies & cash awards!'}
            </p>
          </div>
        </div>

        {/* Ambassador Rewards Table */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5D7C0] shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
            <Award className="w-6 h-6 text-amber-600" />
            <div>
              <h2 className="font-serif font-black text-xl sm:text-2xl text-stone-900">
                {lang === 'mr' ? 'रेफरल पुरस्कार श्रेणी' : 'Ambassador Reward Tiers'}
              </h2>
              <p className="text-xs text-stone-500">
                {lang === 'mr' ? 'प्रत्येक यशस्वी ₹199 भरलेल्या नोंदणीवर गुण मोजले जातील' : 'Points counted upon verified registration'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wide">
                {lang === 'mr' ? 'कांस्य राजदूत (5+ रेफरल)' : 'Bronze Tier (5+)'}
              </span>
              <p className="font-serif font-black text-lg text-[#9B1B1E]">
                {lang === 'mr' ? 'विशेष डिजिटल राजदूत सन्मानपत्र' : 'Official Ambassador Certificate'}
              </p>
              <p className="text-xs text-stone-500">
                {lang === 'mr' ? 'QR कोड प्रमाणित ई-प्रशस्तिपत्र' : 'QR-verified Honor Scroll'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300 space-y-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                {lang === 'mr' ? 'रौप्य राजदूत (10+ रेफरल)' : 'Silver Tier (10+)'}
              </span>
              <p className="font-serif font-black text-lg text-amber-900">
                {lang === 'mr' ? '₹500 रोख / ॲमेझॉन व्हाउचर' : '₹500 Cash / Gift Voucher'}
              </p>
              <p className="text-xs text-stone-500">
                {lang === 'mr' ? 'थेट बँक खात्यात / UPI वर' : 'Direct UPI / Bank Transfer'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-orange-50 border border-orange-300 space-y-2">
              <span className="text-xs font-bold text-orange-800 uppercase tracking-wide">
                {lang === 'mr' ? 'सुवर्ण महापारितोषिक (टॉप 3)' : 'Top 3 Champions'}
              </span>
              <p className="font-serif font-black text-lg text-orange-950">
                {lang === 'mr' ? '₹5,000 / ₹3,000 / ₹2,000' : '₹5,000 / ₹3,000 / ₹2,000'}
              </p>
              <p className="text-xs text-stone-500">
                {lang === 'mr' ? 'भव्य सन्मान चिन्ह व महापुरस्कार' : 'Grand Trophy & Felicitation'}
              </p>
            </div>
          </div>
        </div>

        {/* Live Referral Stats Checker */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5D7C0] shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif font-black text-xl sm:text-2xl text-stone-900">
              {lang === 'mr' ? 'तुमची रेफरल स्थिती व गुण तपासा' : 'Check Your Referral Status'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              {lang === 'mr'
                ? 'तुमचा नोंदणीकृत तिकीट क्रमांक टाका आणि तुमच्या रेफरलद्वारे किती स्पर्धक जोडले गेले ते पहा.'
                : 'Enter your registered Ticket ID to track how many participants registered using your code.'}
            </p>
          </div>

          <form onSubmit={handleSearchStats} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                required
                value={queryCode}
                onChange={(e) => setQueryCode(e.target.value.toUpperCase())}
                placeholder={lang === 'mr' ? 'उदा. LOK-2026-8941' : 'e.g. LOK-2026-8941'}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]/40 uppercase text-stone-900"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="inline-flex items-center justify-center gap-2 bg-[#9B1B1E] hover:bg-[#781416] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{searching ? (lang === 'mr' ? 'शोधत आहे...' : 'Checking...') : (lang === 'mr' ? 'तपासा' : 'Check Stats')}</span>
            </button>
          </form>

          {searchError && (
            <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
              {searchError}
            </p>
          )}

          {/* Stats Results Card */}
          {stats && (
            <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-2xl space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 pb-3">
                <div>
                  <span className="text-xs text-stone-500 font-bold uppercase block">
                    {lang === 'mr' ? 'सांस्कृतिक राजदूत:' : 'Ambassador Name:'}
                  </span>
                  <p className="font-serif font-black text-xl text-stone-900">
                    {stats.fullName} ({stats.district})
                  </p>
                  <p className="text-xs text-stone-500 font-mono">
                    कोड: {stats.ticketId}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-stone-500 font-bold uppercase block">
                    {lang === 'mr' ? 'यशस्वी रेफरल्स:' : 'Successful Referrals:'}
                  </span>
                  <p className="font-serif font-black text-3xl text-[#9B1B1E]">
                    {stats.referralCount}
                  </p>
                </div>
              </div>

              {/* Share actions */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700">
                  {lang === 'mr' ? 'तुमची खास रेफरल लिंक:' : 'Your Unique Referral Link:'}
                </label>
                <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-amber-200">
                  <input
                    type="text"
                    readOnly
                    value={referralUrl}
                    className="w-full text-xs font-mono text-stone-700 bg-transparent outline-none truncate select-all px-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(referralUrl);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? (lang === 'mr' ? 'कॉपी झाले' : 'Copied') : (lang === 'mr' ? 'कॉपी' : 'Copy')}</span>
                  </button>
                </div>
              </div>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `🚩 *लोकोत्सव २०२६ | महाराष्ट्र राज्य ऑनलाइन गणेश सजावट स्पर्धा*\n\nमी माझ्या बाप्पाच्या देखाव्याची अधिकृत नोंदणी पूर्ण केली आहे! (प्रवेशिका: ${stats.ticketId})\n\nतुम्हीही तुमच्या घरगुती गणपती किंवा मंडळाच्या सजावटीची नोंदणी करा आणि रोख पारितोषिके जिंका.\n\n👉 माझ्या रेफरल लिंकवरून लगेच नोंदणी करा:\n${referralUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-xs transition-transform active:scale-98 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>{lang === 'mr' ? 'व्हाट्सॲपवर मित्रांना शेअर करा' : 'Share on WhatsApp'}</span>
              </a>

              {/* Referred Entries List */}
              {stats.referredEntries && stats.referredEntries.length > 0 ? (
                <div className="pt-3 border-t border-amber-200 space-y-2">
                  <h4 className="font-bold text-xs uppercase text-stone-700">
                    {lang === 'mr' ? 'नोंदणी झालेले मित्र:' : 'Referred Participants:'}
                  </h4>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {stats.referredEntries.map((refUser: any, i: number) => (
                      <div
                        key={i}
                        className="bg-white px-3 py-2 rounded-lg border border-amber-100 flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-stone-800">{refUser.fullName}</span>
                        <span className="text-emerald-700 font-medium">✓ नोंदणीकृत ({refUser.ticketId})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-500 text-center pt-2">
                  {lang === 'mr'
                    ? 'अद्याप कोणीही तुमच्या कोडवरून नोंदणी केलेली नाही. आजच आपली लिंक शेअर करा!'
                    : 'No participants have registered with your code yet. Share your link today to start earning!'}
                </p>
              )}
            </div>
          )}
        </div>

        {/* CTA Bottom Banner */}
        <div className="bg-[#1C1917] rounded-2xl p-6 sm:p-10 text-white text-center space-y-4 shadow-xl">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-amber-400">
            {lang === 'mr' ? 'अद्याप नोंदणी केली नाही का?' : 'Haven’t Registered Yet?'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
            {lang === 'mr'
              ? 'केवळ ₹199 मध्ये आपल्या बाप्पाच्या सजावटीची नोंदणी करा, अधिकृत तिकीट मिळवा आणि स्वतःचा रेफरल कोड सक्रिय करा.'
              : 'Register your Ganpati decoration for just ₹199, receive your official ticket pass, and activate your personal ambassador code.'}
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#9B1B1E] hover:bg-[#781416] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-98"
            >
              <span>{lang === 'mr' ? 'आता नोंदणी करा (₹199)' : 'Register Now (₹199)'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
