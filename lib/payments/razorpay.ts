import Razorpay from 'razorpay';
import { PaymentProvider, CreateOrderParams, CreateOrderResult } from './types';
import { priceCart } from '@/server/cart';

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
  throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set');
}

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

export class RazorpayProvider implements PaymentProvider {
  async createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
    // Price cart server-side to get accurate amount
    const { items: pricedItems, subtotalCents } = await priceCart(params.items);

    if (pricedItems.length === 0) {
      throw new Error('Cart is empty or all items are invalid');
    }

    // Create Razorpay order (amount in paise)
    const options = {
      amount: subtotalCents, // Already in paise
      currency: params.currency,
      receipt: `order_${Date.now()}`,
      notes: {
        email: params.email || '',
        userId: params.userId || '',
        itemCount: pricedItems.length.toString(),
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return {
      providerOrderId: razorpayOrder.id,
      amountCents: subtotalCents,
      keyId: razorpayKeyId,
      currency: params.currency,
      customerEmail: params.email,
      pricedItems, // Include for order creation
    };
  }
}

/**
 * Verify Razorpay payment signature
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', razorpayKeySecret!)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return expectedSignature === signature;
}

/**
 * Verify Razorpay webhook signature
 */
export function verifyRazorpayWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('RAZORPAY_WEBHOOK_SECRET must be set');
    return false;
  }

  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  );
}

export const razorpayProvider = new RazorpayProvider();

