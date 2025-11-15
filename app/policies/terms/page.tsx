import { Metadata } from 'next';
import { getAbsoluteUrl, siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for PebblyPlay - Terms and conditions for using our website and services.',
  alternates: {
    canonical: getAbsoluteUrl('/policies/terms'),
  },
  openGraph: {
    type: 'website',
    url: getAbsoluteUrl('/policies/terms'),
    siteName: siteConfig.name,
    title: 'Terms of Service | ' + siteConfig.name,
    description: 'Terms of Service for PebblyPlay - Terms and conditions for using our website and services.',
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Service | ' + siteConfig.name,
    description: 'Terms of Service for PebblyPlay - Terms and conditions for using our website and services.',
  },
};

export default function TermsOfServicePage() {
  return (
    <main className="container py-10 max-w-4xl">
      <h1 className="text-3xl font-semibold mb-6">Terms of Service</h1>
      <div className="prose prose-slate max-w-none space-y-6">
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <section>
          <h2 id="agreement-to-terms" className="text-2xl font-semibold mt-8 mb-4">Agreement to Terms</h2>
          <p>
            By accessing or using the PebblyPlay website and services, you agree to be bound by these Terms of Service
            and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited
            from using or accessing this site.
          </p>
        </section>

        <section>
          <h2 id="use-license" className="text-2xl font-semibold mt-8 mb-4">Use License</h2>
          <p>
            Permission is granted to temporarily access the materials on PebblyPlay&apos;s website for personal,
            non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under
            this license you may not:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
          </ul>
        </section>

        <section>
          <h2 id="products-and-pricing" className="text-2xl font-semibold mt-8 mb-4">Products and Pricing</h2>
          <p>
            We strive to provide accurate product descriptions and pricing. However, we do not warrant that product
            descriptions or other content on this site is accurate, complete, reliable, current, or error-free.
          </p>
          <p className="mt-4">
            All prices are in Indian Rupees (INR) and are subject to change without notice. We reserve the right to
            modify prices at any time.
          </p>
        </section>

        <section>
          <h2 id="orders-and-payment" className="text-2xl font-semibold mt-8 mb-4">Orders and Payment</h2>
          <p>
            When you place an order, you are making an offer to purchase products at the prices stated. We reserve the
            right to accept or reject your order for any reason.
          </p>
          <p className="mt-4">
            Payment must be received before we ship your order. We accept payment through our payment processor. All
            transactions are processed securely.
          </p>
        </section>

        <section>
          <h2 id="user-accounts" className="text-2xl font-semibold mt-8 mb-4">User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and password. You agree to accept
            responsibility for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 id="prohibited-uses" className="text-2xl font-semibold mt-8 mb-4">Prohibited Uses</h2>
          <p>You may not use our website:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>In any way that violates any applicable national or international law or regulation</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material</li>
            <li>To impersonate or attempt to impersonate the company, a company employee, another user, or any other person or entity</li>
            <li>In any way that infringes upon the rights of others</li>
            <li>To engage in any other conduct that restricts or inhibits anyone&apos;s use or enjoyment of the website</li>
          </ul>
        </section>

        <section>
          <h2 id="intellectual-property" className="text-2xl font-semibold mt-8 mb-4">Intellectual Property</h2>
          <p>
            The content, organization, graphics, design, compilation, and other matters related to the website are
            protected under applicable copyrights, trademarks, and other proprietary rights. Copying, redistribution,
            or publication of any such materials is strictly prohibited.
          </p>
        </section>

        <section>
          <h2 id="disclaimer" className="text-2xl font-semibold mt-8 mb-4">Disclaimer</h2>
          <p>
            The materials on PebblyPlay&apos;s website are provided on an &apos;as is&apos; basis. PebblyPlay makes no
            warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without
            limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or
            non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2 id="limitations" className="text-2xl font-semibold mt-8 mb-4">Limitations</h2>
          <p>
            In no event shall PebblyPlay or its suppliers be liable for any damages (including, without limitation,
            damages for loss of data or profit, or due to business interruption) arising out of the use or inability to
            use the materials on PebblyPlay&apos;s website.
          </p>
        </section>

        <section>
          <h2 id="governing-law" className="text-2xl font-semibold mt-8 mb-4">Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes
            relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of India.
          </p>
        </section>

        <section>
          <h2 id="changes-to-terms" className="text-2xl font-semibold mt-8 mb-4">Changes to Terms</h2>
          <p>
            We reserve the right to revise these terms of service at any time without notice. By using this website, you
            are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section>
          <h2 id="contact-us" className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:{' '}
            <a href="mailto:support@pebblyplay.com" className="text-primary hover:underline">
              support@pebblyplay.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}

