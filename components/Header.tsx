import Link from 'next/link';
import { Logo } from './Logo';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CartBadge } from '@/components/cart/CartBadge';
import { HeaderAuth } from '@/components/auth/HeaderAuth';
import { NavLink } from '@/components/ui/nav-link';

export async function Header() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-sm border-b border-slate-200/60">
      <div className="container h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink href="/catalog">Catalog</NavLink>
          <CartBadge />
          <HeaderAuth />
          {(role === 'OWNER' || role === 'STAFF') && <NavLink href="/admin">Admin</NavLink>}
        </nav>
      </div>
    </header>
  );
}


