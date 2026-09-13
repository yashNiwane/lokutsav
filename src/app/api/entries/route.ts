import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get('district');
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.toLowerCase();
    const winnersOnly = searchParams.get('winners') === 'true';

    let entries = await dataStore.getAllEntries();

    if (winnersOnly) {
      entries = entries.filter((e) => e.finalRank && e.finalRank <= 10);
      entries.sort((a, b) => (a.finalRank || 99) - (b.finalRank || 99));
    }

    if (district && district !== 'ALL') {
      entries = entries.filter((e) => e.district.toLowerCase() === district.toLowerCase());
    }

    if (category && category !== 'ALL') {
      entries = entries.filter((e) => e.category === category);
    }

    if (search) {
      entries = entries.filter(
        (e) =>
          e.fullName.toLowerCase().includes(search) ||
          e.themeTitle.toLowerCase().includes(search) ||
          e.district.toLowerCase().includes(search) ||
          e.ticketId.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      count: entries.length,
      entries,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch entries' }, { status: 500 });
  }
}
