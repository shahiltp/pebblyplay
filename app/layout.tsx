import '@/styles/globals.css';
import type { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Sonner } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Fredoka, Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ui/theme-provider';

const displayFont = Fredoka({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const sansFont = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${displayFont.variable} ${sansFont.variable}`}>
      <body className="min-h-screen antialiased bg-[hsl(var(--background))] text-[hsl(var(--foreground))] font-sans">
        <ThemeProvider defaultTheme="light">
          <AuthProvider>
            <Header />
            {children}
            <Footer />
            <Sonner />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}



