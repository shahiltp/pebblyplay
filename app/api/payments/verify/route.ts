import { NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/payments/razorpay';
import { prisma } from '@/server/db';
import { priceCart } from '@/server/cart';
import { OrderStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, email, userId } = json;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    // Verify signature
    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Price cart to get items and total
    const { items: pricedItems, subtotalCents } = await priceCart(items || []);

    if (pricedItems.length === 0) {
      return NextResponse.json({ error: 'Invalid cart items' }, { status: 400 });
    }

    // Create Order and OrderItems in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create Order
      const order = await tx.order.create({
        data: {
          userId: userId || null,
          email,
          currency: 'INR',
          amountCents: subtotalCents,
          status: OrderStatus.PAID,
          provider: 'razorpay',
          providerOrderId: razorpay_order_id,
          providerPaymentId: razorpay_payment_id,
          providerSignature: razorpay_signature,
        },
      });

      // Create OrderItems and decrement stock
      const orderItems = await Promise.all(
        pricedItems.map(async (item) => {
          // Get variant with productId and decrement stock
          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
          });

          if (!variant) {
            throw new Error(`Variant ${item.variantId} not found`);
          }

          // Decrement stock (clamp to zero if would go negative)
          const newStock = Math.max(0, variant.stock - item.quantity);
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: newStock },
          });

          // Create order item
          return tx.orderItem.create({
            data: {
              orderId: order.id,
              productId: variant.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              unitPriceCents: item.priceCents,
            },
          });
        })
      );

      return { order, orderItems };
    });

    revalidatePath('/checkout/success');
    revalidatePath('/account');

    // Send order confirmation email (idempotent - won't send twice)
    try {
      const { sendOrderEmailIfNeeded } = await import('@/server/orders');
      await sendOrderEmailIfNeeded(result.order.id);
    } catch (error) {
      // Log but don't fail the request if email fails
      console.error('Failed to send order confirmation email:', error);
    }

    return NextResponse.json({
      success: true,
      orderId: result.order.id,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to verify payment' },
      { status: 500 }
    );
  }
}

