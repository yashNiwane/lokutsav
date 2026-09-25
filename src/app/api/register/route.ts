import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/db';
import { createRegistrationOrder } from '@/lib/razorpay';
import { generateUniqueTicketId } from '@/lib/ticket-generator';
import { isRegistrationOpen } from '@/lib/competition-config';

export async function POST(request: NextRequest) {
  try {
    if (!isRegistrationOpen()) {
      return NextResponse.json(
        {
          error: 'नोंदणी प्रक्रिया आता बंद झाली आहे. अंतिम निकाल उद्या सायंकाळी ६:०० वाजता जाहीर केला जाईल. (Registrations are closed. Results will be announced tomorrow by 6:00 PM.)',
          registrationsClosed: true,
        },
        { status: 403 }
      );
    }

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

    const cleanPhone = phone.toString().replace('+91', '').replace(/[\s-]/g, '').trim();

    // 1. Check if user has ALREADY completed registration with this phone number
    const existingEntry = await dataStore.findEntryByPhone(cleanPhone);
    if (existingEntry && existingEntry.paymentStatus === 'COMPLETED') {
      return NextResponse.json({
        success: true,
        alreadyRegistered: true,
        ticketId: existingEntry.ticketId,
        entryId: existingEntry.id,
        entry: existingEntry,
        message: 'या मोबाईल नंबरवर आधीच नोंदणी झालेली आहे / Already registered with this mobile number',
      });
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

    // 2. Generate guaranteed unique 6-digit Ticket ID (verified against database)
    const ticketId = await generateUniqueTicketId();

    // 3. Create participant entry in database
    const newEntry = await dataStore.createEntry({
      ticketId,
      fullName: fullName.trim(),
      phone: cleanPhone,
      email: email ? email.trim() : `${cleanPhone}@lokutsav.org`,
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
      entryFee: 99,
      paymentStatus: 'PENDING',
      termsAccepted: false,
      referredBy: referredBy ? referredBy.trim().toUpperCase() : undefined,
      status: 'PENDING_VERIFICATION',
    });

    // 4. Generate Razorpay Order
    const order = await createRegistrationOrder(ticketId, 99);

    // 5. Store razorpayOrderId immediately in the database row
    if (order?.orderId) {
      await dataStore.updateOrderId(newEntry.id, order.orderId);
    }

    return NextResponse.json({
      success: true,
      ticketId,
      entryId: newEntry.id,
      order,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
