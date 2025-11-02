import '@/styles/globals.css';
import type { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Sonner } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/auth/AuthProvider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <AuthProvider>
          <Header />
          {children}
          <Footer />
          <Sonner />
        </AuthProvider>
      </body>
    </html>
  );
}



