// app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Digitaler Produktpass',
  description: 'MVP eines Digital Product Passport',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      {/* важно оставить этот тег */}
      <head />
      <body className="min-h-screen bg-gray-50 flex items-start justify-center p-4">
        {children}
      </body>
    </html>
  );
}
