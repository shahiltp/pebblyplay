'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { UserMenu } from './UserMenu';

export function HeaderAuth() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  if (isLoading) {
    return <div className="h-9 w-20" />; // Placeholder to prevent layout shift
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/account" className="text-sm hover:underline">
          {session.user.name || session.user.email || 'Account'}
        </Link>
        <UserMenu />
      </div>
    );
  }

  return (
    <Link href="/sign-in" className="text-sm hover:underline">
      Sign in
    </Link>
  );
}


