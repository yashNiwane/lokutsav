import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/db';
import { createRegistrationOrder } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      fullName,
      phone,
      email,
      district,
      city,
      address,
      category = 'HOUSEHOLD',
      idolType = 'SHADU_MATI_CLAY',
      themeTitle,
      themeDescription,
      materialsUsed = '',
      photoUrls = [],
      videoUrl = '',
    } = body;

    // Basic validation
    if (!fullName || !phone || !district || !themeTitle || !themeDescription) {
      return NextResponse.json(
        { error: 'Please provide all required fields (Name, Phone, District, Theme Title, Theme Description)' },
        { status: 400 }
      );
    }

    if (!photoUrls || photoUrls.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one photo of your Ganpati decoration' },
        { status: 400 }
      );
    }

    // Generate unique Ticket ID: LOK-2026-XXXX
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `LOK-2026-${randomCode}`;

    // Create participant entry in database
    const newEntry = await dataStore.createEntry({
      ticketId,
      fullName,
      phone,
      email: email || `${phone}@lokutsav.org`,
      district,
      city: city || district,
      address: address || `${city}, ${district}`,
      category,
      idolType,
      themeTitle,
      themeDescription,
      materialsUsed,
      photoUrls,
      videoUrl: videoUrl || undefined,
      entryFee: 199,
      paymentStatus: 'PENDING',
      status: 'PENDING_VERIFICATION',
    });

    // Generate Razorpay Order
    const order = await createRegistrationOrder(ticketId, 199);

    return NextResponse.json({
      success: true,
      ticketId,
      entryId: newEntry.id,
      order,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
