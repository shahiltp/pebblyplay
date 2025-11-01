import * as React from 'react';
import { FormProvider, useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';

export const Form = FormProvider;

export function FormField({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('grid gap-2', className)}>{children}</div>;
}

export function FormMessage({ name }: { name: string }) {
  try {
    const {
      formState: { errors },
    } = useFormContext();
    const err = (errors as any)?.[name]?.message as string | undefined;
    if (!err) return null;
    return <p className="text-sm text-destructive">{err}</p>;
  } catch {
    // Form context not available
    return null;
  }
}




