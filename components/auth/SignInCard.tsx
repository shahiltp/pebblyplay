"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormMessage } from '@/components/ui/form';
import { signInSchema, type SignInInput } from '@/lib/validators';
import { useState } from 'react';

export function SignInCard() {
  const form = useForm<SignInInput>({ resolver: zodResolver(signInSchema), defaultValues: { email: '', password: '' } });
  const [error, setError] = useState<string | null>(null);

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
        <Button variant="outline" className="w-full" onClick={() => signIn('google')}>Continue with Google</Button>
        <div className="my-4" />
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register('email')} />
              <FormMessage name="email" />
            </FormField>
            <FormField>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...form.register('password')} />
              <FormMessage name="password" />
            </FormField>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full">Sign in</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}




