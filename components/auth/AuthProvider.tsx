'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { setCurrentUserId } from '@/lib/cart';

function AuthCartSync() {
  const { data: session } = useSession();

  useEffect(() => {
    // Update cart user ID when session changes
    const userId = session?.user?.id || null;
    setCurrentUserId(userId);

    // Trigger cart update event so components refresh
    window.dispatchEvent(new Event('cartUpdated'));
  }, [session?.user?.id]);

  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthCartSync />
      {children}
    </SessionProvider>
  );
}

