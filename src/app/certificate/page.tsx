'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import CertificateDocument, { CertificateData } from '@/components/CertificateDocument';
import { generateCertificatePdf, generateCertificateImage } from '@/lib/certificate-pdf';
import {
  Award,
  Search,
  Download,
  Share2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCheck,
  Sparkles,
  Phone,
  Ticket,
  Image as ImageIcon,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';

function CertificatePageContent() {
  const { lang } = useLanguage();
  const searchParams = useSearchParams();

  const [phone, setPhone] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingPng, setDownloadingPng] = useState(false);
  const [error, setError] = useState('');
  const [unpaidNotice, setUnpaidNotice] = useState(false);

  const [entries, setEntries] = useState<CertificateData[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<CertificateData | null>(null);

  // Pre-fill from query params if available (e.g. ?phone=9823... or ?ticket=LOK-...)
  useEffect(() => {
    const qPhone = searchParams.get('phone') || '';
    const qTicket = searchParams.get('ticket') || searchParams.get('ticketId') || '';
    if (qPhone) setPhone(qPhone.replace('+91', '').replace(/[\s-]/g, ''));
    if (qTicket) setTicketId(qTicket.toUpperCase());

    if (qPhone && qPhone.length === 10) {
      handleSearch(qPhone, qTicket);
    }
  }, [searchParams]);

  const handleSearch = async (phoneVal?: string, ticketVal?: string) => {
    const searchPhone = (phoneVal !== undefined ? phoneVal : phone).replace('+91', '').replace(/[\s-]/g, '').trim();
    const searchTicket = (ticketVal !== undefined ? ticketVal : ticketId).trim().toUpperCase();

    if (!searchPhone || searchPhone.length < 10) {
      setError(
        lang === 'mr'
          ? 'कृपया आपला वैध १०-अंकी नोंदणीकृत मोबाईल नंबर प्रविष्ट करा.'
          : 'Please enter your valid 10-digit registered mobile number.'
      );
      return;
    }

    setLoading(true);
    setError('');
    setUnpaidNotice(false);
    setEntries([]);
    setSelectedEntry(null);

    try {
      let url = `/api/certificate/lookup?phone=${encodeURIComponent(searchPhone)}`;
      if (searchTicket) {
        url += `&ticketId=${encodeURIComponent(searchTicket)}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.success && data.found && data.entries && data.entries.length > 0) {
        setEntries(data.entries);
        setSelectedEntry(data.entries[0]);
      } else if (data.unpaid) {
        setUnpaidNotice(true);
        setError(data.message);
      } else {
        setError(
          data.message ||
            (lang === 'mr'
              ? 'या मोबाईल नंबरवर कोणतीही पुष्टीकृत नोंदणी आढळली नाही.'
              : 'No confirmed registration found for this mobile number.')
        );
      }
    } catch {
      setError(
        lang === 'mr'
          ? 'प्रमाणपत्र शोधताना तांत्रिक अडचण आली. कृपया पुन्हा प्रयत्न करा.'
          : 'Failed to search for certificate. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!selectedEntry) return;
    setDownloadingPdf(true);
    try {
      await generateCertificatePdf(
        'certificate-render-target',
        selectedEntry.ticketId,
        selectedEntry.fullName
      );
    } catch (err) {
      console.error('PDF generation error:', err);
      alert(
        lang === 'mr'
          ? 'प्रमाणपत्र PDF तयार करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.'
          : 'Failed to generate PDF. Please try again.'
      );
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadPng = async () => {
    if (!selectedEntry) return;
    setDownloadingPng(true);
    try {
      await generateCertificateImage(
        'certificate-render-target',
        selectedEntry.ticketId,
        selectedEntry.fullName
      );
    } catch (err) {
      console.error('PNG export error:', err);
      alert(
        lang === 'mr'
          ? 'प्रमाणपत्र फोटो तयार करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.'
          : 'Failed to generate image. Please try again.'
      );
    } finally {
      setDownloadingPng(false);
    }
  };

  const shareOnWhatsApp = () => {
    if (!selectedEntry) return;
    const text =
      lang === 'mr'
        ? `🚩 *लोकोत्सव २०२६ | अधिकृत सहभाग प्रमाणपत्र*\n\nमी 'लोकोत्सव ऑनलाइन गणेश सजावट स्पर्धा २०२६' मध्ये सहभाग घेतला असून माझे अधिकृत सहभाग प्रमाणपत्र प्राप्त झाले आहे!\n\nनाव: *${selectedEntry.fullName}*\nतिकीट क्र.: *${selectedEntry.ticketId}*\n\n👉 आपले प्रमाणपत्र डाउनलोड करा: https://lokutsav.com/certificate`
        : `🚩 *Lokutsav 2026 | Official Participation Certificate*\n\nI participated in Lokutsav Online Ganesh Decoration Competition 2026 and received my official Certificate of Participation!\n\nName: *${selectedEntry.fullName}*\nTicket ID: *${selectedEntry.ticketId}*\n\n👉 Download your certificate: https://lokutsav.com/certificate`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ============================================================ */}
        {/* SCREEN 1: SEARCH SCREEN (Shown when no certificate selected)  */}
        {/* ============================================================ */}
        {!selectedEntry ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Page Top Heading */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs sm:text-sm font-bold shadow-2xs">
                <Award className="w-4 h-4 text-[#9B1B1E]" />
                <span>
                  {lang === 'mr'
                    ? 'अधिकृत सहभाग प्रमाणपत्र • लोकोत्सव २०२६'
                    : 'Official Participation Certificate • Lokutsav 2026'}
                </span>
              </div>

              <h1 className="font-serif font-black text-2xl sm:text-4xl lg:text-5xl text-[#1C1917] tracking-tight">
                {lang === 'mr' ? 'सहभाग प्रमाणपत्र डाउनलोड करा' : 'Download Participation Certificate'}
              </h1>

              <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto font-normal leading-relaxed">
                {lang === 'mr'
                  ? 'स्पर्धेत सहभागी झालेल्या सर्व पुष्टीकृत गणेशभक्तांना सन्मानपूर्वक सहभाग प्रमाणपत्र प्रदान करण्यात येत आहे. आपला नोंदणीकृत मोबाईल नंबर टाकून प्रमाणपत्र लगेच प्राप्त करा.'
                  : 'Official certificate of participation for all verified participants. Enter your registered mobile number to generate and download your high-resolution certificate.'}
              </p>
            </div>

            {/* Search Card */}
            <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300/80 shadow-lg space-y-5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
                className="space-y-4"
              >
                {/* Phone Number (Compulsory) */}
                <div>
                  <label className="text-xs sm:text-sm font-bold text-stone-800 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-[#9B1B1E]" />
                      <span>{lang === 'mr' ? 'नोंदणीकृत मोबाईल नंबर' : 'Registered Mobile Number'}</span>
                    </span>
                    <span className="text-[11px] text-[#9B1B1E] font-bold">
                      {lang === 'mr' ? '* अनिवार्य' : '* Required'}
                    </span>
                  </label>
                  <div className="relative flex rounded-xl shadow-2xs">
                    <span className="inline-flex items-center px-4 rounded-l-xl border-2 border-r-0 border-stone-300 bg-stone-100 text-stone-700 font-bold text-sm">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9823xxxxxx"
                      maxLength={10}
                      className="w-full px-4 py-3 bg-white border-2 border-stone-300 focus:border-[#9B1B1E] focus:outline-hidden rounded-r-xl text-base font-semibold text-stone-900 tracking-wider"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Ticket ID (Optional) */}
                <div>
                  <label className="text-xs sm:text-sm font-bold text-stone-800 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Ticket className="w-4 h-4 text-amber-700" />
                      <span>{lang === 'mr' ? 'तिकीट क्रमांक' : 'Ticket ID'}</span>
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      {lang === 'mr' ? '(ऐच्छिक / Optional)' : '(Optional)'}
                    </span>
                  </label>
                  <input
                    type="text"
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value.toUpperCase().trim())}
                    placeholder="उदा. LOK-2026-1024"
                    className="w-full px-4 py-3 bg-white border-2 border-stone-300 focus:border-[#9B1B1E] focus:outline-hidden rounded-xl text-base font-semibold text-stone-900 placeholder:text-stone-400 placeholder:font-normal"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    {lang === 'mr'
                      ? 'आपल्याकडे तिकीट क्रमांक नसल्यास फक्त मोबाईल नंबर टाकूनही शोधू शकता.'
                      : 'If you do not have your Ticket ID, simply search with your mobile number.'}
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#9B1B1E] hover:bg-[#7F1518] text-white py-3.5 px-6 rounded-xl font-bold text-base shadow-md transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{lang === 'mr' ? 'प्रमाणपत्र शोधत आहे...' : 'Searching Certificate...'}</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 text-amber-300" />
                      <span>{lang === 'mr' ? 'प्रमाणपत्र शोधा' : 'Find My Certificate'}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Error / Not Found Alert */}
              {error && (
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm flex items-start gap-3 border ${
                    unpaidNotice
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">{error}</p>
                    {unpaidNotice && (
                      <p className="text-xs text-amber-800">
                        {lang === 'mr'
                          ? 'नोंदणी शुल्क (₹९९) पूर्ण केलेल्या पुष्टीकृत स्पर्धकांनाच सहभाग प्रमाणपत्र दिले जाते.'
                          : 'Certificates are issued only to confirmed entries with completed registration fee.'}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* SCREEN 2: DEDICATED CERTIFICATE & DOWNLOAD/SHARE SCREEN     */
          /* ============================================================ */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-400">
            {/* Top Navigation & Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-md border border-amber-200 px-4 py-3 rounded-2xl shadow-xs">
              <button
                onClick={() => {
                  setSelectedEntry(null);
                  setError('');
                }}
                className="inline-flex items-center gap-2 text-stone-700 hover:text-[#9B1B1E] font-bold text-xs sm:text-sm px-3 py-1.5 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#9B1B1E]" />
                <span>{lang === 'mr' ? '← दुसरा नंबर शोधा (मागे जा)' : '← Search Another Number'}</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'mr' ? 'पुष्टीकृत सहभाग' : 'Verified Entry'}</span>
                </span>
                <span className="font-mono text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-300">
                  {selectedEntry.ticketId}
                </span>
              </div>
            </div>

            {/* Multiple Entries Switcher (If mobile number has multiple registered idols) */}
            {entries.length > 1 && (
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-[#9B1B1E]" />
                    <span>
                      {lang === 'mr'
                        ? `या मोबाईल नंबरवर ${entries.length} प्रमाणपत्ने उपलब्ध आहेत:`
                        : `${entries.length} certificates available for this number:`}
                    </span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {entries.map((entry) => (
                    <button
                      key={entry.ticketId}
                      onClick={() => setSelectedEntry(entry)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        selectedEntry.ticketId === entry.ticketId
                          ? 'bg-[#9B1B1E] text-white border-[#7B1113] shadow-xs'
                          : 'bg-white text-stone-800 border-amber-200 hover:border-amber-400'
                      }`}
                    >
                      {entry.fullName} ({entry.ticketId})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Screen Header & Main Actions */}
            <div className="text-center space-y-3 pt-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {lang === 'mr'
                    ? `प्रमाणपत्र तयार: ${selectedEntry.fullName}`
                    : `Certificate Ready: ${selectedEntry.fullName}`}
                </span>
              </div>

              <h2 className="font-serif font-black text-2xl sm:text-4xl text-[#1C1917] tracking-tight">
                {selectedEntry.fullName}
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto font-medium">
                {lang === 'mr'
                  ? 'आपले अधिकृत सहभाग प्रमाणपत्र तयार आहे. खालील पर्यायांद्वारे उच्च दर्जाचे PDF डाउनलोड करा किंवा WhatsApp वर शेअर करा.'
                  : 'Your official Certificate of Participation is ready. Download as high-res PDF or share with friends on WhatsApp.'}
              </p>

              {/* Action Buttons Bar */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {/* Primary PDF Download Button */}
                <button
                  onClick={handleDownloadPdf}
                  disabled={downloadingPdf}
                  className="inline-flex items-center gap-2.5 bg-[#9B1B1E] hover:bg-[#7F1518] text-white px-7 py-3.5 rounded-2xl font-black text-sm sm:text-base shadow-md transition-all active:scale-95 disabled:opacity-75 cursor-pointer border border-amber-400/50"
                >
                  {downloadingPdf ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
                      <span>{lang === 'mr' ? 'PDF तयार होत आहे...' : 'Generating High-Res PDF...'}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 text-amber-300" />
                      <span>{lang === 'mr' ? 'प्रमाणपत्र PDF डाउनलोड करा' : 'Download Certificate (PDF)'}</span>
                    </>
                  )}
                </button>

                {/* PNG Image Download Button */}
                <button
                  onClick={handleDownloadPng}
                  disabled={downloadingPng}
                  className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-stone-800 border-2 border-stone-300 px-5 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-xs transition-all hover:border-[#9B1B1E] cursor-pointer"
                >
                  {downloadingPng ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-[#9B1B1E]" />
                  )}
                  <span>{lang === 'mr' ? 'फोटो (PNG) सेव्ह करा' : 'Save as Image (PNG)'}</span>
                </button>

                {/* WhatsApp Share Button */}
                <button
                  onClick={shareOnWhatsApp}
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{lang === 'mr' ? 'WhatsApp वर शेअर करा' : 'Share on WhatsApp'}</span>
                </button>
              </div>
            </div>

            {/* Live Interactive Certificate Document Preview */}
            <div className="relative rounded-3xl p-2 sm:p-6 bg-stone-900/5 border-2 border-amber-300/60 shadow-xl overflow-x-auto">
              <div className="min-w-[650px] sm:min-w-[850px] lg:min-w-0">
                <CertificateDocument data={selectedEntry} id="certificate-render-target" />
              </div>
            </div>

            {/* Security & Tamper-proof Note */}
            <div className="max-w-3xl mx-auto text-center space-y-2 pt-2 text-xs text-stone-500">
              <p className="flex items-center justify-center gap-1.5 font-semibold text-stone-700">
                <ShieldCheck className="w-4 h-4 text-[#9B1B1E]" />
                <span>
                  {lang === 'mr'
                    ? 'हे प्रमाणपत्र डिजिटल स्वरूपात अधिकृतपणे सुरक्षित व प्रमाणित आहे.'
                    : 'This certificate is digitally signed and officially verified.'}
                </span>
              </p>
              <p>
                {lang === 'mr'
                  ? 'टीप: या प्रमाणपत्रावर कोणत्याही प्रकारचे गुण (Marks) किंवा क्रमांक नमूद नसून, हा केवळ सर्व पुष्टीकृत स्पर्धकांसाठी सन्मानपूर्वक सहभाग दाखला आहे.'
                  : 'Note: This is a Certificate of Participation celebrating your entry. No marks or scores are displayed.'}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setSelectedEntry(null);
                    setError('');
                  }}
                  className="inline-flex items-center gap-1.5 text-[#9B1B1E] hover:underline font-bold text-xs cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === 'mr' ? 'दुसऱ्या क्रमांकाचे प्रमाणपत्र शोधा' : 'Search another certificate'}</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default function CertificatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#9B1B1E]" />
        </div>
      }
    >
      <CertificatePageContent />
    </Suspense>
  );
}
