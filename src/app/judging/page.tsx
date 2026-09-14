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
} from 'lucide-react';

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
    if (passcode === 'AYPtech@2026') {
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

  const filteredEntries = entries.filter(
    (e) =>
      e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.ticketId.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              placeholder="पासकोड प्रविष्ट करा / Enter Passcode"
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

        {/* Search & Filter bar */}
        <div className="bg-white p-4 rounded-xl border border-[#E5D7C0] mb-6 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="नाव, तिकीट क्रमांक किंवा जिल्ह्यानुसार शोधा..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm bg-transparent focus:outline-none"
          />
        </div>

        {/* Entries Table */}
        <div className="bg-white rounded-xl border border-[#E5D7C0] overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 text-xs font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">तिकीट क्र.</th>
                  <th className="py-3 px-4">स्पर्धक व जिल्हा</th>
                  <th className="py-3 px-4">संकल्पना</th>
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
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewVideoUrl(entry.videoUrl || null);
                              setPreviewVideoTitle(`${entry.themeTitle} (${entry.fullName} - ${entry.district})`);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-0.5 rounded border border-amber-300 transition-colors cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-amber-900" />
                            <span>व्हिडिओ देखावा (Video)</span>
                          </button>
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
                        className="bg-[#9B1B1E] hover:bg-[#781416] text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors shadow-2xs"
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
      </div>

      {/* ================= Evaluation Modal ================= */}
      {activeEntry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-stone-300 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-stone-500">
                  {activeEntry.ticketId} • {activeEntry.district}
                </span>
                <h2 className="font-serif font-black text-2xl text-stone-900 mt-0.5">
                  {activeEntry.themeTitle}
                </h2>
                <p className="text-xs text-stone-600">
                  स्पर्धक: <strong>{activeEntry.fullName}</strong> | वर्ग: {activeEntry.category === 'HOUSEHOLD' ? 'घरगुती' : 'सार्वजनिक मंडळ'}
                </p>
              </div>

              <button
                onClick={() => setActiveEntry(null)}
                className="text-stone-400 hover:text-stone-700 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Video Tour Player */}
            {activeEntry.videoUrl ? (
              <div className="bg-stone-950 rounded-2xl p-4 border border-stone-800 space-y-3 shadow-lg">
                <div className="flex items-center justify-between text-white flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#9B1B1E] flex items-center justify-center text-white shadow-xs">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-stone-100 flex items-center gap-2">
                        <span>सजावट व्हिडिओ देखावा (Video Tour)</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-900/80 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full">
                          थेट अपलोड (5 min limit)
                        </span>
                      </h4>
                      <p className="text-[11px] text-stone-400">परीक्षकांसाठी अधिकृत व्हिडिओ पडताळणी</p>
                    </div>
                  </div>

                  <a
                    href={activeEntry.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded-lg border border-stone-700 transition-colors"
                  >
                    <span>नवीन विंडोमध्ये उघडा</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="rounded-xl overflow-hidden bg-black aspect-16/9 max-h-[360px] flex items-center justify-center shadow-inner">
                  {isVideoDirectFile(activeEntry.videoUrl) ? (
                    <video
                      key={activeEntry.videoUrl}
                      src={activeEntry.videoUrl}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-contain"
                    />
                  ) : isYouTubeUrl(activeEntry.videoUrl) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(activeEntry.videoUrl)}
                      title="Decoration Video Tour"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      key={activeEntry.videoUrl}
                      src={activeEntry.videoUrl}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <Film className="w-4 h-4 text-amber-700 shrink-0" />
                <span>या स्पर्धकाने व्हिडिओ जोडलेला नाही (केवळ खालील छायाचित्रे उपलब्ध आहेत).</span>
              </div>
            )}

            {/* Photo Gallery with Full Resolution View */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-stone-500" />
                  <span>सजावट छायाचित्रे (Photos - {activeEntry.photoUrls.length})</span>
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

            <div className="bg-white p-4 rounded-xl border border-stone-200 text-xs space-y-2">
              <p><strong>संकल्पना माहिती:</strong> {activeEntry.themeDescription}</p>
              {activeEntry.materialsUsed && (
                <p><strong>साहित्य:</strong> {activeEntry.materialsUsed}</p>
              )}
            </div>

            {/* 5 Criteria Score Sliders */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center justify-between">
                <span>5 निकषांवर गुणदान (प्रत्येकी 1 ते 10)</span>
                <span className="font-mono text-base text-[#9B1B1E] font-black bg-amber-100 px-3 py-1 rounded">
                  एकूण भारांकित गुण: {calculateTotal()}/10
                </span>
              </h3>

              <div className="space-y-3">
                {JUDGING_CRITERIA_LIST.map((c) => (
                  <div key={c.id} className="bg-white p-3.5 rounded-xl border border-stone-200">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span>{c.nameMr} ({Math.round(c.weight * 100)}%)</span>
                      <span className="font-mono font-bold text-[#9B1B1E] text-sm">
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
                className="w-full text-xs p-3 rounded-lg border border-stone-300 bg-white"
              />
            </div>

            {feedbackSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold text-center">
                {feedbackSuccess}
              </div>
            )}

            {/* Submit Score */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setActiveEntry(null)}
                className="text-xs font-semibold px-4 py-2.5 text-stone-600 hover:text-stone-900"
              >
                रद्द करा
              </button>
              <button
                type="button"
                onClick={submitEvaluation}
                disabled={submittingScore}
                className="bg-[#9B1B1E] hover:bg-[#781416] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-sm transition-colors"
              >
                {submittingScore ? 'नोंद होत आहे...' : 'गुण निश्चित करा व क्रमवारी लावा'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Video Preview Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 rounded-2xl max-w-3xl w-full border border-stone-800 p-5 space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-base text-stone-100 truncate max-w-md">
                  {previewVideoTitle || 'सजावट व्हिडिओ देखावा'}
                </h3>
              </div>
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-black aspect-16/9 max-h-[440px] flex items-center justify-center">
              {isVideoDirectFile(previewVideoUrl) ? (
                <video
                  src={previewVideoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : isYouTubeUrl(previewVideoUrl) ? (
                <iframe
                  src={getYouTubeEmbedUrl(previewVideoUrl)}
                  title="Decoration Video Tour"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={previewVideoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
              <span>कालावधी: कमाल 5 मिनिटे (Direct Video Tour)</span>
              <a
                href={previewVideoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <span>नवीन टॅबमध्ये उघडा</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
