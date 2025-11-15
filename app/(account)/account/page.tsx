import { requireUser } from '@/lib/auth-guard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AccountInfo } from '@/components/account/AccountInfo';
import { LogoutButton } from '@/components/account/LogoutButton';

export default async function AccountPage() {
  const session = await requireUser();
  
  if (!session.user) {
    throw new Error('UNAUTHORIZED');
  }
  
  return (
    <main className="container py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Account</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <AccountInfo user={session.user} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>Sign out of your account</CardDescription>
          </CardHeader>
          <CardContent>
            <LogoutButton />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
