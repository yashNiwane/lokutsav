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
  Download,
  Search,
  Phone,
  Mail,
  FileText,
  X,
  ExternalLink,
  Film,
  Building,
  Award,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days' | 'all'>('all');
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'all-leads' | 'funnel' | 'bottlenecks' | 'devices' | 'events'>('all-leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'incomplete' | 'completed' | 'has-phone'>('all');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

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

  // CSV Export for all captured people and incomplete leads
  const exportAllLeadsCsv = () => {
    const leadsToExport = data?.allLeads || [];
    if (!leadsToExport || leadsToExport.length === 0) {
      alert('कोणतीही माहिती उपलब्ध नाही / No data available to export');
      return;
    }

    const headers = [
      'Session ID',
      'Full Name (नाव)',
      'Phone (फोन)',
      'Email (ईमेल)',
      'District (जिल्हा)',
      'City / Village (शहर / गाव)',
      'Address (पत्ता)',
      'Category (प्रवर्ग)',
      'Idol Type (मूर्ती प्रकार)',
      'Theme Title (देखावा शीर्षक)',
      'Theme Description (वर्णन)',
      'Materials Used (साहित्य)',
      'Photos Count (फोटो संख्या)',
      'Photo URLs',
      'Video URL',
      'Referred By (रेफरल कोड)',
      'Status (स्थिती)',
      'Payment Status (पेमेंट)',
      'Ticket ID (तिकीट क्र)',
      'Max Step Reached (टप्पा)',
      'Drop Off Field (अडथळा)',
      'Device (डिव्हाइस)',
      'Started At (नोंदणी वेळ)',
      'Last Active At (शेवटची वेळ)',
    ];

    const rows = leadsToExport.map((l: any) => [
      `"${(l.sessionId || '').replace(/"/g, '""')}"`,
      `"${(l.fullName || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.district || '').replace(/"/g, '""')}"`,
      `"${(l.city || '').replace(/"/g, '""')}"`,
      `"${(l.address || '').replace(/"/g, '""')}"`,
      `"${(l.category || '').replace(/"/g, '""')}"`,
      `"${(l.idolType || '').replace(/"/g, '""')}"`,
      `"${(l.themeTitle || '').replace(/"/g, '""')}"`,
      `"${(l.themeDescription || '').replace(/"/g, '""')}"`,
      `"${(l.materialsUsed || '').replace(/"/g, '""')}"`,
      l.photosCount || 0,
      `"${(l.photoUrls || []).join(' | ').replace(/"/g, '""')}"`,
      `"${(l.videoUrl || '').replace(/"/g, '""')}"`,
      `"${(l.referredBy || '').replace(/"/g, '""')}"`,
      l.isCompleted ? '"Completed"' : '"Incomplete"',
      `"${(l.paymentStatus || '').replace(/"/g, '""')}"`,
      `"${(l.ticketId || '').replace(/"/g, '""')}"`,
      l.maxStepReached || 1,
      `"${(l.dropOffField || '').replace(/"/g, '""')}"`,
      `"${(l.deviceType || '').replace(/"/g, '""')}"`,
      `"${(l.createdAt || '').replace(/"/g, '""')}"`,
      `"${(l.lastActive || '').replace(/"/g, '""')}"`,
    ]);

    // UTF-8 BOM so Excel opens Marathi Unicode characters properly
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `lokutsav_all_people_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyLeadJson = (lead: any) => {
    if (!lead) return;
    const jsonStr = JSON.stringify(lead, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              युजर प्रवास, नोंदणी टप्पे, पूर्णत्व दर, अपूर्ण फॉर्म आणि सर्व व्यक्तींचा डेटा पाहण्यासाठी अधिकृत पासवर्ड प्रविष्ट करा.
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
                placeholder="Enter Passcode"
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

  const { overview, funnel, stuckPoints, deviceBreakdown, districtStats, incompleteLeads, recentEvents, allLeads } = data || {};

  // Client-side filter for all leads
  const filteredLeads = (allLeads || []).filter((lead: any) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        (lead.fullName && lead.fullName.toLowerCase().includes(q)) ||
        (lead.phone && lead.phone.includes(q)) ||
        (lead.email && lead.email.toLowerCase().includes(q)) ||
        (lead.city && lead.city.toLowerCase().includes(q)) ||
        (lead.district && lead.district.toLowerCase().includes(q)) ||
        (lead.address && lead.address.toLowerCase().includes(q)) ||
        (lead.themeTitle && lead.themeTitle.toLowerCase().includes(q)) ||
        (lead.referredBy && lead.referredBy.toLowerCase().includes(q)) ||
        (lead.ticketId && lead.ticketId.toLowerCase().includes(q)) ||
        (lead.sessionId && lead.sessionId.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (filterStatus === 'incomplete') {
      return !lead.isCompleted && lead.paymentStatus !== 'COMPLETED';
    }
    if (filterStatus === 'completed') {
      return lead.isCompleted || lead.paymentStatus === 'COMPLETED';
    }
    if (filterStatus === 'has-phone') {
      return lead.phone && lead.phone.trim().length >= 10;
    }

    return true;
  });

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
              वेबसाईट प्रगती व डेटा विश्लेषण कक्ष
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              प्रत्येक व्यक्तीचा भरलेला संपूर्ण डेटा (अपूर्ण फॉर्म्ससह), ड्रॉप-ऑफ विश्लेषण आणि टप्पानिहाय प्रगतीचा थेट अहवाल.
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
              <span className="text-xs font-bold uppercase tracking-wider">नोंदणी सुरू केलेल्या व्यक्ती (Visits)</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-serif font-black text-stone-900">
              {overview?.totalSessions || 0}
            </p>
            <span className="text-[11px] text-stone-500 block">
              डेटाबेसमध्ये कॅप्चर झालेले एकूण युजर सेशन्स
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
              फॉर्म अर्धवट सोडून गेलेले युजर्स (डेटा सेव्ह केला आहे)
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
              {stuckPoints?.[0]?.dropOffCount || 0} युजर्स येथे थांबले ({stuckPoints?.[0]?.percentage || 0}%)
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all-leads')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'all-leads'
                ? 'bg-[#9B1B1E] text-white shadow-sm'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>👥 सर्व व्यक्ती व संपूर्ण फॉर्म डेटा ({allLeads?.length || 0})</span>
          </button>

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

        {/* ================= TAB 1: All Persons & Full Form Data ================= */}
        {activeTab === 'all-leads' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5D7C0] shadow-sm space-y-6">
              {/* Header & Controls */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                <div className="space-y-1">
                  <h2 className="font-serif font-black text-xl text-stone-900 flex items-center gap-2">
                    <span>सर्व व्यक्तींचा डेटाबेस व भरलेला फॉर्म</span>
                    <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                      {filteredLeads.length} व्यक्ती
                    </span>
                  </h2>
                  <p className="text-xs text-stone-500">
                    प्रत्येक व्यक्तीने फॉर्ममध्ये टाइप केलेली सर्व माहिती (नाव, फोन, पत्ता, देखावा, फोटो, व्हिडिओ, रेफरल कोड) येथे लाइव्ह उपलब्ध आहे.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={exportAllLeadsCsv}
                    className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>📥 संपूर्ण डेटा CSV डाउनलोड करा</span>
                  </button>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="नाव, फोन, जिल्हा, शहर किंवा देखावा शोधा..."
                    className="w-full pl-9 pr-8 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]/30 bg-stone-50/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Status Filter Chips */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      filterStatus === 'all'
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    सर्व ({allLeads?.length || 0})
                  </button>
                  <button
                    onClick={() => setFilterStatus('incomplete')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      filterStatus === 'incomplete'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    अपूर्ण फॉर्म ({allLeads?.filter((l: any) => !l.isCompleted)?.length || 0})
                  </button>
                  <button
                    onClick={() => setFilterStatus('completed')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      filterStatus === 'completed'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    पूर्ण झालेले ({allLeads?.filter((l: any) => l.isCompleted)?.length || 0})
                  </button>
                  <button
                    onClick={() => setFilterStatus('has-phone')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      filterStatus === 'has-phone'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    फोन नंबर उपलब्ध ({allLeads?.filter((l: any) => l.phone && l.phone.length >= 10)?.length || 0})
                  </button>
                </div>
              </div>

              {/* Leads Table */}
              {filteredLeads.length > 0 ? (
                <div className="overflow-x-auto border border-stone-200 rounded-2xl">
                  <table className="w-full text-left text-xs text-stone-700">
                    <thead className="bg-stone-100 text-stone-600 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                      <tr>
                        <th className="p-3.5">स्पर्धक नाव व आयडी</th>
                        <th className="p-3.5">संपर्क (Phone / Email)</th>
                        <th className="p-3.5">स्थान (Location)</th>
                        <th className="p-3.5">देखावा व वर्ग</th>
                        <th className="p-3.5">प्रगती / स्थिती</th>
                        <th className="p-3.5">भरलेली माहिती</th>
                        <th className="p-3.5 text-right">सविस्तर कृती</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredLeads.map((lead: any, idx: number) => {
                        const hasPhone = lead.phone && lead.phone.trim().length >= 10;
                        const waLink = hasPhone
                          ? `https://wa.me/91${lead.phone}?text=${encodeURIComponent(
                              `नमस्कार ${lead.fullName || 'स्पर्धक'},\n\nआम्ही 'लोकोत्सव २०२६' महाराष्ट्र राज्य गणेश सजावट स्पर्धेतून संपर्क करत आहोत. आपली नोंदणी पाहण्यात आली.\n\nआपल्याला फोटो अपलोड किंवा नोंदणी पूर्ण करताना काही मदत हवी असल्यास नक्की सांगा.\n\n👉 स्पर्धा लिंक:\nhttps://lokutsav.com/register`
                            )}`
                          : null;

                        return (
                          <tr key={idx} className="hover:bg-amber-50/30 transition-colors">
                            <td className="p-3.5">
                              <div className="font-bold text-stone-900 text-sm">
                                {lead.fullName || (
                                  <span className="text-stone-400 font-normal italic">नाव भरले नाही</span>
                                )}
                              </div>
                              <div className="text-[10px] font-mono text-stone-400">
                                {lead.sessionId ? lead.sessionId.substring(0, 14) + '...' : ''}
                              </div>
                              <span className="text-[10px] text-stone-500">
                                {new Date(lead.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </td>

                            <td className="p-3.5">
                              {hasPhone ? (
                                <div className="space-y-1">
                                  <a
                                    href={`tel:${lead.phone}`}
                                    className="font-mono font-bold text-stone-800 hover:text-[#9B1B1E] flex items-center gap-1"
                                  >
                                    <Phone className="w-3 h-3 text-stone-500" />
                                    <span>{lead.phone}</span>
                                  </a>
                                  {waLink && (
                                    <a
                                      href={waLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold hover:bg-emerald-100"
                                    >
                                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                                      <span>व्हॉट्सॲप मेसेज</span>
                                    </a>
                                  )}
                                </div>
                              ) : (
                                <span className="text-stone-400 text-[11px] italic">फोन नाही</span>
                              )}
                              {lead.email && (
                                <div className="text-[11px] text-stone-500 truncate max-w-[140px]" title={lead.email}>
                                  {lead.email}
                                </div>
                              )}
                            </td>

                            <td className="p-3.5">
                              <div className="font-medium text-stone-900">
                                {lead.district || lead.city ? (
                                  `${lead.district || ''} ${lead.city ? `(${lead.city})` : ''}`
                                ) : (
                                  <span className="text-stone-400 italic">स्थान भरले नाही</span>
                                )}
                              </div>
                              {lead.address && (
                                <p className="text-[11px] text-stone-500 line-clamp-1 max-w-[160px]" title={lead.address}>
                                  {lead.address}
                                </p>
                              )}
                            </td>

                            <td className="p-3.5">
                              <div className="font-medium text-stone-800">
                                {lead.themeTitle || (
                                  <span className="text-stone-400 italic">शीर्षक नाही</span>
                                )}
                              </div>
                              <span className="text-[10px] text-stone-500 block">
                                {lead.category === 'MANDAL' ? 'सार्वजनिक मंडळ' : 'घरगुती गणेशोत्सव'}
                              </span>
                            </td>

                            <td className="p-3.5">
                              {lead.isCompleted ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>पूर्ण (₹९९ भरले)</span>
                                </span>
                              ) : (
                                <div className="space-y-0.5">
                                  <span className="inline-block px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[11px]">
                                    टप्पा {lead.maxStepReached} वर थांबले
                                  </span>
                                  {lead.dropOffField && (
                                    <span className="block text-[10px] text-stone-500 font-mono">
                                      अडथळा: {lead.dropOffField}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>

                            <td className="p-3.5">
                              <div className="flex flex-wrap gap-1 max-w-[160px]">
                                {lead.phone && (
                                  <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium">
                                    ✓ फोन
                                  </span>
                                )}
                                {lead.address && (
                                  <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-medium">
                                    ✓ पत्ता
                                  </span>
                                )}
                                {lead.photosCount > 0 && (
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-medium">
                                    ✓ {lead.photosCount} फोटो
                                  </span>
                                )}
                                {lead.videoUrl && (
                                  <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-medium">
                                    ✓ व्हिडिओ
                                  </span>
                                )}
                                {lead.referredBy && (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-medium">
                                    Ref: {lead.referredBy}
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => setSelectedLead(lead)}
                                className="inline-flex items-center gap-1 bg-[#9B1B1E] hover:bg-[#781416] text-white px-3 py-1.5 rounded-lg font-bold text-[11px] shadow-2xs transition-all cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>तपशील पहा</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                  <UserX className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs text-stone-600 font-bold">कोणतेही रेकॉर्ड सापडले नाही.</p>
                  <p className="text-[11px] text-stone-400 mt-1">कृपया शोध शब्द बदला किंवा फिल्टर रिसेट करा.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: Stage-Wise Funnel ================= */}
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

        {/* ================= TAB 3: Drop-Off Bottlenecks ================= */}
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

        {/* ================= MODAL: Full Lead Details & Form Inspection ================= */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-3xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="p-5 sm:p-6 bg-stone-900 text-white flex items-start justify-between gap-4 shrink-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      आयडी: {selectedLead.sessionId}
                    </span>
                    {selectedLead.isCompleted ? (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>पूर्ण नोंदणी</span>
                      </span>
                    ) : (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>अपूर्ण (टप्पा {selectedLead.maxStepReached})</span>
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-white">
                    {selectedLead.fullName || 'नाव भरलेले नाही'}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyLeadJson(selectedLead)}
                    className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                    title="JSON स्नॅपशॉट कॉपी करा"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copied ? 'कॉपी झाले!' : 'JSON कॉपी'}</span>
                  </button>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="p-6 overflow-y-auto space-y-6 text-stone-800 text-xs sm:text-sm">
                {/* 1. वैयक्तिक व संपर्क माहिती */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#9B1B1E]" />
                      <span>१. वैयक्तिक व संपर्क माहिती (Personal Details)</span>
                    </h3>

                    {selectedLead.phone && selectedLead.phone.length >= 10 && (
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${selectedLead.phone}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          <span>कॉल करा</span>
                        </a>
                        <a
                          href={`https://wa.me/91${selectedLead.phone}?text=${encodeURIComponent(
                            `नमस्कार ${selectedLead.fullName || 'स्पर्धक'},\n\nआम्ही 'लोकोत्सव २०२६' महाराष्ट्र राज्य गणेश सजावट स्पर्धेतून संपर्क करत आहोत.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>व्हॉट्सॲप</span>
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] text-stone-500 block">पूर्ण नाव (Full Name)</span>
                      <strong className="text-stone-900">{selectedLead.fullName || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500 block">व्हॉट्सॲप नंबर (Phone)</span>
                      <strong className="text-stone-900 font-mono">{selectedLead.phone || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500 block">ईमेल पत्ता (Email)</span>
                      <strong className="text-stone-900">{selectedLead.email || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500 block">जिल्हा व शहर (District & City)</span>
                      <strong className="text-stone-900">
                        {selectedLead.district || '—'} {selectedLead.city ? `(${selectedLead.city})` : ''}
                      </strong>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[11px] text-stone-500 block">संपूर्ण पत्ता (Full Address)</span>
                      <p className="text-stone-800 bg-white p-2.5 rounded-xl border border-stone-200">
                        {selectedLead.address || '—'}
                      </p>
                    </div>
                    {selectedLead.referredBy && (
                      <div>
                        <span className="text-[11px] text-stone-500 block">रेफरल कोड (Referred By)</span>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold">
                          {selectedLead.referredBy}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. स्पर्धा व देखावा माहिती */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                    <Award className="w-4 h-4 text-amber-700" />
                    <h3 className="font-serif font-bold text-sm text-stone-900">
                      २. स्पर्धा व देखावा माहिती (Competition & Decoration)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] text-stone-500 block">स्पर्धा प्रवर्ग (Category)</span>
                      <strong className="text-stone-900">
                        {selectedLead.category === 'MANDAL' ? 'सार्वजनिक गणेशोत्सव मंडळ' : 'घरगुती गणेशोत्सव'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500 block">गणेश मूर्ती प्रकार (Idol Type)</span>
                      <strong className="text-stone-900">{selectedLead.idolType || '—'}</strong>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[11px] text-stone-500 block">देखाव्याचे नाव / शीर्षक (Theme Title)</span>
                      <p className="font-bold text-stone-900 text-sm">
                        {selectedLead.themeTitle || '—'}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[11px] text-stone-500 block">देखाव्याची संकल्पना व वर्णन (Theme Description)</span>
                      <p className="text-stone-800 bg-white p-3 rounded-xl border border-stone-200 whitespace-pre-wrap leading-relaxed">
                        {selectedLead.themeDescription || '—'}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[11px] text-stone-500 block">वापरलेले पर्यावरणपूरक साहित्य (Materials Used)</span>
                      <p className="text-stone-800 bg-white p-2.5 rounded-xl border border-stone-200">
                        {selectedLead.materialsUsed || '—'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. फोटो व व्हिडिओ अपलोड */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                    <Camera className="w-4 h-4 text-purple-700" />
                    <h3 className="font-serif font-bold text-sm text-stone-900">
                      ३. अपलोड केलेले फोटो व व्हिडिओ ({selectedLead.photoUrls?.length || 0} फोटो)
                    </h3>
                  </div>

                  {selectedLead.photoUrls && selectedLead.photoUrls.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedLead.photoUrls.map((url: string, i: number) => (
                        <div key={i} className="group relative rounded-xl overflow-hidden border border-stone-300 aspect-video bg-stone-200">
                          <img
                            src={url}
                            alt={`Photo ${i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            <span>उघडा</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-stone-400 italic text-xs py-2">कोणतेही फोटो अपलोड केलेले नाहीत.</p>
                  )}

                  {selectedLead.videoUrl && (
                    <div className="pt-2">
                      <span className="text-[11px] text-stone-500 block mb-1">व्हिडिओ लिंक / फाईल:</span>
                      <a
                        href={selectedLead.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-purple-700 hover:text-purple-900 underline font-mono text-xs break-all"
                      >
                        <Film className="w-3.5 h-3.5 shrink-0" />
                        <span>{selectedLead.videoUrl}</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* 4. प्रवास, ड्रॉप-ऑफ व सिस्टम माहिती */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                    <Clock className="w-4 h-4 text-stone-700" />
                    <h3 className="font-serif font-bold text-sm text-stone-900">
                      ४. प्रवास, ड्रॉप-ऑफ व तांत्रिक माहिती (Diagnostics)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[11px] text-stone-500 block">नोंदणी स्थिती</span>
                      <strong className={selectedLead.isCompleted ? 'text-emerald-700' : 'text-amber-700'}>
                        {selectedLead.isCompleted ? 'पूर्ण (Completed)' : 'अपूर्ण (Dropped Off)'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500 block">पेमेंट स्थिती</span>
                      <span className="font-mono font-bold text-stone-900">{selectedLead.paymentStatus}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500 block">तिकीट क्रमांक</span>
                      <span className="font-mono font-bold text-stone-900">{selectedLead.ticketId || '—'}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500 block">गाठलेला टप्पा</span>
                      <strong className="text-stone-900">टप्पा {selectedLead.maxStepReached}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500 block">शेवटचे ॲक्टिव्ह फील्ड</span>
                      <span className="font-mono text-red-600 font-bold">{selectedLead.dropOffField || '—'}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500 block">डिव्हाइस प्रकार</span>
                      <span className="text-stone-900 capitalize">{selectedLead.deviceType}</span>
                    </div>
                    <div className="sm:col-span-3 text-[11px] text-stone-500 pt-1 border-t border-stone-200 flex justify-between flex-wrap gap-2">
                      <span>नोंदणी सुरुवात: {new Date(selectedLead.createdAt).toLocaleString()}</span>
                      <span>शेवटची ॲक्टिव्हिटी: {new Date(selectedLead.lastActive).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-end shrink-0">
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  बंद करा
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
