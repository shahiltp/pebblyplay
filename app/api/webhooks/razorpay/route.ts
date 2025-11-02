import { NextResponse } from 'next/server';
import { verifyRazorpayWebhookSignature } from '@/lib/payments/razorpay';
import { prisma } from '@/server/db';
import { OrderStatus } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('x-razorpay-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Get raw body for signature verification
    const body = await req.text();

    // Verify webhook signature
    const isValid = verifyRazorpayWebhookSignature(body, signature);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);
    const { event, payload: eventPayload } = payload;

    // Handle payment.captured event
    if (event === 'payment.captured') {
      const payment = eventPayload.payment?.entity;
      const orderId = payment?.order_id;

      if (!orderId) {
        return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
      }

      // Update order status to PAID
      await prisma.order.updateMany({
        where: {
          providerOrderId: orderId,
          status: { in: [OrderStatus.PENDING, OrderStatus.FAILED] },
        },
        data: {
          status: OrderStatus.PAID,
          providerPaymentId: payment.id,
        },
      });

      // Decrement stock if not already done
      const order = await prisma.order.findUnique({
        where: { providerOrderId: orderId },
        include: { items: true },
      });

      if (order && order.status === OrderStatus.PAID) {
        // Decrement stock safely (clamp to zero to prevent negative)
        for (const item of order.items) {
          const variant = await prisma.productVariant.findUnique({
            where: { id: item.variantId },
          });

          if (variant) {
            const newStock = Math.max(0, variant.stock - item.quantity);
            await prisma.productVariant.update({
              where: { id: item.variantId },
              data: { stock: newStock },
            });
          }
        }
      }
    }

    // Handle payment.failed event
    if (event === 'payment.failed') {
      const payment = eventPayload.payment?.entity;
      const orderId = payment?.order_id;

      if (orderId) {
        await prisma.order.updateMany({
          where: { providerOrderId: orderId },
          data: { status: OrderStatus.FAILED },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Razorpay webhooks use POST, but also handle GET for verification
export async function GET() {
  return NextResponse.json({ message: 'Razorpay webhook endpoint' });
}

