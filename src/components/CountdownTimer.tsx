'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Flame, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

// Registration deadline: 24th September 2026, 23:59:59 IST (+05:30)
const DEADLINE_ISO = '2026-09-24T23:59:59+05:30';

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

  useEffect(() => {
    setMounted(true);
    const target = new Date(DEADLINE_ISO).getTime();
    setTimeLeft(calculateTimeLeft(target));

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(target));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  // Instructions text items for the marquee
  const instructionsMr = [
    '⏳ अंतिम नोंदणी तारीख: २४ सप्टेंबर २०२६ रात्री ११:५९ पर्यंतच!',
    '🏆 केवळ ₹९९ मध्ये सहभाग नोंदवा व जिंका ₹२,००,०००+ रोख पारितोषिके आणि मानाची सुवर्ण ट्रॉफी!',
    '📸 घरगुती व सार्वजनिक मंडळांच्या सजावटीचे फोटो किंवा ३ मिनिटांचा व्हिडिओ थेट अपलोड करा.',
    '🚩 महाराष्ट्रातील सर्व ३६ जिल्ह्यांमधील गणेशोत्सवांसाठी खुली राज्यस्तरीय महास्पर्धा.',
    '⚖️ १००% पारदर्शक व निष्पक्ष ज्युरी परीक्षण + अधिकृत डिजिटल सन्मानपत्र.',
    '⚡ वेळ संपत आहे — आजच आपला सहभाग नोंदवा!'
  ];

  const instructionsEn = [
    '⏳ Registration Deadline: 24th September 2026, 11:59 PM IST!',
    '🏆 Register for just ₹99 & compete for ₹2,00,000+ in Cash Prizes and Prestigious Trophies!',
    '📸 Upload high-resolution photos or up to a 3-minute video of your decoration.',
    '🚩 Open across all 36 districts of Maharashtra for household and mandal setups.',
    '⚖️ 100% impartial jury evaluation with official participation certificate.',
    '⚡ Hurry, registrations closing soon — Enter today!'
  ];

  const instructions = lang === 'mr' ? instructionsMr : instructionsEn;

  return (
    <div className="w-full max-w-5xl mx-auto my-3 sm:my-4">
      {/* Sleek, compact marquee bar with fixed timer head and scrolling instructions */}
      <div className="relative flex items-center overflow-hidden rounded-xl bg-gradient-to-r from-[#630B0D] via-[#8C1417] to-[#630B0D] border border-amber-400/60 shadow-md text-white h-11 sm:h-12">
        {/* ================= FIXED TIMER HEAD PART (DOES NOT MOVE) ================= */}
        <div className="shrink-0 z-20 flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 h-full bg-stone-950/90 border-r border-amber-400/50 shadow-md">
          <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse shrink-0" />
          
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-[11px] sm:text-xs font-bold text-amber-300 uppercase tracking-wide whitespace-nowrap">
              {lang === 'mr' ? '२४ सप्टें.' : '24 Sept'}
            </span>

            <span className="text-stone-500 text-xs hidden xs:inline">•</span>

            {/* Static timer countdown digits */}
            {!mounted ? (
              <span className="font-mono font-bold text-amber-300 text-xs sm:text-sm tracking-tight whitespace-nowrap">
                --d : --h : --m : --s
              </span>
            ) : timeLeft.isExpired ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-900/80 text-red-200 text-[10px] sm:text-xs font-bold whitespace-nowrap">
                <AlertTriangle className="w-3 h-3" />
                {lang === 'mr' ? 'नोंदणी समाप्त' : 'Closed'}
              </span>
            ) : (
              <span className="font-mono font-black text-amber-300 text-xs sm:text-sm tracking-tight drop-shadow-sm whitespace-nowrap">
                <span>{pad(timeLeft.days)}</span>
                <span className="text-amber-400/80 text-[10px] sm:text-xs font-sans font-semibold ml-0.5 mr-1">d</span>
                <span>{pad(timeLeft.hours)}</span>
                <span className="text-amber-400/80 text-[10px] sm:text-xs font-sans font-semibold ml-0.5 mr-1">h</span>
                <span>{pad(timeLeft.minutes)}</span>
                <span className="text-amber-400/80 text-[10px] sm:text-xs font-sans font-semibold ml-0.5 mr-1">m</span>
                <span className="text-amber-400">{pad(timeLeft.seconds)}</span>
                <span className="text-amber-400/80 text-[10px] sm:text-xs font-sans font-semibold ml-0.5">s</span>
              </span>
            )}
          </div>
        </div>

        {/* ================= MARQUEE BODY: SCROLLING INSTRUCTION TEXT ================= */}
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
        <Link
          href="/register"
          className="hidden md:inline-flex shrink-0 items-center gap-1.5 px-3.5 py-1 mr-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-black transition-all hover:scale-102 active:scale-98 shadow-xs whitespace-nowrap z-20"
        >
          <span>{lang === 'mr' ? 'नोंदणी करा' : 'Register'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
