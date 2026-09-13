import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code || !code.trim()) {
      return NextResponse.json(
        { error: 'Referral code or Ticket ID is required' },
        { status: 400 }
      );
    }

    const stats = await dataStore.getReferralStats(code);

    if (!stats.found) {
      return NextResponse.json(
        { error: 'वैध रेफरल कोड / तिकीट सापडले नाही (Referral code not found)' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error('Referral stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch referral stats' },
      { status: 500 }
    );
  }
}
