import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { dataStore } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
    const signature = request.headers.get('x-razorpay-signature');

    const rawBody = await request.text();

    // Verify webhook signature if secret is present
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        console.warn('Invalid Razorpay webhook signature');
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;

    // Handle payment.captured or order.paid
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderEntity = event.payload?.order?.entity;

      const ticketId =
        paymentEntity?.notes?.ticketId ||
        orderEntity?.notes?.ticketId;

      const paymentId = paymentEntity?.id || 'webhook_captured';
      const orderId = orderEntity?.id || paymentEntity?.order_id || '';

      if (ticketId) {
        console.log(`[Webhook] Confirming payment for ticket ${ticketId}, paymentId: ${paymentId}`);
        await dataStore.updatePayment(ticketId, paymentId, orderId, true);
      }
    }

    return NextResponse.json({ status: 'ok', received: true });
  } catch (error: any) {
    console.error('Razorpay webhook processing error:', error);
    return NextResponse.json({ error: error.message || 'Webhook failed' }, { status: 500 });
  }
}
