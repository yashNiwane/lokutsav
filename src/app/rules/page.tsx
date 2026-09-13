'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/language-context';
import {
  BookOpen,
  Scale,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Award,
  Video,
  Clock,
  Printer,
  Search,
  ChevronRight,
  Download,
  CheckCircle2,
  Lock,
  HelpCircle,
  ArrowRight,
  IndianRupee,
  Leaf,
  Gavel,
} from 'lucide-react';

interface RuleChapter {
  id: string;
  chapterNumber: number;
  titleEn: string;
  titleMr: string;
  summaryEn: string;
  summaryMr: string;
  clauses: {
    number: string;
    headingEn: string;
    headingMr: string;
    textEn: string;
    textMr: string;
    highlight?: 'alert' | 'info' | 'eco' | 'fee';
  }[];
}

const RULE_BOOK: RuleChapter[] = [
  {
    id: 'chapter-1',
    chapterNumber: 1,
    titleEn: 'Chapter I: Preamble & Constitutional Framework',
    titleMr: 'प्रकरण १: प्रस्तावना व स्पर्धेचे कायदेशीर स्वरूप',
    summaryEn: 'Foundational constitution, jurisdiction across 36 districts of Maharashtra, and core festival mission.',
    summaryMr: 'स्पर्धेची घटना, महाराष्ट्रातील ३६ जिल्ह्यांचे अधिकारक्षेत्र आणि गणेशोत्सवाचे सांस्कृतिक उद्दिष्ट.',
    clauses: [
      {
        number: '1.1',
        headingEn: 'Official Organizing Body & Title',
        headingMr: 'अधिकृत नियामक समिती व शीर्षक',
        textEn: 'The state-level competition shall be formally designated as "Lokutsav 2026 — Maharashtra Rajya Online Ganpati Decoration Competition" (लोकोत्सव २०२६), organized by the Lokutsav State Cultural Directorate. All administrative, financial, and promotional operations are governed by this codified Rule Book.',
        textMr: 'ही स्पर्धा अधिकृतपणे "लोकोत्सव २०२६ — महाराष्ट्र राज्य ऑनलाइन गणेश सजावट स्पर्धा" या नावाने ओळखली जाईल. याचे संचालन लोकोत्सव राज्य सांस्कृतिक समितीद्वारे केले जाते. स्पर्धेचे सर्व प्रशासकीय, आर्थिक व प्रसिद्धीविषयक कामकाज या नियमावलीनुसारच चालवले जाईल.',
      },
      {
        number: '1.2',
        headingEn: 'Territorial Jurisdiction Across Maharashtra',
        headingMr: 'संपूर्ण महाराष्ट्र राज्य अधिकारक्षेत्र',
        textEn: 'The competition is open exclusively to citizens residing within the 36 administrative districts and 358 talukas of Maharashtra. Entries submitted from outside the geographic borders of Maharashtra are not eligible for evaluation or rank rewards.',
        textMr: 'सदर स्पर्धा केवळ महाराष्ट्र राज्यातील ३६ महसुली जिल्हे व ३५८ तालुक्यांमधील रहिवासी आणि मंडळांसाठी खुली आहे. महाराष्ट्राच्या भौगोलिक सीमेबाहेरील नोंदी परीक्षणासाठी ग्राह्य धरल्या जाणार नाहीत.',
      },
      {
        number: '1.3',
        headingEn: 'Cultural Ethos & Zero-Tolerance Policy',
        headingMr: 'सांस्कृतिक मूल्ये व आक्षेपार्ह मजकूर बंदी',
        textEn: 'Lokutsav is dedicated to celebrating the sublime cultural, artistic, and devotional heritage of Lord Ganesha as initiated by Lokmanya Bal Gangadhar Tilak. Any decoration containing political electioneering, party symbols, communal disharmony, derogatory caricatures, obscene elements, or commercial trademarks infringing copyright shall face summary disqualification under Section 9.',
        textMr: 'लोकमान्य टिळकांनी सुरू केलेल्या गणेशोत्सवाचा गौरव, कलात्मकता आणि पावित्र्य जपणे हा या स्पर्धेचा मुख्य उद्देश आहे. कोणत्याही प्रकारची राजकीय प्रचारबाजी, पक्षाची चिन्हे, जातीय/धार्मिक तेढ निर्माण करणारे देखावे, अश्लील सादरीकरण किंवा आक्षेपार्ह मजकूर आढळल्यास प्रवेशिका तात्काळ रद्द केली जाईल.',
        highlight: 'alert',
      },
    ],
  },
  {
    id: 'chapter-2',
    chapterNumber: 2,
    titleEn: 'Chapter II: Eligibility & Participation Categories',
    titleMr: 'प्रकरण २: सहभाग पात्रता व वर्गवारी निकष',
    summaryEn: 'Criteria defining Household versus Sarvajanik Mandal categories, age requirements, and single-entry rules.',
    summaryMr: 'घरगुती व सार्वजनिक मंडळ वर्गवारी, वयाची अट आणि प्रति कुटुंब एक प्रवेशिका नियम.',
    clauses: [
      {
        number: '2.1',
        headingEn: 'Category Classification',
        headingMr: 'स्पर्धा वर्गवारीचे प्रकार',
        textEn: 'Participants must register under one of two mutually exclusive categories: (a) Household Decoration (घरगुती गणेशोत्सव) — decorations installed inside private homes, apartments, or housing courtyards; or (b) Sarvajanik Mandal (सार्वजनिक गणेशोत्सव मंडळ) — registered public trusts, residential welfare associations, housing societies, or neighborhood youth clubs.',
        textMr: 'स्पर्धकांना दोनपैकी एकाच योग्य प्रवर्गात नोंदणी करणे बंधनकारक आहे: (अ) घरगुती गणेशोत्सव — स्वतःच्या निवासस्थानी, फ्लॅटमध्ये किंवा घराच्या आवारात केलेली सजावट; किंवा (ब) सार्वजनिक मंडळ — नोंदणीकृत सार्वजनिक गणेशोत्सव मंडळ, गृहनिर्माण संस्था (Housing Society) अथवा गल्लीतील मंडळ.',
      },
      {
        number: '2.2',
        headingEn: 'Age Requirement & Authorized Representative',
        headingMr: 'वयाची अट व अधिकृत प्रतिनिधी',
        textEn: 'The registering participant must be at least 18 years of age on the date of submission. Minors may participate only under the express authorization and supervision of a registered parent or legal guardian.',
        textMr: 'नोंदणी करणारी व्यक्ती अर्ज भरण्याच्या दिवशी किमान १८ वर्षे वयाची असणे आवश्यक आहे. अल्पवयीन स्पर्धकांसाठी पालक किंवा कुटुंबप्रमुखाच्या नावे नोंदणी करणे अनिवार्य आहे.',
      },
      {
        number: '2.3',
        headingEn: 'Single Entry per Residential Premises',
        headingMr: 'एका पत्त्यावर एकच प्रवेशिका',
        textEn: 'Only one entry is permitted per individual household address. Submitting duplicate registrations with identical decoration photographs or videos under different family members’ names is strictly prohibited and shall result in the cancellation of all associated entries without fee reimbursement.',
        textMr: 'एका घरासाठी किंवा एकाच पत्त्यावर केवळ एकच प्रवेशिका ग्राह्य मानली जाईल. एकाच सजावटीचे फोटो घरातील वेगवेगळ्या सदस्यांच्या नावाने पुन्हा पुन्हा नोंदवून एकाधिक प्रवेशिका सादर केल्यास सर्व संबंधित नोंदी अपात्र ठरवण्यात येतील.',
        highlight: 'alert',
      },
    ],
  },
  {
    id: 'chapter-3',
    chapterNumber: 3,
    titleEn: 'Chapter III: Registration Fee & Payment Integrity',
    titleMr: 'प्रकरण ३: नोंदणी शुल्क, भरणा व परतावा धोरण',
    summaryEn: '₹199 fixed fee, Razorpay checkout, UPI Intent flows, Ticket ID generation, and non-refundable policy.',
    summaryMr: '₹199 निश्चित प्रवेश शुल्क, रेझरपे पेमेंट, यूपीआय सुविधा, तिकीट निर्मिती आणि परतावा धोरण.',
    clauses: [
      {
        number: '3.1',
        headingEn: 'Standard Entry Fee (₹199)',
        headingMr: 'निश्चित नोंदणी शुल्क (₹199)',
        textEn: 'A nominal, subsidized administrative registration fee of ₹199 (inclusive of all applicable payment processing charges and platform infrastructure levies) is mandatory for every entry to authenticate participation and maintain evaluation infrastructure.',
        textMr: 'प्रत्येक नोंदीसाठी ₹199 (सर्व कर व गेटवे शुल्कासह) हे नाममात्र प्रवेश शुल्क निश्चित करण्यात आले आहे. हे शुल्क मूल्यमापन यंत्रणा, पडताळणी आणि डिजिटल सुरक्षा प्रणालीच्या संचलनासाठी आवश्यक आहे.',
        highlight: 'fee',
      },
      {
        number: '3.2',
        headingEn: 'Approved Payment Gateways & UPI Intent',
        headingMr: 'अधिकृत पेमेंट मार्ग व यूपीआय इन्टेंट',
        textEn: 'All payments must be executed through the official Razorpay payment portal integrated on the platform. Supported modes include native mobile UPI Intent (Google Pay, PhonePe, Paytm, BHIM, Cred), RuPay/Visa/Mastercard debit/credit cards, and Netbanking. No offline cash transactions or manual UPI transfers to third-party accounts are permitted.',
        textMr: 'सर्व आर्थिक व्यवहार केवळ वेबसाइटवर उपलब्ध अधिकृत Razorpay पेमेंट गेटवेमार्फतच केले पाहिजेत. यामध्ये मोबाइल UPI Intent (Google Pay, PhonePe, Paytm, BHIM), RuPay/Visa कार्ड्स आणि नेटबँकिंगचा समावेश आहे. कोणत्याही बँक खात्यावर थेट परस्पर रोख रक्कम किंवा अनधिकृत क्यूआर कोडवर व्यवहार करू नयेत.',
      },
      {
        number: '3.3',
        headingEn: 'Official Ticket Pass Issuance',
        headingMr: 'अधिकृत प्रवेश तिकीट (Ticket ID)',
        textEn: 'Upon successful payment verification, the system will instantaneously generate an Official Lokutsav Digital Ticket Pass bearing a unique alphanumeric identification code (e.g., LOK-2026-XXXX). This ticket pass serves as conclusive proof of registration and must be retained by the participant for all future verification.',
        textMr: 'पेमेंट यशस्वी झाल्यानंतर प्रणाली लगेच एक अधिकृत डिजिटल तिकीट (उदा. LOK-2026-XXXX) जारी करेल. हा तिकीट क्रमांक स्पर्धेचा अधिकृत पुरावा असून तो जपून ठेवणे आवश्यक आहे.',
      },
      {
        number: '3.4',
        headingEn: 'Strict Non-Refundable Policy',
        headingMr: 'परतावा न मिळण्याबाबत कडक नियम',
        textEn: 'The registration fee of ₹199 is strictly non-refundable and non-transferable under any circumstances once the Official Ticket Pass has been generated, regardless of whether the participant subsequently alters, withdraws, or is disqualified from the competition. In the sole event of an authenticated technical duplicate billing, the extra deduction will be refunded to the source account within 7 to 10 banking days.',
        textMr: 'एकदा तिकीट जनरेट झाल्यानंतर ₹199 चे प्रवेश शुल्क कोणत्याही परिस्थितीत परत (Refund) केले जाणार नाही. स्पर्धकाने स्वतःहून माघार घेतल्यास किंवा नियमांचे उल्लंघन करून अपात्र ठरल्यास शुल्क परत मिळणार नाही. केवळ तांत्रिक बिघाडामुळे दुबार पैसे कापले गेल्यास पुरावा तपासून ७ ते १० दिवसांत मूळ खात्यात रक्कम जमा केली जाईल.',
        highlight: 'alert',
      },
    ],
  },
  {
    id: 'chapter-4',
    chapterNumber: 4,
    titleEn: 'Chapter IV: Media Submission & 5-Minute Video Limitation',
    titleMr: 'प्रकरण ४: छायाचित्रे व ५ मिनिटे कमाल व्हिडिओ मर्यादा',
    summaryEn: 'Strict 5-minute video duration ceiling, photo resolution guidelines, anti-plagiarism and zero-AI mandates.',
    summaryMr: 'व्हिडिओसाठी ५ मिनिटांची कमाल कालमर्यादा, फोटोचे रिझोल्यूशन, कॉपीराईट व बनावट छायाचित्रांवर बंदी.',
    clauses: [
      {
        number: '4.1',
        headingEn: 'Strict 5-Minute (300 Seconds) Maximum Video Duration',
        headingMr: 'व्हिडिओसाठी कमाल ५ मिनिटे (३०० सेकंद) मर्यादा',
        textEn: 'Each participant is permitted to submit a direct video walkthrough of their decoration. The video duration MUST strictly not exceed 5 minutes (300 seconds). Both client-side pre-upload checks and server-side validators will reject or truncate videos beyond 300 seconds. Videos between 1 to 3 minutes highlighting craftsmanship, lighting, and detail are highly encouraged.',
        textMr: 'स्पर्धकांना त्यांच्या बाप्पाच्या सजावटीचा थेट व्हिडिओ अपलोड करण्याची सुविधा आहे. या व्हिडिओचा कालावधी जास्तीत जास्त ५ मिनिटे (३०० सेकंद) असावा. ५ मिनिटांपेक्षा मोठा व्हिडिओ अपलोड स्वीकारला जाणार नाही. सजावट, कारागिरी आणि प्रकाशयोजना नीट दिसावी यासाठी १ ते ३ मिनिटांचा स्पष्ट व्हिडिओ सर्वोत्तम मानला जाईल.',
        highlight: 'info',
      },
      {
        number: '4.2',
        headingEn: 'Direct Device File Upload Standards',
        headingMr: 'थेट डिव्हाइस फाइल अपलोड निकष',
        textEn: 'Participants must upload media directly from their mobile phone or camera storage. Supported video formats include .mp4, .mov, .webm, and .m4v with a maximum payload size of 100MB. External third-party streaming links (such as unlisted YouTube URLs) are not required, guaranteeing direct, high-fidelity jury inspection.',
        textMr: 'व्हिडिओ थेट स्वतःच्या मोबाइल किंवा संगणकावरून अपलोड करावा. .mp4, .mov, .webm फाइल्स ग्राह्य धरल्या जातील आणि कमाल फाइल आकार 100MB पर्यंत असावा. कोणत्याही बाह्य युट्यूब लिंकची गरज नाही, जेणेकरून परीक्षकांना थेट मूळ गुणवत्तेत व्हिडिओ पाहता येईल.',
      },
      {
        number: '4.3',
        headingEn: 'High-Resolution Photographic Evidence',
        headingMr: 'सजावटीचे स्पष्ट व मूळ छायाचित्रे',
        textEn: 'Participants must upload at least one (1) and up to ten (10) clear photographs showcasing: (a) wide-angle view of the full decoration, (b) close-up shot of the Ganesh idol, and (c) craftsmanship and material detailing. Images must be genuine, unmanipulated JPEG, PNG, or WebP files.',
        textMr: 'किमान १ व कमाल १० स्पष्ट फोटो अपलोड करणे अनिवार्य आहे: (१) संपूर्ण सजावटीचा विहंगम फोटो, (२) श्री गणेशाच्या मूर्तीचा क्लोज-अप फोटो, आणि (३) सजावटीच्या साहित्याची कारागिरी दर्शवणारे फोटो. सर्व फोटो मूळ आणि स्पष्ट असावेत.',
      },
      {
        number: '4.4',
        headingEn: 'Absolute Prohibition of AI-Generated & Archived Stock Media',
        headingMr: 'AI जनरेटेड व जुन्या इंटरनेट फोटोंवर संपूर्ण बंदी',
        textEn: 'All submitted photos and videos MUST be authentic, original captures of decorations erected physically during the current Ganesh festival edition (2026). The use of AI-generated synthetic renderings, stock photography, Pinterest imagery, or media from prior festive years constitutes fraudulent misrepresentation and will attract immediate lifetime disqualification and public blacklisting.',
        textMr: 'सादर केलेले फोटो व व्हिडिओ हे याच वर्षीच्या (२०२६) गणेशोत्सवातील प्रत्यक्ष केलेल्या सजावटीचेच असले पाहिजेत. इंटरनेटवरील तयार फोटो, AI द्वारे बनवलेले फोटो, किंवा मागील वर्षांचे जुने फोटो सादर केल्यास स्पर्धकाला तात्काळ अपात्र ठरवले जाईल व काळ्या यादीत टाकले जाईल.',
        highlight: 'alert',
      },
    ],
  },
  {
    id: 'chapter-5',
    chapterNumber: 5,
    titleEn: 'Chapter V: Eco-Friendly Material Standards & Shadu Mati Mandate',
    titleMr: 'प्रकरण ५: पर्यावरणपूरकता व शाडू मातीचे विशेष निकष',
    summaryEn: 'Zero Plaster of Paris (PoP) encouragement, 20% dedicated judging weightage, and organic materials list.',
    summaryMr: 'पर्यावरणपूरक सजावटीला २०% भारांकन, शाडू मातीच्या मूर्तीला प्राधान्य आणि थर्माकोल वापरावर बंदी.',
    clauses: [
      {
        number: '5.1',
        headingEn: '20% Dedicated Eco-Friendliness Weightage',
        headingMr: 'पर्यावरणपूरकतेला थेट २०% गुणांचे भारांकन',
        textEn: 'In strict alignment with the environmental conservation directives of the Government of Maharashtra and the Maharashtra Pollution Control Board (MPCB), twenty percent (20%) of the overall evaluation score is formally allocated to ecological responsibility and the usage of biodegradable materials.',
        textMr: 'महाराष्ट्र प्रदूषण नियंत्रण मंडळाच्या (MPCB) पर्यावरण संवर्धन मार्गदर्शक तत्त्वांनुसार, एकूण गुणदानातून २०% गुण केवळ पर्यावरणपूरकता आणि नैसर्गिक घटकांच्या वापरासाठी राखीव ठेवण्यात आले आहेत.',
        highlight: 'eco',
      },
      {
        number: '5.2',
        headingEn: 'Idol Material Hierarchy: Shadu Mati vs Traditional',
        headingMr: 'मूर्तीचे प्रकार: शाडू माती व पारंपरिक',
        textEn: 'Idols sculpted from natural clay (शाडू माती), paper pulp (कागदी लगदा), or organic soil receive maximum criterion points. Participants employing Plaster of Paris (PoP) idols will be penalized under Criterion 3 in accordance with state sustainability goals.',
        textMr: 'नैसर्गिक शाडू मातीची मूर्ती, कागदी लगद्याची मूर्ती किंवा लाल मातीपासून बनवलेल्या विसर्जनक्षम मूर्तीला परीक्षणात सर्वोच्च गुण मिळतील. प्लास्टर ऑफ पॅरिसच्या (PoP) मूर्तींना पर्यावरण निकषात कमी गुण दिले जातील.',
        highlight: 'eco',
      },
      {
        number: '5.3',
        headingEn: 'Prohibition of Single-Use Thermocol & Toxic Sheeting',
        headingMr: 'थर्माकोल व घातक प्लॅस्टिक वापरावर बंदी',
        textEn: 'The extensive use of single-use expanded polystyrene (thermocol) and non-biodegradable glitter is strongly discouraged. Decorators using sustainable alternatives such as handmade bamboo armature, jute canvas, coir, natural cotton fabric, dry leaves, coconut shells, cardboard, and terracotta will be awarded top craftsmanship tier rankings.',
        textMr: 'एकल-वापर थर्माकोल आणि पर्यावरणास घातक प्लॅस्टिकचा वापर टाळणे गरजेचे आहे. बांबू, सुतळी, गोणपाट, पुठ्ठा, मातीची मडकी, नारळाच्या करवंट्या, सुती कापड, नैसर्गिक फुले व हळद-कुंकवाच्या रंगांचा वापर करणाऱ्या देखाव्यांना विशेष पसंती दिली जाईल.',
      },
    ],
  },
  {
    id: 'chapter-6',
    chapterNumber: 6,
    titleEn: 'Chapter VI: Independent Jury Panel & Scoring Methodology',
    titleMr: 'प्रकरण ६: निष्पक्ष परीक्षक मंडळ व ५ निकषांवर आधारित गुणदान',
    summaryEn: 'Composition of jury panel, 5 weighted criteria breakdown, and absolute legal finality of jury decisions.',
    summaryMr: 'परीक्षक मंडळाची रचना, ५ पारदर्शक निकष आणि परीक्षकांचा निर्णय अंतिम व सर्वमान्य असल्याबाबत तरतूद.',
    clauses: [
      {
        number: '6.1',
        headingEn: 'Composition of the Eminent Jury Panel',
        headingMr: 'नामवंत तज्ज्ञ परीक्षक मंडळ',
        textEn: 'The evaluation committee comprises esteemed cultural scholars, seasoned Bollywood/Marathi theatre art directors, master sculptors, and veteran environmental activists appointed independently across Maharashtra.',
        textMr: 'मूल्यांकन समितीमध्ये महाराष्ट्रातील नामवंत कला दिग्दर्शक, ज्येष्ठ शिल्पकार, नाट्यकर्मी, सांस्कृतिक अभ्यासक आणि पर्यावरण तज्ज्ञांचा समावेश आहे.',
      },
      {
        number: '6.2',
        headingEn: 'The Five Defined Evaluation Criteria',
        headingMr: 'मूल्यांकनाचे ५ मुख्य निकष व टक्केवारी',
        textEn: 'Every authenticated entry is scored independently across five criteria on a scale of 1 to 10, resulting in a weighted composite score out of 10.0: \n1. Concept & Creativity (संकल्पना व कल्पकता) — 25%\n2. Craftsmanship & Finishing Detailing (हस्तकला व फिनिशिंग) — 25%\n3. Eco-friendliness & Sustainable Materials (पर्यावरणपूरकता व साहित्य) — 20%\n4. Lighting, Harmony & Presentation (प्रकाशयोजना व सादरीकरण) — 15%\n5. Uniqueness, Originality & Innovation (नाविन्यता व वेगळेपण) — 15%',
        textMr: 'प्रत्येक नोंदीचे खालील ५ निकषांवर १ ते १० गुणांच्या आधारे पारदर्शक मूल्यांकन केले जाईल:\n१. संकल्पना व कल्पकता (Concept & Creativity) — २५%\n२. हस्तकला व फिनिशिंग (Craftsmanship & Detailing) — २५%\n३. पर्यावरणपूरकता व साहित्य (Eco-friendliness) — २०%\n४. प्रकाशयोजना व सादरीकरण (Lighting & Presentation) — १५%\n५. नाविन्यता व वेगळेपण (Uniqueness & Innovation) — १५%',
      },
      {
        number: '6.3',
        headingEn: 'Absolute Finality of the Jury Panel Decision',
        headingMr: 'परीक्षकांचा निर्णय अंतिम व सर्वमान्य',
        textEn: 'The numerical scores, ranking designations, and merit awards decided by the Lokutsav Jury Directorate are absolute, conclusive, and legally final. No correspondence, challenge, dispute, arbitral claim, or public litigation questioning the subjective artistic judgment of the panel shall be entertained.',
        textMr: 'परीक्षक मंडळाने दिलेले गुण, क्रमवारी आणि पारितोषिकांचा निर्णय अंतिम, निर्णायक आणि सर्वांवर बंधनकारक असेल. परीक्षकांच्या कलात्मक निर्णयाविरोधात कोणतीही तक्रार, वाद अथवा न्यायालयात आव्हान स्वीकारले जाणार नाही.',
        highlight: 'alert',
      },
    ],
  },
  {
    id: 'chapter-7',
    chapterNumber: 7,
    titleEn: 'Chapter VII: Cash Prizes, Award Ceremonies & Tax Compliance (TDS)',
    titleMr: 'प्रकरण ७: पारितोषिक वितरण, कर व बँक पडताळणी नियम',
    summaryEn: 'Top 10 cash prize disbursement, Section 194B TDS compliance, bank KYC verification, and trophies delivery.',
    summaryMr: 'प्रथम १० क्रमांकांची रोख बक्षिसे, आयकर कलम 194B नुसार TDS कपात, बँक पडताळणी आणि मानाच्या ट्रॉफीज.',
    clauses: [
      {
        number: '7.1',
        headingEn: 'Official Cash Prize Pool Schedule',
        headingMr: 'अधिकृत रोख पारितोषिकांचे वाटप',
        textEn: 'The top 10 winners across Maharashtra will be awarded official cash prizes directly: \n• 1st Place (महाराष्ट्र राज्य महाविजेता): ₹51,000 Cash + Gold-Plated Trophy + ₹15,000 Sponsor Gift Hamper\n• 2nd Place (द्वितीय क्रमांक): ₹31,000 Cash + Silver-Plated Trophy + ₹10,000 Sponsor Gift Hamper\n• 3rd Place (तृतीय क्रमांक): ₹21,000 Cash + Bronze Trophy + ₹7,500 Sponsor Gift Hamper\n• 4th to 10th Place (राज्य गुणवत्ता उत्तेजनार्थ पुरस्कार - ७ विजेते): ₹5,000 Cash Each + State Memento & Official Merit Certificate.',
        textMr: 'महाराष्ट्रातील पहिल्या १० मानाच्या विजेत्यांना थेट रोख पारितोषिके दिली जातील:\n• प्रथम क्रमांक (महाविजेता): ₹51,000 रोख + मानाची सुवर्ण ट्रॉफी + ₹15,000 चा प्रायोजक हॅम्पर\n• द्वितीय क्रमांक: ₹31,000 रोख + मानाची रजत ट्रॉफी + ₹10,000 चा प्रायोजक हॅम्पर\n• तृतीय क्रमांक: ₹21,000 रोख + मानाची कांस्य ट्रॉफी + ₹7,500 चा प्रायोजक हॅम्पर\n• ४था ते १०वा क्रमांक (उत्तेजनार्थ गुणवत्ता - ७ विजेते): प्रत्येकी ₹5,000 रोख + राज्य सन्मानचिन्ह व अधिकृत गुणवत्ता प्रमाणपत्र.',
        highlight: 'fee',
      },
      {
        number: '7.2',
        headingEn: 'Statutory Tax Compliance (Section 194B TDS)',
        headingMr: 'आयकर कलम 194B नुसार कर (TDS) तरतुदी',
        textEn: 'All cash awards are disbursed strictly in compliance with the prevailing Indian Income Tax Act. Under Section 194B, winnings exceeding ₹10,000 from competitive awards are subject to Tax Deducted at Source (TDS) at the statutory rate (currently 30% plus applicable cess). Net funds will be remitted alongside a valid Form 16A TDS Certificate.',
        textMr: 'सर्व रोख पारितोषिके भारतीय आयकर कायद्यातील तरतुदींनुसार दिली जातील. कलम 194B अंतर्गत ₹10,000 वरील बक्षिसांच्या रकमेतून नियमानुसार ३०% अधिक अधिभार TDS कपात करून उर्वरित रक्कम अधिकृत फॉर्म 16A प्रमाणपत्रासह खात्यात वर्ग केली जाईल.',
      },
      {
        number: '7.3',
        headingEn: 'Identity & Bank Account Verification (KYC)',
        headingMr: 'ओळखपत्र व बँक खाते पडताळणी (KYC)',
        textEn: 'Prior to prize disbursement, the designated winner must provide authenticated government identity documentation (Aadhaar Card, PAN Card) matching the name registered on the Ticket Pass, along with verified bank account details (cancelled cheque or passbook copy). Cash payouts through informal intermediaries or untraceable wallets are strictly prohibited.',
        textMr: 'पारितोषिक वितरण करण्यापूर्वी विजेत्याला स्वतःचे पॅन कार्ड (PAN Card), आधार कार्ड (Aadhaar) आणि बँक खात्याचा तपशील (रद्द केलेला धनादेश किंवा पासबुक) पडताळणीसाठी सादर करणे बंधनकारक आहे. कोणत्याही त्रयस्थ व्यक्तीच्या खात्यावर पैसे पाठवले जाणार नाहीत.',
      },
    ],
  },
  {
    id: 'chapter-8',
    chapterNumber: 8,
    titleEn: 'Chapter VIII: Intellectual Property & Media Broadcast Licensing',
    titleMr: 'प्रकरण ८: बौद्धिक संपदा, प्रसिद्धी व प्रसारण हक्क',
    summaryEn: 'Ownership retention by creators, royalty-free non-exclusive media broadcast license granted to Lokutsav.',
    summaryMr: 'सजावटीचे स्वामित्व स्पर्धकाकडेच राहणे, लोकोत्सव समूहाला वृत्तपत्र व डिजिटल प्रसारणाचे विना-रॉयल्टी अधिकार.',
    clauses: [
      {
        number: '8.1',
        headingEn: 'Artisan Ownership of Physical Craft',
        headingMr: 'कारागिरीचे मूळ स्वामित्व स्पर्धकाकडेच',
        textEn: 'The participant retains complete intellectual and physical ownership of their physical decoration craftsmanship and artistic conception. Lokutsav asserts no claim over the physical materials or physical idol.',
        textMr: 'स्पर्धकाने स्वतः तयार केलेल्या सजावटीचे व कलाकृतीचे मूळ मालकी हक्क हे संपूर्णपणे स्पर्धकाकडेच राहतील. लोकोत्सव भौतिक साहित्यावर कोणताही दावा करत नाही.',
      },
      {
        number: '8.2',
        headingEn: 'Worldwide Non-Exclusive Broadcast License',
        headingMr: 'प्रसिद्धी व प्रसारणासाठी विना-रॉयल्टी परवाना',
        textEn: 'By uploading media and completing registration, the participant irrevocably grants to Lokutsav a perpetual, non-exclusive, royalty-free, worldwide license to utilize, broadcast, display, reproduce, and distribute the submitted photos, video tours, participant names, and district affiliations across digital websites, social media channels, television broadcasts, print press releases, and promotional documentaries.',
        textMr: 'नोंदणी करून फोटो व व्हिडिओ सबमिट केल्याने, स्पर्धक लोकोत्सव समितीला ते फोटो व व्हिडिओ वृत्तपत्रे, वृत्तवाहिन्या, सोशल मीडिया, माहितीपट आणि वेबसाइटवर प्रसिद्ध व प्रसारित करण्याचे विना-रॉयल्टी हक्क प्रदान करतो.',
      },
    ],
  },
  {
    id: 'chapter-9',
    chapterNumber: 9,
    titleEn: 'Chapter IX: Disqualification Grounds & Code of Ethical Conduct',
    titleMr: 'प्रकरण ९: अपात्रतेचे निकष व आचारसंहिता',
    summaryEn: 'Specific violations that trigger immediate disqualification, fee forfeiture, and blacklisting.',
    summaryMr: 'तातडीने अपात्र ठरवणारे गैरप्रकार, शुल्क जप्ती आणि स्पर्धकावरील शिस्तभंगाची कारवाई.',
    clauses: [
      {
        number: '9.1',
        headingEn: 'Grounds for Summary Disqualification',
        headingMr: 'थेट अपात्र ठरवणारे मुख्य घटक',
        textEn: 'An entry shall be disqualified with immediate forfeiture of registration fees if found guilty of: \n1. Submitting synthetic AI imagery or plagiarized photography from external sources;\n2. Submitting decorations installed in previous years or non-festive periods;\n3. Submitting video files that deliberately exceed 5 minutes in duration;\n4. Engaging in voter manipulation, automated scripting, or jury tampering;\n5. Displaying defamatory, communally provocative, or hate-inciting materials.',
        textMr: 'खालीलपैकी कोणत्याही बाबी आढळल्यास स्पर्धकाची नोंदणी रद्द करून त्याचे प्रवेश शुल्क जप्त केले जाईल:\n१. AI जनरेटेड किंवा इंटरनेटवरून चोरलेले खोटे फोटो सादर करणे;\n२. मागील वर्षांचे जुने देखावे याच वर्षाचे असल्याचे भासवणे;\n३. ५ मिनिटांपेक्षा जास्त लांबीचा अनधिकृत व्हिडिओ सादर करणे;\n४. परीक्षकांना प्रभावित करण्याचा किंवा अनैतिक संपर्क साधण्याचा प्रयत्न करणे;\n५. सामाजिक सलोखा बिघडवणारे किंवा आक्षेपार्ह देखावे सादर करणे.',
        highlight: 'alert',
      },
      {
        number: '9.2',
        headingEn: 'Zero Abuse Policy Toward Staff & Judges',
        headingMr: 'परीक्षक व कर्मचाऱ्यांशी गैरवर्तन बंदी',
        textEn: 'Participants and their associates must maintain absolute decorum. Posting abusive, defamatory, or harassing comments against jury members, organizers, or fellow participants on public platforms will attract immediate legal notice under the Information Technology Act and Indian Penal Code.',
        textMr: 'स्पर्धकांनी सोशल मीडिया व डिजिटल मंचावर सभ्यता राखणे बंधनकारक आहे. परीक्षक, इतर स्पर्धक किंवा आयोजकांविरोधात सोशल मीडियावर खोटी विधाने, बदनामीकारक मजकूर किंवा शिवीगाळ केल्यास कायदेशीर कारवाई करण्यात येईल.',
      },
    ],
  },
  {
    id: 'chapter-10',
    chapterNumber: 10,
    titleEn: 'Chapter X: Legal Jurisdiction & Dispute Redressal Mechanism',
    titleMr: 'प्रकरण १०: न्यायाधिकार, दायित्व मर्यादा व तक्रार निवारण',
    summaryEn: 'Exclusive jurisdiction of Pune/Mumbai courts, force majeure exemptions, and Grievance Officer details.',
    summaryMr: 'पुणे/मुंबई न्यायालयाचे विशेष अधिकारक्षेत्र, आपत्कालीन तरतुदी आणि अधिकृत तक्रार निवारण अधिकारी.',
    clauses: [
      {
        number: '10.1',
        headingEn: 'Exclusive Legal Jurisdiction in Maharashtra',
        headingMr: 'पुणे / मुंबई न्यायालयाचे विशेष अधिकारक्षेत्र',
        textEn: 'Any legal claim, controversy, or dispute arising out of or in connection with the Lokutsav 2026 competition shall be subject to the exclusive jurisdiction of the competent civil courts situated in Pune / Mumbai, Maharashtra, India.',
        textMr: 'लोकोत्सव २०२६ स्पर्धेसंदर्भातील कोणताही कायदेशीर वाद उद्भवल्यास त्याचे विशेष अधिकारक्षेत्र केवळ पुणे / मुंबई, महाराष्ट्र येथील सक्षम न्यायालयाच्या कक्षेत राहील.',
      },
      {
        number: '10.2',
        headingEn: 'Limitation of Liability & Force Majeure',
        headingMr: 'दायित्व मर्यादा व नैसर्गिक आपत्ती तरतूद',
        textEn: 'Lokutsav, its directors, jury members, and affiliated sponsors shall not be held liable for any electrical short-circuits, fire accidents, structural collapses, or property damage occurring at the participant’s premises during decoration installation. Furthermore, the organizers are not liable for delays caused by national server outages, telecommunication breakdowns, natural disasters, or government regulatory orders.',
        textMr: 'सजावट करताना किंवा घरात वीज, आग अथवा साहित्यामुळे घडणाऱ्या कोणत्याही अपघातास अथवा नुकसानीस लोकोत्सव समिती किंवा प्रायोजक जबाबदार असणार नाहीत. तसेच महापूर, नैसर्गिक आपत्ती किंवा इंटरनेट सर्व्हर बंद पडल्यामुळे होणाऱ्या विलंबास संस्था जबाबदार नसेल.',
      },
      {
        number: '10.3',
        headingEn: 'Official Grievance Officer & Contact Point',
        headingMr: 'अधिकृत तक्रार निवारण अधिकारी व संपर्क',
        textEn: 'For formal inquiries, technical discrepancies, or rulebook clarification, participants may contact the designated Grievance Officer: \n• Legal & Compliance Directorate: legal@lokutsav.org\n• Official Helpline: +91 98220 12345 (10:00 AM – 7:00 PM IST)\n• Registered Secretariat: Lokutsav Bhawan, Shivaji Nagar, Pune, Maharashtra 411005.',
        textMr: 'कोणत्याही अधिकृत चौकशी किंवा नियमावलीच्या स्पष्टीकरणासाठी स्पर्धक अधिकृत तक्रार निवारण कक्षाशी संपर्क साधू शकतात:\n• कायदेशीर व तक्रार कक्ष: legal@lokutsav.org\n• अधिकृत हेल्पलाइन: +91 98220 12345 (सकाळी १० ते संध्याकाळी ७)\n• मुख्य कार्यालय: लोकोत्सव भवन, शिवाजीनगर, पुणे, महाराष्ट्र ४११००५.',
      },
    ],
  },
];

export default function RulesPage() {
  const { lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChapterId, setActiveChapterId] = useState('chapter-1');

  // Filter chapters and clauses based on search query
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return RULE_BOOK;
    const q = searchQuery.toLowerCase().trim();

    return RULE_BOOK.map((chapter) => {
      const matchInChapter =
        chapter.titleEn.toLowerCase().includes(q) ||
        chapter.titleMr.toLowerCase().includes(q) ||
        chapter.summaryEn.toLowerCase().includes(q) ||
        chapter.summaryMr.toLowerCase().includes(q);

      const matchedClauses = chapter.clauses.filter((clause) => {
        return (
          clause.number.toLowerCase().includes(q) ||
          clause.headingEn.toLowerCase().includes(q) ||
          clause.headingMr.toLowerCase().includes(q) ||
          clause.textEn.toLowerCase().includes(q) ||
          clause.textMr.toLowerCase().includes(q)
        );
      });

      if (matchInChapter) {
        return chapter;
      }

      if (matchedClauses.length > 0) {
        return {
          ...chapter,
          clauses: matchedClauses,
        };
      }

      return null;
    }).filter(Boolean) as RuleChapter[];
  }, [searchQuery]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Header Banner */}
      <section className="bg-[#1C1917] text-white pt-12 pb-14 border-b-4 border-[#9B1B1E] relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#9B1B1E]/10 blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#9B1B1E] text-amber-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <Gavel className="w-3.5 h-3.5" />
                <span>{lang === 'mr' ? 'अधिकृत राजपत्र व नियमावली २०२६' : 'Official Contest Rule Book 2026'}</span>
              </div>

              <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-stone-100 tracking-tight">
                {lang === 'mr'
                  ? 'स्पर्धेचे नियम, अटी व कायदेशीर संहिता'
                  : 'Rules, Terms & Competition Constitution'}
              </h1>
              
              <p className="text-stone-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                {lang === 'mr'
                  ? 'महाराष्ट्रातील सर्वात मोठ्या राज्यस्तरीय ऑनलाइन गणेश सजावट स्पर्धेची संपूर्ण कायदेशीर व तांत्रिक मार्गदर्शक संहिता. सर्व १० प्रकरणे काळजीपूर्वक वाचावीत.'
                  : 'Comprehensive official guidelines, eligibility criteria, judging benchmarks, fee structures, and legal terms governing Maharashtra’s largest online decoration contest.'}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 self-start md:self-center shrink-0">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>{lang === 'mr' ? 'प्रिंट / सेव्ह PDF' : 'Print / Save PDF'}</span>
              </button>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#9B1B1E] hover:bg-[#781416] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                <span>{lang === 'mr' ? 'नोंदणी करा (₹199)' : 'Enter Contest (₹199)'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Pillars Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 mt-8 border-t border-stone-800 text-xs">
            <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 flex items-center gap-2.5">
              <IndianRupee className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">{lang === 'mr' ? 'नोंदणी शुल्क' : 'Entry Fee'}</span>
                <span className="font-bold text-white">₹199 {lang === 'mr' ? '(अपरिवर्तनीय)' : '(Fixed)'}</span>
              </div>
            </div>

            <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 flex items-center gap-2.5">
              <Video className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">{lang === 'mr' ? 'व्हिडिओ मर्यादा' : 'Video Limit'}</span>
                <span className="font-bold text-white">{lang === 'mr' ? 'कमाल ५ मिनिटे' : 'Max 5 Minutes'}</span>
              </div>
            </div>

            <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 flex items-center gap-2.5">
              <Leaf className="w-4 h-4 text-green-400 shrink-0" />
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">{lang === 'mr' ? 'पर्यावरण भारांकन' : 'Eco Weightage'}</span>
                <span className="font-bold text-white">२०% {lang === 'mr' ? 'गुण शाडू मातीस' : 'For Clay & Nature'}</span>
              </div>
            </div>

            <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 flex items-center gap-2.5">
              <Scale className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">{lang === 'mr' ? 'परीक्षण निर्णय' : 'Jury Verdict'}</span>
                <span className="font-bold text-white">{lang === 'mr' ? 'अंतिम व सर्वमान्य' : 'Final & Binding'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Sidebar + Rule Clauses */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#E5D7C0] shadow-xs mb-8 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0 ml-1" />
          <input
            type="text"
            placeholder={
              lang === 'mr'
                ? 'नियमावलीमध्ये शोधा (उदा. व्हिडिओ, शाडू माती, ₹199, परतावा, कर, अपात्रता...)'
                : 'Search the rule book (e.g. video, shadu mati, 199, refund, tax, disqualification)...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm sm:text-base bg-transparent focus:outline-none placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-stone-400 hover:text-stone-700 px-2 py-1 font-bold"
            >
              Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sticky Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 bg-white rounded-2xl p-5 border border-[#E5D7C0] shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100 text-stone-900 font-bold text-sm">
              <BookOpen className="w-4 h-4 text-[#9B1B1E]" />
              <span>{lang === 'mr' ? 'अनुक्रमणिका (१० प्रकरणे)' : 'Table of Contents (10 Chapters)'}</span>
            </div>

            <nav className="space-y-1 text-xs">
              {RULE_BOOK.map((chapter) => (
                <a
                  key={chapter.id}
                  href={`#${chapter.id}`}
                  onClick={() => setActiveChapterId(chapter.id)}
                  className={`block px-3 py-2 rounded-lg font-medium transition-all ${
                    activeChapterId === chapter.id
                      ? 'bg-amber-100 text-amber-950 font-bold border-l-4 border-[#9B1B1E]'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <span className="font-mono text-[#9B1B1E] font-bold mr-1.5">
                    {chapter.chapterNumber}.
                  </span>
                  <span>{lang === 'mr' ? chapter.titleMr : chapter.titleEn}</span>
                </a>
              ))}
            </nav>

            <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500 space-y-1">
              <p>📅 आवृत्ती: गणेशोत्सव २०२६ (आवृत्ती १.२)</p>
              <p>⚖️ कायदेशीर सल्लागार: लोकोत्सव विधी कक्ष</p>
            </div>
          </aside>

          {/* Right Column: Full Rule Chapters */}
          <main className="lg:col-span-8 space-y-10">
            {filteredChapters.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-stone-200 text-stone-500 space-y-3">
                <HelpCircle className="w-10 h-10 text-stone-400 mx-auto" />
                <h3 className="font-bold text-base text-stone-700">
                  {lang === 'mr' ? 'कोणताही नियम आढळला नाही' : 'No matching rules found'}
                </h3>
                <p className="text-xs">
                  {lang === 'mr'
                    ? 'कृपया वेगळा शब्द शोधून पहा किंवा शोधपट्टी रिकामी करा.'
                    : 'Try different keywords or clear the search filter above.'}
                </p>
              </div>
            ) : (
              filteredChapters.map((chapter) => (
                <section
                  key={chapter.id}
                  id={chapter.id}
                  className="bg-white rounded-2xl border border-[#E5D7C0] shadow-xs p-6 sm:p-8 space-y-6 scroll-mt-24 transition-all hover:border-amber-300"
                >
                  {/* Chapter Header */}
                  <div className="border-b border-stone-200 pb-4">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#9B1B1E] uppercase tracking-wider mb-1">
                      <span>Chapter {chapter.chapterNumber}</span>
                      <span>•</span>
                      <span>{lang === 'mr' ? 'अधिकृत संहिता' : 'Official Code'}</span>
                    </div>

                    <h2 className="font-serif font-black text-2xl sm:text-3xl text-stone-900 tracking-tight">
                      {lang === 'mr' ? chapter.titleMr : chapter.titleEn}
                    </h2>

                    <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
                      {lang === 'mr' ? chapter.summaryMr : chapter.summaryEn}
                    </p>
                  </div>

                  {/* Clauses List */}
                  <div className="space-y-6">
                    {chapter.clauses.map((clause) => (
                      <div
                        key={clause.number}
                        className={`p-4 sm:p-5 rounded-xl border transition-colors ${
                          clause.highlight === 'alert'
                            ? 'bg-red-50/70 border-red-200'
                            : clause.highlight === 'eco'
                            ? 'bg-green-50/70 border-green-200'
                            : clause.highlight === 'fee'
                            ? 'bg-amber-50/70 border-amber-200'
                            : 'bg-[#FAF7F2] border-stone-200/80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2">
                            <span className="font-mono text-xs px-2 py-0.5 rounded bg-stone-200/80 text-stone-800 font-black">
                              § {clause.number}
                            </span>
                            <span>{lang === 'mr' ? clause.headingMr : clause.headingEn}</span>
                          </h3>

                          {clause.highlight === 'alert' && (
                            <span className="text-[10px] font-bold text-red-700 bg-red-100 border border-red-300 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>{lang === 'mr' ? 'कडक नियम' : 'Strict Penalty'}</span>
                            </span>
                          )}

                          {clause.highlight === 'eco' && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                              <Leaf className="w-3 h-3" />
                              <span>{lang === 'mr' ? 'पर्यावरण प्रोत्साहन' : 'Eco Boost'}</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                          {lang === 'mr' ? clause.textMr : clause.textEn}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ))
            )}

            {/* Bottom Agreement & Next Step Box */}
            <div className="bg-[#1C1917] text-white p-6 sm:p-8 rounded-2xl border-4 border-[#9B1B1E] space-y-4 shadow-lg">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-7 h-7 text-amber-400 shrink-0" />
                <div>
                  <h3 className="font-serif font-black text-xl text-stone-100">
                    {lang === 'mr' ? 'नियमांचे पालन करून सहभागी व्हा!' : 'Ready to participate with full compliance?'}
                  </h3>
                  <p className="text-xs text-stone-300">
                    {lang === 'mr'
                      ? 'ऑनलाइन नोंदणी करून वरील सर्व नियम मान्य केल्याचे ग्राह्य धरले जाईल.'
                      : 'By submitting an entry, the participant explicitly agrees to and accepts this entire Rule Book without reservation.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-stone-800">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#9B1B1E] hover:bg-[#781416] text-white font-bold px-8 py-3.5 rounded-xl shadow-sm text-sm transition-all"
                >
                  <span>{lang === 'mr' ? 'होय, नियम मान्य आहेत — नोंदणी करा (₹199)' : 'I Agree to Rules — Register Now (₹199)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/#prizes"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold px-6 py-3.5 rounded-xl text-sm transition-colors"
                >
                  <span>{lang === 'mr' ? 'पारितोषिकांची माहिती पहा' : 'View Top 10 Prizes'}</span>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
