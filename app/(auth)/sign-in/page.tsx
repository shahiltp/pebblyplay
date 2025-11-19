import { Suspense } from 'react';
import { SignInCard } from '@/components/auth/SignInCard';

export default function SignInPage() {
  return (
    <main className="container py-10">
      <Suspense fallback={<div className="max-w-sm mx-auto">Loading...</div>}>
        <SignInCard />
      </Suspense>
    </main>
  );
}










