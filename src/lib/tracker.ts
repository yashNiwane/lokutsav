'use client';

// Lightweight client-side journey & drop-off tracker
export type JourneyStep = 1 | 2 | 3 | 4;

export type StageName =
  | 'VISIT_HOME'
  | 'ENTER_REGISTER'
  | 'STEP_1_PERSONAL'
  | 'STEP_2_DECORATION'
  | 'STEP_3_PAYMENT'
  | 'STEP_4_COMPLETED'
  | 'PAYMENT_INITIATED'
  | 'PAYMENT_FAILED'
  | 'DROP_OFF';

export interface TrackerPayload {
  step?: JourneyStep;
  stageName: StageName;
  eventType?: 'STEP_ENTER' | 'FIELD_INTERACT' | 'PHOTO_UPLOAD' | 'PAYMENT_INITIATED' | 'PAYMENT_COMPLETED' | 'PAYMENT_FAILED' | 'DROP_OFF';
  field?: string;
  category?: string;
  district?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  themeTitle?: string;
  photosCount?: number;
  hasVideo?: boolean;
  ticketId?: string;
  paymentStatus?: string;
  metadata?: Record<string, any>;
}

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server-session';

  let sId = sessionStorage.getItem('lokutsav_session_id');
  if (!sId) {
    sId = localStorage.getItem('lokutsav_session_id');
  }

  if (!sId) {
    sId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    try {
      sessionStorage.setItem('lokutsav_session_id', sId);
      localStorage.setItem('lokutsav_session_id', sId);
    } catch {
      // storage unavailable
    }
  }

  return sId;
}

export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) return 'mobile';
  return 'desktop';
}

export function trackJourney(payload: TrackerPayload) {
  if (typeof window === 'undefined') return;

  const sessionId = getOrCreateSessionId();
  const deviceType = getDeviceType();
  const referrer = document.referrer || 'direct';

  const body = JSON.stringify({
    sessionId,
    deviceType,
    referrer,
    ...payload,
    timestamp: new Date().toISOString(),
  });

  try {
    // Prefer sendBeacon for unloads & reliability without blocking UI
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/track', blob);
      return;
    }

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // silent failure for tracking
  }
}
