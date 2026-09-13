import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/language-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'लोकोत्सव 2026 | महाराष्ट्र राज्य ऑनलाइन गणेश सजावट स्पर्धा',
  description: 'महाराष्ट्रातील सर्वात मोठी राज्यस्तरीय ऑनलाइन गणपती सजावट स्पर्धा. ₹199 मध्ये नोंदणी करा आणि जिंका ₹1,50,000+ रोख पारितोषिके व मानाच्या ट्रॉफीज.',
  keywords: [
    'Lokutsav',
    'Ganpati Decoration Competition',
    'Maharashtra Ganesh Utsav',
    'Ganesh Decoration 2026',
    'Eco-friendly Ganpati',
    'गणेश सजावट स्पर्धा',
    'लोकोत्सव',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col font-sans bg-[#FAF7F2] text-[#1C1917] antialiased selection:bg-amber-200 selection:text-[#9B1B1E]">
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
