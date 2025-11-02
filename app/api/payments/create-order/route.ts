import { NextResponse } from 'next/server';
import { razorpayProvider } from '@/lib/payments/razorpay';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const json = await req.json();

    const { items, email } = json;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart items are required' }, { status: 400 });
    }

    // Use session email if authenticated, otherwise require email for guest checkout
    const customerEmail = session?.user?.email || email;

    if (!customerEmail) {
      return NextResponse.json({ error: 'Email is required for checkout' }, { status: 400 });
    }

    // Create order with Razorpay
    const orderResult = await razorpayProvider.createOrder({
      items,
      currency: 'INR',
      email: customerEmail,
      userId: session?.user?.id,
    });

    return NextResponse.json({
      success: true,
      orderId: orderResult.providerOrderId,
      amount: orderResult.amountCents,
      keyId: orderResult.keyId,
      currency: orderResult.currency,
      customerEmail: orderResult.customerEmail,
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create order' },
      { status: 500 }
    );
  }
}

