// src/app/layout.tsx
import React from 'react';

export const metadata = {
  title: 'DPP Demo',
  description: 'Digital Product Passport MVP',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
