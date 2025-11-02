import { Resend } from 'resend';
import { prisma } from '@/server/db';
import { formatINR } from '@/lib/money';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Build HTML email for order confirmation
 */
function buildOrderConfirmationEmail(
  orderId: string,
  orderDate: Date,
  customerEmail: string,
  items: Array<{
    title: string;
    variantAttrs: Record<string, any>;
    quantity: number;
    unitPriceCents: number;
    lineTotalCents: number;
    imageUrl?: string | null;
  }>,
  totalCents: number
): string {
  const shortId = orderId.slice(0, 8).toUpperCase();
  const formattedDate = orderDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          ${item.title}
          ${Object.keys(item.variantAttrs).length > 0
            ? '<br><small style="color: #666;">' +
              Object.entries(item.variantAttrs)
                .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
                .join(', ') +
              '</small>'
            : ''}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatINR(item.unitPriceCents)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatINR(item.lineTotalCents)}</td>
      </tr>
    `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - PebblyPlay</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h1 style="margin: 0; color: #2563eb;">Order Confirmation</h1>
    <p style="margin: 10px 0 0 0; color: #666;">Order #${shortId}</p>
  </div>

  <div style="background-color: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px;">
    <p><strong>Order Date:</strong> ${formattedDate}</p>
    <p><strong>Email:</strong> ${customerEmail}</p>
  </div>

  <div style="background-color: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="margin-top: 0; color: #2563eb;">Order Items</h2>
    <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
      <thead>
        <tr style="background-color: #f3f4f6;">
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
          <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
          <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Unit Price</th>
          <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="padding: 12px; text-align: right; border-top: 2px solid #e5e7eb; font-weight: bold;">Total:</td>
          <td style="padding: 12px; text-align: right; border-top: 2px solid #e5e7eb; font-weight: bold; font-size: 1.1em;">${formatINR(totalCents)}</td>
        </tr>
      </tfoot>
    </table>
  </div>

  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center; color: #666; font-size: 0.9em;">
    <p style="margin: 0;">Thank you for your order!</p>
    <p style="margin: 10px 0 0 0;">If you have any questions, please contact us at <a href="mailto:support@pebblyplay.com" style="color: #2563eb;">support@pebblyplay.com</a></p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(orderId: string): Promise<{ messageId: string }> {
  // Fetch order with items
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
    },
  });

  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  // Fetch products and variants separately since OrderItem doesn't have direct relations
  const productIds = order.items.map((item) => item.productId);
  const variantIds = order.items.map((item) => item.variantId);
  
  const [products, variants] = await Promise.all([
    prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        images: {
          take: 1,
          orderBy: { id: 'asc' },
        },
      },
    }),
    prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
    }),
  ]);

  // Build items array with all necessary data
  const emailItems = order.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const variant = variants.find((v) => v.id === item.variantId);
    const variantAttrs = (variant?.optionValues as Record<string, any>) || {};
    return {
      title: product?.title || 'Unknown Product',
      variantAttrs,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
      lineTotalCents: item.unitPriceCents * item.quantity,
      imageUrl: product?.images[0]?.url || null,
    };
  });

  // Build HTML email
  const html = buildOrderConfirmationEmail(
    order.id,
    order.createdAt,
    order.email,
    emailItems,
    order.amountCents
  );

  // Send via Resend
  const shortId = orderId.slice(0, 8).toUpperCase();
  const fromEmail = process.env.RESEND_FROM || 'PebblyPlay <orders@pebblyplay.com>';

  const result = await resend.emails.send({
    from: fromEmail,
    to: order.email,
    subject: `Your PebblyPlay order ${shortId}`,
    html,
  });

  if (!result.data?.id) {
    throw new Error('Failed to send email: No message ID returned');
  }

  return { messageId: result.data.id };
}

