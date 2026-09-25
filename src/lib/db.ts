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

import fs from 'fs';
import path from 'path';

function loadLocalManifestEntries(): ParticipantEntry[] {
  try {
    const manifestPath = path.join(process.cwd(), 'participants_manifest.json');
    if (fs.existsSync(manifestPath)) {
      const raw = fs.readFileSync(manifestPath, 'utf-8');
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        return list.map((item: any, idx: number) => {
          let photos: string[] = [];
          if (item.photoUrls) {
            try {
              photos = typeof item.photoUrls === 'string' ? JSON.parse(item.photoUrls) : item.photoUrls;
            } catch {
              photos = [item.photoUrls];
            }
          }
          return {
            id: item.id || `entry-manifest-${idx}`,
            ticketId: item.ticketId || `LOK-2026-${1000 + idx}`,
            fullName: item.fullName || 'Participant',
            phone: item.phone || '',
            email: item.email || `${item.phone || 'participant'}@lokutsav.com`,
            district: item.district || 'Maharashtra',
            city: item.city || item.district || 'Maharashtra',
            address: item.address || item.city || item.district || '',
            category: (item.category === 'SARVAJANIK_MANDAL' ? 'SARVAJANIK_MANDAL' : 'HOUSEHOLD') as any,
            idolType: (item.idolType || 'SHADU_MATI_CLAY') as any,
            themeTitle: item.themeTitle || 'पारंपारिक गणेश सजावट',
            themeDescription: item.themeDescription || 'श्री गणेशाची सुंदर व मंगलमय सजावट.',
            materialsUsed: item.materialsUsed || '',
            photoUrls: photos,
            videoUrl: item.videoUrl || undefined,
            entryFee: 99,
            paymentStatus: (item.paymentStatus === 'COMPLETED' ? 'COMPLETED' : 'PENDING') as any,
            status: 'APPROVED',
            createdAt: item.createdAt || new Date().toISOString(),
          };
        });
      }
    }
  } catch {
    // Non-fatal
  }
  return [];
}

const manifestEntries = loadLocalManifestEntries();
const existingTickets = new Set(INITIAL_ENTRIES.map((e) => e.ticketId.toUpperCase()));
const mergedEntries = [
  ...INITIAL_ENTRIES,
  ...manifestEntries.filter((m) => !existingTickets.has(m.ticketId.toUpperCase())),
];

// In-memory persistent cache for zero-setup local dev / demo mode when database is not yet seeded
let inMemoryEntries: ParticipantEntry[] = mergedEntries;
let inMemoryJourneySessions: any[] = [];
let inMemoryJourneyEvents: any[] = [];
let isPostgresAvailable: boolean | null = null;

export async function canUsePrisma(): Promise<boolean> {
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
          where: {
            paymentStatus: 'COMPLETED',
          },
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
      // Fallback to in-memory store (only paid entries)
    }
    return inMemoryEntries.filter((e) => e.paymentStatus === 'COMPLETED');
  },

  async getEntryById(id: string): Promise<ParticipantEntry | null> {
    try {
      if (await canUsePrisma()) {
        const cleanPhone = id.replace('+91', '').replace(/[\s-]/g, '').trim();
        const r = await prisma.participant.findFirst({
          where: {
            OR: [
              { id },
              { ticketId: id },
              { ticketId: id.toUpperCase() },
              ...(cleanPhone.length === 10 ? [{ phone: cleanPhone }] : []),
            ],
          },
          orderBy: [
            { paymentStatus: 'desc' }, // Prioritize COMPLETED
            { createdAt: 'desc' },
          ],
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
    const cleanPhone = id.replace('+91', '').replace(/[\s-]/g, '').trim();
    return (
      inMemoryEntries.find(
        (e) =>
          e.id === id ||
          e.ticketId.toUpperCase() === id.toUpperCase() ||
          (cleanPhone.length === 10 && e.phone === cleanPhone)
      ) || null
    );
  },

  async findEntryByPhone(phone: string): Promise<ParticipantEntry | null> {
    const clean = phone.replace('+91', '').replace(/[\s-]/g, '').trim();
    if (!clean) return null;
    return this.getEntryById(clean);
  },

  async getEntryByOrderId(orderId: string): Promise<ParticipantEntry | null> {
    try {
      if (await canUsePrisma()) {
        const r = await prisma.participant.findFirst({
          where: { razorpayOrderId: orderId },
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
    return inMemoryEntries.find((e) => e.razorpayOrderId === orderId) || null;
  },

  async updateOrderId(idOrTicket: string, razorpayOrderId: string): Promise<void> {
    try {
      if (await canUsePrisma()) {
        await prisma.participant.updateMany({
          where: {
            OR: [{ id: idOrTicket }, { ticketId: idOrTicket }],
          },
          data: { razorpayOrderId },
        });
      }
    } catch {
      // fallback
    }
    const idx = inMemoryEntries.findIndex((e) => e.id === idOrTicket || e.ticketId === idOrTicket);
    if (idx !== -1) {
      inMemoryEntries[idx].razorpayOrderId = razorpayOrderId;
    }
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
        newEntry.referralCode = newEntry.referralCode || newEntry.ticketId;
        newEntry.referralCount = 0;
        inMemoryEntries.unshift(newEntry);
        return newEntry;
      }
    } catch (err: any) {
      console.error('Prisma participant creation failed:', err);
      // Re-throw database error so caller does not create ghost in-memory ticket
      throw err;
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
    commissionEarned?: number;
    commissionRate?: number;
    referredEntries?: Array<{ ticketId: string; fullName: string; date: string; status: string }>;
  }> {
    const clean = code.trim();
    const COMMISSION_PER_REGISTRATION = 9.9; // 10% of ₹99 registration fee
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

          const count = referred.length || user.referralCount || 0;
          return {
            found: true,
            ticketId: user.ticketId,
            fullName: user.fullName,
            district: user.district,
            referralCount: count,
            commissionEarned: Number((count * COMMISSION_PER_REGISTRATION).toFixed(2)),
            commissionRate: 10,
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
      const count = referred.length || memUser.referralCount || 0;
      return {
        found: true,
        ticketId: memUser.ticketId,
        fullName: memUser.fullName,
        district: memUser.district,
        referralCount: count,
        commissionEarned: Number((count * COMMISSION_PER_REGISTRATION).toFixed(2)),
        commissionRate: 10,
        referredEntries: referred.map((r) => ({
          ticketId: r.ticketId,
          fullName: r.fullName,
          date: r.createdAt,
          status: r.status,
        })),
      };
    }

    return { found: false, referralCount: 0, commissionEarned: 0, commissionRate: 10 };
  },

  getCriteria(): Criterion[] {
    return JUDGING_CRITERIA_LIST;
  },

  getSponsors(): SponsorItem[] {
    return SPONSORS_LIST;
  },

  // ==========================================
  // User Journey Analytics & Drop-off Tracking
  // ==========================================
  async trackJourney(payload: {
    sessionId: string;
    step?: number;
    stageName: string;
    eventType?: string;
    field?: string;
    category?: string;
    district?: string;
    city?: string;
    address?: string;
    fullName?: string;
    phone?: string;
    email?: string;
    idolType?: string;
    themeTitle?: string;
    themeDescription?: string;
    materialsUsed?: string;
    photoUrls?: string[];
    photosCount?: number;
    videoUrl?: string;
    hasVideo?: boolean;
    referredBy?: string;
    ticketId?: string;
    paymentStatus?: string;
    deviceType?: string;
    referrer?: string;
    formDataJson?: string;
    metadata?: any;
  }): Promise<boolean> {
    const stepNum = Number(payload.step) || 1;
    const isSuccess = payload.eventType === 'PAYMENT_COMPLETED' || payload.paymentStatus === 'COMPLETED';

    try {
      if (await canUsePrisma()) {
        const existing = await prisma.userJourneySession.findUnique({
          where: { sessionId: payload.sessionId },
        });

        const maxStep = Math.max(existing?.maxStepReached || 1, stepNum);
        const droppedAt = isSuccess ? null : payload.stageName;
        const dropField = isSuccess ? null : (payload.field || existing?.dropOffField || null);
        const photosJson = payload.photoUrls ? JSON.stringify(payload.photoUrls) : undefined;
        const photoCount = payload.photosCount !== undefined ? payload.photosCount : (payload.photoUrls?.length || 0);

        await prisma.userJourneySession.upsert({
          where: { sessionId: payload.sessionId },
          create: {
            sessionId: payload.sessionId,
            currentStep: stepNum,
            maxStepReached: maxStep,
            stageName: payload.stageName,
            isCompleted: isSuccess,
            droppedOffAt: droppedAt,
            dropOffField: dropField,
            category: payload.category || undefined,
            district: payload.district || undefined,
            city: payload.city || undefined,
            address: payload.address || undefined,
            fullName: payload.fullName || undefined,
            phone: payload.phone || undefined,
            email: payload.email || undefined,
            idolType: payload.idolType || undefined,
            themeTitle: payload.themeTitle || undefined,
            themeDescription: payload.themeDescription || undefined,
            materialsUsed: payload.materialsUsed || undefined,
            photoUrls: photosJson,
            photosCount: photoCount,
            videoUrl: payload.videoUrl || undefined,
            hasVideo: payload.hasVideo || Boolean(payload.videoUrl),
            referredBy: payload.referredBy || undefined,
            ticketId: payload.ticketId || undefined,
            paymentStatus: payload.paymentStatus || (isSuccess ? 'COMPLETED' : 'NOT_INITIATED'),
            deviceType: payload.deviceType || 'mobile',
            referrer: payload.referrer || undefined,
            formDataJson: payload.formDataJson || undefined,
          },
          update: {
            currentStep: stepNum,
            maxStepReached: maxStep,
            stageName: payload.stageName,
            isCompleted: isSuccess ? true : (existing?.isCompleted ?? false),
            droppedOffAt: droppedAt,
            dropOffField: dropField,
            category: payload.category || existing?.category || undefined,
            district: payload.district || existing?.district || undefined,
            city: payload.city || existing?.city || undefined,
            address: payload.address || existing?.address || undefined,
            fullName: payload.fullName || existing?.fullName || undefined,
            phone: payload.phone || existing?.phone || undefined,
            email: payload.email || existing?.email || undefined,
            idolType: payload.idolType || existing?.idolType || undefined,
            themeTitle: payload.themeTitle || existing?.themeTitle || undefined,
            themeDescription: payload.themeDescription || existing?.themeDescription || undefined,
            materialsUsed: payload.materialsUsed || existing?.materialsUsed || undefined,
            photoUrls: photosJson || existing?.photoUrls || undefined,
            photosCount: payload.photosCount !== undefined ? payload.photosCount : (photoCount || existing?.photosCount || 0),
            videoUrl: payload.videoUrl || existing?.videoUrl || undefined,
            hasVideo: payload.hasVideo !== undefined ? payload.hasVideo : (Boolean(payload.videoUrl) || existing?.hasVideo || false),
            referredBy: payload.referredBy || existing?.referredBy || undefined,
            ticketId: payload.ticketId || existing?.ticketId || undefined,
            paymentStatus: payload.paymentStatus || existing?.paymentStatus || (isSuccess ? 'COMPLETED' : 'NOT_INITIATED'),
            deviceType: payload.deviceType || existing?.deviceType || 'mobile',
            formDataJson: payload.formDataJson || existing?.formDataJson || undefined,
          },
        });

        // Record granular event
        await prisma.userJourneyEvent.create({
          data: {
            sessionId: payload.sessionId,
            eventType: payload.eventType || 'STEP_ENTER',
            step: stepNum,
            stageName: payload.stageName,
            field: payload.field || null,
            metadata: payload.metadata ? JSON.stringify(payload.metadata) : null,
          },
        });

        return true;
      }
    } catch (e) {
      console.warn('⚡ [Lokutsav Analytics] Prisma write error, recording in memory:', e);
    }

    // In-memory fallback
    const idx = inMemoryJourneySessions.findIndex((s) => s.sessionId === payload.sessionId);
    const now = new Date();
    const existing = idx !== -1 ? inMemoryJourneySessions[idx] : null;
    const maxStep = Math.max(existing?.maxStepReached || 1, stepNum);
    const droppedAt = isSuccess ? null : payload.stageName;
    const dropField = isSuccess ? null : (payload.field || existing?.dropOffField || null);
    const photosJson = payload.photoUrls ? JSON.stringify(payload.photoUrls) : existing?.photoUrls;

    const sessionObj = {
      sessionId: payload.sessionId,
      currentStep: stepNum,
      maxStepReached: maxStep,
      stageName: payload.stageName,
      isCompleted: isSuccess ? true : (existing?.isCompleted ?? false),
      droppedOffAt: droppedAt,
      dropOffField: dropField,
      category: payload.category || existing?.category || 'HOUSEHOLD',
      district: payload.district || existing?.district || 'Pune',
      city: payload.city || existing?.city || '',
      address: payload.address || existing?.address || '',
      fullName: payload.fullName || existing?.fullName || '',
      phone: payload.phone || existing?.phone || '',
      email: payload.email || existing?.email || '',
      idolType: payload.idolType || existing?.idolType || 'SHADU_MATI_CLAY',
      themeTitle: payload.themeTitle || existing?.themeTitle || '',
      themeDescription: payload.themeDescription || existing?.themeDescription || '',
      materialsUsed: payload.materialsUsed || existing?.materialsUsed || '',
      photoUrls: photosJson,
      photosCount: payload.photosCount !== undefined ? payload.photosCount : (existing?.photosCount ?? 0),
      videoUrl: payload.videoUrl || existing?.videoUrl || '',
      hasVideo: payload.hasVideo !== undefined ? payload.hasVideo : (existing?.hasVideo ?? false),
      referredBy: payload.referredBy || existing?.referredBy || '',
      ticketId: payload.ticketId || existing?.ticketId || '',
      paymentStatus: payload.paymentStatus || existing?.paymentStatus || (isSuccess ? 'COMPLETED' : 'NOT_INITIATED'),
      deviceType: payload.deviceType || existing?.deviceType || 'mobile',
      referrer: payload.referrer || existing?.referrer || 'direct',
      formDataJson: payload.formDataJson || existing?.formDataJson || undefined,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    if (idx !== -1) {
      inMemoryJourneySessions[idx] = sessionObj;
    } else {
      inMemoryJourneySessions.push(sessionObj);
    }

    inMemoryJourneyEvents.push({
      id: 'ev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      sessionId: payload.sessionId,
      eventType: payload.eventType || 'STEP_ENTER',
      step: stepNum,
      stageName: payload.stageName,
      field: payload.field || null,
      metadata: payload.metadata ? JSON.stringify(payload.metadata) : null,
      createdAt: now,
    });

    return true;
  },

  async getAnalyticsSummary(timeRange: string = 'all'): Promise<{
    overview: {
      totalSessions: number;
      completed: number;
      droppedOff: number;
      conversionRate: number;
      dropOffRate: number;
    };
    funnel: Array<{
      step: number;
      name: string;
      nameMr: string;
      count: number;
      conversionFromPrev: number;
      dropOffCount: number;
      dropOffRate: number;
    }>;
    stuckPoints: Array<{
      field: string;
      label: string;
      labelMr: string;
      dropOffCount: number;
      percentage: number;
    }>;
    deviceBreakdown: Array<{
      device: string;
      count: number;
      completed: number;
      conversionRate: number;
    }>;
    districtStats: Array<{
      district: string;
      sessions: number;
      completed: number;
      dropOffRate: number;
    }>;
    allLeads: Array<any>;
    incompleteLeads: Array<any>;
    recentEvents: Array<{
      id: string;
      sessionId: string;
      eventType: string;
      step: number;
      stageName: string;
      field: string | null;
      createdAt: string;
    }>;
  }> {
    let sessions: any[] = [];
    let events: any[] = [];

    // Filter date calculation
    let dateFilter: Date | null = null;
    if (timeRange === 'today') {
      dateFilter = new Date();
      dateFilter.setHours(0, 0, 0, 0);
    } else if (timeRange === '7days') {
      dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - 7);
    } else if (timeRange === '30days') {
      dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - 30);
    }

    try {
      if (await canUsePrisma()) {
        const whereClause = dateFilter ? { createdAt: { gte: dateFilter } } : {};
        sessions = await prisma.userJourneySession.findMany({
          where: whereClause,
          select: {
            sessionId: true,
            currentStep: true,
            maxStepReached: true,
            stageName: true,
            isCompleted: true,
            droppedOffAt: true,
            dropOffField: true,
            category: true,
            district: true,
            city: true,
            address: true,
            fullName: true,
            phone: true,
            email: true,
            idolType: true,
            themeTitle: true,
            themeDescription: true,
            materialsUsed: true,
            photoUrls: true,
            photosCount: true,
            videoUrl: true,
            hasVideo: true,
            referredBy: true,
            ticketId: true,
            paymentStatus: true,
            deviceType: true,
            referrer: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { updatedAt: 'desc' },
        });
        events = await prisma.userJourneyEvent.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          take: 50,
        });
      }
    } catch {
      // fallback
    }

    if (sessions.length === 0 && inMemoryJourneySessions.length > 0) {
      sessions = inMemoryJourneySessions.filter((s) => (!dateFilter ? true : new Date(s.createdAt) >= dateFilter));
      events = inMemoryJourneyEvents
        .filter((e) => (!dateFilter ? true : new Date(e.createdAt) >= dateFilter))
        .slice(-50)
        .reverse();
    }

    // Also include registered participants from main Participant table to guarantee live accuracy
    let participantCount = 0;
    try {
      if (await canUsePrisma()) {
        participantCount = await prisma.participant.count({
          where: { paymentStatus: 'COMPLETED' },
        });
      } else {
        participantCount = inMemoryEntries.filter((e) => e.paymentStatus === 'COMPLETED').length;
      }
    } catch {
      participantCount = inMemoryEntries.filter((e) => e.paymentStatus === 'COMPLETED').length;
    }

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter((s) => s.isCompleted || s.paymentStatus === 'COMPLETED');
    const completedCount = Math.max(completedSessions.length, participantCount);
    const droppedOffCount = Math.max(0, totalSessions - completedCount);
    const conversionRate = totalSessions > 0 ? Number(((completedCount / totalSessions) * 100).toFixed(1)) : 0;
    const dropOffRate = totalSessions > 0 ? Number(((droppedOffCount / totalSessions) * 100).toFixed(1)) : 0;

    // Funnel Steps Calculation
    // Step 1: Visited Register & Started Personal Details
    const step1Count = sessions.filter((s) => (s.maxStepReached || s.currentStep || 1) >= 1).length || totalSessions;
    // Step 2: Completed Personal & Reached Decoration / Uploads
    const step2Count = sessions.filter((s) => (s.maxStepReached || s.currentStep || 1) >= 2).length;
    // Step 3: Completed Decoration/Photos & Reached Payment Review
    const step3Count = sessions.filter((s) => (s.maxStepReached || s.currentStep || 1) >= 3).length;
    // Step 4: Initiated Payment Checkout / Verified
    const step4Count = completedCount;

    const funnel = [
      {
        step: 1,
        name: 'Step 1: Personal Details',
        nameMr: 'टप्पा १: वैयक्तिक माहिती',
        count: step1Count,
        conversionFromPrev: 100,
        dropOffCount: Math.max(0, step1Count - step2Count),
        dropOffRate: step1Count > 0 ? Number((((step1Count - step2Count) / step1Count) * 100).toFixed(1)) : 0,
      },
      {
        step: 2,
        name: 'Step 2: Decoration Details & Photos',
        nameMr: 'टप्पा २: सजावट व फोटो अपलोड',
        count: step2Count,
        conversionFromPrev: step1Count > 0 ? Number(((step2Count / step1Count) * 100).toFixed(1)) : 0,
        dropOffCount: Math.max(0, step2Count - step3Count),
        dropOffRate: step2Count > 0 ? Number((((step2Count - step3Count) / step2Count) * 100).toFixed(1)) : 0,
      },
      {
        step: 3,
        name: 'Step 3: Review & Payment Confirmation',
        nameMr: 'टप्पा ३: पडताळणी व शुल्क ₹९९',
        count: step3Count,
        conversionFromPrev: step2Count > 0 ? Number(((step3Count / step2Count) * 100).toFixed(1)) : 0,
        dropOffCount: Math.max(0, step3Count - step4Count),
        dropOffRate: step3Count > 0 ? Number((((step3Count - step4Count) / step3Count) * 100).toFixed(1)) : 0,
      },
      {
        step: 4,
        name: 'Completed: Verified & Ticket Generated',
        nameMr: 'यशस्वी: तिकीट वितरीत',
        count: step4Count,
        conversionFromPrev: step3Count > 0 ? Number(((step4Count / step3Count) * 100).toFixed(1)) : 0,
        dropOffCount: 0,
        dropOffRate: 0,
      },
    ];

    // Stuck Points / Drop-off Fields Analysis
    const fieldCounts: Record<string, number> = {};
    const uncompleted = sessions.filter((s) => !s.isCompleted && s.paymentStatus !== 'COMPLETED');
    uncompleted.forEach((s) => {
      const key = s.dropOffField || (s.maxStepReached === 1 ? 'personal_details' : s.maxStepReached === 2 ? 'photos_upload' : 'payment_screen');
      fieldCounts[key] = (fieldCounts[key] || 0) + 1;
    });

    const fieldLabels: Record<string, { label: string; labelMr: string }> = {
      photos_upload: { label: 'Decoration Photos / Video Upload', labelMr: 'सजावटीचे फोटो / व्हिडिओ अपलोड' },
      photos: { label: 'Decoration Photos / Video Upload', labelMr: 'सजावटीचे फोटो / व्हिडिओ अपलोड' },
      phone: { label: 'WhatsApp Phone Number Input', labelMr: 'व्हॉट्सॲप फोन नंबर नोंदणी' },
      payment_screen: { label: 'Payment Gateway (₹99 Fee Hesitation)', labelMr: 'पेमेंट स्क्रीन (₹९९ शुल्क)' },
      razorpay_modal: { label: 'Razorpay UPI Modal Dismissed', labelMr: 'UPI पेमेंट विंडो बंद केली' },
      personal_details: { label: 'Personal Information Form', labelMr: 'वैयक्तिक माहिती फॉर्म' },
      district: { label: 'District / City Selection', labelMr: 'जिल्हा / शहर निवड' },
      address: { label: 'Address & Mandal Details', labelMr: 'पत्ता व तपशील' },
      themeDescription: { label: 'Decoration Concept & Description', labelMr: 'देखाव्याची संकल्पना / वर्णन' },
    };

    const stuckPoints = Object.entries(fieldCounts)
      .map(([field, count]) => {
        const meta = fieldLabels[field] || { label: field, labelMr: field };
        return {
          field,
          label: meta.label,
          labelMr: meta.labelMr,
          dropOffCount: count,
          percentage: uncompleted.length > 0 ? Number(((count / uncompleted.length) * 100).toFixed(1)) : 0,
        };
      })
      .sort((a, b) => b.dropOffCount - a.dropOffCount)
      .slice(0, 6);

    // Device breakdown
    const deviceMap: Record<string, { count: number; completed: number }> = {
      mobile: { count: 0, completed: 0 },
      desktop: { count: 0, completed: 0 },
      tablet: { count: 0, completed: 0 },
    };
    sessions.forEach((s) => {
      const d = (s.deviceType || 'mobile').toLowerCase();
      const target = deviceMap[d] || deviceMap['mobile'];
      target.count += 1;
      if (s.isCompleted || s.paymentStatus === 'COMPLETED') target.completed += 1;
    });

    const deviceBreakdown = Object.entries(deviceMap).map(([device, data]) => ({
      device: device.charAt(0).toUpperCase() + device.slice(1),
      count: data.count,
      completed: data.completed,
      conversionRate: data.count > 0 ? Number(((data.completed / data.count) * 100).toFixed(1)) : 0,
    }));

    // District stats
    const districtMap: Record<string, { sessions: number; completed: number }> = {};
    sessions.forEach((s) => {
      if (s.district) {
        if (!districtMap[s.district]) districtMap[s.district] = { sessions: 0, completed: 0 };
        districtMap[s.district].sessions += 1;
        if (s.isCompleted || s.paymentStatus === 'COMPLETED') districtMap[s.district].completed += 1;
      }
    });

    const districtStats = Object.entries(districtMap)
      .map(([district, data]) => ({
        district,
        sessions: data.sessions,
        completed: data.completed,
        dropOffRate: data.sessions > 0 ? Number((((data.sessions - data.completed) / data.sessions) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 8);

    // Helper to format lead object with all filled fields
    const formatLead = (s: any) => {
      let parsedPhotos: string[] = [];
      if (s.photoUrls) {
        try {
          const arr = JSON.parse(s.photoUrls);
          parsedPhotos = Array.isArray(arr) ? arr.filter((u: any) => typeof u === 'string' && !u.startsWith('data:')) : [];
        } catch {
          parsedPhotos = typeof s.photoUrls === 'string' && !s.photoUrls.startsWith('data:') ? [s.photoUrls] : [];
        }
      }

      const isDone = s.isCompleted === true || s.paymentStatus === 'COMPLETED';

      return {
        sessionId: s.sessionId,
        fullName: s.fullName || '',
        phone: s.phone || '',
        email: s.email || '',
        district: s.district || '',
        city: s.city || '',
        address: s.address || '',
        category: s.category || 'HOUSEHOLD',
        idolType: s.idolType || 'SHADU_MATI_CLAY',
        themeTitle: s.themeTitle || '',
        themeDescription: s.themeDescription || '',
        materialsUsed: s.materialsUsed || '',
        photoUrls: parsedPhotos,
        photosCount: s.photosCount || parsedPhotos.length,
        videoUrl: s.videoUrl || '',
        hasVideo: s.hasVideo || Boolean(s.videoUrl),
        referredBy: s.referredBy || '',
        ticketId: s.ticketId || '',
        paymentStatus: s.paymentStatus || (isDone ? 'COMPLETED' : 'NOT_INITIATED'),
        isCompleted: isDone,
        currentStep: s.currentStep || 1,
        maxStepReached: s.maxStepReached || 1,
        droppedOffAt: isDone ? null : (s.droppedOffAt || 'STEP_1_PERSONAL'),
        dropOffField: isDone ? null : (s.dropOffField || 'photos'),
        deviceType: s.deviceType || 'mobile',
        referrer: s.referrer || 'direct',
        lastActive: s.updatedAt ? new Date(s.updatedAt).toISOString() : (s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString()),
        createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString(),
      };
    };

    // All person sessions with every single field filled
    const allLeads = sessions.map(formatLead);
    const incompleteLeads: any[] = [];

    const recentEvents = events.slice(0, 50).map((e) => ({
      id: e.id,
      sessionId: e.sessionId,
      eventType: e.eventType,
      step: e.step,
      stageName: e.stageName,
      field: e.field,
      createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : new Date().toISOString(),
    }));

    return {
      overview: {
        totalSessions,
        completed: completedCount,
        droppedOff: droppedOffCount,
        conversionRate,
        dropOffRate,
      },
      funnel,
      stuckPoints,
      deviceBreakdown,
      districtStats,
      allLeads,
      incompleteLeads,
      recentEvents,
    };
  },
};

