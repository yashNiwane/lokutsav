import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/db';

function verifyAdminPasscode(provided?: string | null): boolean {
  if (!provided) return false;
  const clean = provided.trim();
  const validPasscodes = new Set([
    'ASGData#4509',
    process.env.ADMIN_PASSCODE?.trim(),
  ].filter(Boolean));
  return validPasscodes.has(clean);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get('authorization') || '';
    const tokenFromHeader = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const passcode = searchParams.get('passcode') || tokenFromHeader;

    if (!verifyAdminPasscode(passcode)) {
      return NextResponse.json(
        { error: 'अनधिकृत प्रवेश. कृपया वैध पासवर्ड टाका. (Unauthorized. Valid passcode required.)' },
        { status: 401 }
      );
    }

    const timeRange = searchParams.get('timeRange') || 'all';
    const analytics = await dataStore.getAnalyticsSummary(timeRange);

    return NextResponse.json({
      success: true,
      timeRange,
      analytics,
    });
  } catch (error: any) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate analytics summary' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const passcode = body?.passcode;

    if (!verifyAdminPasscode(passcode)) {
      return NextResponse.json(
        { error: 'अनधिकृत प्रवेश. कृपया वैध पासवर्ड टाका. (Unauthorized. Valid passcode required.)' },
        { status: 401 }
      );
    }

    const timeRange = body?.timeRange || 'all';
    const analytics = await dataStore.getAnalyticsSummary(timeRange);

    return NextResponse.json({
      success: true,
      timeRange,
      analytics,
    });
  } catch (error: any) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate analytics summary' },
      { status: 500 }
    );
  }
}
