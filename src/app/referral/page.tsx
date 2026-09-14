'use client';

import React, { useState, useEffect } from 'react';
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
  const [sessionTicket, setSessionTicket] = useState<string | null>(null);

  const fetchStats = async (codeToSearch: string) => {
    if (!codeToSearch || !codeToSearch.trim()) return;

    setSearching(true);
    setSearchError('');
    setStats(null);

    try {
      const res = await fetch(`/api/referral?code=${encodeURIComponent(codeToSearch.trim())}`);
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

  // Auto-load ticket from session if user already registered
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved =
        sessionStorage.getItem('lokutsav_my_ticket') ||
        localStorage.getItem('lokutsav_my_ticket');
      if (saved) {
        setSessionTicket(saved);
        setQueryCode(saved);
        fetchStats(saved);
      }
    }
  }, []);

  const handleSearchStats = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchStats(queryCode);
  };

  const referralUrl =
    typeof window !== 'undefined' && stats?.ticketId
      ? `${window.location.origin}/register?ref=${stats.ticketId}`
      : '';

  const totalEarnings = stats ? ((stats.referralCount || 0) * 9.9).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header Hero */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9B1B1E] bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
            <Gift className="w-3.5 h-3.5 text-[#9B1B1E]" />
            <span>{lang === 'mr' ? 'लोकोत्सव सांस्कृतिक राजदूत अभियान • १०% थेट कमिशन' : 'Cultural Ambassador Program • 10% Cash Commission'}</span>
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-stone-900 tracking-tight">
            {lang === 'mr' ? 'रेफर करा आणि मिळवा थेट १०% रोख कमिशन!' : 'Refer Friends & Earn 10% Cash Commission!'}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {lang === 'mr'
              ? 'तुमच्या रेफरल लिंकवरून होणाऱ्या प्रत्येक ₹९९ च्या यशस्वी नोंदणीवर मिळवा थेट १०% (₹९.९०) रोख कमिशन! आपल्या मित्रांना, आप्तेष्टांना व गणेश मंडळांना सहभागी करा आणि अमर्याद कमाई करा.'
              : 'Earn a 10% direct cash commission (₹9.90) on every ₹99 verified registration made through your referral code or link. Invite friends and earn without limits!'}
          </p>
        </div>

        {/* 10% Commission Showcase Cards */}
        <div className="bg-gradient-to-br from-amber-500 via-orange-600 to-[#9B1B1E] p-6 sm:p-8 rounded-3xl text-white shadow-lg space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-widest font-bold text-amber-200 bg-black/20 px-3 py-1 rounded-full inline-block">
              {lang === 'mr' ? '💰 थेट कमाईचे गणित' : '💰 Commission Earnings Structure'}
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white">
              {lang === 'mr' ? 'प्रत्येक नोंदणीवर १०% हमखास कमिशन' : '10% Guaranteed Cash on Every Registration'}
            </h2>
            <p className="text-amber-100 text-xs sm:text-sm">
              {lang === 'mr' ? 'प्रवेश शुल्क: ₹९९ | तुमचे कमिशन: १०% = ₹९.९० प्रति नोंदणी' : 'Entry Fee: ₹99 | Your Commission: 10% = ₹9.90 per registration'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <span className="text-xs text-amber-200 block font-medium">{lang === 'mr' ? '१ नोंदणी' : '1 Registration'}</span>
              <p className="text-2xl sm:text-3xl font-serif font-black text-white mt-1">₹९.९०</p>
              <span className="text-[11px] text-amber-100/90 block mt-1">{lang === 'mr' ? '१०% थेट कमिशन' : '10% Commission'}</span>
            </div>

            <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border-2 border-amber-300 shadow-md">
              <span className="text-xs text-amber-200 block font-bold">{lang === 'mr' ? '१० नोंदणी' : '10 Registrations'}</span>
              <p className="text-2xl sm:text-3xl font-serif font-black text-amber-300 mt-1">₹९९.००</p>
              <span className="text-[11px] text-emerald-200 block mt-1 font-bold">
                {lang === 'mr' ? 'स्वतःची फी १००% वसूल!' : '100% Fee Recovered!'}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <span className="text-xs text-amber-200 block font-medium">{lang === 'mr' ? '५० नोंदणी' : '50 Registrations'}</span>
              <p className="text-2xl sm:text-3xl font-serif font-black text-white mt-1">₹४९५.००</p>
              <span className="text-[11px] text-amber-100/90 block mt-1">{lang === 'mr' ? 'थेट रोख कमिशन' : 'Direct Cash'}</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <span className="text-xs text-amber-200 block font-medium">{lang === 'mr' ? '१०० नोंदणी' : '100 Registrations'}</span>
              <p className="text-2xl sm:text-3xl font-serif font-black text-white mt-1">₹९९०.००</p>
              <span className="text-[11px] text-amber-100/90 block mt-1">{lang === 'mr' ? 'अमर्याद कमाई' : 'Unlimited Cash'}</span>
            </div>
          </div>

          <div className="text-center text-xs text-amber-100/90 pt-1">
            <span>✨ {lang === 'mr' ? 'कमिशन रक्कम थेट तुमच्या UPI किंवा बँक खात्यात वितरीत केली जाईल.' : 'Commission payout transferred directly to your UPI or Bank Account.'}</span>
          </div>
        </div>

        {/* 3 Steps Process */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E5D7C0] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#9B1B1E] flex items-center justify-center font-bold text-lg font-serif">
              1
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              {lang === 'mr' ? 'आपला तिकीट कोड मिळवा' : 'Get Your Referral Code'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {lang === 'mr'
                ? 'स्पर्धेत ₹९९ भरून नोंदणी केल्यावर प्राप्त होणारा युनिक तिकीट क्रमांक (उदा. LOK-2026-8941) हाच तुमचा अधिकृत रेफरल कोड आहे.'
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
                : 'Share your personal referral link on WhatsApp or social media. When invited friends register, your referral points and earnings increase automatically.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5D7C0] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#9B1B1E] flex items-center justify-center font-bold text-lg font-serif">
              3
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              {lang === 'mr' ? '१०% कमिशन व सन्मान मिळवा' : 'Earn 10% Cash & Rewards'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {lang === 'mr'
                ? 'प्रत्येक यशस्वी नोंदणीवर १०% (₹९.९०) रोख कमिशन, १०+ रेफरल्सवर राजदूत प्रमाणपत्र, आणि टॉप ३ रेफरर्सना भव्य रोख पारितोषिके!'
                : 'Earn 10% (₹9.90) cash commission on every registration, ambassador certificate on 10+ referrals, and grand cash awards for top referrers!'}
            </p>
          </div>
        </div>

        {/* Ambassador Rewards Table */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5D7C0] shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
            <Award className="w-6 h-6 text-amber-600" />
            <div>
              <h2 className="font-serif font-black text-xl sm:text-2xl text-stone-900">
                {lang === 'mr' ? 'रेफरल पुरस्कार व कमिशन श्रेणी' : 'Ambassador Rewards & Commission Tiers'}
              </h2>
              <p className="text-xs text-stone-500">
                {lang === 'mr' ? 'प्रत्येक यशस्वी ₹९९ भरलेल्या नोंदणीवर १०% थेट कमिशन + विशेष सन्मान' : '10% Cash Commission + Special Trophies on every verified registration'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wide">
                {lang === 'mr' ? 'प्रत्येक नोंदणीवर (Base Rate)' : 'Per Registration'}
              </span>
              <p className="font-serif font-black text-xl text-[#9B1B1E]">
                {lang === 'mr' ? '१०% थेट कमिशन (₹९.९०)' : '10% Direct Cash (₹9.90)'}
              </p>
              <p className="text-xs text-stone-500">
                {lang === 'mr' ? 'पहिल्या नोंदणीपासून हमखास कमाई' : 'Earned from your very 1st referral'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300 space-y-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                {lang === 'mr' ? 'रौप्य राजदूत (१०+ रेफरल)' : 'Silver Tier (10+ Referrals)'}
              </span>
              <p className="font-serif font-black text-xl text-amber-900">
                {lang === 'mr' ? '₹९९+ कमिशन + ई-प्रशस्तिपत्र' : '₹99+ Cash + Official Certificate'}
              </p>
              <p className="text-xs text-stone-500">
                {lang === 'mr' ? 'नोंदणी फी १००% वसूल + अधिकृत राजदूत प्रमाणपत्र' : '100% Entry Fee back + QR verified honor scroll'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-orange-50 border border-orange-300 space-y-2">
              <span className="text-xs font-bold text-orange-800 uppercase tracking-wide">
                {lang === 'mr' ? 'सुवर्ण महापारितोषिक (राज्यस्तरीय टॉप ३)' : 'Top 3 State Champions'}
              </span>
              <p className="font-serif font-black text-xl text-orange-950">
                {lang === 'mr' ? '१०% कमिशन + ₹५,००० / ₹३,००० / ₹२,०००' : '10% Cash + ₹5,000 / ₹3,000 / ₹2,000'}
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
              {lang === 'mr' ? 'तुमची रेफरल स्थिती व कमाई तपासा' : 'Check Your Referral Status & Earnings'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              {lang === 'mr'
                ? 'तुमचा नोंदणीकृत तिकीट क्रमांक टाका आणि तुमच्या रेफरलद्वारे जोडलेले स्पर्धक व तुमची १०% कमिशन कमाई पहा.'
                : 'Enter your registered Ticket ID to track your referrals and total 10% cash commission earned.'}
            </p>
          </div>

          {sessionTicket && (
            <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-950 font-medium shadow-2xs">
              <span className="flex items-center gap-2">
                <span className="text-base">🎫</span>
                <span>
                  {lang === 'mr' ? 'चालू सत्रातील तिकीट थेट लोड झाले:' : 'Loaded from your active session:'}{' '}
                  <strong className="font-mono text-emerald-900 font-bold">{sessionTicket}</strong>
                </span>
              </span>
              <button
                type="button"
                onClick={() => fetchStats(sessionTicket)}
                className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 underline font-bold cursor-pointer"
              >
                <span>↻ {lang === 'mr' ? 'माहिती रिफ्रेश करा' : 'Refresh stats'}</span>
              </button>
            </div>
          )}

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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200 pb-4">
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

                <div className="flex items-center gap-4">
                  <div className="text-left sm:text-right bg-white/80 p-3 rounded-xl border border-amber-200">
                    <span className="text-[11px] text-stone-500 font-bold uppercase block">
                      {lang === 'mr' ? 'यशस्वी रेफरल्स:' : 'Referrals:'}
                    </span>
                    <p className="font-serif font-black text-2xl text-stone-900">
                      {stats.referralCount}
                    </p>
                  </div>

                  <div className="text-left sm:text-right bg-emerald-50 p-3 rounded-xl border border-emerald-300">
                    <span className="text-[11px] text-emerald-800 font-bold uppercase block">
                      {lang === 'mr' ? '१०% कमिशन कमाई:' : '10% Earnings:'}
                    </span>
                    <p className="font-serif font-black text-2xl text-emerald-800">
                      ₹{totalEarnings}
                    </p>
                    <span className="text-[10px] text-emerald-700 font-medium block">
                      (₹9.90 / नोंदणी)
                    </span>
                  </div>
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
                  `🚩 *लोकोत्सव २०२६ | महाराष्ट्र राज्य ऑनलाइन गणेश सजावट स्पर्धा*\n\nमी माझ्या बाप्पाच्या देखाव्याची अधिकृत नोंदणी पूर्ण केली आहे! (प्रवेशिका: ${stats.ticketId})\n\nतुम्हीही तुमच्या घरगुती गणपती किंवा मंडळाच्या सजावटीची केवळ ₹९९ मध्ये नोंदणी करा आणि रोख पारितोषिके जिंका.\n\n👉 माझ्या रेफरल लिंकवरून लगेच नोंदणी करा:\n${referralUrl}`
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
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs uppercase text-stone-700">
                      {lang === 'mr' ? 'नोंदणी झालेले मित्र:' : 'Referred Participants:'}
                    </h4>
                    <span className="text-xs font-bold text-emerald-800">
                      {lang === 'mr' ? `एकूण कमाई: ₹${totalEarnings}` : `Total Earned: ₹${totalEarnings}`}
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {stats.referredEntries.map((refUser: any, i: number) => (
                      <div
                        key={i}
                        className="bg-white px-3.5 py-2.5 rounded-lg border border-amber-100 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-stone-800 block">{refUser.fullName}</span>
                          <span className="text-[11px] text-stone-500 font-mono">तिकीट: {refUser.ticketId}</span>
                        </div>
                        <div className="text-right">
                          <span className="inline-block text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold text-[11px]">
                            + ₹9.90 (१०%)
                          </span>
                          <span className="text-[10px] text-stone-400 block">✓ नोंदणीकृत</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-500 text-center pt-2">
                  {lang === 'mr'
                    ? 'अद्याप कोणीही तुमच्या कोडवरून नोंदणी केलेली नाही. आजच आपली लिंक शेअर करून प्रति नोंदणी १०% (₹९.९०) कमवा!'
                    : 'No participants have registered with your code yet. Share your link today to start earning 10% (₹9.90) per registration!'}
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
              ? 'केवळ ₹99 मध्ये आपल्या बाप्पाच्या सजावटीची नोंदणी करा, अधिकृत तिकीट मिळवा आणि स्वतःचा रेफरल कोड सक्रिय करा.'
              : 'Register your Ganpati decoration for just ₹99, receive your official ticket pass, and activate your personal ambassador code.'}
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#9B1B1E] hover:bg-[#781416] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-98"
            >
              <span>{lang === 'mr' ? 'आता नोंदणी करा (₹99)' : 'Register Now (₹99)'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
