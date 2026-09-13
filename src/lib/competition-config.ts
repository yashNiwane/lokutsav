// Competition Lifecycle State
// 'REGISTRATION_OPEN' = Active competition phase: Gallery & Winners are hidden from public, Jury curates entries
// 'COMPLETED' = Post-competition phase: Gallery & Top 10 Winners unlocked publicly

export interface CompetitionPhaseConfig {
  phase: 'REGISTRATION_OPEN' | 'COMPLETED';
  announcementDateEn: string;
  announcementDateMr: string;
}

// Global runtime state (can be toggled in /judging portal by admin)
export const competitionConfig: CompetitionPhaseConfig = {
  phase: 'REGISTRATION_OPEN', // Active competition phase
  announcementDateEn: 'Anant Chaturdashi 2026',
  announcementDateMr: 'अनंत चतुर्दशी 2026',
};

export function isCompetitionActive(): boolean {
  return competitionConfig.phase === 'REGISTRATION_OPEN';
}

export function setCompetitionPhase(phase: 'REGISTRATION_OPEN' | 'COMPLETED') {
  competitionConfig.phase = phase;
}
