import crypto from 'crypto';
import Razorpay from 'razorpay';

export const isRazorpayConfigured = Boolean(
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
);

export function getRazorpayClient(): Razorpay | null {
  if (!isRazorpayConfigured) return null;
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string,
  });
}

export async function createRegistrationOrder(ticketId: string, amountInRupees = 299) {
  const client = getRazorpayClient();
  const amountInPaise = amountInRupees * 100;

  if (client) {
    const order = await client.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${ticketId}`,
      notes: {
        competition: 'Lokutsav 2026 Maharashtra',
        ticketId,
      },
    });
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      isSimulated: false,
    };
  }

  // Fallback simulated order for development or when keys not yet added
  return {
    orderId: `order_sim_${ticketId}_${Date.now()}`,
    amount: amountInPaise,
    currency: 'INR',
    keyId: 'rzp_test_simulated_lokutsav',
    isSimulated: true,
  };
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!isRazorpayConfigured) {
    // In simulation mode, accept if signature starts with sim_ or valid string
    return Boolean(signature && paymentId);
  }

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === signature;
}
