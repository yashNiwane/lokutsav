const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Lokutsav Database...');

  // 1. Create or upsert Competition
  const comp = await prisma.competition.upsert({
    where: { slug: 'ganeshutsav-2026' },
    update: {},
    create: {
      slug: 'ganeshutsav-2026',
      title: 'Maharashtra Rajya Online Ganpati Decoration Competition 2026',
      titleMr: 'महाराष्ट्र राज्य ऑनलाइन गणेश सजावट स्पर्धा 2026',
      description: 'State-wide online Ganpati decoration competition across all 36 districts of Maharashtra.',
      descriptionMr: 'महाराष्ट्रातील सर्व 36 जिल्ह्यांसाठी भव्य राज्यस्तरीय ऑनलाइन गणेश सजावट स्पर्धा.',
      year: 2026,
      entryFee: 99,
      prizePoolText: '₹1,50,000+ in Cash & Gold Trophies',
      prizePoolTextMr: '₹1,50,000+ रोख व मानाच्या सुवर्ण ट्रॉफीज',
      registrationEnd: new Date('2026-09-30T23:59:59Z'),
      judgingEnd: new Date('2026-10-05T23:59:59Z'),
    },
  });

  // 2. Create Criteria
  const criteria = [
    {
      id: 'crit-1',
      name: 'Concept & Creativity',
      nameMr: 'संकल्पना व कल्पकता',
      description: 'Originality of story, theme, cultural resonance, and depth of imagination.',
      descriptionMr: 'सजावटीमागील मूळ विचार, संदेश, सामाजिक किंवा पौराणिक संकल्पनेची मांडणी.',
      maxScore: 10,
      weight: 0.25,
      sortOrder: 1,
    },
    {
      id: 'crit-2',
      name: 'Craftsmanship & Detailing',
      nameMr: 'हस्तकला व फिनिशिंग',
      description: 'Structural precision, finishing, artistry, handmade elements, and aesthetic balance.',
      descriptionMr: 'तयार केलेल्या देखाव्याची कारागिरी, अचूकता, सुबकता आणि सुसंवाद.',
      maxScore: 10,
      weight: 0.25,
      sortOrder: 2,
    },
    {
      id: 'crit-3',
      name: 'Eco-Friendliness & Materials',
      nameMr: 'पर्यावरणपूरकता व साहित्य',
      description: 'Clay (Shadu) idol, cloth, bamboo, paper pulp, seed paper; zero thermocol or plastic.',
      descriptionMr: 'शाडू माती मूर्ती, कागदी लगदा, फुले, कापड यांसारख्या निसर्गस्नेही घटकांचा वापर.',
      maxScore: 10,
      weight: 0.20,
      sortOrder: 3,
    },
    {
      id: 'crit-4',
      name: 'Lighting & Presentation',
      nameMr: 'प्रकाशयोजना व सादरीकरण',
      description: 'Lighting design, color coherence, neatness, framing, and visual ambience.',
      descriptionMr: 'रंगसंगती, प्रकाशयोजना (Lighting), मांडणीचे सौंदर्य आणि संपूर्ण दृश्य प्रभाव.',
      maxScore: 10,
      weight: 0.15,
      sortOrder: 4,
    },
    {
      id: 'crit-5',
      name: 'Uniqueness & Wow Factor',
      nameMr: 'नाविन्यता व वेगळेपण',
      description: 'Novel approach, emotional impact, and unforgettable artistic impression.',
      descriptionMr: 'नेहमीपेक्षा वेगळा विचार आणि प्रेक्षकांना मंत्रमुग्ध करणारी नाविन्यपूर्ण कल्पना.',
      maxScore: 10,
      weight: 0.15,
      sortOrder: 5,
    },
  ];

  for (const c of criteria) {
    await prisma.judgingCriterion.upsert({
      where: { id: c.id },
      update: c,
      create: c,
    });
  }

  // 3. Create Sponsors
  const sponsors = [
    {
      id: 'sp-1',
      name: 'Chitale Bandhu Mithaiwale',
      tier: 'TITLE',
      logoUrl: '/sponsors/chitale.png',
      websiteUrl: 'https://chitalebandhu.in',
      sponsoredCategory: 'Title Partner & Grand 1st Prize',
      sponsoredCategoryMr: 'मुख्य प्रायोजक व महाविजेता पारितोषिक',
      description: 'Maharashtra’s iconic heritage sweetmaker celebrating sweet traditions for over 8 decades.',
      descriptionMr: 'महाराष्ट्राचे लाडके मिष्ठान्न ब्रँड, 8 दशकांपासून परंपरेची गोडी जपणारे चितळे बंधू.',
      sortOrder: 1,
    },
    {
      id: 'sp-2',
      name: 'PNG Jewellers',
      tier: 'POWERED_BY',
      logoUrl: '/sponsors/png.png',
      websiteUrl: 'https://pngjewellers.com',
      sponsoredCategory: 'Official Trophy & Gold Partner',
      sponsoredCategoryMr: 'अधिकृत सुवर्ण ट्रॉफी व सह-प्रायोजक',
      description: 'Purity, Trust and 190+ years of Royal Maharashtrian Jewellery legacy.',
      descriptionMr: 'शुद्धता, विश्वास आणि 190+ वर्षांचा सुवर्ण वारसा जपणारे पी एन जी ज्वेलर्स.',
      sortOrder: 2,
    },
  ];

  for (const sp of sponsors) {
  // 4. Create Test & Seed Participants
  const testParticipants = [
    {
      ticketId: 'LOK-2026-1001',
      competitionId: comp.id,
      fullName: 'सचिन दत्तात्रय पाटील (Sachin Dattatraya Patil)',
      phone: '9999999999',
      email: 'sachin.patil@example.com',
      district: 'Pune',
      city: 'Kothrud, Pune',
      address: 'Plot 45, Mayur Colony, Kothrud, Pune 411038',
      category: 'HOUSEHOLD',
      idolType: 'SHADU_MATI_CLAY',
      themeTitle: 'ऐतिहासिक शिवकालीन रायगड दरबार देखावा',
      themeDescription: 'छत्रपती शिवाजी महाराजांच्या मेघडंबरीची पर्यावरणपूरक भव्य प्रतिकृती, बांबू व मातीचे घटक.',
      materialsUsed: 'शाडू माती मूर्ती, बांबू, ज्यूट दोरी, पर्यावरणपूरक रंग, मातीचे दिवे.',
      photoUrls: '["https://images.unsplash.com/photo-1567591370504-20a2e7c54ef5?auto=format&fit=crop&w=1200&q=80"]',
      videoUrl: 'https://www.youtube.com/watch?v=sample1',
      entryFee: 99,
      paymentStatus: 'COMPLETED',
      status: 'APPROVED',
    },
    {
      ticketId: 'LOK-2026-2002',
      competitionId: comp.id,
      fullName: 'श्री गणेश मित्र मंडळ (Shree Ganesh Mitra Mandal)',
      phone: '9888888888',
      email: 'mitramandal.mumbai@example.com',
      district: 'Mumbai City',
      city: 'Dadar, Mumbai',
      address: 'Shree Ganesh Nagar, Ranade Road, Dadar West, Mumbai 400028',
      category: 'SARVAJANIK_MANDAL',
      idolType: 'ECO_FRIENDLY_PAPER_PULP',
      themeTitle: 'सुवर्ण मंदिर प्रतिकृती व भव्य पारंपरिक रोषणाई',
      themeDescription: 'अमृतसर सुवर्ण मंदिराची पर्यावरणपूरक कागदी लगद्याची सुंदर प्रतिकृती व शांत प्रकाशयोजना.',
      materialsUsed: 'कागदी लगदा, कापड, लाकडी फ्रेम, एलईडी रोषणाई.',
      photoUrls: '["https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1200&q=80"]',
      videoUrl: 'https://www.youtube.com/watch?v=sample2',
      entryFee: 99,
      paymentStatus: 'COMPLETED',
      status: 'APPROVED',
    },
    {
      ticketId: 'LOK-2026-3001',
      competitionId: comp.id,
      fullName: 'आनंद महादेव सावंत (Anand Mahadev Sawant)',
      phone: '9777777777',
      email: 'anand.sawant@example.com',
      district: 'Kolhapur',
      city: 'Rajarampuri, Kolhapur',
      address: 'Tarabai Park, Kolhapur 416003',
      category: 'HOUSEHOLD',
      idolType: 'SHADU_MATI_CLAY',
      themeTitle: 'अंबाबाई महालक्ष्मी दीपस्तंभ देखावा',
      themeDescription: '१०८ पारंपरिक पितळी दिव्यांची आरास व राजस्थानी मंदिर कोरीव काम.',
      materialsUsed: 'शाडू माती, लाकूड, पितळी दिवे.',
      photoUrls: '["https://images.unsplash.com/photo-1599827552599-eafeedb4231f?auto=format&fit=crop&w=1200&q=80"]',
      entryFee: 99,
      paymentStatus: 'COMPLETED',
      status: 'APPROVED',
    },
    {
      ticketId: 'LOK-2026-3002',
      competitionId: comp.id,
      fullName: 'सावंत कुटुंब पर्यावरणपूरक गणेशोत्सव',
      phone: '9777777777',
      email: 'anand.sawant@example.com',
      district: 'Kolhapur',
      city: 'Rajarampuri, Kolhapur',
      address: 'Tarabai Park, Kolhapur 416003',
      category: 'HOUSEHOLD',
      idolType: 'ECO_FRIENDLY_PAPER_PULP',
      themeTitle: 'निसर्ग संवर्धन व हरित महाराष्ट्र संकल्पना',
      themeDescription: 'रोपवाटिका व खतांपासून तयार केलेली पर्यावरणस्नेही आरास.',
      materialsUsed: 'जिवंत झाडे, कागदी लगदा, माती.',
      photoUrls: '["https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=1200&q=80"]',
      entryFee: 99,
      paymentStatus: 'COMPLETED',
      status: 'APPROVED',
    },
    {
      ticketId: 'LOK-2026-4004',
      competitionId: comp.id,
      fullName: 'राहुल विठ्ठल मोहिते (Rahul Vitthal Mohite)',
      phone: '9666666666',
      email: 'rahul.mohite@example.com',
      district: 'Nashik',
      city: 'Gangapur Road, Nashik',
      address: 'Shree Residency, Nashik 422005',
      category: 'HOUSEHOLD',
      idolType: 'SHADU_MATI_CLAY',
      themeTitle: 'नाशिक कुंभमेळा व गोदावरी घाट देखावा',
      themeDescription: 'गोदावरी आरती व घाटांचे दृश्य.',
      materialsUsed: 'शाडू माती, कापड.',
      photoUrls: '[]',
      entryFee: 99,
      paymentStatus: 'PENDING',
      status: 'PENDING_VERIFICATION',
    },
  ];

  for (const p of testParticipants) {
    await prisma.participant.upsert({
      where: { ticketId: p.ticketId },
      update: p,
      create: p,
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
