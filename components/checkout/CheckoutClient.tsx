'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCart, clearCart, type CartItem } from '@/lib/cart';
import { priceCartAction } from '@/app/actions/cart';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Script from 'next/script';
import { useSession } from 'next-auth/react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutClientProps {
  userEmail?: string;
  userId?: string;
}

export function CheckoutClient({ userEmail, userId: propUserId }: CheckoutClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [email, setEmail] = useState(userEmail || '');
  const [pricedItems, setPricedItems] = useState<any[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      const userId = propUserId || session?.user?.id || null;
      const clientCart = getCart(userId);
      setCart(clientCart);

      if (clientCart.length === 0) {
        toast.error('Your cart is empty');
        router.push('/cart');
        return;
      }

        try {
          const result = await priceCartAction(clientCart);
          if (result.success && 'items' in result && 'subtotalCents' in result) {
            setPricedItems(result.items || []);
            setSubtotal(result.subtotalCents || 0);
          } else {
            toast.error('Failed to load cart. Please try again.');
            router.push('/cart');
          }
      } catch (error) {
        console.error('Failed to price cart:', error);
        toast.error('Failed to load cart');
        router.push('/cart');
      }
      setLoading(false);
    };

    loadCart();
  }, [router, session?.user?.id]);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const checkoutEmail = email.trim();
    if (!checkoutEmail) {
      toast.error('Please enter your email address');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(checkoutEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!razorpayLoaded) {
      toast.error('Payment system is loading. Please wait...');
      return;
    }

    setProcessing(true);

    try {
      // Create Razorpay order
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          email: checkoutEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create payment order');
      }

      // Initialize Razorpay Checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'PebblyPlay',
        description: 'Order Payment',
        order_id: data.orderId,
        prefill: {
          email: data.customerEmail,
        },
        notes: {
          cartHash: JSON.stringify(cart),
        },
        handler: async function (response: any) {
          // Payment successful - verify payment
          try {
            const currentUserId = propUserId || session?.user?.id || null;
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items: cart,
                email: checkoutEmail,
                userId: currentUserId,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              clearCart(currentUserId);
              toast.success('Payment successful!');
              router.push(`/checkout/success?oid=${verifyData.orderId}`);
            } else {
              toast.error('Payment verification failed');
              router.push('/checkout/cancel');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
            router.push('/checkout/cancel');
          }
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            toast.info('Payment canceled');
            router.push('/checkout/cancel');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function () {
        setProcessing(false);
        toast.error('Payment failed');
        router.push('/checkout/cancel');
      });

      razorpay.open();
      setProcessing(false);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Checkout failed');
      setProcessing(false);
    }
  };

  const formatPrice = (cents: number) => {
    return `₹${(cents / 100).toLocaleString('en-IN')}`;
  };

  if (loading) {
    return <div className="text-center py-12">Loading checkout...</div>;
  }

  if (cart.length === 0) {
    return null; // Will redirect
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!!userEmail}
                required
              />
              {userEmail && (
                <p className="text-xs text-muted-foreground mt-1">Logged in as {userEmail}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              {pricedItems.map((item) => (
                <div key={item.variantId} className="flex justify-between text-sm">
                  <span>
                    {item.title} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.lineTotal)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold text-lg mb-4">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <Button onClick={handleCheckout} className="w-full" size="lg" disabled={processing || !razorpayLoaded}>
                {processing ? 'Processing...' : 'Pay with Razorpay'}
              </Button>
              {!razorpayLoaded && (
                <p className="text-xs text-muted-foreground mt-2 text-center">Loading payment system...</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

