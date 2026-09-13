export type Language = 'mr' | 'en';

export type Category = 'HOUSEHOLD' | 'SARVAJANIK_MANDAL';

export type IdolType = 'SHADU_MATI_CLAY' | 'ECO_FRIENDLY_PAPER_PULP' | 'TRADITIONAL_OTHER';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export type EntryStatus = 'PENDING_VERIFICATION' | 'APPROVED' | 'FLAGGED' | 'REJECTED';

export type SponsorTier = 'TITLE' | 'POWERED_BY' | 'GOLD' | 'ASSOCIATE';

export interface ParticipantEntry {
  id: string;
  ticketId: string;
  fullName: string;
  phone: string;
  email: string;
  district: string;
  city: string;
  address: string;
  category: Category;
  idolType: IdolType;
  themeTitle: string;
  themeDescription: string;
  materialsUsed: string;
  photoUrls: string[];
  videoUrl?: string;
  entryFee: number;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  termsAccepted?: boolean;
  termsAcceptedAt?: string;
  status: EntryStatus;
  finalScore?: number;
  finalRank?: number;
  evaluationsCount?: number;
  createdAt: string;
}

export interface Criterion {
  id: string;
  name: string;
  nameMr: string;
  description: string;
  descriptionMr: string;
  maxScore: number;
  weight: number;
  iconName: string;
}

export interface EvaluationRecord {
  id: string;
  participantId: string;
  judgeName: string;
  scores: Record<string, number>; // criterionId -> score (1-10)
  totalScore: number;
  remarks?: string;
  createdAt: string;
}

export interface SponsorItem {
  id: string;
  name: string;
  tier: SponsorTier;
  logoUrl: string;
  websiteUrl?: string;
  sponsoredCategory: string;
  sponsoredCategoryMr: string;
  description: string;
  descriptionMr: string;
}

export interface PrizeItem {
  rank: number;
  title: string;
  titleMr: string;
  cashAmount: number;
  cashText: string;
  cashTextMr: string;
  perks: string[];
  perksMr: string[];
  badgeColor: string;
}
