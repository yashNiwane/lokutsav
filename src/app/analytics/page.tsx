'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle2,
  AlertTriangle,
  Lock,
  RefreshCw,
  Smartphone,
  Monitor,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Filter,
  Eye,
  Camera,
  CreditCard,
  UserX,
  MessageCircle,
  LogOut,
  Sparkles,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days' | 'all'>('all');
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'funnel' | 'bottlenecks' | 'leads' | 'devices' | 'events'>('funnel');

  // Check saved session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPass = sessionStorage.getItem('lokutsav_analytics_pass');
      if (savedPass) {
        setPasscode(savedPass);
        verifyAndFetch(savedPass, 'all');
      }
    }
  }, []);

  const verifyAndFetch = async (passToUse: string, range: string = timeRange) => {
    if (!passToUse) return;
    setLoading(true);
    setAuthError('');

    try {
      const res = await fetch(`/api/analytics/stats?passcode=${encodeURIComponent(passToUse)}&timeRange=${range}`);
      const json = await res.json();

      if (res.ok && json.success) {
        setIsAuthenticated(true);
        setData(json.analytics);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('lokutsav_analytics_pass', passToUse);
        }
      } else {
        setAuthError(json.error || 'अवैध पासवर्ड / Invalid Passcode');
        setIsAuthenticated(false);
      }
    } catch {
      setAuthError('माहिती लोड करताना त्रुटी आली / Network Error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    verifyAndFetch(passcode, timeRange);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('lokutsav_analytics_pass');
    }
  };

  const handleRangeChange = (range: 'today' | '7days' | '30days' | 'all') => {
    setTimeRange(range);
    verifyAndFetch(passcode, range);
  };

  // Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#E5D7C0] shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#9B1B1E] bg-red-50 border border-red-200 px-3 py-1 rounded-full inline-block">
              सुरक्षित ॲनालिटिक्स डॅशबोर्ड
            </span>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-stone-900">
              वेबसाईट ॲनालिटिक्स कक्ष
            </h1>
            <p className="text-xs text-stone-600 leading-relaxed">
              युजर प्रवास, नोंदणी टप्पे, पूर्णत्व दर आणि ड्रॉप-ऑफ विश्लेषण पाहण्यासाठी अधिकृत पासवर्ड प्रविष्ट करा.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                प्रशासक पासवर्ड (Passcode)
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="password@123"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]/40 font-mono text-sm"
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#9B1B1E] hover:bg-[#781416] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>पडताळत आहे...</span>
                </>
              ) : (
                <>
                  <span>डॅशबोर्ड उघडा</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-1.5 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>२५६-बिट एन्क्रिप्टेड अधिकृत सुरक्षा</span>
          </div>
        </div>
      </div>
    );
  }

  const { overview, funnel, stuckPoints, deviceBreakdown, districtStats, incompleteLeads, recentEvents } = data || {};

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5D7C0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9B1B1E] bg-red-50 border border-red-200 px-3 py-1 rounded-full inline-flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5 text-[#9B1B1E]" />
                <span>लाइव्ह युजर प्रवास व ड्रॉप-ऑफ ॲनालिटिक्स</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live</span>
              </span>
            </div>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-stone-900 tracking-tight">
              वेबसाईट प्रगती व ड्रॉप-ऑफ विश्लेषण कक्ष
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              युजर्स नोंदणी प्रक्रियेत कुठे अडकतात, कोणत्या टप्प्यावर फॉर्म सोडतात आणि एकूण पूर्णत्व दर किती आहे याचे सखोल विश्लेषण.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Time range filter */}
            <div className="inline-flex p-1 rounded-xl bg-stone-100 border border-stone-200 text-xs font-bold">
              <button
                onClick={() => handleRangeChange('today')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === 'today' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                आज
              </button>
              <button
                onClick={() => handleRangeChange('7days')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === '7days' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                ७ दिवस
              </button>
              <button
                onClick={() => handleRangeChange('30days')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === '30days' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                ३० दिवस
              </button>
              <button
                onClick={() => handleRangeChange('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                सर्व
              </button>
            </div>

            <button
              onClick={() => verifyAndFetch(passcode, timeRange)}
              disabled={loading}
              className="p-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
              title="माहिती रिफ्रेश करा"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>बाहेर पडा</span>
            </button>
          </div>
        </div>

        {/* Overview KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs font-bold uppercase tracking-wider">एकूण नोंदणी सुरू (Visits)</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-serif font-black text-stone-900">
              {overview?.totalSessions || 0}
            </p>
            <span className="text-[11px] text-stone-500 block">
              फॉर्म भरण्यास सुरुवात केलेल्या युजर्सची संख्या
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs space-y-2 bg-gradient-to-br from-white to-emerald-50/40">
            <div className="flex items-center justify-between text-emerald-800">
              <span className="text-xs font-bold uppercase tracking-wider">यशस्वी पूर्ण नोंदी (Completed)</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-serif font-black text-emerald-800">
                {overview?.completed || 0}
              </p>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {overview?.conversionRate || 0}% पूर्णत्व
              </span>
            </div>
            <span className="text-[11px] text-stone-500 block">
              ₹९९ भरून तिकीट प्राप्त केलेले स्पर्धक
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-xs space-y-2 bg-gradient-to-br from-white to-red-50/40">
            <div className="flex items-center justify-between text-red-800">
              <span className="text-xs font-bold uppercase tracking-wider">अपूर्ण / सोडलेले (Drop-Offs)</span>
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-serif font-black text-red-700">
                {overview?.droppedOff || 0}
              </p>
              <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                {overview?.dropOffRate || 0}% ड्रॉप-ऑफ
              </span>
            </div>
            <span className="text-[11px] text-stone-500 block">
              फॉर्म अर्धवट सोडून गेलेले युजर्स
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-2 bg-gradient-to-br from-white to-amber-50/40">
            <div className="flex items-center justify-between text-amber-900">
              <span className="text-xs font-bold uppercase tracking-wider">सर्वात मोठा अडथळा (Bottleneck)</span>
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-base font-serif font-black text-amber-900 truncate">
              {stuckPoints?.[0]?.labelMr || 'फोटो अपलोड'}
            </p>
            <span className="text-[11px] text-amber-800 font-bold block">
              {stuckPoints?.[0]?.dropOffCount || 0} युजर्स येथे अडकले ({stuckPoints?.[0]?.percentage || 0}%)
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('funnel')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'funnel'
                ? 'bg-[#9B1B1E] text-white shadow-sm'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            📊 टप्पानिहाय फनेल (Stage Funnel)
          </button>

          <button
            onClick={() => setActiveTab('bottlenecks')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'bottlenecks'
                ? 'bg-[#9B1B1E] text-white shadow-sm'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            ⚠️ कुठे अडकतात? (Drop-off Points)
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'leads'
                ? 'bg-[#9B1B1E] text-white shadow-sm'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            📋 अपूर्ण नोंदी / संपर्क लीड्स ({incompleteLeads?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('devices')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'devices'
                ? 'bg-[#9B1B1E] text-white shadow-sm'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            📱 डिव्हाइस व जिल्हे (Audience)
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'events'
                ? 'bg-[#9B1B1E] text-white shadow-sm'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            ⚡ थेट ॲक्टिव्हिटी लॉग (Live Events)
          </button>
        </div>

        {/* ================= TAB 1: Stage-Wise Funnel ================= */}
        {activeTab === 'funnel' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5D7C0] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                <div>
                  <h2 className="font-serif font-black text-xl text-stone-900">
                    नोंदणी टप्पानिहाय प्रगती व फनेल विश्लेषण
                  </h2>
                  <p className="text-xs text-stone-500">
                    युजर पहिल्या टप्प्यापासून अंतिम पेमेंटपर्यंत कसा पुढे सरकतो आणि कुठे गळती होते याचे थेट विश्लेषण
                  </p>
                </div>
                <span className="text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-full w-fit">
                  एकूण फनेल रूपांतरण: <strong>{overview?.conversionRate || 0}%</strong>
                </span>
              </div>

              {/* Visual Funnel Cards */}
              <div className="space-y-4">
                {funnel?.map((stage: any, idx: number) => {
                  const maxCount = funnel[0]?.count || 1;
                  const barWidth = maxCount > 0 ? Math.max(8, (stage.count / maxCount) * 100) : 10;
                  const isCompleted = idx === funnel.length - 1;

                  return (
                    <div key={idx} className="bg-stone-50/70 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-8 h-8 rounded-xl font-serif font-bold text-sm flex items-center justify-center shrink-0 ${
                              isCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#9B1B1E] text-white'
                            }`}
                          >
                            {stage.step}
                          </span>
                          <div>
                            <p className="font-serif font-bold text-sm sm:text-base text-stone-900">
                              {stage.nameMr}
                            </p>
                            <span className="text-xs text-stone-500 font-sans">{stage.name}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-right">
                          <div>
                            <span className="text-xs text-stone-500 block">पोहोचलेले युजर्स</span>
                            <span className="font-serif font-black text-lg sm:text-xl text-stone-900">
                              {stage.count}
                            </span>
                          </div>

                          {!isCompleted && stage.dropOffCount > 0 && (
                            <div className="bg-red-50 border border-red-200 px-3 py-1 rounded-xl text-left sm:text-right">
                              <span className="text-[10px] text-red-600 uppercase font-bold block">येथून सोडले</span>
                              <span className="font-serif font-bold text-xs text-red-700">
                                -{stage.dropOffCount} ({stage.dropOffRate}%)
                              </span>
                            </div>
                          )}

                          {isCompleted && (
                            <div className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl text-left sm:text-right">
                              <span className="text-[10px] text-emerald-700 uppercase font-bold block">अंतिम यश</span>
                              <span className="font-serif font-bold text-xs text-emerald-800">
                                {stage.count} तिकीटे
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar Visualizer */}
                      <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden relative">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted
                              ? 'bg-emerald-600'
                              : idx === 0
                              ? 'bg-blue-600'
                              : idx === 1
                              ? 'bg-amber-600'
                              : 'bg-[#9B1B1E]'
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>

                      {/* Transition note */}
                      {idx < funnel.length - 1 && (
                        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                          <span>पुढील टप्प्यावर सरकण्याचा दर: <strong className="text-stone-800">{funnel[idx + 1]?.conversionFromPrev || 0}%</strong></span>
                          {stage.dropOffCount > 0 && (
                            <span className="text-red-600 font-medium">
                              ⚠️ {stage.dropOffCount} स्पर्धक पुढील टप्प्यापूर्वी थांबले
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: Drop-Off Bottlenecks ================= */}
        {activeTab === 'bottlenecks' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5D7C0] shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="font-serif font-black text-xl text-stone-900">
                युजर्स नेमके कुठे अडकतात? (Drop-Off Points & Bottlenecks)
              </h2>
              <p className="text-xs text-stone-500">
                फॉर्म भरताना युजरने शेवटची कोणती कृती केली आणि कोणत्या फील्डवर प्रक्रियेतून बाहेर पडला याचे विश्लेषण
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stuckPoints?.map((item: any, i: number) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                        क्र. {i + 1} अडथळा
                      </span>
                      <h3 className="font-serif font-bold text-base text-stone-900">
                        {item.labelMr}
                      </h3>
                      <p className="text-xs text-stone-500 font-mono">{item.label}</p>
                    </div>

                    <div className="text-right">
                      <span className="font-serif font-black text-2xl text-red-600 block">
                        {item.dropOffCount}
                      </span>
                      <span className="text-[11px] text-stone-500 font-medium">
                        {item.percentage}% गळती
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-red-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, item.percentage)}%` }}
                    />
                  </div>

                  {/* Contextual recommendation */}
                  <p className="text-[11px] text-stone-600 bg-white/80 p-2.5 rounded-xl border border-amber-100">
                    💡 <strong>कृती सूचना:</strong>{' '}
                    {item.field.includes('photo')
                      ? 'सजावटीचे फोटो लगेच उपलब्ध नसणाऱ्या स्पर्धकांसाठी "नंतर फोटो जोडा" किंवा व्हॉट्सॲपवर फोटो पाठवण्याचा पर्याय दिल्यास रूपांतरण वाढेल.'
                      : item.field.includes('phone')
                      ? 'फोन नंबर टाकताना केवळ १० अंकांचा व्हॉट्सॲप नंबर मागून स्पष्टता द्या.'
                      : item.field.includes('payment') || item.field.includes('razorpay')
                      ? 'पेमेंट स्क्रीनवर ₹९९ शुल्कामध्ये सहभागी प्रमाणपत्र, राज्यस्तरीय प्रदर्शन आणि बक्षिसांची स्पष्ट आठवण करून द्या.'
                      : 'हे फील्ड भरण्यास सोपे करा किंवा ऐच्छिक (Optional) ठेवा.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: Incomplete Leads (Abandoned Form Leads) ================= */}
        {activeTab === 'leads' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5D7C0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
              <div>
                <h2 className="font-serif font-black text-xl text-stone-900">
                  अपूर्ण नोंदणी झालेले स्पर्धक (Actionable Abandoned Leads)
                </h2>
                <p className="text-xs text-stone-500">
                  ज्या स्पर्धकांनी नाव किंवा व्हॉट्सॲप नंबर टाकला पण शेवटच्या टप्प्यावर फॉर्म सोडला, त्यांना थेट मदत करून नोंदणी पूर्ण करून घेता येईल.
                </p>
              </div>
              <span className="text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-full w-fit">
                एकूण लीड्स: <strong>{incompleteLeads?.length || 0}</strong>
              </span>
            </div>

            {incompleteLeads && incompleteLeads.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-100 text-stone-600 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5 rounded-l-xl">नाव (Name)</th>
                      <th className="p-3.5">फोन नंबर (Phone)</th>
                      <th className="p-3.5">जिल्हा (District)</th>
                      <th className="p-3.5">सोडलेला टप्पा (Stage)</th>
                      <th className="p-3.5">कारण / अडथळा (Field)</th>
                      <th className="p-3.5 rounded-r-xl text-right">कृती (Action)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {incompleteLeads.map((lead: any, idx: number) => {
                      const hasPhone = lead.phone && lead.phone !== 'उपलब्ध नाही' && lead.phone.length >= 10;
                      const waLink = hasPhone
                        ? `https://wa.me/91${lead.phone}?text=${encodeURIComponent(
                            `नमस्कार ${lead.fullName},\n\nआम्ही 'लोकोत्सव २०२६' महाराष्ट्र राज्य गणेश सजावट स्पर्धेतून संपर्क करत आहोत. आपली नोंदणी अपूर्ण राहिलेली दिसली आहे.\n\nआपल्याला फोटो अपलोड किंवा नोंदणी पूर्ण करताना काही अडचण येत आहे का? आम्ही मदत करण्यास उत्सुक आहोत.\n\n👉 नोंदणी पूर्ण करण्यासाठी येथे भेट द्या:\nhttps://lokutsav.com/register`
                          )}`
                        : '#';

                      return (
                        <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                          <td className="p-3.5 font-bold text-stone-900">{lead.fullName}</td>
                          <td className="p-3.5 font-mono text-stone-800">{lead.phone}</td>
                          <td className="p-3.5">{lead.district}</td>
                          <td className="p-3.5">
                            <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-bold text-[11px]">
                              टप्पा {lead.maxStepReached}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-stone-500 text-[11px]">
                            {lead.dropOffField}
                          </td>
                          <td className="p-3.5 text-right">
                            {hasPhone ? (
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-3 py-1.5 rounded-lg font-bold text-[11px] shadow-2xs transition-transform active:scale-98"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>व्हॉट्सॲप मदत</span>
                              </a>
                            ) : (
                              <span className="text-stone-400 text-[11px]">नंबर नाही</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-stone-500 text-center py-8">
                सध्या कोणतीही अर्धवट नोंदणी लीड उपलब्ध नाही.
              </p>
            )}
          </div>
        )}

        {/* ================= TAB 4: Devices & Geography ================= */}
        {activeTab === 'devices' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Device Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-[#E5D7C0] shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <Smartphone className="w-5 h-5 text-stone-800" />
                <h3 className="font-serif font-black text-lg text-stone-900">
                  डिव्हाइसनिहाय वापर व रूपांतरण
                </h3>
              </div>

              <div className="space-y-3">
                {deviceBreakdown?.map((item: any, i: number) => (
                  <div key={i} className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {item.device === 'Mobile' ? (
                        <Smartphone className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Monitor className="w-5 h-5 text-stone-700" />
                      )}
                      <div>
                        <p className="font-bold text-sm text-stone-900">{item.device}</p>
                        <span className="text-xs text-stone-500">{item.count} युजर्स</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-sm text-emerald-800 block">
                        {item.completed} पूर्ण
                      </span>
                      <span className="text-[11px] text-stone-500">
                        {item.conversionRate}% रूपांतरण
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* District Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-[#E5D7C0] shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <MapPin className="w-5 h-5 text-[#9B1B1E]" />
                <h3 className="font-serif font-black text-lg text-stone-900">
                  जिल्ह्यानुसार नोंदणी व ड्रॉप-ऑफ दर
                </h3>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {districtStats && districtStats.length > 0 ? (
                  districtStats.map((dist: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-stone-900 block">{dist.district}</span>
                        <span className="text-stone-500 text-[11px]">{dist.sessions} सुरू • {dist.completed} पूर्ण</span>
                      </div>

                      <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                        dist.dropOffRate > 50 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {dist.dropOffRate}% गळती
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-500 text-center py-6">अद्याप जिल्ह्यांची माहिती उपलब्ध नाही.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: Live Event Stream ================= */}
        {activeTab === 'events' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5D7C0] shadow-sm space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="font-serif font-black text-xl text-stone-900">
                थेट ॲक्टिव्हिटी स्ट्रीम (Live Event Stream)
              </h2>
              <p className="text-xs text-stone-500">
                वेबसाईटवर घडणाऱ्या ताज्या ५० कृतींचा थेट कालक्रमानुसार अहवाल
              </p>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {recentEvents && recentEvents.length > 0 ? (
                recentEvents.map((ev: any, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="font-bold text-stone-800">{ev.eventType}</span>
                      <span className="text-stone-500">[{ev.stageName}]</span>
                      {ev.field && <span className="text-amber-800 font-medium">({ev.field})</span>}
                    </div>
                    <span className="text-stone-400 text-[11px]">
                      {new Date(ev.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-500 text-center py-8">अद्याप ॲक्टिव्हिटी लॉग रिकामे आहेत.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
