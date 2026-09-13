import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { dataStore } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { ticketId, razorpayOrderId, razorpayPaymentId, razorpaySignature, termsAccepted = true } = await request.json();

    if (!ticketId || !razorpayPaymentId) {
      return NextResponse.json(
        { error: 'Missing required payment verification details' },
        { status: 400 }
      );
    }

    const isValid = verifyPaymentSignature(
      razorpayOrderId || '',
      razorpayPaymentId,
      razorpaySignature || 'sim_sig'
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Update payment and terms acceptance in dataStore / database
    await dataStore.updatePayment(ticketId, razorpayPaymentId, razorpayOrderId, Boolean(termsAccepted));

    const updatedEntry = await dataStore.getEntryById(ticketId);

    return NextResponse.json({
      success: true,
      message: 'Payment verified and entry confirmed!',
      entry: updatedEntry,
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
