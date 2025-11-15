import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t mt-10 py-8 text-sm text-muted-foreground">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span>© {new Date().getFullYear()} PebblyPlay. All rights reserved.</span>
          </div>
          <nav className="flex flex-wrap gap-4 md:gap-6">
            <Link href="/policies/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/policies/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/policies/shipping-and-returns" className="hover:text-foreground transition-colors">
              Shipping & Returns
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}









