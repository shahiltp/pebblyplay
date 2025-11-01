import { requireRole } from '@/lib/auth-guard';

export default async function AdminPage() {
  await requireRole(['OWNER', 'STAFF']);
  return (
    <main className="container py-10">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="text-muted-foreground">Restricted area.</p>
    </main>
  );
}




