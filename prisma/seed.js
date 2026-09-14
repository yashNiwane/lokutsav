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
      entryFee: 299,
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
    await prisma.sponsor.upsert({
      where: { id: sp.id },
      update: sp,
      create: sp,
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
