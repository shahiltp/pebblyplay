import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/server/db';
import { notFound } from 'next/navigation';
import { formatINR } from '@/lib/money';

interface Props {
  searchParams: Promise<{
    id?: string;
  }>;
}

export default async function EmailPreviewPage({ searchParams }: Props) {
  await requireRole(['OWNER', 'STAFF']);

  const params = await searchParams;
  const orderId = params.id;

  // If no order ID provided, show instructions
  if (!orderId) {
    return (
      <main className="container py-10">
        <h1 className="text-2xl font-semibold mb-4">Email Preview</h1>
        <div className="bg-muted p-6 rounded-lg">
          <p className="mb-2">To preview an order confirmation email:</p>
          <p className="text-sm text-muted-foreground">
            Add <code className="bg-background px-2 py-1 rounded">?id=ORDER_ID</code> to the URL
          </p>
        </div>
      </main>
    );
  }

  // Fetch order with items
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
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

  // Build items array
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

  const shortId = order.id.slice(0, 8).toUpperCase();
  const formattedDate = order.createdAt.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="container py-10">
      <h1 className="text-2xl font-semibold mb-4">Email Preview - Order {shortId}</h1>
      <div className="mb-4 text-sm text-muted-foreground">
        <p>
          Status: <strong>{order.status}</strong> | Email sent:{' '}
          <strong>{order.emailSentAt ? order.emailSentAt.toLocaleString() : 'Not sent'}</strong>
        </p>
      </div>

      <div className="bg-white border rounded-lg p-8 max-w-3xl">
        <div className="bg-gray-50 p-5 rounded-lg mb-5">
          <h1 className="text-2xl font-bold text-blue-600 m-0">Order Confirmation</h1>
          <p className="mt-2 mb-0 text-gray-600">Order #{shortId}</p>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-lg mb-5">
          <p className="mb-2">
            <strong>Order Date:</strong> {formattedDate}
          </p>
          <p className="mb-0">
            <strong>Email:</strong> {order.email}
          </p>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-lg mb-5">
          <h2 className="text-xl font-semibold text-blue-600 mt-0 mb-4">Order Items</h2>
          <table className="w-full border-collapse mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left border-b-2 border-gray-200">Item</th>
                <th className="p-3 text-center border-b-2 border-gray-200">Qty</th>
                <th className="p-3 text-right border-b-2 border-gray-200">Unit Price</th>
                <th className="p-3 text-right border-b-2 border-gray-200">Total</th>
              </tr>
            </thead>
            <tbody>
              {emailItems.map((item: typeof emailItems[0], idx: number) => (
                <tr key={idx}>
                  <td className="p-3 border-b border-gray-200">
                    {item.title}
                    {Object.keys(item.variantAttrs).length > 0 && (
                      <br />
                    )}
                    {Object.keys(item.variantAttrs).length > 0 && (
                      <small className="text-gray-600">
                        {Object.entries(item.variantAttrs)
                          .map(([key, value]) => (
                            <span key={key}>
                              <strong>{key}:</strong> {String(value)}
                            </span>
                          ))
                          .reduce<React.ReactNode[]>((acc, curr, i) => {
                            if (i > 0) acc.push(', ');
                            acc.push(curr);
                            return acc;
                          }, [])}
                      </small>
                    )}
                  </td>
                  <td className="p-3 text-center border-b border-gray-200">{item.quantity}</td>
                  <td className="p-3 text-right border-b border-gray-200">
                    {formatINR(item.unitPriceCents)}
                  </td>
                  <td className="p-3 text-right border-b border-gray-200">
                    {formatINR(item.lineTotalCents)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan={3}
                  className="p-3 text-right border-t-2 border-gray-200 font-bold"
                >
                  Total:
                </td>
                <td className="p-3 text-right border-t-2 border-gray-200 font-bold text-lg">
                  {formatINR(order.amountCents)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="bg-gray-50 p-5 rounded-lg mt-5 text-center text-gray-600 text-sm">
          <p className="m-0">Thank you for your order!</p>
          <p className="mt-2 mb-0">
            If you have any questions, please contact us at{' '}
            <a href="mailto:support@pebblyplay.com" className="text-blue-600">
              support@pebblyplay.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

