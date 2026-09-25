import { NextRequest, NextResponse } from 'next/server';
import { competitionConfig, setCompetitionPhase } from '@/lib/competition-config';

export async function GET() {
  return NextResponse.json({
    success: true,
    phase: competitionConfig.phase,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { phase, passcode } = await request.json();

    const validPasscodes = new Set([
      'ASGData#4509',
      'AYPtech@2026',
      'lokutsav2026',
      process.env.JURY_PASSCODE?.trim(),
      process.env.ADMIN_PASSCODE?.trim(),
    ].filter(Boolean));

    if (!passcode || !validPasscodes.has(passcode.trim())) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid passcode' },
        { status: 401 }
      );
    }

    if (phase !== 'REGISTRATION_OPEN' && phase !== 'REGISTRATION_CLOSED' && phase !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Invalid phase value. Must be REGISTRATION_OPEN, REGISTRATION_CLOSED, or COMPLETED' },
        { status: 400 }
      );
    }

    setCompetitionPhase(phase);

    return NextResponse.json({
      success: true,
      phase: competitionConfig.phase,
      message:
        phase === 'COMPLETED'
          ? 'स्पर्धा संपन्न टप्पा सक्रिय! गॅलरी व महाविजेते सर्वांसाठी लाइव्ह करण्यात आले आहेत.'
          : phase === 'REGISTRATION_CLOSED'
          ? 'नोंदणी बंद टप्पा सक्रिय! निकाल उद्या सायंकाळी ६ वाजता जाहीर केला जाईल.'
          : 'नोंदणी चालू टप्पा सक्रिय! गॅलरी व विजेते लोकांच्या नजरेतून लपवले आहेत.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
