'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { Search, X, CheckCircle2, AlertCircle, Download, Share2, Ticket, Loader2 } from 'lucide-react';

interface LookupEntry {
  ticketId: string;
  fullName: string;
  phone: string;
  district: string;
  category: string;
  themeTitle: string;
  paymentStatus: string;
  createdAt: string;
}

export default function TicketLookupModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<LookupEntry | null>(null);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = query.replace('+91', '').replace(/[\s-]/g, '').trim();
    if (!clean) {
      setError(
        lang === 'mr'
          ? 'कृपया आपला १०-अंकी मोबाईल नंबर प्रविष्ट करा'
          : 'Please enter your 10-digit mobile number'
      );
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/ticket/lookup?q=${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (data.success && data.found) {
        setResult(data.entry);
      } else {
        setError(
          data.message ||
            (lang === 'mr'
              ? 'या मोबाईल नंबरवर कोणतीही यशस्वी नोंदणी आढळली नाही.'
              : 'No completed registration found for this number.')
        );
      }
    } catch {
      setError(
        lang === 'mr'
          ? 'शोधताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.'
          : 'Error looking up ticket. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const shareOnWhatsApp = (ticketId: string) => {
    const text =
      lang === 'mr'
        ? `🚩 *लोकोत्सव २०२६ | अधिकृत प्रवेश तिकीट*\n\nमाझी लोकोत्सव २०२६ गणपती सजावट स्पर्धेत नोंदणी पूर्ण झाली आहे!\nमाझा तिकीट क्रमांक: *${ticketId}*\n\n👉 अधिक माहिती: https://lokutsav.com`
        : `🚩 *Lokutsav 2026 | Official Entry Ticket*\n\nMy Ganpati decoration has been registered for Lokutsav 2026!\nTicket ID: *${ticketId}*\n\n👉 Visit: https://lokutsav.com`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl border-2 border-amber-300 shadow-2xl overflow-hidden">
        {/* Header bar */}
        <div className="bg-gradient-to-r from-[#7B1113] via-[#9B1B1E] to-[#7B1113] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-amber-300" />
            <h3 className="font-serif font-black text-base sm:text-lg">
              {lang === 'mr' ? 'माझे तिकीट शोधा' : 'Find My Entry Ticket'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs sm:text-sm text-stone-600">
            {lang === 'mr'
              ? 'आपण नोंदणी केली असल्यास आपला १०-अंकी मोबाईल नंबर टाका. आपले तिकीट लगेच उपलब्ध होईल.'
              : 'Enter your registered 10-digit mobile number to retrieve your official Ticket ID and pass.'}
          </p>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="tel"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={lang === 'mr' ? 'उदा. 9823xxxxxx' : 'e.g. 9823xxxxxx'}
                maxLength={10}
                className="w-full px-4 py-3 bg-white border-2 border-stone-300 focus:border-[#9B1B1E] focus:outline-hidden rounded-xl text-base font-medium text-stone-900 shadow-2xs"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-[#9B1B1E] hover:bg-[#781416] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-60 whitespace-nowrap"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4 text-amber-300" />}
              <span>{lang === 'mr' ? 'शोधा' : 'Search'}</span>
            </button>
          </form>

          {/* Error / Not Found Message */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Result Pass */}
          {result && (
            <div className="mt-4 p-5 bg-gradient-to-br from-amber-50 to-orange-50/50 border-2 border-amber-300 rounded-2xl shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
                <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'mr' ? 'नोंदणी यशस्वी व पुष्टीकृत' : 'Verified & Confirmed'}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  ₹99 PAID
                </span>
              </div>

              <div className="text-center py-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  {lang === 'mr' ? 'अधिकृत तिकीट क्रमांक' : 'Official Ticket ID'}
                </span>
                <span className="font-mono text-2xl sm:text-3xl font-black text-[#9B1B1E] tracking-wider px-4 py-1.5 bg-white border border-amber-300 rounded-xl shadow-inner inline-block">
                  {result.ticketId}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-white/80 p-3 rounded-xl border border-amber-200/60">
                <div>
                  <span className="text-stone-500 block">{lang === 'mr' ? 'नाव' : 'Name'}</span>
                  <strong className="text-stone-900 truncate block">{result.fullName}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">{lang === 'mr' ? 'जिल्हा' : 'District'}</span>
                  <strong className="text-stone-900 block">{result.district}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">{lang === 'mr' ? 'वर्ग' : 'Category'}</span>
                  <strong className="text-stone-900 block">
                    {result.category === 'HOUSEHOLD'
                      ? lang === 'mr' ? 'घरगुती' : 'Household'
                      : lang === 'mr' ? 'सार्वजनिक' : 'Mandal'}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-500 block">{lang === 'mr' ? 'नोंदणी तारीख' : 'Date'}</span>
                  <strong className="text-stone-900 block">
                    {new Date(result.createdAt).toLocaleDateString()}
                  </strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => shareOnWhatsApp(result.ticketId)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-4 rounded-xl font-bold text-xs shadow-xs transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center bg-stone-200 hover:bg-stone-300 text-stone-800 py-2.5 px-5 rounded-xl font-bold text-xs transition-colors"
                >
                  <span>{lang === 'mr' ? 'बंद करा' : 'Close'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
