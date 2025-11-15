"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormMessage } from '@/components/ui/form';
import { signUpSchema, type SignUpInput } from '@/lib/validators';
import { useState } from 'react';

export function SignUpCard() {
  const form = useForm<SignUpInput>({ resolver: zodResolver(signUpSchema), defaultValues: { name: '', email: '', password: '' } });
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(values: SignUpInput) {
    setError(null);
    setOk(false);
    const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || 'Failed to sign up');
    } else {
      setOk(true);
    }
  }

  return (
    <Card className="max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full" onClick={() => signIn('google', { callbackUrl: '/account' })}>
          Continue with Google
        </Button>
        <div className="my-4 flex items-center">
          <div className="flex-1 border-t"></div>
          <span className="px-2 text-sm text-muted-foreground">or</span>
          <div className="flex-1 border-t"></div>
        </div>
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...form.register('name')} />
              <FormMessage name="name" />
            </FormField>
            <FormField>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register('email')} />
              <FormMessage name="email" />
            </FormField>
            <FormField>
              <Label htmlFor="password">Password</Label>
              <PasswordInput id="password" {...form.register('password')} />
              <FormMessage name="password" />
            </FormField>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {ok ? <p className="text-sm text-green-600">Account created. You can sign in now.</p> : null}
            <Button type="submit" className="w-full">Create account</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}








