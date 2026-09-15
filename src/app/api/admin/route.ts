import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const VALID_PASSCODES = new Set([
  'AYPtech@2026',
  'lokutsav2026',
  process.env.ADMIN_PASSCODE?.trim(),
  process.env.JURY_PASSCODE?.trim(),
].filter(Boolean));

function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();
  const queryPass = req.nextUrl.searchParams.get('passcode')?.trim();
  return (token && VALID_PASSCODES.has(token)) || (queryPass && VALID_PASSCODES.has(queryPass)) || false;
}

// GET: Fetch records from any database table with search, filter, sort & pagination
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized: Invalid admin credentials' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const table = searchParams.get('table') || 'participants';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const pageSize = Math.min(100, Math.max(10, parseInt(searchParams.get('pageSize') || '25')));
  const search = searchParams.get('search')?.trim() || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = (searchParams.get('sortOrder') || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';
  const paymentFilter = searchParams.get('paymentStatus'); // e.g. COMPLETED, PENDING, FAILED
  const districtFilter = searchParams.get('district');

  const skip = (page - 1) * pageSize;

  try {
    if (table === 'participants') {
      const where: any = {};
      if (paymentFilter && paymentFilter !== 'ALL') {
        where.paymentStatus = paymentFilter;
      }
      if (districtFilter && districtFilter !== 'ALL') {
        where.district = { equals: districtFilter, mode: 'insensitive' };
      }
      if (search) {
        where.OR = [
          { ticketId: { contains: search, mode: 'insensitive' } },
          { fullName: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
          { district: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } },
          { themeTitle: { contains: search, mode: 'insensitive' } },
          { razorpayPaymentId: { contains: search, mode: 'insensitive' } },
          { razorpayOrderId: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [total, rows] = await Promise.all([
        prisma.participant.count({ where }),
        prisma.participant.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: pageSize,
        }),
      ]);

      const formatted = rows.map((r: any) => ({
        ...r,
        photoUrls: (() => {
          try {
            return JSON.parse(r.photoUrls || '[]');
          } catch {
            return typeof r.photoUrls === 'string' ? [r.photoUrls] : [];
          }
        })(),
      }));

      return NextResponse.json({
        success: true,
        table,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        data: formatted,
      });
    }

    if (table === 'leads' || table === 'sessions') {
      const where: any = {};
      if (search) {
        where.OR = [
          { fullName: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
          { district: { contains: search, mode: 'insensitive' } },
          { ticketId: { contains: search, mode: 'insensitive' } },
          { sessionId: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [total, rows] = await Promise.all([
        prisma.userJourneySession.count({ where }),
        prisma.userJourneySession.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: pageSize,
        }),
      ]);

      return NextResponse.json({
        success: true,
        table,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        data: rows,
      });
    }

    if (table === 'evaluations') {
      const [total, rows] = await Promise.all([
        prisma.evaluation.count(),
        prisma.evaluation.findMany({
          include: {
            participant: {
              select: { ticketId: true, fullName: true, themeTitle: true, district: true },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: pageSize,
        }),
      ]);

      return NextResponse.json({
        success: true,
        table,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        data: rows,
      });
    }

    if (table === 'events') {
      const [total, rows] = await Promise.all([
        prisma.userJourneyEvent.count(),
        prisma.userJourneyEvent.findMany({
          orderBy: { createdAt: 'desc' },
          skip,
          take: pageSize,
        }),
      ]);

      return NextResponse.json({
        success: true,
        table,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        data: rows,
      });
    }

    return NextResponse.json({ error: 'Unknown table requested' }, { status: 400 });
  } catch (error: any) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: error.message || 'Database query failed' }, { status: 500 });
  }
}

// POST: Add new entry directly / VIP / Offline entry
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
      photoUrls = [],
      videoUrl = '',
      paymentStatus = 'COMPLETED',
      status = 'APPROVED',
      customTicketId,
    } = body;

    if (!fullName || !phone || !district) {
      return NextResponse.json({ error: 'Name, Phone, and District are required' }, { status: 400 });
    }

    let comp = await prisma.competition.findFirst();
    if (!comp) {
      comp = await prisma.competition.create({
        data: {
          slug: 'ganeshutsav-2026',
          title: 'Maharashtra Rajya Online Ganpati Decoration Competition 2026',
          titleMr: 'महाराष्ट्र राज्य ऑनलाइन गणेश सजावट स्पर्धा 2026',
          description: 'State competition',
          descriptionMr: 'राज्यस्तरीय स्पर्धा',
          registrationEnd: new Date('2026-09-30T23:59:59Z'),
          judgingEnd: new Date('2026-10-05T23:59:59Z'),
        },
      });
    }

    const ticketId = customTicketId?.trim() || `LOK-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRecord = await prisma.participant.create({
      data: {
        ticketId,
        competitionId: comp.id,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email?.trim() || `${phone.trim()}@lokutsav.org`,
        district: district.trim(),
        city: (city || district).trim(),
        address: (address || `${city || district}, ${district}`).trim(),
        category: category as any,
        idolType: idolType as any,
        themeTitle: themeTitle?.trim() || `${fullName.trim()} - गणेश सजावट`,
        themeDescription: themeDescription?.trim() || themeTitle?.trim() || 'Direct Registration',
        photoUrls: JSON.stringify(Array.isArray(photoUrls) ? photoUrls : [photoUrls]),
        videoUrl: videoUrl?.trim() || null,
        entryFee: 99,
        paymentStatus: paymentStatus as any,
        razorpayPaymentId: paymentStatus === 'COMPLETED' ? `admin_manual_${Date.now()}` : null,
        status: status as any,
        termsAccepted: true,
        termsAcceptedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Participant successfully created',
      participant: newRecord,
    });
  } catch (error: any) {
    console.error('Admin create entry error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create record' }, { status: 500 });
  }
}

// PUT: Update / Edit participant details or verify payment
export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ticketId, action, ...fieldsToUpdate } = body;

    const where = id ? { id } : ticketId ? { ticketId } : null;
    if (!where) {
      return NextResponse.json({ error: 'Participant id or ticketId is required' }, { status: 400 });
    }

    // Shortcut actions
    if (action === 'MARK_PAID') {
      const updated = await prisma.participant.update({
        where,
        data: {
          paymentStatus: 'COMPLETED',
          status: 'APPROVED',
          razorpayPaymentId: fieldsToUpdate.razorpayPaymentId || `manual_admin_${Date.now()}`,
          termsAccepted: true,
        },
      });
      return NextResponse.json({ success: true, message: 'Marked as Paid & Approved', participant: updated });
    }

    if (action === 'FLAG') {
      const updated = await prisma.participant.update({
        where,
        data: { status: 'FLAGGED' },
      });
      return NextResponse.json({ success: true, message: 'Participant Flagged', participant: updated });
    }

    if (action === 'APPROVE') {
      const updated = await prisma.participant.update({
        where,
        data: { status: 'APPROVED' },
      });
      return NextResponse.json({ success: true, message: 'Participant Approved', participant: updated });
    }

    // General update
    const updateData: any = {};
    if (fieldsToUpdate.fullName !== undefined) updateData.fullName = fieldsToUpdate.fullName.trim();
    if (fieldsToUpdate.phone !== undefined) updateData.phone = fieldsToUpdate.phone.trim();
    if (fieldsToUpdate.email !== undefined) updateData.email = fieldsToUpdate.email.trim();
    if (fieldsToUpdate.district !== undefined) updateData.district = fieldsToUpdate.district.trim();
    if (fieldsToUpdate.city !== undefined) updateData.city = fieldsToUpdate.city.trim();
    if (fieldsToUpdate.address !== undefined) updateData.address = fieldsToUpdate.address.trim();
    if (fieldsToUpdate.category !== undefined) updateData.category = fieldsToUpdate.category;
    if (fieldsToUpdate.idolType !== undefined) updateData.idolType = fieldsToUpdate.idolType;
    if (fieldsToUpdate.themeTitle !== undefined) updateData.themeTitle = fieldsToUpdate.themeTitle.trim();
    if (fieldsToUpdate.themeDescription !== undefined) updateData.themeDescription = fieldsToUpdate.themeDescription.trim();
    if (fieldsToUpdate.videoUrl !== undefined) updateData.videoUrl = fieldsToUpdate.videoUrl?.trim() || null;
    if (fieldsToUpdate.paymentStatus !== undefined) updateData.paymentStatus = fieldsToUpdate.paymentStatus;
    if (fieldsToUpdate.status !== undefined) updateData.status = fieldsToUpdate.status;
    if (fieldsToUpdate.photoUrls !== undefined) {
      updateData.photoUrls = JSON.stringify(fieldsToUpdate.photoUrls);
    }

    const updated = await prisma.participant.update({
      where,
      data: updateData,
    });

    return NextResponse.json({ success: true, message: 'Participant updated successfully', participant: updated });
  } catch (error: any) {
    console.error('Admin update error:', error);
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}

// DELETE: Delete record and associated evaluations
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const ticketId = searchParams.get('ticketId');
    const table = searchParams.get('table') || 'participants';

    if (table === 'participants') {
      const where = id ? { id } : ticketId ? { ticketId } : null;
      if (!where) {
        return NextResponse.json({ error: 'Participant id or ticketId required' }, { status: 400 });
      }

      await prisma.participant.delete({ where });
      return NextResponse.json({ success: true, message: `Participant ${id || ticketId} deleted successfully` });
    }

    if (table === 'leads' || table === 'sessions') {
      const sessionId = searchParams.get('sessionId') || id;
      if (!sessionId) {
        return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
      }
      await prisma.userJourneySession.delete({ where: { sessionId } });
      return NextResponse.json({ success: true, message: `Lead session deleted` });
    }

    return NextResponse.json({ error: 'Delete not supported for this table' }, { status: 400 });
  } catch (error: any) {
    console.error('Admin delete error:', error);
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
