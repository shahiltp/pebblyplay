"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormMessage } from '@/components/ui/form';
import { signInSchema, type SignInInput } from '@/lib/validators';
import { useState, useEffect } from 'react';

export function SignInCard() {
  const searchParams = useSearchParams();
  const form = useForm<SignInInput>({ resolver: zodResolver(signInSchema), defaultValues: { email: '', password: '' } });
  const [error, setError] = useState<string | null>(null);

  // Check for OAuth errors in URL
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'OAuthAccountNotLinked') {
      setError('An account with this email already exists. Please sign in with your password instead, or use a different Google account.');
    } else if (errorParam) {
      setError('Authentication failed. Please try again.');
    }
  }, [searchParams]);

  async function onSubmit(values: SignInInput) {
    setError(null);
    const res = await signIn('credentials', { redirect: false, email: values.email, password: values.password });
    if (res?.error) setError('Invalid email or password');
    else window.location.href = '/account';
  }

  return (
    <Card className="max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
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
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register('email')} />
              <FormMessage name="email" />
            </FormField>
            <FormField>
              <Label htmlFor="password">Password</Label>
              <PasswordInput id="password" {...form.register('password')} />
              <FormMessage name="password" />
            </FormField>
            <Button type="submit" className="w-full">Sign in</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}




