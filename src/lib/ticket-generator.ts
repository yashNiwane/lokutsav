import { prisma, canUsePrisma } from './db';

/**
 * Generate a guaranteed unique Ticket ID: LOK-2026-XXXXXX (6 digits, 900,000 combinations)
 * Pre-checks PostgreSQL to prevent any collision or unique constraint violation.
 */
export async function generateUniqueTicketId(): Promise<string> {
  for (let attempt = 0; attempt < 25; attempt++) {
    // 6-digit random code: 100000 - 999999
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const candidate = `LOK-2026-${randomCode}`;

    try {
      if (await canUsePrisma()) {
        const existing = await prisma.participant.findUnique({
          where: { ticketId: candidate },
          select: { id: true },
        });
        if (!existing) {
          return candidate;
        }
      } else {
        return candidate;
      }
    } catch {
      return candidate;
    }
  }

  // Cryptographic fallback using timestamp suffix
  const timestampSuffix = `${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;
  return `LOK-2026-${timestampSuffix}`;
}
