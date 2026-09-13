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

    const expectedPasscode = process.env.JURY_PASSCODE || 'AYPtech@2026';
    if (passcode !== expectedPasscode) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid passcode' },
        { status: 401 }
      );
    }

    if (phase !== 'REGISTRATION_OPEN' && phase !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Invalid phase value' },
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
          : 'स्पर्धा चालू टप्पा सक्रिय! गॅलरी व विजेते लोकांच्या नजरेतून लपवले आहेत (केवळ ज्युरी पाहू व अद्ययावत करू शकतात).',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
