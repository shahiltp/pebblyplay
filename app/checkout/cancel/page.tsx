import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CheckoutCancelPage() {
  return (
    <main className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600">Payment Canceled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Your payment was canceled. No charges have been made. You can try again or continue shopping.
          </p>

          <div className="flex gap-4">
            <Link href="/cart" className="flex-1">
              <Button className="w-full">Return to Cart</Button>
            </Link>
            <Link href="/catalog" className="flex-1">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

