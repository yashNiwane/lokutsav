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

export const dataStore = {
  async getAllEntries(): Promise<ParticipantEntry[]> {
    try {
      if (process.env.DATABASE_URL) {
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
      if (process.env.DATABASE_URL) {
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
      if (process.env.DATABASE_URL) {
        // Find or create default competition
        let comp = await prisma.competition.findFirst();
        if (!comp) {
          comp = await prisma.competition.create({
            data: {
              slug: 'ganeshutsav-2026',
              title: 'Maharashtra Rajya Online Ganpati Decoration Competition 2026',
              titleMr: 'महाराष्ट्र राज्य ऑनलाइन गणेश सजावट स्पर्धा २०२६',
              description: 'State-level Ganpati decoration competition',
              descriptionMr: 'राज्यस्तरीय गणेश सजावट स्पर्धा',
              entryFee: 199,
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
            status: newEntry.status as any,
          },
        });

        newEntry.id = created.id;
      }
    } catch {
      // Prisma insertion fallback
    }

    inMemoryEntries.unshift(newEntry);
    return newEntry;
  },

  async updatePayment(
    ticketId: string,
    razorpayPaymentId: string,
    razorpayOrderId?: string
  ): Promise<boolean> {
    try {
      if (process.env.DATABASE_URL) {
        await prisma.participant.updateMany({
          where: { ticketId },
          data: {
            paymentStatus: 'COMPLETED',
            status: 'APPROVED',
            razorpayPaymentId,
            razorpayOrderId,
          },
        });
      }
    } catch {
      // fallback
    }

    const idx = inMemoryEntries.findIndex((e) => e.ticketId === ticketId);
    if (idx !== -1) {
      inMemoryEntries[idx].paymentStatus = 'COMPLETED';
      inMemoryEntries[idx].status = 'APPROVED';
      inMemoryEntries[idx].razorpayPaymentId = razorpayPaymentId;
      if (razorpayOrderId) inMemoryEntries[idx].razorpayOrderId = razorpayOrderId;
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
      if (process.env.DATABASE_URL) {
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

  getCriteria(): Criterion[] {
    return JUDGING_CRITERIA_LIST;
  },

  getSponsors(): SponsorItem[] {
    return SPONSORS_LIST;
  },
};
