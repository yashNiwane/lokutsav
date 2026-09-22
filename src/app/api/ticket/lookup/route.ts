import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || searchParams.get('phone') || searchParams.get('ticketId') || '').trim();

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'कृपया मोबाईल नंबर किंवा तिकीट क्रमांक प्रविष्ट करा (Please provide mobile number or ticket ID)' },
        { status: 400 }
      );
    }

    const rawQuery = query.trim();
    const isTicket = rawQuery.toUpperCase().startsWith('LOK');
    const cleanPhone = rawQuery.replace('+91', '').replace(/[\s-]/g, '').trim();
    const lookupTarget = isTicket ? rawQuery.toUpperCase() : (cleanPhone.length === 10 ? cleanPhone : rawQuery);

    // Look up entry in dataStore (searches by id, ticketId, and phone)
    const entry = await dataStore.getEntryById(lookupTarget);

    if (!entry) {
      return NextResponse.json({
        success: true,
        found: false,
        message: 'या मोबाईल नंबरवर किंवा तिकीट क्रमांकावर कोणतीही नोंदणी आढळली नाही. (No registration found.)',
      });
    }

    return NextResponse.json({
      success: true,
      found: true,
      entry: {
        id: entry.id,
        ticketId: entry.ticketId,
        fullName: entry.fullName,
        phone: entry.phone,
        email: entry.email,
        district: entry.district,
        city: entry.city,
        address: entry.address,
        category: entry.category,
        idolType: entry.idolType,
        themeTitle: entry.themeTitle,
        themeDescription: entry.themeDescription,
        materialsUsed: entry.materialsUsed,
        photoUrls: entry.photoUrls,
        videoUrl: entry.videoUrl,
        entryFee: entry.entryFee,
        paymentStatus: entry.paymentStatus,
        createdAt: entry.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Ticket lookup error:', error);
    return NextResponse.json(
      { success: false, error: 'Ticket lookup failed' },
      { status: 500 }
    );
  }
}
