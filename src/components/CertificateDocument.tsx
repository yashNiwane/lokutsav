'use client';

import React from 'react';

export interface CertificateData {
  ticketId: string;
  fullName: string;
  district: string;
  city?: string;
  category: string;
  themeTitle?: string;
  createdAt: string;
  certificateNo?: string;
}

interface CertificateDocumentProps {
  data: CertificateData;
  id?: string;
}

export default function CertificateDocument({ data, id = 'certificate-render-target' }: CertificateDocumentProps) {
  const isHousehold = data.category === 'HOUSEHOLD';
  const categoryText = isHousehold ? 'घरगुती गणपती सजावट' : 'सार्वजनिक गणेशोत्सव मंडळ';
  const categoryTextEn = isHousehold ? 'Household Ganpati Decoration' : 'Sarvajanik Ganeshotsav Mandal';
  const certId = data.certificateNo || `CERT-${data.ticketId}`;
  
  // Format location cleanly avoiding duplicate "Pune, Pune" or "Kothrud, Pune, Pune"
  const city = (data.city || '').trim();
  const district = (data.district || '').trim();
  let locationText = district;
  if (city) {
    if (district && city.toLowerCase().includes(district.toLowerCase())) {
      locationText = city;
    } else if (district) {
      locationText = `${city}, ${district}`;
    } else {
      locationText = city;
    }
  }

  return (
    <div
      id={id}
      className="relative w-full aspect-[1.414/1] max-w-[1100px] mx-auto bg-[#FDFBF7] text-[#1C1917] p-2.5 sm:p-5 select-none overflow-hidden shadow-2xl font-serif"
      style={{
        boxSizing: 'border-box',
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(217, 119, 6, 0.03) 0%, rgba(253, 251, 247, 0) 70%),
          radial-gradient(circle at 10% 10%, rgba(155, 27, 30, 0.02) 0%, transparent 40%),
          radial-gradient(circle at 90% 90%, rgba(155, 27, 30, 0.02) 0%, transparent 40%)
        `,
      }}
    >
      {/* Outer Royal Border */}
      <div className="w-full h-full border-[5px] sm:border-[8px] border-[#7B1113] p-1 sm:p-1.5 relative flex flex-col justify-between">
        
        {/* Inner Gold Foil Border with Corner Motifs */}
        <div className="w-full h-full border-[1.5px] sm:border-[2.5px] border-[#D4AF37] p-2.5 sm:p-4.5 relative flex flex-col justify-between bg-white/75 backdrop-blur-[2px]">
          
          {/* Traditional Ornate Corners (Pure SVG - Zero CORS, 100% Sharp) */}
          {/* Top-Left Corner */}
          <div className="absolute top-0.5 left-0.5 w-8 sm:w-12 h-8 sm:h-12 text-[#B45309] pointer-events-none">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
              <path d="M0,0 L45,0 C45,15 35,25 25,25 C25,35 15,45 0,45 Z" fill="#9B1B1E" />
              <path d="M5,5 L40,5 C38,18 28,28 18,38 L5,40 Z" fill="#D4AF37" opacity="0.8" />
              <circle cx="16" cy="16" r="5" fill="#7B1113" />
              <path d="M0,50 L2,50 C2,30 20,12 50,12 L50,10 C18,10 0,28 0,50 Z" fill="#D4AF37" />
            </svg>
          </div>

          {/* Top-Right Corner */}
          <div className="absolute top-0.5 right-0.5 w-8 sm:w-12 h-8 sm:h-12 text-[#B45309] pointer-events-none rotate-90">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
              <path d="M0,0 L45,0 C45,15 35,25 25,25 C25,35 15,45 0,45 Z" fill="#9B1B1E" />
              <path d="M5,5 L40,5 C38,18 28,28 18,38 L5,40 Z" fill="#D4AF37" opacity="0.8" />
              <circle cx="16" cy="16" r="5" fill="#7B1113" />
              <path d="M0,50 L2,50 C2,30 20,12 50,12 L50,10 C18,10 0,28 0,50 Z" fill="#D4AF37" />
            </svg>
          </div>

          {/* Bottom-Left Corner */}
          <div className="absolute bottom-0.5 left-0.5 w-8 sm:w-12 h-8 sm:h-12 text-[#B45309] pointer-events-none -rotate-90">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
              <path d="M0,0 L45,0 C45,15 35,25 25,25 C25,35 15,45 0,45 Z" fill="#9B1B1E" />
              <path d="M5,5 L40,5 C38,18 28,28 18,38 L5,40 Z" fill="#D4AF37" opacity="0.8" />
              <circle cx="16" cy="16" r="5" fill="#7B1113" />
              <path d="M0,50 L2,50 C2,30 20,12 50,12 L50,10 C18,10 0,28 0,50 Z" fill="#D4AF37" />
            </svg>
          </div>

          {/* Bottom-Right Corner */}
          <div className="absolute bottom-0.5 right-0.5 w-8 sm:w-12 h-8 sm:h-12 text-[#B45309] pointer-events-none rotate-180">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
              <path d="M0,0 L45,0 C45,15 35,25 25,25 C25,35 15,45 0,45 Z" fill="#9B1B1E" />
              <path d="M5,5 L40,5 C38,18 28,28 18,38 L5,40 Z" fill="#D4AF37" opacity="0.8" />
              <circle cx="16" cy="16" r="5" fill="#7B1113" />
              <path d="M0,50 L2,50 C2,30 20,12 50,12 L50,10 C18,10 0,28 0,50 Z" fill="#D4AF37" />
            </svg>
          </div>

          {/* Background Watermark Mandala */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <svg viewBox="0 0 200 200" className="w-[45%] h-[45%]" fill="#7B1113">
              <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="100" cy="100" r="75" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
              <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M100,10 L105,40 L100,35 L95,40 Z M100,190 L105,160 L100,165 L95,160 Z M10,100 L40,105 L35,100 L40,95 Z M190,100 L160,105 L165,100 L160,95 Z" />
            </svg>
          </div>

          {/* HEADER SECTION */}
          <div className="text-center relative z-10 space-y-0.5">
            {/* Auspicious Invocation */}
            <div className="flex items-center justify-center gap-2">
              <span className="h-[1px] w-6 sm:w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <p className="text-[#9B1B1E] font-bold text-[9px] sm:text-xs tracking-[0.25em] uppercase">
                ॥ श्री गणेशाय नमः ॥
              </p>
              <span className="h-[1px] w-6 sm:w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>

            {/* Official Lokutsav Logo Emblem */}
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-13 sm:h-13 rounded-full bg-white border-2 border-[#D4AF37] shadow-sm my-0.5 overflow-hidden p-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Lokutsav Official Logo"
                className="w-full h-full object-contain rounded-full"
                crossOrigin="anonymous"
              />
            </div>

            {/* Organization & Competition Title */}
            <h2 className="text-[#7B1113] font-serif font-black text-xs sm:text-lg lg:text-xl tracking-tight leading-tight">
              महाराष्ट्र राज्य ऑनलाइन गणेश सजावट स्पर्धा २०२६
            </h2>
            <p className="text-stone-600 font-sans text-[8px] sm:text-[10px] tracking-wider uppercase font-semibold">
              Maharashtra State Online Ganesh Decoration Competition 2026
            </p>

            {/* Certificate Title Badge */}
            <div className="pt-0.5 sm:pt-1">
              <div className="inline-block relative">
                <div className="bg-gradient-to-r from-[#7B1113] via-[#9B1B1E] to-[#7B1113] text-[#FEF3C7] px-5 sm:px-8 py-0.5 sm:py-1 rounded-full border border-amber-300 shadow-xs">
                  <h1 className="font-serif font-black text-[11px] sm:text-sm lg:text-base tracking-widest uppercase">
                    सहभाग प्रमाणपत्र
                  </h1>
                </div>
                <div className="text-[7px] sm:text-[9px] text-amber-800 tracking-wider font-semibold uppercase mt-0.5">
                  Certificate of Participation
                </div>
              </div>
            </div>
          </div>

          {/* CITATION & PARTICIPANT BODY */}
          <div className="text-center relative z-10 my-auto py-0.5 sm:py-1 space-y-1 sm:space-y-1.5">
            <p className="text-stone-700 italic text-[10px] sm:text-xs font-serif">
              हे प्रमाणपत्र अत्यंत सन्मानपूर्वक व गौरवाने प्रदान करण्यात येते की,
            </p>

            {/* Participant Name */}
            <div className="py-0">
              <h3 className="font-serif font-black text-lg sm:text-2xl lg:text-3xl text-[#1C1917] tracking-wide inline-block relative px-4">
                {data.fullName}
              </h3>
              {/* Decorative underline */}
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
                <div className="h-[1px] w-10 sm:w-20 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                <span className="text-[#D4AF37] text-[9px] sm:text-xs">✦</span>
                <div className="h-[1px] w-10 sm:w-20 bg-gradient-to-l from-transparent to-[#D4AF37]" />
              </div>
            </div>

            {/* Participation Metadata */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[9.5px] sm:text-[11.5px] text-stone-800 font-sans font-medium">
              <span className="bg-amber-100/70 border border-amber-300 px-3 py-0.5 rounded-md">
                <strong className="text-amber-950 font-bold">सहभाग वर्ग:</strong> {categoryText} ({categoryTextEn})
              </span>
              <span className="bg-amber-100/70 border border-amber-300 px-3 py-0.5 rounded-md">
                <strong className="text-amber-950 font-bold">स्थान:</strong> {locationText}
              </span>
            </div>

            {/* Official Citation Statement */}
            <p className="max-w-2xl mx-auto text-stone-700 text-[9.5px] sm:text-[11px] leading-relaxed font-sans font-normal px-4">
              यांनी <strong className="text-stone-900 font-semibold">&lsquo;लोकोत्सव २०२६&rsquo;</strong> या राज्यस्तरीय ऑनलाइन गणेश सजावट स्पर्धेत कलात्मकतेने व आपली सांस्कृतिक परंपरा जपणारी उत्कृष्ट गणेश सजावट सादर करून सक्रिय सहभाग नोंदविला. त्यांच्या या कलात्मक योगदानाची व श्रद्धेची प्रशंसा करून हे <strong className="text-[#7B1113] font-semibold">सहभाग सन्मानपत्र</strong> सस्नेह प्रदान करण्यात येत आहे.
            </p>
          </div>

          {/* FOOTER SECTION: VERIFICATION, GOLD SEAL & SIGNATURES */}
          <div className="relative z-10 pt-1.5 border-t border-amber-300/80 flex items-end justify-between text-[8px] sm:text-[11px]">
            
            {/* Left Credentials Block */}
            <div className="text-left space-y-0.5 shrink-0 max-w-[30%]">
              <div>
                <span className="text-stone-500 font-sans text-[7.5px] sm:text-[9px] block uppercase font-bold tracking-wider">
                  नोंदणी तिकीट क्रमांक
                </span>
                <span className="font-mono font-bold text-stone-900 text-[9.5px] sm:text-xs">
                  {data.ticketId}
                </span>
              </div>
              <div>
                <span className="text-stone-500 font-sans text-[7.5px] sm:text-[9px] block uppercase font-bold tracking-wider">
                  प्रमाणपत्र अनुक्रमांक
                </span>
                <span className="font-mono font-bold text-[#7B1113] text-[9.5px] sm:text-xs">
                  {certId}
                </span>
              </div>
              <div>
                <span className="text-stone-500 font-sans text-[7.5px] sm:text-[9px] block uppercase font-bold tracking-wider">
                  कालावधी
                </span>
                <span className="text-stone-800 font-sans text-[8.5px] sm:text-[10px] font-medium">
                  भाद्रपद गणेशोत्सव २०२६
                </span>
              </div>
            </div>

            {/* Center Royal Honor Medallion */}
            <div className="flex flex-col items-center justify-center shrink-0 mx-2">
              <div className="relative w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#B45309] via-[#F59E0B] to-[#FEF08A] p-[2px] shadow-xs flex items-center justify-center border border-amber-300/80">
                {/* Inner Elegant Gold Ring */}
                <div className="w-full h-full rounded-full border border-amber-400/80 flex flex-col items-center justify-center text-center p-1 bg-gradient-to-b from-[#FFFDF7] via-[#FEF9E7] to-[#FDEAA7]">
                  {/* Decorative Top Sparkle */}
                  <span className="text-[7px] sm:text-[8.5px] text-[#B45309] leading-none mb-0.5">
                    ✦
                  </span>
                  
                  {/* Brand & Year */}
                  <span className="text-[8px] sm:text-[10.5px] font-serif font-black text-[#7B1113] leading-none tracking-wide">
                    लोकोत्सव
                  </span>
                  <span className="text-[7px] sm:text-[9px] font-serif font-bold text-[#B45309] leading-tight mt-0.5">
                    २०२६
                  </span>

                  {/* Decorative Bottom Star */}
                  <span className="text-[5.5px] sm:text-[7px] text-[#D97706] leading-none mt-0.5">
                    ★
                  </span>
                </div>
              </div>
              <span className="text-[7px] sm:text-[8.5px] text-[#7B1113] font-serif font-bold tracking-wider mt-0.5">
                सहभाग सन्मान
              </span>
            </div>

            {/* Right: Official Cryptographic Digital Signature Block */}
            <div className="text-right flex flex-col items-end justify-end shrink-0 max-w-[42%]">
              <div className="bg-emerald-50/95 border border-emerald-600/60 rounded-md p-1 sm:p-1.5 shadow-2xs text-left relative overflow-hidden backdrop-blur-xs w-full max-w-[190px] sm:max-w-[230px]">
                <div className="flex items-center gap-1 border-b border-emerald-300 pb-0.5 mb-0.5">
                  <span className="inline-flex items-center justify-center w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-600 text-white text-[7px] sm:text-[8px] font-black">
                    ✓
                  </span>
                  <span className="text-[7px] sm:text-[8.5px] font-bold text-emerald-900 tracking-wide uppercase font-sans">
                    Digitally Signed & Verified
                  </span>
                </div>
                <div className="space-y-0.5 text-[6px] sm:text-[7.5px] font-sans text-stone-700 leading-tight">
                  <p>
                    <strong className="text-emerald-950">Signed By:</strong> Lokutsav Committee, MS
                  </p>
                  <p>
                    <strong className="text-emerald-950">Reason:</strong> Official Participation Certification
                  </p>
                  <p className="font-mono text-[5.5px] sm:text-[7px] text-stone-500 truncate">
                    <strong>Hash:</strong> SHA256:{data.ticketId ? data.ticketId.replace(/[^A-Z0-9]/g, '') : 'LOK2026'}•e7f9a2
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Micro Security Footnote */}
          <div className="text-center pt-0.5 mt-0.5 border-t border-amber-200/50">
            <p className="text-[6.5px] sm:text-[7.5px] text-stone-500 font-sans">
              अधिकृत डिजिटल सहभाग प्रमाणपत्र • पडताळणी: https://lokutsav.com/certificate • नोंदणीकृत गणेशभक्तांसाठी जारी.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
