import { Metadata } from 'next';
import { getAbsoluteUrl, siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for PebblyPlay - How we collect, use, and protect your personal information.',
  alternates: {
    canonical: getAbsoluteUrl('/policies/privacy'),
  },
  openGraph: {
    type: 'website',
    url: getAbsoluteUrl('/policies/privacy'),
    siteName: siteConfig.name,
    title: 'Privacy Policy | ' + siteConfig.name,
    description: 'Privacy Policy for PebblyPlay - How we collect, use, and protect your personal information.',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | ' + siteConfig.name,
    description: 'Privacy Policy for PebblyPlay - How we collect, use, and protect your personal information.',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container py-10 max-w-4xl">
      <h1 className="text-3xl font-semibold mb-6">Privacy Policy</h1>
      <div className="prose prose-slate max-w-none space-y-6">
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <section>
          <h2 id="introduction" className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
          <p>
            Welcome to PebblyPlay. We are committed to protecting your personal information and your right to privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit
            our website and use our services.
          </p>
        </section>

        <section>
          <h2 id="information-we-collect" className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
          <h3 id="personal-information" className="text-xl font-semibold mt-6 mb-3">Personal Information</h3>
          <p>
            We may collect personal information that you voluntarily provide to us when you:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Register for an account</li>
            <li>Make a purchase</li>
            <li>Subscribe to our newsletter</li>
            <li>Contact us for support</li>
            <li>Participate in surveys or promotions</li>
          </ul>
          <p className="mt-4">
            This information may include your name, email address, shipping address, billing address, phone number,
            and payment information.
          </p>

          <h3 id="automatically-collected-information" className="text-xl font-semibold mt-6 mb-3">Automatically Collected Information</h3>
          <p>
            When you visit our website, we automatically collect certain information about your device, including
            information about your web browser, IP address, time zone, and some of the cookies that are installed
            on your device.
          </p>
        </section>

        <section>
          <h2 id="how-we-use-your-information" className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Send you order confirmations and updates</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Detect and prevent fraud</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 id="information-sharing" className="text-2xl font-semibold mt-8 mb-4">Information Sharing and Disclosure</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share your information
            with:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Service providers who assist us in operating our website and conducting our business</li>
            <li>Payment processors to handle transactions</li>
            <li>Shipping companies to deliver your orders</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>

        <section>
          <h2 id="data-security" className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information.
            However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 id="your-rights" className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to processing of your information</li>
            <li>Request restriction of processing</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section>
          <h2 id="cookies" className="text-2xl font-semibold mt-8 mb-4">Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our website and hold certain
            information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <section>
          <h2 id="children-privacy" className="text-2xl font-semibold mt-8 mb-4">Children&apos;s Privacy</h2>
          <p>
            Our services are not directed to individuals under the age of 13. We do not knowingly collect personal
            information from children under 13. If you become aware that a child has provided us with personal
            information, please contact us.
          </p>
        </section>

        <section>
          <h2 id="changes-to-policy" className="text-2xl font-semibold mt-8 mb-4">Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2 id="contact-us" className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:{' '}
            <a href="mailto:support@pebblyplay.com" className="text-primary hover:underline">
              support@pebblyplay.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}

