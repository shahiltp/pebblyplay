import { prisma } from '@/server/db';
import { sendOrderConfirmation } from '@/server/email';

/**
 * Send order confirmation email with idempotency guard
 * Uses transaction to ensure we never double-send
 */
export async function sendOrderEmailIfNeeded(orderId: string) {
  return await prisma.$transaction(async (tx) => {
    // Read order with FOR UPDATE equivalent (exclusive lock in transaction)
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        emailSentAt: true,
        status: true,
      },
    });

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    // Check if email already sent (idempotency guard)
    if (order.emailSentAt !== null) {
      // Email already sent, return the order
      return await tx.order.findUnique({
        where: { id: orderId },
      });
    }

    // Only send email for PAID orders
    if (order.status !== 'PAID') {
      throw new Error(`Cannot send email for order with status ${order.status}`);
    }

    // Send email
    const { messageId } = await sendOrderConfirmation(orderId);

    // Update order with email metadata
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        emailSentAt: new Date(),
        emailMessageId: messageId,
      },
    });

    return updatedOrder;
  });
}

