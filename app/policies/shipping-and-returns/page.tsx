import { Metadata } from 'next';
import { getAbsoluteUrl, siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Shipping and Returns',
  description: 'Shipping and Returns Policy for PebblyPlay - Information about shipping, delivery, and return policies.',
  alternates: {
    canonical: getAbsoluteUrl('/policies/shipping-and-returns'),
  },
  openGraph: {
    type: 'website',
    url: getAbsoluteUrl('/policies/shipping-and-returns'),
    siteName: siteConfig.name,
    title: 'Shipping and Returns | ' + siteConfig.name,
    description: 'Shipping and Returns Policy for PebblyPlay - Information about shipping, delivery, and return policies.',
  },
  twitter: {
    card: 'summary',
    title: 'Shipping and Returns | ' + siteConfig.name,
    description: 'Shipping and Returns Policy for PebblyPlay - Information about shipping, delivery, and return policies.',
  },
};

export default function ShippingAndReturnsPage() {
  return (
    <main className="container py-10 max-w-4xl">
      <h1 className="text-3xl font-semibold mb-6">Shipping and Returns</h1>
      <div className="prose prose-slate max-w-none space-y-6">
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <section>
          <h2 id="shipping" className="text-2xl font-semibold mt-8 mb-4">Shipping</h2>
          <h3 id="domestic-shipping" className="text-xl font-semibold mt-6 mb-3">Domestic Shipping (India)</h3>
          <p>
            We currently ship to addresses within India. Shipping costs and delivery times vary based on your location
            and the shipping method selected at checkout.
          </p>
          <p className="mt-4">
            Standard shipping typically takes 5-7 business days. Express shipping options may be available for faster
            delivery. Delivery times are estimates and may vary due to factors beyond our control, including weather
            conditions and carrier delays.
          </p>

          <h3 id="order-processing" className="text-xl font-semibold mt-6 mb-3">Order Processing</h3>
          <p>
            Orders are typically processed within 1-2 business days after payment confirmation. You will receive an
            email confirmation with tracking information once your order has been shipped.
          </p>

          <h3 id="shipping-addresses" className="text-xl font-semibold mt-6 mb-3">Shipping Addresses</h3>
          <p>
            Please ensure your shipping address is complete and accurate. We are not responsible for orders shipped to
            incorrect addresses provided by the customer. If you need to change your shipping address, please contact us
            as soon as possible.
          </p>
        </section>

        <section>
          <h2 id="returns" className="text-2xl font-semibold mt-8 mb-4">Returns</h2>
          <h3 id="return-policy" className="text-xl font-semibold mt-6 mb-3">Return Policy</h3>
          <p>
            We want you to be completely satisfied with your purchase. If you are not satisfied, you may return
            unopened toys within 7 days of delivery for a full refund.
          </p>
          <p className="mt-4">
            To be eligible for a return, the item must be:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Unopened and in its original packaging</li>
            <li>In the same condition as when you received it</li>
            <li>Returned within 7 days of delivery</li>
            <li>Accompanied by proof of purchase</li>
          </ul>

          <h3 id="return-process" className="text-xl font-semibold mt-6 mb-3">Return Process</h3>
          <p>To initiate a return:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Contact us at <a href="mailto:support@pebblyplay.com" className="text-primary hover:underline">support@pebblyplay.com</a> with your order number</li>
            <li>We will provide you with return instructions and a return authorization</li>
            <li>Package the item securely in its original packaging</li>
            <li>Ship the item back to us using a trackable shipping method</li>
            <li>Once we receive and inspect the returned item, we will process your refund</li>
          </ol>

          <h3 id="refunds" className="text-xl font-semibold mt-6 mb-3">Refunds</h3>
          <p>
            Refunds will be processed to the original payment method within 5-10 business days after we receive and
            inspect the returned item. Shipping costs are non-refundable unless the return is due to our error.
          </p>

          <h3 id="non-returnable-items" className="text-xl font-semibold mt-6 mb-3">Non-Returnable Items</h3>
          <p>The following items cannot be returned:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Opened or used toys</li>
            <li>Items damaged by the customer</li>
            <li>Items returned after 7 days</li>
            <li>Items without proof of purchase</li>
          </ul>
        </section>

        <section>
          <h2 id="damaged-or-defective-items" className="text-2xl font-semibold mt-8 mb-4">Damaged or Defective Items</h2>
          <p>
            If you receive a damaged or defective item, please contact us immediately at{' '}
            <a href="mailto:support@pebblyplay.com" className="text-primary hover:underline">
              support@pebblyplay.com
            </a>
            {' '}with photos of the damage. We will arrange for a replacement or full refund at no additional cost to you.
          </p>
        </section>

        <section>
          <h2 id="exchanges" className="text-2xl font-semibold mt-8 mb-4">Exchanges</h2>
          <p>
            We currently do not offer direct exchanges. If you wish to exchange an item, please return the original
            item for a refund and place a new order for the desired item.
          </p>
        </section>

        <section>
          <h2 id="contact-us" className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>
            If you have any questions about our shipping or returns policy, please contact us at:{' '}
            <a href="mailto:support@pebblyplay.com" className="text-primary hover:underline">
              support@pebblyplay.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}

