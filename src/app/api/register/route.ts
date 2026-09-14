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
      referredBy = '',
    } = body;

    // Basic validation
    if (!fullName || !phone || !district) {
      return NextResponse.json(
        { error: 'Please provide all required fields (Name, Phone, District)' },
        { status: 400 }
      );
    }

    const hasPhotos = Array.isArray(photoUrls) && photoUrls.length > 0;
    const hasVideo = !!(videoUrl && typeof videoUrl === 'string' && videoUrl.trim().length > 0);

    if (!hasPhotos && !hasVideo) {
      return NextResponse.json(
        { error: 'Please provide at least one photo or a video of your Ganpati decoration' },
        { status: 400 }
      );
    }

    // Default theme title if omitted
    const finalThemeTitle =
      themeTitle && typeof themeTitle === 'string' && themeTitle.trim().length > 0
        ? themeTitle.trim()
        : `${fullName} - गणेश सजावट 2026`;

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
      idolType: idolType || 'SHADU_MATI_CLAY',
      themeTitle: finalThemeTitle,
      themeDescription: themeDescription || finalThemeTitle,
      materialsUsed: materialsUsed || '',
      photoUrls: hasPhotos ? photoUrls : [],
      videoUrl: hasVideo ? videoUrl.trim() : undefined,
      entryFee: 199,
      paymentStatus: 'PENDING',
      termsAccepted: false,
      referredBy: referredBy ? referredBy.trim().toUpperCase() : undefined,
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
