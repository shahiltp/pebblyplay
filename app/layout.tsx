import '@/styles/globals.css';
import type { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Sonner } from '@/components/ui/sonner';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <Header />
        {children}
        <Footer />
        <Sonner />
      </body>
    </html>
  );
}



