import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { entryId, scores, remarks, judgePasscode } = await request.json();

    // Verification: simple jury passcode for demo / evaluation
    const expectedPasscode = process.env.JURY_PASSCODE || 'AYPtech@2026';
    if (judgePasscode !== expectedPasscode) {
      return NextResponse.json(
        { error: 'Invalid Judge / Admin authorization passcode' },
        { status: 401 }
      );
    }

    if (!entryId || !scores) {
      return NextResponse.json(
        { error: 'Missing entryId or scores' },
        { status: 400 }
      );
    }

    const updated = await dataStore.scoreEntry(entryId, scores, remarks);

    if (!updated) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    const allEntries = await dataStore.getAllEntries();
    const top10 = allEntries
      .filter((e) => e.finalRank && e.finalRank <= 10)
      .sort((a, b) => (a.finalRank || 99) - (b.finalRank || 99));

    return NextResponse.json({
      success: true,
      message: 'Score successfully recorded and rank re-calculated!',
      entry: updated,
      top10,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Scoring failed' }, { status: 500 });
  }
}
