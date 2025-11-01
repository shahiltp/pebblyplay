import Link from 'next/link';
import { Logo } from './Logo';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function Header() {
  const session = await getServerSession(authOptions);
  const isAuthed = !!session?.user?.id;
  const role = session?.user?.role;
  return (
    <header className="border-b bg-background">
      <div className="container h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/catalog">Catalog</Link>
          <Link href="/cart">Cart</Link>
          {isAuthed ? <Link href="/account">Account</Link> : <Link href="/sign-in">Sign in</Link>}
          {(role === 'OWNER' || role === 'STAFF') && <Link href="/admin">Admin</Link>}
        </nav>
      </div>
    </header>
  );
}


