'use client';

import * as React from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system';
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  attribute = 'class',
  enableSystem = false,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  // For now, we'll use a simple implementation
  // In the future, this can be extended with next-themes or similar
  React.useEffect(() => {
    const root = window.document.documentElement;
    
    if (defaultTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [defaultTheme]);

  return <>{children}</>;
}

