import { requireUser } from '@/lib/auth-guard';

export default async function AccountPage() {
  const session = await requireUser();
  return (
    <main className="container py-10">
      <h1 className="text-2xl font-semibold">Account</h1>
      <pre className="mt-4 rounded bg-muted p-4 text-sm">{JSON.stringify(session.user, null, 2)}</pre>
    </main>
  );
}




