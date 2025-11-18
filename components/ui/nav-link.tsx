'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <Link
      href={href as any}
      className={cn(
        'px-3 py-1 rounded-full hover:bg-slate-100 transition',
        isActive && 'bg-slate-100 text-slate-900',
        className
      )}
    >
      {children}
    </Link>
  );
}

