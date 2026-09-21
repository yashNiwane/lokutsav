'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Clock, Flame, ArrowRight, AlertTriangle } from 'lucide-react';

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

export default function CountdownTimer({ compact = false }: { compact?: boolean }) {
  const { lang } = useLanguage();
  const [targetTimestamp, setTargetTimestamp] = useState<number>(() =>
    new Date(DEADLINE_ISO).getTime()
  );
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
    setTargetTimestamp(target);
    setTimeLeft(calculateTimeLeft(target));

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(target));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  // SSR or before mount fallback
  if (!mounted) {
    return (
      <div className="w-full max-w-3xl mx-auto my-4 bg-gradient-to-r from-[#7B1113] via-[#9B1B1E] to-[#7B1113] rounded-2xl p-4 sm:p-5 border-2 border-amber-400/50 shadow-xl text-white">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2 text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4 animate-spin" />
            <span>
              {lang === 'mr'
                ? '⏳ नोंदणीची अंतिम मुदत: २४ सप्टेंबर २०२६'
                : '⏳ Registration Deadline: 24th September 2026'}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-2 w-full max-w-md">
            {['--', '--', '--', '--'].map((item, i) => (
              <div
                key={i}
                className="bg-black/40 border border-amber-400/30 rounded-xl p-2.5 sm:p-3 text-center"
              >
                <div className="text-xl sm:text-3xl font-black font-mono text-amber-300">
                  {item}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (timeLeft.isExpired) {
    return (
      <div className="w-full max-w-3xl mx-auto my-4 bg-stone-900 border-2 border-stone-700 rounded-2xl p-4 sm:p-5 text-center text-white shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/60 text-red-300 text-xs font-bold mb-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{lang === 'mr' ? 'नोंदणी समाप्त' : 'Registration Closed'}</span>
        </div>
        <h4 className="text-lg sm:text-xl font-bold font-serif">
          {lang === 'mr'
            ? 'स्पर्धेची नोंदणी २४ सप्टेंबर २०२६ रोजी समाप्त झाली आहे.'
            : 'Competition registrations closed on 24th September 2026.'}
        </h4>
        <p className="text-xs sm:text-sm text-stone-400 mt-1">
          {lang === 'mr'
            ? 'परीक्षकांद्वारे मूल्यांकन सुरू आहे. निकाल लवकरच जाहीर केला जाईल.'
            : 'Jury evaluations are underway. Results will be announced shortly.'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto my-5 relative overflow-hidden bg-gradient-to-br from-[#6A0C0E] via-[#9B1B1E] to-[#5C0A0C] rounded-2xl p-4 sm:p-6 border-2 border-amber-400/70 shadow-2xl text-white">
      {/* Subtle gold glow & decorative accent */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold shadow-xs mb-2">
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>
            {lang === 'mr'
              ? '⏳ नोंदणीची अंतिम मुदत: २४ सप्टेंबर २०२६'
              : '⏳ Final Registration Deadline: 24th September 2026'}
          </span>
        </div>

        {/* Subtitle / Urgency Label */}
        <h3 className="font-serif font-black text-base sm:text-xl text-amber-100 tracking-tight mt-1 mb-3">
          {lang === 'mr'
            ? 'नोंदणी समाप्त होण्यास उर्वरित वेळ'
            : 'Registration Closes In'}
        </h3>

        {/* 4-Box Countdown Timer Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full max-w-md sm:max-w-lg mb-3">
          {/* Days */}
          <div className="bg-gradient-to-b from-stone-950/80 to-stone-900/90 border border-amber-400/40 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-inner flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-4xl font-black font-mono text-amber-300 tracking-tight drop-shadow-sm">
              {pad(timeLeft.days)}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-stone-300 uppercase tracking-wider mt-1">
              {lang === 'mr' ? 'दिवस' : 'Days'}
            </span>
          </div>

          {/* Hours */}
          <div className="bg-gradient-to-b from-stone-950/80 to-stone-900/90 border border-amber-400/40 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-inner flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-4xl font-black font-mono text-amber-300 tracking-tight drop-shadow-sm">
              {pad(timeLeft.hours)}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-stone-300 uppercase tracking-wider mt-1">
              {lang === 'mr' ? 'तास' : 'Hours'}
            </span>
          </div>

          {/* Minutes */}
          <div className="bg-gradient-to-b from-stone-950/80 to-stone-900/90 border border-amber-400/40 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-inner flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-4xl font-black font-mono text-amber-300 tracking-tight drop-shadow-sm">
              {pad(timeLeft.minutes)}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-stone-300 uppercase tracking-wider mt-1">
              {lang === 'mr' ? 'मिंट' : 'Mins'}
            </span>
          </div>

          {/* Seconds */}
          <div className="bg-gradient-to-b from-stone-950/80 to-stone-900/90 border border-amber-400/40 rounded-xl sm:rounded-2xl p-2 sm:p-3.5 shadow-inner flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-4xl font-black font-mono text-amber-400 tracking-tight drop-shadow-sm animate-pulse">
              {pad(timeLeft.seconds)}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-stone-300 uppercase tracking-wider mt-1">
              {lang === 'mr' ? 'सेकंद' : 'Secs'}
            </span>
          </div>
        </div>

        {/* Footer Warning note */}
        <p className="text-[11px] sm:text-xs text-amber-200/90 font-medium max-w-md">
          {lang === 'mr'
            ? '⚠️ २४ सप्टेंबर रात्री ११:५९ नंतर कोणतीही नवीन नोंदणी स्वीकारली जाणार नाही.'
            : '⚠️ No entries will be accepted after 11:59 PM on 24th September 2026.'}
        </p>
      </div>
    </div>
  );
}
