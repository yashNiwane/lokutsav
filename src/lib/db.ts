import { PrismaClient } from '@prisma/client';
import { INITIAL_ENTRIES, JUDGING_CRITERIA_LIST, SPONSORS_LIST } from './seed-data';
import { ParticipantEntry, Criterion, SponsorItem } from './types';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

// In-memory persistent cache for zero-setup local dev / demo mode when database is not yet seeded
let inMemoryEntries: ParticipantEntry[] = [...INITIAL_ENTRIES];
let isPostgresAvailable: boolean | null = null;

async function canUsePrisma(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  if (isPostgresAvailable === false) return false;
  if (isPostgresAvailable === true) return true;

  try {
    const check = prisma.$queryRaw`SELECT 1`;
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 600));
    await Promise.race([check, timeout]);
    isPostgresAvailable = true;
    return true;
  } catch {
    console.warn('⚡ [Lokutsav] PostgreSQL not connected locally. Using instant in-memory data store.');
    isPostgresAvailable = false;
    return false;
  }
}

export const dataStore = {
  async getAllEntries(): Promise<ParticipantEntry[]> {
    try {
      if (await canUsePrisma()) {
        const rows = await prisma.participant.findMany({
          orderBy: [{ finalRank: 'asc' }, { createdAt: 'desc' }],
        });
        if (rows.length > 0) {
          return rows.map((r: any) => ({
            id: r.id,
            ticketId: r.ticketId,
            fullName: r.fullName,
            phone: r.phone,
            email: r.email,
            district: r.district,
            city: r.city,
            address: r.address,
            category: r.category as any,
            idolType: r.idolType as any,
            themeTitle: r.themeTitle,
            themeDescription: r.themeDescription,
            materialsUsed: r.materialsUsed || '',
            photoUrls: JSON.parse(r.photoUrls || '[]'),
            videoUrl: r.videoUrl || undefined,
            entryFee: r.entryFee,
            paymentStatus: r.paymentStatus as any,
            razorpayOrderId: r.razorpayOrderId || undefined,
            razorpayPaymentId: r.razorpayPaymentId || undefined,
            status: r.status as any,
            finalScore: r.finalScore || undefined,
            finalRank: r.finalRank || undefined,
            createdAt: r.createdAt.toISOString(),
          }));
        }
      }
    } catch {
      // Fallback to in-memory store
    }
    return inMemoryEntries;
  },

  async getEntryById(id: string): Promise<ParticipantEntry | null> {
    try {
      if (await canUsePrisma()) {
        const r = await prisma.participant.findUnique({
          where: { id },
        });
        if (r) {
          return {
            id: r.id,
            ticketId: r.ticketId,
            fullName: r.fullName,
            phone: r.phone,
            email: r.email,
            district: r.district,
            city: r.city,
            address: r.address,
            category: r.category as any,
            idolType: r.idolType as any,
            themeTitle: r.themeTitle,
            themeDescription: r.themeDescription,
            materialsUsed: r.materialsUsed || '',
            photoUrls: JSON.parse(r.photoUrls || '[]'),
            videoUrl: r.videoUrl || undefined,
            entryFee: r.entryFee,
            paymentStatus: r.paymentStatus as any,
            razorpayOrderId: r.razorpayOrderId || undefined,
            razorpayPaymentId: r.razorpayPaymentId || undefined,
            status: r.status as any,
            finalScore: r.finalScore || undefined,
            finalRank: r.finalRank || undefined,
            createdAt: r.createdAt.toISOString(),
          };
        }
      }
    } catch {
      // fallback
    }
    return inMemoryEntries.find((e) => e.id === id || e.ticketId === id) || null;
  },

  async createEntry(data: Omit<ParticipantEntry, 'id' | 'createdAt'>): Promise<ParticipantEntry> {
    const newEntry: ParticipantEntry = {
      ...data,
      id: `entry-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };

    try {
      if (await canUsePrisma()) {
        // Find or create default competition
        let comp = await prisma.competition.findFirst();
        if (!comp) {
          comp = await prisma.competition.create({
            data: {
              slug: 'ganeshutsav-2026',
              title: 'Maharashtra Rajya Online Ganpati Decoration Competition 2026',
              titleMr: 'महाराष्ट्र राज्य ऑनलाइन गणेश सजावट स्पर्धा 2026',
              description: 'State-level Ganpati decoration competition',
              descriptionMr: 'राज्यस्तरीय गणेश सजावट स्पर्धा',
              entryFee: 99,
              registrationEnd: new Date('2026-09-30T23:59:59Z'),
              judgingEnd: new Date('2026-10-05T23:59:59Z'),
            },
          });
        }

        const created = await prisma.participant.create({
          data: {
            ticketId: newEntry.ticketId,
            competitionId: comp.id,
            fullName: newEntry.fullName,
            phone: newEntry.phone,
            email: newEntry.email,
            district: newEntry.district,
            city: newEntry.city,
            address: newEntry.address,
            category: newEntry.category as any,
            idolType: newEntry.idolType as any,
            themeTitle: newEntry.themeTitle,
            themeDescription: newEntry.themeDescription,
            materialsUsed: newEntry.materialsUsed,
            photoUrls: JSON.stringify(newEntry.photoUrls),
            videoUrl: newEntry.videoUrl,
            entryFee: newEntry.entryFee,
            paymentStatus: newEntry.paymentStatus as any,
            razorpayOrderId: newEntry.razorpayOrderId,
            razorpayPaymentId: newEntry.razorpayPaymentId,
            termsAccepted: newEntry.termsAccepted ?? true,
            termsAcceptedAt: newEntry.termsAcceptedAt ? new Date(newEntry.termsAcceptedAt) : new Date(),
            referralCode: newEntry.referralCode || newEntry.ticketId,
            referredBy: newEntry.referredBy || null,
            referralCount: 0,
            status: newEntry.status as any,
          },
        });

        newEntry.id = created.id;
      }
    } catch {
      // Prisma insertion fallback
    }

    newEntry.referralCode = newEntry.referralCode || newEntry.ticketId;
    newEntry.referralCount = 0;
    inMemoryEntries.unshift(newEntry);
    return newEntry;
  },

  async updatePayment(
    ticketId: string,
    razorpayPaymentId: string,
    razorpayOrderId?: string,
    termsAccepted: boolean = true
  ): Promise<boolean> {
    const acceptedAt = new Date();
    try {
      if (await canUsePrisma()) {
        await prisma.participant.updateMany({
          where: { ticketId },
          data: {
            paymentStatus: 'COMPLETED',
            status: 'APPROVED',
            razorpayPaymentId,
            razorpayOrderId,
            termsAccepted,
            termsAcceptedAt: acceptedAt,
          },
        });

        // Increment referrer count if applicable
        const entry = await prisma.participant.findUnique({ where: { ticketId } });
        if (entry?.referredBy) {
          await prisma.participant.updateMany({
            where: {
              OR: [{ ticketId: entry.referredBy }, { referralCode: entry.referredBy }],
            },
            data: {
              referralCount: { increment: 1 },
            },
          });
        }
      }
    } catch {
      // fallback
    }

    const idx = inMemoryEntries.findIndex((e) => e.ticketId === ticketId);
    if (idx !== -1) {
      inMemoryEntries[idx].paymentStatus = 'COMPLETED';
      inMemoryEntries[idx].status = 'APPROVED';
      inMemoryEntries[idx].razorpayPaymentId = razorpayPaymentId;
      inMemoryEntries[idx].termsAccepted = termsAccepted;
      inMemoryEntries[idx].termsAcceptedAt = acceptedAt.toISOString();
      if (razorpayOrderId) inMemoryEntries[idx].razorpayOrderId = razorpayOrderId;

      // Increment referral in in-memory
      const refCode = inMemoryEntries[idx].referredBy;
      if (refCode) {
        const referrer = inMemoryEntries.find((e) => e.ticketId === refCode || e.referralCode === refCode);
        if (referrer) {
          referrer.referralCount = (referrer.referralCount || 0) + 1;
        }
      }

      return true;
    }
    return false;
  },

  async scoreEntry(
    id: string,
    scores: Record<string, number>,
    remarks?: string
  ): Promise<ParticipantEntry | null> {
    // calculate weighted total score out of 10
    let totalScore = 0;
    for (const crit of JUDGING_CRITERIA_LIST) {
      const raw = scores[crit.id] || 0;
      totalScore += raw * crit.weight;
    }
    totalScore = Math.round(totalScore * 10) / 10;

    try {
      if (await canUsePrisma()) {
        await prisma.participant.update({
          where: { id },
          data: {
            finalScore: totalScore,
          },
        });
      }
    } catch {
      // fallback
    }

    const idx = inMemoryEntries.findIndex((e) => e.id === id);
    if (idx !== -1) {
      inMemoryEntries[idx].finalScore = totalScore;
      inMemoryEntries[idx].evaluationsCount = (inMemoryEntries[idx].evaluationsCount || 0) + 1;
      
      // re-rank top 10
      const scored = [...inMemoryEntries].filter((e) => e.finalScore !== undefined);
      scored.sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0));
      scored.slice(0, 10).forEach((entry, i) => {
        const found = inMemoryEntries.find((e) => e.id === entry.id);
        if (found) found.finalRank = i + 1;
      });

      return inMemoryEntries[idx];
    }
    return null;
  },

  async getReferralStats(code: string): Promise<{
    found: boolean;
    ticketId?: string;
    fullName?: string;
    district?: string;
    referralCount: number;
    referredEntries?: Array<{ ticketId: string; fullName: string; date: string; status: string }>;
  }> {
    const clean = code.trim();
    try {
      if (await canUsePrisma()) {
        const user = await prisma.participant.findFirst({
          where: {
            OR: [{ ticketId: clean }, { referralCode: clean }],
          },
        });
        if (user) {
          const referred = await prisma.participant.findMany({
            where: {
              referredBy: clean,
              paymentStatus: 'COMPLETED',
            },
            select: { ticketId: true, fullName: true, createdAt: true, status: true },
          });

          return {
            found: true,
            ticketId: user.ticketId,
            fullName: user.fullName,
            district: user.district,
            referralCount: referred.length || user.referralCount || 0,
            referredEntries: referred.map((r) => ({
              ticketId: r.ticketId,
              fullName: r.fullName,
              date: r.createdAt.toISOString(),
              status: r.status,
            })),
          };
        }
      }
    } catch {
      // fallback
    }

    const memUser = inMemoryEntries.find((e) => e.ticketId === clean || e.referralCode === clean);
    if (memUser) {
      const referred = inMemoryEntries.filter(
        (e) => (e.referredBy === clean || e.referredBy === memUser.ticketId) && e.paymentStatus === 'COMPLETED'
      );
      return {
        found: true,
        ticketId: memUser.ticketId,
        fullName: memUser.fullName,
        district: memUser.district,
        referralCount: referred.length || memUser.referralCount || 0,
        referredEntries: referred.map((r) => ({
          ticketId: r.ticketId,
          fullName: r.fullName,
          date: r.createdAt,
          status: r.status,
        })),
      };
    }

    return { found: false, referralCount: 0 };
  },

  getCriteria(): Criterion[] {
    return JUDGING_CRITERIA_LIST;
  },

  getSponsors(): SponsorItem[] {
    return SPONSORS_LIST;
  },
};
