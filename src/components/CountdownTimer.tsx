'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { Trophy, Clock, AlertTriangle, Ticket } from 'lucide-react';
import TicketLookupModal from '@/components/TicketLookupModal';

// Result announcement deadline: 26th September 2026, 18:00:00 IST (+05:30)
const RESULTS_DEADLINE_ISO = '2026-09-26T18:00:00+05:30';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeLeft(targetTime: number): TimeLeft {
  const now = Date.now();
  const diff = targetTime - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

export default function CountdownTimer() {
  const { lang } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });
  const [mounted, setMounted] = useState(false);
  const [lookupModalOpen, setLookupModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date(RESULTS_DEADLINE_ISO).getTime();
    setTimeLeft(calculateTimeLeft(target));

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(target));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  // Announcement text items for the marquee
  const instructionsMr = [
    '🔴 लोकोत्सव २०२६: अधिकृत निकाल व १० महाविजेते जाहीर करण्यात आले आहेत!',
    '🏆 भव्य राज्यस्तरीय महास्पर्धेचा निकाल आता प्रसिद्ध झाला आहे. विजेत्यांचे हार्दिक अभिनंदन!',
    '⚖️ सन्माननीय परीक्षकांकडून सर्व ३६ जिल्ह्यांतील प्राप्त उत्कृष्ट देखाव्यांचे मूल्यमापन पूर्ण झाले आहे.',
    '🎖️ सर्व सहभागी स्पर्धकांना अधिकृत डिजिटल सहभाग प्रमाणपत्र उपलब्ध आहे.',
    '🌟 १० महाविजेत्यांची यादी व सजावट संकल्पना संकेतस्थळावर उपलब्ध आहेत.',
    '🎫 नोंदणी केलेल्या स्पर्धकांनी आपले तिकीट पाहण्यासाठी "तिकीट शोधा" बटणाचा वापर करावा.'
  ];

  const instructionsEn = [
    '🔴 Lokutsav 2026: Official results and Top 10 Champions have been declared!',
    '🏆 Grand State-Level Competition Results are now live. Hearty congratulations to all winners!',
    '⚖️ Expert jury evaluation across all 36 districts is completed.',
    '🎖️ Official State-Level digital certificates are now available for all participants.',
    '🌟 Top 10 Champions and their decoration concepts are published right here.',
    '🎫 Registered participants can check their entry status using the "Find Ticket" feature.'
  ];

  const instructions = lang === 'mr' ? instructionsMr : instructionsEn;

  // Calculate total remaining hours including days
  const totalRemainingHours = timeLeft.days * 24 + timeLeft.hours;

  return (
    <div className="w-full max-w-5xl mx-auto my-3 sm:my-4">
      {/* Sleek, compact marquee bar with fixed timer head and scrolling instructions */}
      <div className="relative flex items-center overflow-hidden rounded-xl bg-gradient-to-r from-[#630B0D] via-[#8C1417] to-[#630B0D] border border-amber-400/60 shadow-md text-white h-11 sm:h-12">
        {/* ================= FIXED TIMER HEAD PART (DOES NOT MOVE) ================= */}
        <div className="shrink-0 z-20 flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 h-full bg-stone-950/90 border-r border-amber-400/50 shadow-md">
          <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
          
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-600/90 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              {lang === 'mr' ? 'निकाल जाहीर' : 'Results Live'}
            </span>

            <span className="text-stone-500 text-xs hidden xs:inline">•</span>

            <span className="text-[11px] sm:text-xs font-bold text-amber-300 uppercase tracking-wide whitespace-nowrap hidden sm:inline">
              {lang === 'mr' ? '१० महाविजेते' : 'Top 10 Winners'}
            </span>

            <span className="text-stone-500 text-xs hidden sm:inline">•</span>

            {/* Static timer countdown digits */}
            {!mounted ? (
              <span className="font-mono font-bold text-amber-300 text-xs sm:text-sm tracking-tight whitespace-nowrap">
                --h : --m : --s
              </span>
            ) : timeLeft.isExpired ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-200 text-[10px] sm:text-xs font-bold whitespace-nowrap">
                <Clock className="w-3 h-3" />
                {lang === 'mr' ? 'निकाल प्रक्रिया सुरू' : 'Results Pending'}
              </span>
            ) : (
              <span className="font-mono font-black text-amber-300 text-xs sm:text-sm tracking-tight drop-shadow-sm whitespace-nowrap flex items-center">
                <span>{pad(totalRemainingHours)}</span>
                <span className="text-amber-400/80 text-[10px] sm:text-xs font-sans font-semibold ml-0.5 mr-1">h</span>
                <span>{pad(timeLeft.minutes)}</span>
                <span className="text-amber-400/80 text-[10px] sm:text-xs font-sans font-semibold ml-0.5 mr-1">m</span>
                <span className="text-amber-400">{pad(timeLeft.seconds)}</span>
                <span className="text-amber-400/80 text-[10px] sm:text-xs font-sans font-semibold ml-0.5">s</span>
              </span>
            )}
          </div>
        </div>

        {/* ================= MARQUEE BODY: SCROLLING ANNOUNCEMENT TEXT ================= */}
        <div className="relative flex-1 overflow-hidden h-full flex items-center">
          {/* Subtle gradient edge fades so text seamlessly glides in and out */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-[#630B0D] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-5 bg-gradient-to-l from-[#630B0D] to-transparent z-10" />

          {/* Continuous scrolling marquee track (duplicated twice for seamless loop) */}
          <div className="animate-marquee-scroll flex items-center gap-8 text-xs sm:text-sm font-medium text-amber-100 whitespace-nowrap">
            {/* First sequence */}
            <div className="flex items-center gap-8">
              {instructions.map((text, idx) => (
                <span key={`seq1-${idx}`} className="inline-flex items-center gap-2">
                  <span>{text}</span>
                  <span className="text-amber-400/60 font-bold">•</span>
                </span>
              ))}
            </div>

            {/* Second identical sequence for seamless loop */}
            <div className="flex items-center gap-8">
              {instructions.map((text, idx) => (
                <span key={`seq2-${idx}`} className="inline-flex items-center gap-2">
                  <span>{text}</span>
                  <span className="text-amber-400/60 font-bold">•</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT QUICK LINK (DESKTOP) ================= */}
        <button
          onClick={() => setLookupModalOpen(true)}
          className="hidden md:inline-flex shrink-0 items-center gap-1.5 px-3.5 py-1 mr-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-black transition-all hover:scale-102 active:scale-98 shadow-xs whitespace-nowrap z-20 cursor-pointer"
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>{lang === 'mr' ? 'तिकीट शोधा' : 'Find Ticket'}</span>
        </button>
      </div>

      <TicketLookupModal
        isOpen={lookupModalOpen}
        onClose={() => setLookupModalOpen(false)}
      />
    </div>
  );
}
