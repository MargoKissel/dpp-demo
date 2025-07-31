// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400','600','700'] });

export default function RootLayout({ children }) {
  return (
    <html lang="de" className={inter.className}>
      <head />
      <body className="min-h-screen bg-gray-50 flex justify-center p-4">
        {children}
      </body>
    </html>
  );
}
