import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { LanguageProvider } from '@/lib/language-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'लोकोत्सव 2026 | महाराष्ट्र राज्य ऑनलाइन गणेश सजावट स्पर्धा',
  description: 'महाराष्ट्रातील सर्वात मोठी राज्यस्तरीय ऑनलाइन गणपती सजावट स्पर्धा. ₹99 मध्ये नोंदणी करा आणि जिंका ₹2,00,000+ रोख पारितोषिके व मानाच्या ट्रॉफीज.',
  keywords: [
    'Lokutsav',
    'Ganpati Decoration Competition',
    'Maharashtra Ganesh Utsav',
    'Ganesh Decoration 2026',
    'Eco-friendly Ganpati',
    'गणेश सजावट स्पर्धा',
    'लोकोत्सव',
  ],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png' },
    ],
    shortcut: ['/favicon.ico'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col font-sans bg-[#FAF7F2] text-[#1C1917] antialiased selection:bg-amber-200 selection:text-[#9B1B1E]">
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '1769192297538282');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1769192297538282&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
