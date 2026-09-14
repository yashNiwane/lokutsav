import React from 'react';

export function GooglePayLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label="Google Pay">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export function PhonePeLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <img
      src="/phonepe.png"
      alt="PhonePe"
      className={`${className} object-contain`}
      loading="lazy"
    />
  );
}

export function PaytmLogo({ className = 'w-10 h-6' }: { className?: string }) {
  return (
    <img
      src="/Paytm-Logo.wine.webp"
      alt="Paytm"
      className={`${className} object-contain`}
      loading="lazy"
    />
  );
}

export function BhimLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-label="BHIM">
      <circle cx="16" cy="16" r="15" fill="#FFFFFF" stroke="#00863F" strokeWidth="1.5" />
      <path d="M12 6l8 10-8 10V6z" fill="#00863F" />
      <path d="M17 6l8 10-8 10V6z" fill="#F37021" opacity="0.9" />
    </svg>
  );
}

export function CredLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <img
      src="/cred.png"
      alt="CRED"
      className={`${className} object-contain rounded-md`}
      loading="lazy"
    />
  );
}

export function UpiBadgeIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 20" className={className} aria-label="UPI">
      <path d="M6 3l7 14H8L3 7 6 3z" fill="#71717A" />
      <path d="M15 3l7 14h-5l-5-10 3-4z" fill="#097939" />
      <path d="M24 3l7 14h-5l-5-10 3-4z" fill="#ED7524" />
    </svg>
  );
}
