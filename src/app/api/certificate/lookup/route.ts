import { NextRequest, NextResponse } from 'next/server';
import { prisma, canUsePrisma, dataStore } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawPhone = (searchParams.get('phone') || '').trim();
    const rawTicketId = (searchParams.get('ticketId') || '').trim().toUpperCase();

    const cleanPhone = rawPhone.replace('+91', '').replace(/[\s-]/g, '').trim();

    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'कृपया आपला १०-अंकी मोबाईल नंबर प्रविष्ट करा. (Please provide a valid 10-digit mobile number.)',
        },
        { status: 400 }
      );
    }

    let entries: any[] = [];
    let unpaidFound = false;

    if (await canUsePrisma()) {
      // 1. First search for COMPLETED (paid) entries matching phone
      const whereClause: any = {
        phone: { contains: cleanPhone },
        paymentStatus: 'COMPLETED',
      };

      if (rawTicketId && rawTicketId.startsWith('LOK')) {
        whereClause.ticketId = rawTicketId;
      }

      const paidRows = await prisma.participant.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      });

      if (paidRows.length > 0) {
        entries = paidRows.map((r: any) => ({
          id: r.id,
          ticketId: r.ticketId,
          fullName: r.fullName,
          phone: r.phone,
          district: r.district,
          city: r.city,
          category: r.category,
          idolType: r.idolType,
          themeTitle: r.themeTitle,
          themeDescription: r.themeDescription,
          paymentStatus: r.paymentStatus,
          createdAt: r.createdAt.toISOString(),
          certificateNo: `CERT-${r.ticketId}`,
        }));
      } else {
        // Check if there is an UNPAID entry with this phone
        const unpaidWhere: any = {
          phone: { contains: cleanPhone },
        };
        if (rawTicketId && rawTicketId.startsWith('LOK')) {
          unpaidWhere.ticketId = rawTicketId;
        }
        const unpaidRows = await prisma.participant.findMany({
          where: unpaidWhere,
          take: 1,
        });
        if (unpaidRows.length > 0) {
          unpaidFound = true;
        }
      }
    } else {
      // Fallback in-memory
      const all = await dataStore.getAllEntries();
      const paid = all.filter((e) => {
        const pMatch = e.phone.replace('+91', '').replace(/[\s-]/g, '').includes(cleanPhone);
        const tMatch = rawTicketId ? e.ticketId.toUpperCase() === rawTicketId : true;
        return pMatch && tMatch && e.paymentStatus === 'COMPLETED';
      });

      if (paid.length > 0) {
        entries = paid.map((e) => ({
          ...e,
          certificateNo: `CERT-${e.ticketId}`,
        }));
      } else {
        const unpaid = all.find((e) => {
          const pMatch = e.phone.replace('+91', '').replace(/[\s-]/g, '').includes(cleanPhone);
          const tMatch = rawTicketId ? e.ticketId.toUpperCase() === rawTicketId : true;
          return pMatch && tMatch;
        });
        if (unpaid) {
          unpaidFound = true;
        }
      }
    }

    if (entries.length === 0) {
      if (unpaidFound) {
        return NextResponse.json({
          success: true,
          found: false,
          unpaid: true,
          message:
            'या मोबाईल नंबरवर नोंदणी आढळली आहे, परंतु नोंदणी शुल्क पूर्ण झालेले नाही. सहभाग प्रमाणपत्र केवळ पुष्टीकृत स्पर्धकांसाठी उपलब्ध आहे. (Registration was found, but payment was not completed. Certificate is available only for confirmed participants.)',
        });
      }

      return NextResponse.json({
        success: true,
        found: false,
        message:
          'या मोबाईल नंबरवर कोणतीही पुष्टीकृत नोंदणी आढळली नाही. कृपया योग्य १०-अंकी मोबाईल नंबर तपासा. (No confirmed registration found for this mobile number.)',
      });
    }

    return NextResponse.json({
      success: true,
      found: true,
      count: entries.length,
      entries,
    });
  } catch (error: any) {
    console.error('Certificate lookup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while searching for certificate' },
      { status: 500 }
    );
  }
}
