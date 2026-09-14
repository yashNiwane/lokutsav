import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    if (!payload || !payload.sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    await dataStore.trackJourney({
      sessionId: String(payload.sessionId).trim(),
      step: payload.step ? Number(payload.step) : 1,
      stageName: payload.stageName || 'VISIT',
      eventType: payload.eventType || 'STEP_ENTER',
      field: payload.field || undefined,
      category: payload.category || undefined,
      district: payload.district || undefined,
      fullName: payload.fullName || undefined,
      phone: payload.phone || undefined,
      email: payload.email || undefined,
      themeTitle: payload.themeTitle || undefined,
      photosCount: payload.photosCount !== undefined ? Number(payload.photosCount) : undefined,
      hasVideo: Boolean(payload.hasVideo),
      ticketId: payload.ticketId || undefined,
      paymentStatus: payload.paymentStatus || undefined,
      deviceType: payload.deviceType || 'mobile',
      referrer: payload.referrer || undefined,
      metadata: payload.metadata || undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Analytics track error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to record tracking event' },
      { status: 500 }
    );
  }
}
