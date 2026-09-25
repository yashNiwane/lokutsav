// Competition Lifecycle State
// 'REGISTRATION_OPEN' = Active competition & registration phase
// 'REGISTRATION_CLOSED' = Registrations closed, Jury evaluating देखावे, results awaiting announcement
// 'COMPLETED' = Post-competition phase: Gallery & Top 10 Winners unlocked publicly

export interface CompetitionPhaseConfig {
  phase: 'REGISTRATION_OPEN' | 'REGISTRATION_CLOSED' | 'COMPLETED';
  announcementDateEn: string;
  announcementDateMr: string;
}

// Global runtime state
export const competitionConfig: CompetitionPhaseConfig = {
  phase: 'REGISTRATION_CLOSED', // Registrations are now closed; jury evaluating
  announcementDateEn: 'Tomorrow (26th September 2026) by 6:00 PM',
  announcementDateMr: 'उद्या (२६ सप्टेंबर २०२६) सायंकाळी ६:०० वाजता',
};

// Check if new registrations can be accepted
export function isRegistrationOpen(): boolean {
  return competitionConfig.phase === 'REGISTRATION_OPEN';
}

// During active or evaluation phases, winners & public gallery remain unannounced
export function isCompetitionActive(): boolean {
  return competitionConfig.phase === 'REGISTRATION_OPEN' || competitionConfig.phase === 'REGISTRATION_CLOSED';
}

// Have the results been officially published on website
export function areResultsAnnounced(): boolean {
  return competitionConfig.phase === 'COMPLETED';
}

export function setCompetitionPhase(phase: 'REGISTRATION_OPEN' | 'REGISTRATION_CLOSED' | 'COMPLETED') {
  competitionConfig.phase = phase;
}
