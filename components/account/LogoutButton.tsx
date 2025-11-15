'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { clearAllCarts, setCurrentUserId } from '@/lib/cart';

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      // Clear cart data and user ID before signing out
      clearAllCarts();
      setCurrentUserId(null);
      
      await signOut({ 
        redirect: false,
        callbackUrl: '/'
      });
      
      router.push('/');
      router.refresh(); // Refresh to update the header
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleSignOut}
      disabled={isLoading}
      className="w-full sm:w-auto"
    >
      <LogOut className="h-4 w-4 mr-2" />
      {isLoading ? 'Signing out...' : 'Sign out'}
    </Button>
  );
}

