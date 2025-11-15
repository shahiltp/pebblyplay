'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clearAllCarts, setCurrentUserId } from '@/lib/cart';

export function UserMenu() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    // Clear cart data and user ID before signing out
    clearAllCarts();
    setCurrentUserId(null);
    
    await signOut({ 
      redirect: false,
      callbackUrl: '/'
    });
    
    router.push('/');
    router.refresh(); // Refresh to update the header
  };

  if (!session?.user) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
      className="text-sm"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Sign out
    </Button>
  );
}

