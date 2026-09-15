'use client';

import React, { useState, useEffect } from 'react';
import { ParticipantEntry, Criterion } from '@/lib/types';
import { JUDGING_CRITERIA_LIST } from '@/lib/seed-data';
import {
  ShieldCheck,
  Scale,
  Award,
  CheckCircle2,
  Lock,
  Search,
  ExternalLink,
  Sparkles,
  MapPin,
  TrendingUp,
  Video,
  Play,
  Film,
  Image as ImageIcon,
  Maximize2,
  X,
  LayoutGrid,
  List,
  Download,
  Eye,
  Camera,
  Layers,
  Smartphone,
  Monitor,
} from 'lucide-react';
import JuryVideoPlayer from '@/components/JuryVideoPlayer';

function isVideoDirectFile(url?: string): boolean {
  if (!url) return false;
  const clean = url.toLowerCase();
  return (
    clean.startsWith('/uploads/') ||
    clean.endsWith('.mp4') ||
    clean.endsWith('.mov') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.m4v')
  );
}

function isYouTubeUrl(url?: string): boolean {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
}

function getYouTubeEmbedUrl(url: string): string {
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes('watch?v=')) {
    const id = url.split('watch?v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  return url;
}

export default function JudgingPage() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  const [entries, setEntries] = useState<ParticipantEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'video' | 'pending' | 'scored'>('all');

  // Quick Video Preview Modal state
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [previewVideoTitle, setPreviewVideoTitle] = useState<string>('');

  // Active entry being evaluated
  const [activeEntry, setActiveEntry] = useState<ParticipantEntry | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({
    'crit-1': 8,
    'crit-2': 8,
    'crit-3': 8,
    'crit-4': 8,
    'crit-5': 8,
  });
  const [remarks, setRemarks] = useState('');
  const [submittingScore, setSubmittingScore] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  const [competitionPhase, setCompetitionPhaseState] = useState<'REGISTRATION_OPEN' | 'COMPLETED'>('REGISTRATION_OPEN');
  const [phaseUpdating, setPhaseUpdating] = useState(false);

  const fetchPhase = async () => {
    try {
      const res = await fetch('/api/competition/phase');
      const data = await res.json();
      if (data.success) {
        setCompetitionPhaseState(data.phase);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTogglePhase = async (newPhase: 'REGISTRATION_OPEN' | 'COMPLETED') => {
    setPhaseUpdating(true);
    try {
      const res = await fetch('/api/competition/phase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase: newPhase, passcode }),
      });
      const data = await res.json();
      if (data.success) {
        setCompetitionPhaseState(data.phase);
        alert(data.message);
      } else {
        alert(data.error || 'Failed to update phase');
      }
    } catch (e) {
      alert('Error updating competition phase');
    } finally {
      setPhaseUpdating(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcode.trim();
    if (clean === 'AYPtech@2026' || clean === 'lokutsav2026') {
      setIsAuthenticated(true);
      setAuthError('');
      fetchEntries();
      fetchPhase();
    } else {
      setAuthError('अवैध परीक्षक पासकोड / Invalid Passcode');
    }
  };

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/entries');
      const data = await res.json();
      if (data.success) {
        setEntries(data.entries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEvaluation = (entry: ParticipantEntry) => {
    setActiveEntry(entry);
    setScores({
      'crit-1': 8,
      'crit-2': 8,
      'crit-3': entry.idolType === 'SHADU_MATI_CLAY' ? 9 : 7,
      'crit-4': 8,
      'crit-5': 8,
    });
    setRemarks('');
    setFeedbackSuccess('');
  };

  // Calculate live weighted score out of 10
  const calculateTotal = () => {
    let sum = 0;
    for (const c of JUDGING_CRITERIA_LIST) {
      sum += (scores[c.id] || 0) * c.weight;
    }
    return Math.round(sum * 10) / 10;
  };

  const submitEvaluation = async () => {
    if (!activeEntry) return;
    setSubmittingScore(true);
    setFeedbackSuccess('');

    try {
      const res = await fetch('/api/judging/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entryId: activeEntry.id,
          scores,
          remarks,
          judgePasscode: passcode,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedbackSuccess('गुणदान यशस्वीरित्या नोंदवले व क्रमवारी अद्ययावत झाली!');
        fetchEntries(); // Refresh table
        setTimeout(() => {
          setActiveEntry(null);
        }, 1200);
      } else {
        alert(data.error || 'Failed to submit score');
      }
    } catch (err) {
      alert('Error recording score');
    } finally {
      setSubmittingScore(false);
    }
  };

  const filteredEntries = entries.filter((e) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      e.fullName.toLowerCase().includes(term) ||
      e.district.toLowerCase().includes(term) ||
      e.ticketId.toLowerCase().includes(term) ||
      e.themeTitle.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    if (mediaFilter === 'video') {
      return !!(e.videoUrl && e.videoUrl.trim().length > 0);
    }
    if (mediaFilter === 'pending') {
      return e.finalScore === undefined;
    }
    if (mediaFilter === 'scored') {
      return e.finalScore !== undefined;
    }
    return true;
  });

  const totalRevenue = entries.length * 99;
  const scoredCount = entries.filter((e) => e.finalScore !== undefined).length;

  if (!isAuthenticated) {
    return (
      <div className="py-20 bg-[#FAF7F2] min-h-[75vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-[#E5D7C0] shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] p-2 flex items-center justify-center mx-auto border border-[#E5D7C0] shadow-xs overflow-hidden">
            <img src="/logo.png" alt="Lokutsav Logo" className="w-full h-full object-contain" />
          </div>

          <div>
            <h1 className="font-serif font-black text-2xl text-stone-900">
              परीक्षक व प्रशासक कक्ष
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              प्रवेश करण्यासाठी अधिकृत ज्युरी पासकोड प्रविष्ट करा
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="password@123"
              className="w-full px-4 py-3 rounded-lg border border-stone-300 text-center font-mono focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]"
            />

            {authError && (
              <p className="text-xs text-red-600 font-semibold">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#9B1B1E] hover:bg-[#781416] text-white font-bold py-3.5 rounded-xl shadow-xs transition-colors text-sm cursor-pointer"
            >
              कक्ष उघडा (Login)
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                परीक्षक मंडळ अधिकृत प्रणाली
              </span>
            </div>
            <h1 className="font-serif font-black text-3xl text-stone-900 mt-1">
              स्पर्धा मूल्यमापन व ज्युरी कक्ष
            </h1>
          </div>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 self-start"
          >
            लॉगआउट
          </button>
        </div>

        {/* Competition Phase Control Banner */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5D7C0] shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${competitionPhase === 'REGISTRATION_OPEN' ? 'bg-amber-500' : 'bg-emerald-600'}`} />
              <span className="text-xs uppercase font-bold text-stone-500">
                स्पर्धा टप्पा नियंत्रण (Competition Phase Control)
              </span>
            </div>
            <p className="text-sm font-bold text-stone-900">
              {competitionPhase === 'REGISTRATION_OPEN' ? (
                <span>
                  🚩 <strong>स्पर्धा नोंदणी सुरू (ACTIVE COMPETITION)</strong> — गॅलरी व महाविजेते लोकांच्या नजरेतून लपवले आहेत.
                </span>
              ) : (
                <span>
                  🏆 <strong>स्पर्धा संपन्न (COMPLETED)</strong> — गॅलरी व महाविजेते सर्वांसाठी लाइव्ह करण्यात आले आहेत.
                </span>
              )}
            </p>
            <p className="text-xs text-stone-500">
              {competitionPhase === 'REGISTRATION_OPEN'
                ? 'ज्युरी या कक्षात सर्व देखावे सतत पाहू, तपासू, गुणदान करू शकतात. स्पर्धा संपेपर्यंत सामान्य जनतेला गॅलरी व विजेते दिसणार नाहीत.'
                : 'स्पर्धा पूर्ण झाली आहे, निकाल व संपूर्ण दालन संकेतस्थळावर सर्व प्रेक्षकांसाठी खुले आहे.'}
            </p>
          </div>

          <div className="shrink-0">
            {competitionPhase === 'REGISTRATION_OPEN' ? (
              <button
                onClick={() => handleTogglePhase('COMPLETED')}
                disabled={phaseUpdating}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
              >
                {phaseUpdating ? 'बदलत आहे...' : 'स्पर्धा समाप्त करा (गॅलरी व विजेते लाइव्ह करा)'}
              </button>
            ) : (
              <button
                onClick={() => handleTogglePhase('REGISTRATION_OPEN')}
                disabled={phaseUpdating}
                className="bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
              >
                {phaseUpdating ? 'बदलत आहे...' : 'परत स्पर्धा चालू टप्प्यात बदला (गॅलरी लपवा)'}
              </button>
            )}
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-[#E5D7C0] shadow-2xs">
            <span className="text-xs font-bold text-stone-500 block mb-1">एकूण नोंदणी</span>
            <p className="font-serif text-3xl font-black text-stone-900">{entries.length}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-[#E5D7C0] shadow-2xs">
            <span className="text-xs font-bold text-stone-500 block mb-1">एकूण जमा शुल्क</span>
            <p className="font-serif text-3xl font-black text-[#9B1B1E]">₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-[#E5D7C0] shadow-2xs">
            <span className="text-xs font-bold text-stone-500 block mb-1">परीक्षण पूर्ण नोंदी</span>
            <p className="font-serif text-3xl font-black text-emerald-700">{scoredCount}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-[#E5D7C0] shadow-2xs">
            <span className="text-xs font-bold text-stone-500 block mb-1">प्रतीक्षाधीन नोंदी</span>
            <p className="font-serif text-3xl font-black text-amber-600">{entries.length - scoredCount}</p>
          </div>
        </div>

        {/* Search, Filter & View Controls */}
        <div className="bg-white p-4 rounded-xl border border-[#E5D7C0] mb-6 space-y-3 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 flex items-center gap-2 bg-stone-50 px-3 py-2 rounded-lg border border-stone-200">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                placeholder="नाव, तिकीट क्रमांक, जिल्हा किंवा संकल्पनेनुसार शोधा..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm bg-transparent focus:outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="text-stone-400 hover:text-stone-700 text-xs px-1.5 py-0.5 rounded"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-[#9B1B1E] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>व्हिडिओ कार्ड देखावा</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#9B1B1E] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>तपशीलवार टेबल</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-stone-100 text-xs">
            <span className="text-stone-400 text-[11px] font-semibold mr-1">फिल्टर:</span>
            <button
              type="button"
              onClick={() => setMediaFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                mediaFilter === 'all'
                  ? 'bg-[#9B1B1E] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              सर्व नोंदी ({entries.length})
            </button>
            <button
              type="button"
              onClick={() => setMediaFilter('video')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                mediaFilter === 'video'
                  ? 'bg-[#9B1B1E] text-white'
                  : 'bg-amber-100/70 text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Video className="w-3 h-3 text-amber-700" />
              <span>व्हिडिओ असलेले ({entries.filter((e) => e.videoUrl && e.videoUrl.trim().length > 0).length})</span>
            </button>
            <button
              type="button"
              onClick={() => setMediaFilter('pending')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                mediaFilter === 'pending'
                  ? 'bg-[#9B1B1E] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              प्रतीक्षाधीन ({entries.length - scoredCount})
            </button>
            <button
              type="button"
              onClick={() => setMediaFilter('scored')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                mediaFilter === 'scored'
                  ? 'bg-[#9B1B1E] text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              परीक्षण पूर्ण ({scoredCount})
            </button>
          </div>
        </div>

        {/* ================= CARDS / VIDEO SHOWCASE VIEW ================= */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-2xl border border-[#E5D7C0] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {/* Card Top Info */}
                <div className="p-4 border-b border-stone-100 bg-stone-50/60">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                      {entry.ticketId}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                        {entry.category === 'HOUSEHOLD' ? 'घरगुती' : 'सार्वजनिक'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {entry.idolType === 'SHADU_MATI_CLAY' ? 'शाडू माती' : 'पारंपारिक'}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-base text-stone-900 truncate">
                    {entry.themeTitle}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-stone-600 mt-1">
                    <span className="font-medium text-stone-800 truncate">{entry.fullName}</span>
                    <span className="flex items-center gap-1 text-stone-500 shrink-0 text-[11px]">
                      <MapPin className="w-3 h-3 text-amber-600" />
                      <span>{entry.district}</span>
                    </span>
                  </div>
                </div>

                {/* Card Media (Video Player or Photo Preview) */}
                <div className="p-3 bg-stone-950 flex-1 flex flex-col justify-center">
                  {entry.videoUrl ? (
                    <JuryVideoPlayer
                      videoUrl={entry.videoUrl}
                      title={entry.themeTitle}
                      participantName={entry.fullName}
                      district={entry.district}
                      compact={true}
                      onOpenModal={() => {
                        setPreviewVideoUrl(entry.videoUrl || null);
                        setPreviewVideoTitle(`${entry.themeTitle} (${entry.fullName} - ${entry.district})`);
                      }}
                    />
                  ) : (
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-stone-900 border border-stone-800 flex flex-col items-center justify-center text-center p-4">
                      {entry.photoUrls.length > 0 ? (
                        <>
                          <img
                            src={entry.photoUrls[0]}
                            alt={entry.themeTitle}
                            className="absolute inset-0 w-full h-full object-cover opacity-40"
                          />
                          <div className="relative z-10 bg-black/70 backdrop-blur-xs p-3 rounded-xl border border-stone-700">
                            <ImageIcon className="w-6 h-6 text-stone-300 mx-auto mb-1" />
                            <p className="text-xs font-bold text-stone-200">केवळ छायाचित्रे उपलब्ध</p>
                            <p className="text-[10px] text-stone-400 mt-0.5">
                              {entry.photoUrls.length} फोटो अपलोड केले आहेत
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="text-stone-500 text-xs">कोणतीही मीडिया उपलब्ध नाही</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Photo Strip */}
                {entry.photoUrls.length > 0 && (
                  <div className="px-3 py-2 bg-stone-100/70 border-t border-stone-200 flex items-center gap-1.5 overflow-x-auto">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider shrink-0 mr-1">
                      फोटो ({entry.photoUrls.length}):
                    </span>
                    {entry.photoUrls.slice(0, 4).map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 rounded-lg overflow-hidden border border-stone-300 shrink-0 hover:border-[#9B1B1E] transition-colors relative group"
                        title={`फोटो ${idx + 1} मोठा करा`}
                      >
                        <img src={url} alt={`सजावट ${idx + 1}`} className="w-full h-full object-cover" />
                      </a>
                    ))}
                    {entry.photoUrls.length > 4 && (
                      <span className="text-[10px] font-bold text-stone-600 bg-stone-200 px-1.5 py-1 rounded shrink-0">
                        +{entry.photoUrls.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Card Footer Evaluation */}
                <div className="p-3.5 bg-white border-t border-stone-200 flex items-center justify-between gap-2">
                  <div>
                    {entry.finalScore ? (
                      <span className="inline-flex items-center gap-1 font-mono font-black text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <Award className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{entry.finalScore}/10</span>
                        {entry.finalRank && <span className="text-emerald-900 font-bold">#{entry.finalRank}</span>}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        ⏳ परीक्षण बाकी
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenEvaluation(entry)}
                    className="inline-flex items-center gap-1.5 bg-[#9B1B1E] hover:bg-[#781416] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{entry.finalScore ? 'पुनर्मूल्यांकन' : 'गुणदान करा'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= TABLE VIEW ================= */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-xl border border-[#E5D7C0] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 text-xs font-bold uppercase">
                  <tr>
                    <th className="py-3 px-4">तिकीट क्र.</th>
                    <th className="py-3 px-4">स्पर्धक व जिल्हा</th>
                    <th className="py-3 px-4">संकल्पना व मीडिया</th>
                    <th className="py-3 px-4">वर्ग व मूर्ती</th>
                    <th className="py-3 px-4 text-center">ज्युरी गुण</th>
                    <th className="py-3 px-4 text-right">कृती</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-stone-800">
                        {entry.ticketId}
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-stone-900">{entry.fullName}</p>
                        <p className="text-xs text-stone-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-600" />
                          <span>{entry.district} ({entry.city})</span>
                        </p>
                      </td>
                      <td className="py-4 px-4 max-w-xs">
                        <p className="font-medium text-stone-800 truncate">{entry.themeTitle}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-[11px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                            <ImageIcon className="w-3 h-3 text-stone-500" />
                            <span>{entry.photoUrls.length} फोटो</span>
                          </span>
                          {entry.videoUrl ? (
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setPreviewVideoUrl(entry.videoUrl || null);
                                  setPreviewVideoTitle(`${entry.themeTitle} (${entry.fullName} - ${entry.district})`);
                                }}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-0.5 rounded border border-amber-300 transition-colors cursor-pointer"
                              >
                                <Play className="w-3 h-3 fill-amber-900" />
                                <span>व्हिडिओ प्ले करा</span>
                              </button>
                              <a
                                href={entry.videoUrl}
                                target="_blank"
                                rel="noreferrer"
                                title="नवीन टॅबमध्ये उघडा"
                                className="p-1 text-stone-500 hover:text-stone-800 transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          ) : (
                            <span className="text-[11px] text-stone-400 italic">व्हिडिओ नाही</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs">
                        <span className="block text-stone-600 font-semibold">
                          {entry.category === 'HOUSEHOLD' ? 'घरगुती' : 'मंडळ'}
                        </span>
                        <span className="text-emerald-700 font-medium">
                          {entry.idolType === 'SHADU_MATI_CLAY' ? 'शाडू माती' : 'पारंपारिक'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {entry.finalScore ? (
                          <span className="inline-block font-mono font-bold text-sm bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded">
                            {entry.finalScore}/10
                            {entry.finalRank && ` (#${entry.finalRank})`}
                          </span>
                        ) : (
                          <span className="text-xs text-stone-400 italic">प्रलंबित</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleOpenEvaluation(entry)}
                          className="bg-[#9B1B1E] hover:bg-[#781416] text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors shadow-2xs cursor-pointer"
                        >
                          {entry.finalScore ? 'पुनर्मूल्यांकन' : 'गुणदान करा'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ================= Enhanced 2-Column Evaluation Modal ================= */}
      {activeEntry && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-6xl w-full max-h-[94vh] overflow-y-auto border border-stone-300 p-5 sm:p-8 space-y-6 shadow-2xl my-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-black px-2 py-0.5 bg-stone-200 text-stone-800 rounded">
                    {activeEntry.ticketId}
                  </span>
                  <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{activeEntry.district} ({activeEntry.city})</span>
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                    {activeEntry.category === 'HOUSEHOLD' ? 'घरगुती देखावा' : 'सार्वजनिक मंडळ देखावा'}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {activeEntry.idolType === 'SHADU_MATI_CLAY' ? 'शाडू माती मूर्ती' : 'पारंपारिक मूर्ती'}
                  </span>
                </div>

                <h2 className="font-serif font-black text-2xl text-stone-900 mt-1">
                  {activeEntry.themeTitle}
                </h2>
                <p className="text-xs text-stone-600">
                  स्पर्धक: <strong className="text-stone-900">{activeEntry.fullName}</strong> • पत्ता: {activeEntry.address}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveEntry(null)}
                className="text-stone-400 hover:text-stone-700 text-xl font-bold p-1 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 2-Column Responsive Layout: Left (Video & Media) | Right (Scorecard) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Video Player & Photos Gallery (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                {/* Dedicated High-Visibility Video Player */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Film className="w-4 h-4 text-[#9B1B1E]" />
                      <span>सजावट व्हिडिओ देखावा (Video Tour)</span>
                    </h4>
                    {activeEntry.videoUrl && (
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                        ✓ व्हिडिओ उपलब्ध
                      </span>
                    )}
                  </div>

                  {activeEntry.videoUrl ? (
                    <JuryVideoPlayer
                      videoUrl={activeEntry.videoUrl}
                      title={activeEntry.themeTitle}
                      participantName={activeEntry.fullName}
                      district={activeEntry.district}
                      onOpenModal={() => {
                        setPreviewVideoUrl(activeEntry.videoUrl || null);
                        setPreviewVideoTitle(`${activeEntry.themeTitle} (${activeEntry.fullName} - ${activeEntry.district})`);
                      }}
                    />
                  ) : (
                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
                      <Film className="w-5 h-5 text-amber-700 shrink-0" />
                      <div>
                        <p className="font-bold">या स्पर्धकाने व्हिडिओ जोडलेला नाही</p>
                        <p className="text-[11px] text-amber-800 mt-0.5">
                          खालील छायाचित्रे व माहितीच्या आधारे मूल्यांकन करावे.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Photo Gallery with Full Resolution View */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-stone-500" />
                      <span>सजावट छायाचित्रे ({activeEntry.photoUrls.length} Photos)</span>
                    </span>
                    <span className="text-[11px] text-stone-400 font-normal">फोटोवर क्लिक करून मोठा आकार पहा</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {activeEntry.photoUrls.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="aspect-4/3 rounded-xl overflow-hidden border border-stone-300 bg-stone-100 group relative block shadow-2xs hover:border-[#9B1B1E] transition-colors"
                      >
                        <img
                          src={url}
                          alt={`सजावट छायाचित्र ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <span className="absolute bottom-1.5 right-1.5 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <Maximize2 className="w-2.5 h-2.5" />
                          मोठे करा
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Decoration Description & Materials */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 text-xs space-y-2">
                  <p><strong>संकल्पना माहिती:</strong> {activeEntry.themeDescription}</p>
                  {activeEntry.materialsUsed && (
                    <p><strong>वापरलेले साहित्य:</strong> {activeEntry.materialsUsed}</p>
                  )}
                </div>
              </div>

              {/* Right Column: Sticky Scoring Scorecard (5 cols) */}
              <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4 lg:sticky lg:top-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-[#9B1B1E]" />
                    <span>परीक्षक गुणदान पत्रक</span>
                  </h3>
                  <div className="font-mono text-base text-[#9B1B1E] font-black bg-amber-100 px-3 py-1 rounded-xl border border-amber-200">
                    एकूण: {calculateTotal()}/10
                  </div>
                </div>

                {/* 5 Criteria Score Sliders */}
                <div className="space-y-3">
                  {JUDGING_CRITERIA_LIST.map((c) => (
                    <div key={c.id} className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span>{c.nameMr} <span className="text-stone-400 font-normal">({Math.round(c.weight * 100)}%)</span></span>
                        <span className="font-mono font-black text-[#9B1B1E] text-sm">
                          {scores[c.id] || 0} / 10
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={scores[c.id] || 0}
                        onChange={(e) =>
                          setScores({ ...scores, [c.id]: parseFloat(e.target.value) })
                        }
                        className="w-full accent-[#9B1B1E] cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    परीक्षकांची शेरे / सूचना (वैकल्पिक)
                  </label>
                  <textarea
                    rows={2}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="सजावटीच्या वैशिष्ट्यांबद्दल शेरा लिहा..."
                    className="w-full text-xs p-3 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#9B1B1E]"
                  />
                </div>

                {feedbackSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold text-center">
                    {feedbackSuccess}
                  </div>
                )}

                {/* Submit Score */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setActiveEntry(null)}
                    className="text-xs font-semibold px-4 py-2.5 text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    रद्द करा
                  </button>
                  <button
                    type="button"
                    onClick={submitEvaluation}
                    disabled={submittingScore}
                    className="flex-1 bg-[#9B1B1E] hover:bg-[#781416] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{submittingScore ? 'नोंद होत आहे...' : 'गुण निश्चित करा'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Video Preview Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="max-w-5xl w-full my-auto space-y-3">
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setPreviewVideoUrl(null)}
                className="text-stone-400 hover:text-white p-2 rounded-xl bg-stone-900 border border-stone-800 hover:bg-stone-800 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              >
                <X className="w-4 h-4" />
                <span>बंद करा (Close)</span>
              </button>
            </div>

            <JuryVideoPlayer
              videoUrl={previewVideoUrl}
              title={previewVideoTitle || 'सजावट व्हिडिओ देखावा'}
              className="shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
